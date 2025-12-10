namespace Terrario.Server.Features.Animals.GetRecentAnimals;

/// <summary>
/// DTO for recent animal information
/// </summary>
public sealed record RecentAnimalDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string SpeciesCommonName { get; init; }
    public string? SpeciesScientificName { get; init; }
    public required string CategoryName { get; init; }
    public string? ImageUrl { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required string AnimalListName { get; init; }
}

/// <summary>
/// Response model for recent animals list
/// </summary>
public sealed record GetRecentAnimalsResponse
{
    public required IEnumerable<RecentAnimalDto> RecentAnimals { get; init; }
    public required int TotalCount { get; init; }
}
