namespace Terrario.Server.Features.AnimalLists.GetLists;

/// <summary>
/// Response model for animal list item
/// </summary>
public sealed record AnimalListDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}

/// <summary>
/// Response model for list of animal lists
/// </summary>
public sealed record GetListsResponse
{
    public required IEnumerable<AnimalListDto> Lists { get; init; }
    public required int TotalCount { get; init; }
}
