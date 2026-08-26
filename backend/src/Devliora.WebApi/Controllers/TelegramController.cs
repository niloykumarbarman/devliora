using System.Text.Json;
using Devliora.Application.Common.Interfaces;
using Devliora.Application.Features.ContactMessages.Commands.CreateContactMessage;
using Devliora.Application.Features.Telegram.Commands.ProcessUpdate;
using Devliora.Infrastructure.Telegram;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Devliora.WebApi.Controllers;

[ApiController]
[Route("api/telegram")]
public class TelegramController : ControllerBase
{
    private readonly ISender _sender;
    private readonly ITelegramApiClient _apiClient;
    private readonly ITelegramSessionStore _sessionStore;
    private readonly ITelegramContactFlowStore _contactFlowStore;
    private readonly TelegramAssistantSettings _settings;
    private readonly ILogger<TelegramController> _logger;
    private const string SecretTokenHeader = "X-Telegram-Bot-Api-Secret-Token";
    private const string StartCommand = "/start";

    public TelegramController(
        ISender sender,
        ITelegramApiClient apiClient,
        ITelegramSessionStore sessionStore,
        ITelegramContactFlowStore contactFlowStore,
        IOptions<TelegramAssistantSettings> settings,
        ILogger<TelegramController> logger)
    {
        _sender = sender;
        _apiClient = apiClient;
        _sessionStore = sessionStore;
        _contactFlowStore = contactFlowStore;
        _settings = settings.Value;
        _logger = logger;
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook([FromBody] JsonElement body, CancellationToken cancellationToken)
    {
        if (!Request.Headers.TryGetValue(SecretTokenHeader, out var providedToken)
            || providedToken != _settings.WebhookSecretToken)
        {
            _logger.LogWarning("Telegram webhook called with missing or invalid secret token");
            return Unauthorized();
        }

        if (TryExtractCallbackQuery(body, out var callbackQueryId, out var callbackChatId, out var callbackData))
        {
            await HandleCallbackQueryAsync(callbackQueryId, callbackChatId, callbackData, cancellationToken);
            return Ok();
        }

        if (!TryExtractTextMessage(body, out var chatId, out var text))
        {
            // Non-text messages (photos, stickers, etc.) are not yet supported.
            // Acknowledge with 200 so Telegram does not retry.
            return Ok();
        }

        if (text.Trim() == StartCommand)
        {
            await HandleStartCommandAsync(chatId, cancellationToken);
            return Ok();
        }

        var flowState = await _contactFlowStore.GetAsync(chatId, cancellationToken);
        if (flowState is not null && flowState.Step != TelegramContactFlowStep.None)
        {
            await HandleContactFlowStepAsync(chatId, flowState, text, cancellationToken);
            return Ok();
        }

        try
        {
            await _sender.Send(new ProcessTelegramUpdateCommand(chatId, text), cancellationToken);
        }
        catch (Exception ex)
        {
            // Belt-and-suspenders: ProcessTelegramUpdateCommandHandler's own
            // dependencies (session store, quota check) already fail open on
            // a Redis hiccup, but this still catches anything unexpected
            // (e.g. the Gemini call itself). Without this, an unhandled
            // exception here 500s the webhook before SendMessageAsync is
            // ever reached — Telegram has already accepted the incoming
            // message by that point, so the user sees "sent" with no reply
            // ever arriving, and no visible error either.
            _logger.LogError(ex, "Failed to process Telegram update for chat {ChatId}", chatId);
            await _apiClient.SendMessageAsync(
                chatId,
                "Sorry, something went wrong on my end. Please try again in a moment.",
                cancellationToken);
        }

        return Ok();
    }

    private async Task HandleStartCommandAsync(long chatId, CancellationToken cancellationToken)
    {
        // Start each /start with a clean slate so the conversation history and any
        // in-progress contact flow don't carry over.
        await _sessionStore.ClearAsync(chatId, cancellationToken);
        await _contactFlowStore.ClearAsync(chatId, cancellationToken);

        var buttons = TelegramWelcomeMessage.SuggestedQuestions
            .Select((q, index) => (Label: q.Label, CallbackData: $"q{index}"))
            .Append((Label: TelegramWelcomeMessage.RequestCallbackLabel, CallbackData: TelegramWelcomeMessage.RequestCallbackCallbackData))
            .ToList();

        await _apiClient.SendMessageWithButtonsAsync(chatId, TelegramWelcomeMessage.Text, buttons, cancellationToken);
    }

    private async Task HandleCallbackQueryAsync(
        string callbackQueryId,
        long chatId,
        string callbackData,
        CancellationToken cancellationToken)
    {
        // Always acknowledge the callback so Telegram clears the button's loading spinner,
        // even if the data doesn't map to a known action.
        await _apiClient.AnswerCallbackQueryAsync(callbackQueryId, cancellationToken);

        if (callbackData == TelegramWelcomeMessage.RequestCallbackCallbackData)
        {
            await StartContactFlowAsync(chatId, cancellationToken);
            return;
        }

        if (!callbackData.StartsWith('q')
            || !int.TryParse(callbackData.AsSpan(1), out var index)
            || index < 0
            || index >= TelegramWelcomeMessage.SuggestedQuestions.Count)
        {
            _logger.LogWarning("Telegram callback_query with unrecognized data: {CallbackData}", callbackData);
            return;
        }

        var question = TelegramWelcomeMessage.SuggestedQuestions[index].Question;
        await _sender.Send(new ProcessTelegramUpdateCommand(chatId, question), cancellationToken);
    }

    private async Task StartContactFlowAsync(long chatId, CancellationToken cancellationToken)
    {
        var state = new TelegramContactFlowState { Step = TelegramContactFlowStep.AwaitingName };
        await _contactFlowStore.SetAsync(chatId, state, cancellationToken);
        await _apiClient.SendMessageAsync(chatId, TelegramContactFlowMessages.AskName, cancellationToken);
    }

    private async Task HandleContactFlowStepAsync(
        long chatId,
        TelegramContactFlowState state,
        string text,
        CancellationToken cancellationToken)
    {
        var trimmed = text.Trim();

        switch (state.Step)
        {
            case TelegramContactFlowStep.AwaitingName:
                state.FullName = trimmed;
                state.Step = TelegramContactFlowStep.AwaitingEmail;
                await _contactFlowStore.SetAsync(chatId, state, cancellationToken);
                await _apiClient.SendMessageAsync(chatId, TelegramContactFlowMessages.AskEmail, cancellationToken);
                break;

            case TelegramContactFlowStep.AwaitingEmail:
                if (!IsValidEmail(trimmed))
                {
                    await _apiClient.SendMessageAsync(chatId, TelegramContactFlowMessages.InvalidEmail, cancellationToken);
                    break;
                }

                state.Email = trimmed;
                state.Step = TelegramContactFlowStep.AwaitingPhone;
                await _contactFlowStore.SetAsync(chatId, state, cancellationToken);
                await _apiClient.SendMessageAsync(chatId, TelegramContactFlowMessages.AskPhone, cancellationToken);
                break;

            case TelegramContactFlowStep.AwaitingPhone:
                state.Phone = trimmed;
                state.Step = TelegramContactFlowStep.AwaitingMessage;
                await _contactFlowStore.SetAsync(chatId, state, cancellationToken);
                await _apiClient.SendMessageAsync(chatId, TelegramContactFlowMessages.AskMessage, cancellationToken);
                break;

            case TelegramContactFlowStep.AwaitingMessage:
                await SubmitContactFlowAsync(chatId, state, trimmed, cancellationToken);
                break;
        }
    }

    private async Task SubmitContactFlowAsync(
        long chatId,
        TelegramContactFlowState state,
        string message,
        CancellationToken cancellationToken)
    {
        try
        {
            await _sender.Send(new CreateContactMessageCommand
            {
                FullName = state.FullName,
                Email = state.Email,
                Phone = state.Phone,
                Subject = TelegramContactFlowMessages.Subject,
                Message = message,
                Source = TelegramContactFlowMessages.Source
            }, cancellationToken);

            await _apiClient.SendMessageAsync(chatId, TelegramContactFlowMessages.Confirmation, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to submit Telegram contact flow request for chat {ChatId}", chatId);
            await _apiClient.SendMessageAsync(chatId, TelegramContactFlowMessages.SubmissionFailed, cancellationToken);
        }
        finally
        {
            await _contactFlowStore.ClearAsync(chatId, cancellationToken);
        }
    }

    private static bool IsValidEmail(string value)
    {
        try
        {
            _ = new System.Net.Mail.MailAddress(value);
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static bool TryExtractTextMessage(JsonElement body, out long chatId, out string text)
    {
        chatId = 0;
        text = string.Empty;

        if (!body.TryGetProperty("message", out var message))
        {
            return false;
        }

        if (!message.TryGetProperty("text", out var textElement) || textElement.ValueKind != JsonValueKind.String)
        {
            return false;
        }

        if (!message.TryGetProperty("chat", out var chat) || !chat.TryGetProperty("id", out var chatIdElement))
        {
            return false;
        }

        var textValue = textElement.GetString();
        if (string.IsNullOrWhiteSpace(textValue))
        {
            return false;
        }

        chatId = chatIdElement.GetInt64();
        text = textValue;
        return true;
    }

    private static bool TryExtractCallbackQuery(
        JsonElement body,
        out string callbackQueryId,
        out long chatId,
        out string callbackData)
    {
        callbackQueryId = string.Empty;
        chatId = 0;
        callbackData = string.Empty;

        if (!body.TryGetProperty("callback_query", out var callbackQuery))
        {
            return false;
        }

        if (!callbackQuery.TryGetProperty("id", out var idElement) || idElement.ValueKind != JsonValueKind.String)
        {
            return false;
        }

        if (!callbackQuery.TryGetProperty("data", out var dataElement) || dataElement.ValueKind != JsonValueKind.String)
        {
            return false;
        }

        if (!callbackQuery.TryGetProperty("message", out var message)
            || !message.TryGetProperty("chat", out var chat)
            || !chat.TryGetProperty("id", out var chatIdElement))
        {
            return false;
        }

        callbackQueryId = idElement.GetString() ?? string.Empty;
        callbackData = dataElement.GetString() ?? string.Empty;
        chatId = chatIdElement.GetInt64();

        return !string.IsNullOrEmpty(callbackQueryId) && !string.IsNullOrEmpty(callbackData);
    }
}
