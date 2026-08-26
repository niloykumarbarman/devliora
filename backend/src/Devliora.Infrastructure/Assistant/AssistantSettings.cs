namespace Devliora.Infrastructure.Assistant;

public class AssistantSettings
{
    public string GeminiApiKey { get; set; } = string.Empty;
    public string GeminiModel { get; set; } = "gemini-2.0-flash";

    // Soft daily quota guard. The Gemini free-tier requests-per-day limit is
    // per Google Cloud project and shared between this widget and the Telegram
    // bot, so the two split it with headroom: 8 + 8, leaving a buffer.
    // Re-check the current RPD for GeminiModel in Google AI Studio and raise
    // once billing / a paid tier is enabled.
    public int GeminiDailyQuota { get; set; } = 8;
}
