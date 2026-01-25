using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Auth.SaveFcmToken;

/// <summary>
/// Handler for saving FCM token logic
/// </summary>
public class SaveFcmTokenHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<SaveFcmTokenHandler> _logger;

    public SaveFcmTokenHandler(
        ApplicationDbContext dbContext,
        ILogger<SaveFcmTokenHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Handles saving FCM token
    /// </summary>
    public async Task<Result<SaveFcmTokenResponse>> HandleAsync(
        string userId,
        SaveFcmTokenRequest request,
        CancellationToken cancellationToken = default)
    {
        // Check if token already exists for this user and device
        var existingToken = await _dbContext.UserFcmTokens
            .FirstOrDefaultAsync(t => t.UserId == userId && t.DeviceId == request.DeviceId, cancellationToken);

        if (existingToken != null)
        {
            // Update existing token
            existingToken.Token = request.Token;
            existingToken.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            // Create new token
            var newToken = new UserFcmToken
            {
                UserId = userId,
                Token = request.Token,
                DeviceId = request.DeviceId,
                CreatedAt = DateTime.UtcNow
            };
            _dbContext.UserFcmTokens.Add(newToken);
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("FCM token saved for user {UserId}, device {DeviceId}", userId, request.DeviceId);

        return Result<SaveFcmTokenResponse>.Success(new SaveFcmTokenResponse
        {
            Message = "Token zapisany pomyślnie"
        });
    }
}