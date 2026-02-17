namespace Terrario.Server.Features.Auth.ValidateToken;

/// <summary>
/// Response model for token validation
/// </summary>
public sealed record ValidateTokenResponse
{
    public required bool IsValid { get; init; }
    public required string UserId { get; init; }
    public required string Email { get; init; }
    public string? FirstName { get; init; }
}
