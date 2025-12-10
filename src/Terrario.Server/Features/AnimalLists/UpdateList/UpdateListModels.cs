using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.AnimalLists.UpdateList;

/// <summary>
/// Request model for updating an animal list
/// </summary>
public sealed record UpdateListRequest
{
    [Required(ErrorMessage = "Nazwa listy jest wymagana")]
    [MaxLength(100, ErrorMessage = "Nazwa listy może mieć maksymalnie 100 znaków")]
    public string Name { get; init; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Opis może mieć maksymalnie 500 znaków")]
    public string? Description { get; init; }
}

/// <summary>
/// Response model for updated animal list
/// </summary>
public sealed record UpdateListResponse
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
