namespace Terrario.Server.Features.Animals.GetAnimals;

/// <summary>
/// DTO for animal information
/// </summary>
public sealed record AnimalDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required Guid SpeciesId { get; init; }
    public required string SpeciesCommonName { get; init; }
    public required string SpeciesScientificName { get; init; }
    public required Guid CategoryId { get; init; }
    public required string CategoryName { get; init; }
    public required Guid AnimalListId { get; init; }
    public string? ImageUrl { get; init; }
    public required DateTime CreatedAt { get; init; }
}

/// <summary>
/// Response model for animals list
/// </summary>
public sealed record GetAnimalsResponse
{
    public required IEnumerable<AnimalDto> Animals { get; init; }
    public required int TotalCount { get; init; }
}

/// <summary>
/// Query parameters for filtering animals
/// </summary>
public sealed record GetAnimalsQuery
{
    public Guid? AnimalListId { get; init; }
    public Guid? SpeciesId { get; init; }
    public string? Search { get; init; }
}
