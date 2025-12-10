using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.Auth.Login;

/// <summary>
/// Request model for user login
/// </summary>
public sealed record LoginRequest
{
    [Required(ErrorMessage = "Email jest wymagany")]
    [EmailAddress(ErrorMessage = "Nieprawidłowy format email")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Hasło jest wymagane")]
    public string Password { get; init; } = string.Empty;
}

/// <summary>
/// Response model for successful login
/// </summary>
public sealed record LoginResponse
{
    public required string UserId { get; init; }
    public required string Email { get; init; }
    public string? FirstName { get; init; }
    public required string Token { get; init; }
}

/// <summary>
/// Error response model
/// </summary>
public sealed record LoginErrorResponse
{
    public required string Message { get; init; }
}
