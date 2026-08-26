using Devliora.Application.Common.Interfaces;
using Devliora.Domain.Enums;
using MediatR;
using Microsoft.Extensions.Logging;
namespace Devliora.Application.Features.Telegram.Commands.ProcessUpdate;
public class ProcessTelegramUpdateCommandHandler : IRequestHandler<ProcessTelegramUpdateCommand>
{
    private readonly ITelegramSessionStore _sessionStore;
    private readonly ITelegramChatService _chatService;
    private readonly ITelegramApiClient _apiClient;
    private readonly IChatPersistenceService _persistenceService;
    private readonly ILogger<ProcessTelegramUpdateCommandHandler> _logger;
    public ProcessTelegramUpdateCommandHandler(
        ITelegramSessionStore sessionStore,
        ITelegramChatService chatService,
        ITelegramApiClient apiClient,
        IChatPersistenceService persistenceService,
        ILogger<ProcessTelegramUpdateCommandHandler> logger)
    {
        _sessionStore = sessionStore;
        _chatService = chatService;
        _apiClient = apiClient;
        _persistenceService = persistenceService;
        _logger = logger;
    }
    public async Task Handle(ProcessTelegramUpdateCommand request, CancellationToken cancellationToken)
    {
        var history = await _sessionStore.GetHistoryAsync(request.ChatId, cancellationToken);
        var userTurn = new ChatTurn("user", request.Text);
        history.Add(userTurn);
        await _sessionStore.AppendTurnAsync(request.ChatId, userTurn, cancellationToken);
        var reply = await _chatService.GetReplyAsync(history, cancellationToken);
        await _sessionStore.AppendTurnAsync(request.ChatId, new ChatTurn("model", reply), cancellationToken);
        await _apiClient.SendMessageAsync(request.ChatId, reply, cancellationToken);

        // Best-effort: this runs after the reply has already been sent to
        // the user, purely so the conversation shows up in /admin/conversations.
        // Previously unguarded, a transient DB failure here (a) silently lost
        // the conversation from the admin panel even though the user got a
        // real reply on Telegram, and (b) would propagate up to the
        // controller's catch block and send a confusing second "something
        // went wrong" message after the real answer had already gone out.
        try
        {
            var externalId = request.ChatId.ToString();
            await _persistenceService.SaveTurnAsync(
                ChatChannel.Telegram, externalId, "user", request.Text, cancellationToken);
            await _persistenceService.SaveTurnAsync(
                ChatChannel.Telegram, externalId, "model", reply, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to persist Telegram conversation turn for chat {ChatId}", request.ChatId);
        }

        _logger.LogInformation("Processed Telegram update for chat {ChatId}", request.ChatId);
    }
}
