namespace Devliora.Infrastructure.Telegram;

public class TelegramAssistantSettings
{
    public string BotToken { get; set; } = string.Empty;

    // Sent by Telegram in the X-Telegram-Bot-Api-Secret-Token header on every
    // webhook call; must match what was set via setWebhook. Protects the
    // endpoint from spoofed requests.
    public string WebhookSecretToken { get; set; } = string.Empty;

    public string GeminiApiKey { get; set; } = string.Empty;
    public string GeminiModel { get; set; } = "gemini-2.0-flash";

    // Separate app-level Redis counter from the website widget, but both share
    // the same Google Cloud project's Gemini free-tier requests-per-day quota.
    // Split with headroom: 8 + 8, leaving a buffer. Re-check the current RPD
    // for GeminiModel in Google AI Studio and raise once billing / a paid tier
    // is enabled.
    public int GeminiDailyQuota { get; set; } = 8;

    // How long a chat's conversation history is kept in Redis after the
    // last message, in minutes. Keeps memory bounded for inactive chats.
    public int SessionTtlMinutes { get; set; } = 60;
    // Personal Telegram chat ID of the site admin; new-message alerts
    // (website chat + Telegram bot) are sent here.
    public string AdminChatId { get; set; } = string.Empty;
}
