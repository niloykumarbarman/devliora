using System.Text;
using Devliora.Application.Common.Interfaces;
using Devliora.Application.Features.Services.Commands.CreateService;
using Devliora.Infrastructure.Caching;
using Devliora.Infrastructure.Data;
using Devliora.Infrastructure.Security;
using Devliora.Infrastructure.Assistant;
using Devliora.Infrastructure.Telegram;
using Devliora.Infrastructure.Chat;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Devliora.Application.Common.Behaviors;
using Devliora.WebApi.Middleware;
using Devliora.WebApi.Services;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(CreateServiceCommand).Assembly);
    cfg.AddOpenBehavior(typeof(AuditLoggingBehavior<,>));
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

builder.Services.AddValidatorsFromAssembly(typeof(CreateServiceCommand).Assembly);
builder.Services.AddFluentValidationAutoValidation();

// JWT + password hashing services
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<AssistantSettings>(builder.Configuration.GetSection("Assistant"));
builder.Services.Configure<TelegramAssistantSettings>(builder.Configuration.GetSection("Telegram"));
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();

// Redis distributed cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "agencywebsite:";
});
builder.Services.AddScoped<ICacheService, RedisCacheService>();
builder.Services.AddHttpClient<IAssistantChatService, GeminiChatService>();
builder.Services.AddScoped<ITelegramSessionStore, TelegramSessionStore>();
builder.Services.AddScoped<ITelegramContactFlowStore, TelegramContactFlowStore>();
builder.Services.AddHttpClient<ITelegramApiClient, TelegramApiClient>();
builder.Services.AddHttpClient<ITelegramChatService, TelegramGeminiChatService>();
builder.Services.AddScoped<IChatPersistenceService, ChatPersistenceService>();

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()
    ?? throw new InvalidOperationException("JwtSettings configuration section is missing.");

if (string.IsNullOrWhiteSpace(jwtSettings.SecretKey) || jwtSettings.SecretKey.Length < 32)
{
    throw new InvalidOperationException(
        "JwtSettings:SecretKey is missing or too short (needs 32+ characters). " +
        "For local development, set it via: dotnet user-secrets set \"JwtSettings:SecretKey\" \"<your-secret>\" " +
        "(run from backend/src/Devliora.WebApi). For production, set the JwtSettings__SecretKey environment " +
        "variable or inject it via your secret manager. See backend/SECRETS.md for details.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy("login", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            }));
    options.AddPolicy("assistant", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0,
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst
            }));

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.ContentType = "application/json";
        var message = context.HttpContext.Request.Path.StartsWithSegments("/api/assistant")
            ? "Too many messages. Please wait a moment before trying again."
            : "Too many login attempts. Please try again later.";
        await context.HttpContext.Response.WriteAsync(
            $"{{\"message\":\"{message}\"}}",
            cancellationToken);
    };
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Apply pending EF Core migrations automatically on startup (safe for prod: no-op if none pending)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    await Devliora.Infrastructure.Data.DbSeeder.SeedAsync(dbContext);

    // Data-fix/data-seed migrations bypass the app layer, so anything Redis
    // had cached from before this deploy would otherwise keep serving stale
    // values for up to its TTL. Drop the keys known to have just changed
    // (see FixHeroSecondaryCtaUrl, SeedAdditionalIndustries,
    // SeedDigitalDesignHighlights) so the fix is live immediately instead
    // of after the cache TTL expires.
    var cache = scope.ServiceProvider.GetRequiredService<ICacheService>();
    await cache.RemoveAsync("hero:content");
    await cache.RemoveAsync("industries:all");
    await cache.RemoveAsync("services:all");
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'";
    context.Response.Headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";

    if (!context.Request.IsHttps && !app.Environment.IsDevelopment())
    {
        // no-op placeholder; HSTS is added separately for production below
    }

    await next();
});
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRateLimiter();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
