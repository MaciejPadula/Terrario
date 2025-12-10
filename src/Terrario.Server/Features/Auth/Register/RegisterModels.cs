using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.Auth.Register;

/// <summary>
/// Request model for user registration
/// </summary>
public sealed record RegisterRequest
{
    [Required(ErrorMessage = "Email jest wymagany")]
    [EmailAddress(ErrorMessage = "Nieprawidłowy format email")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Hasło jest wymagane")]
    [MinLength(8, ErrorMessage = "Hasło musi mieć co najmniej 8 znaków")]
    public string Password { get; init; } = string.Empty;

    [Required(ErrorMessage = "Potwierdzenie hasła jest wymagane")]
    [Compare(nameof(Password), ErrorMessage = "Hasła nie są identyczne")]
    public string ConfirmPassword { get; init; } = string.Empty;

    /// <summary>
    /// Optional first name
    /// </summary>
    public string? FirstName { get; init; }
}

/// <summary>
/// Response model for successful registration
/// </summary>
public sealed record RegisterResponse
{
    public required string UserId { get; init; }
    public required string Email { get; init; }
    public string? FirstName { get; init; }
    public required string Token { get; init; }
    public required DateTime CreatedAt { get; init; }
}

/// <summary>
/// Error response model
/// </summary>
public sealed record RegisterErrorResponse
{
    public required string Message { get; init; }
    public IEnumerable<string>? Errors { get; init; }
}
