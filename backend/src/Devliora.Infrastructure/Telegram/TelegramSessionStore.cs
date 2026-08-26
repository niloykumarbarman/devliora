using Devliora.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Devliora.Infrastructure.Telegram;

public class TelegramSessionStore : ITelegramSessionStore
{
    private readonly ICacheService _cacheService;
    private readonly TelegramAssistantSettings _settings;
    private readonly ILogger<TelegramSessionStore> _logger;
    private const string SessionKeyPrefix = "assistant:telegram:session:";

    public TelegramSessionStore(
        ICacheService cacheService,
        IOptions<TelegramAssistantSettings> settings,
        ILogger<TelegramSessionStore> logger)
    {
        _cacheService = cacheService;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<List<ChatTurn>> GetHistoryAsync(long chatId, CancellationToken cancellationToken = default)
    {
        var key = BuildKey(chatId);

        try
        {
            var history = await _cacheService.GetAsync<List<ChatTurn>>(key, cancellationToken);
            return history ?? new List<ChatTurn>();
        }
        catch (Exception ex)
        {
            // Same best-effort reasoning as AppendTurnAsync below: a Redis
            // hiccup here previously threw uncaught all the way up through
            // the MediatR handler and the webhook controller, which never
            // reached _apiClient.SendMessageAsync — the bot would silently
            // never reply even though Telegram had already accepted the
            // incoming message. Falling back to an empty (fresh) history
            // keeps the conversation going instead of dropping the reply.
            _logger.LogWarning(ex, "Failed to load Telegram session history for chat {ChatId}", chatId);
            return new List<ChatTurn>();
        }
    }

    public async Task AppendTurnAsync(long chatId, ChatTurn turn, CancellationToken cancellationToken = default)
    {
        var key = BuildKey(chatId);
        var history = await GetHistoryAsync(chatId, cancellationToken);
        history.Add(turn);

        var ttl = TimeSpan.FromMinutes(_settings.SessionTtlMinutes);

        try
        {
            await _cacheService.SetAsync(key, history, ttl, cancellationToken);
        }
        catch (Exception ex)
        {
            // Session persistence is best-effort; never fail the chat request because of it.
            _logger.LogWarning(ex, "Failed to persist Telegram session history for chat {ChatId}", chatId);
        }
    }

    public async Task ClearAsync(long chatId, CancellationToken cancellationToken = default)
    {
        var key = BuildKey(chatId);
        await _cacheService.RemoveAsync(key, cancellationToken);
    }

    private static string BuildKey(long chatId) => $"{SessionKeyPrefix}{chatId}";
}
