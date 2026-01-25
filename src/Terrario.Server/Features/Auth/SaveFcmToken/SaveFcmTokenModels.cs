using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.Auth.SaveFcmToken;

/// <summary>
/// Request model for saving FCM token
/// </summary>
public sealed record SaveFcmTokenRequest
{
    [Required(ErrorMessage = "Token jest wymagany")]
    public string Token { get; init; } = string.Empty;

    /// <summary>
    /// Optional device identifier
    /// </summary>
    public string? DeviceId { get; init; }
}

/// <summary>
/// Response model for successful token save
/// </summary>
public sealed record SaveFcmTokenResponse
{
    public required string Message { get; init; }
}

/// <summary>
/// Error response model
/// </summary>
public sealed record SaveFcmTokenErrorResponse
{
    public required string Message { get; init; }
}