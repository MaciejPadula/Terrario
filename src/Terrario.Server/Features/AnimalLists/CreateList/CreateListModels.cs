using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.AnimalLists.CreateList;

/// <summary>
/// Request model for creating a new animal list
/// </summary>
public sealed record CreateListRequest
{
    [Required(ErrorMessage = "Nazwa listy jest wymagana")]
    [MaxLength(100, ErrorMessage = "Nazwa listy może mieć maksymalnie 100 znaków")]
    public string Name { get; init; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Opis może mieć maksymalnie 500 znaków")]
    public string? Description { get; init; }
}

/// <summary>
/// Response model for created animal list
/// </summary>
public sealed record CreateListResponse
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required DateTime CreatedAt { get; init; }
}

/// <summary>
/// Error response model
/// </summary>
public sealed record CreateListErrorResponse
{
    public required string Message { get; init; }
    public IEnumerable<string>? Errors { get; init; }
}
