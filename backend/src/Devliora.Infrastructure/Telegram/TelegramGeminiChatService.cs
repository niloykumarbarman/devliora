using System.Text;
using System.Text.Json;
using Devliora.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Devliora.Infrastructure.Telegram;

// Separate wrapper class (distinct from Assistant.QuotaCounter) so the Telegram
// bot's quota tracking stays fully independent of the website widget's, per the
// project's channel-isolation requirement.
public class TelegramQuotaCounter
{
    public int Count { get; set; }
}

public class TelegramGeminiChatService : ITelegramChatService
{
    private readonly HttpClient _httpClient;
    private readonly ICacheService _cacheService;
    private readonly TelegramAssistantSettings _settings;
    private readonly ILogger<TelegramGeminiChatService> _logger;
    private const string FallbackErrorMessage = "Sorry, I'm unavailable right now. Please try again shortly.";
    private const string QuotaExceededMessage = "Sorry, I've reached my usage limit for today. Please try again tomorrow.";
    private const string QuotaKeyPrefix = "assistant:telegram:daily-quota:";

    public TelegramGeminiChatService(
        HttpClient httpClient,
        ICacheService cacheService,
        IOptions<TelegramAssistantSettings> settings,
        ILogger<TelegramGeminiChatService> logger)
    {
        _httpClient = httpClient;
        _cacheService = cacheService;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<string> GetReplyAsync(List<ChatTurn> history, CancellationToken cancellationToken)
    {
        var quotaKey = $"{QuotaKeyPrefix}{DateTime.UtcNow:yyyy-MM-dd}";

        TelegramQuotaCounter? counter;
        try
        {
            counter = await _cacheService.GetAsync<TelegramQuotaCounter>(quotaKey, cancellationToken);
        }
        catch (Exception ex)
        {
            // Fail open: a Redis hiccup here previously threw uncaught all the
            // way up through the webhook controller before SendMessageAsync
            // was ever reached, so the bot silently never replied even though
            // Telegram had already accepted the incoming message. Quota
            // tracking is best-effort (see IncrementQuotaAsync below); treat
            // an unreadable counter the same way — proceed as if under quota
            // rather than dropping the reply.
            _logger.LogWarning(ex, "Failed to read Telegram assistant daily quota counter");
            counter = null;
        }

        if (counter is not null && counter.Count >= _settings.GeminiDailyQuota)
        {
            _logger.LogWarning("Telegram assistant daily quota reached ({Count}/{Quota})", counter.Count, _settings.GeminiDailyQuota);
            return QuotaExceededMessage;
        }

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_settings.GeminiModel}:generateContent?key={_settings.GeminiApiKey}";

        var contents = history
            .Where(t => t.Role is "user" or "model")
            .Select(t => new
            {
                role = t.Role,
                parts = new[] { new { text = t.Content } }
            });

        var requestBody = new
        {
            system_instruction = new
            {
                parts = new[] { new { text = TelegramSystemPrompt.Text } }
            },
            contents
        };

        var json = JsonSerializer.Serialize(requestBody);
        using var content = new StringContent(json, Encoding.UTF8, "application/json");

        HttpResponseMessage response;
        try
        {
            response = await _httpClient.PostAsync(url, content, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Telegram Gemini API call failed");
            return FallbackErrorMessage;
        }

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Telegram Gemini API returned {StatusCode}: {Body}", response.StatusCode, errorBody);
            return FallbackErrorMessage;
        }

        var responseJson = await response.Content.ReadAsStringAsync(cancellationToken);
        using var doc = JsonDocument.Parse(responseJson);

        string replyText;
        try
        {
            var text = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            replyText = text ?? FallbackErrorMessage;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse Telegram Gemini response: {Body}", responseJson);
            return FallbackErrorMessage;
        }

        // Only count successful Gemini calls toward the daily quota.
        await IncrementQuotaAsync(quotaKey, counter, cancellationToken);

        return replyText;
    }

    private async Task IncrementQuotaAsync(string quotaKey, TelegramQuotaCounter? counter, CancellationToken cancellationToken)
    {
        var newCount = (counter?.Count ?? 0) + 1;
        var nextUtcMidnight = DateTime.UtcNow.Date.AddDays(1);
        var expiry = nextUtcMidnight - DateTime.UtcNow;

        try
        {
            await _cacheService.SetAsync(quotaKey, new TelegramQuotaCounter { Count = newCount }, expiry, cancellationToken);
        }
        catch (Exception ex)
        {
            // Quota tracking is best-effort; never fail the chat request because of it.
            _logger.LogWarning(ex, "Failed to update Telegram assistant daily quota counter");
        }
    }
}
