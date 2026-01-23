namespace Terrario.Server.Features.Animals.GetAnimalDetails;

/// <summary>
/// DTO for detailed animal information
/// </summary>
public sealed record AnimalDetailsDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required Guid SpeciesId { get; init; }
    public required string SpeciesCommonName { get; init; }
    public required string SpeciesScientificName { get; init; }
    public required Guid CategoryId { get; init; }
    public required string CategoryName { get; init; }
    public required Guid AnimalListId { get; init; }
    public required string AnimalListName { get; init; }
    public string? ImageUrl { get; init; }
    public required DateTime CreatedAt { get; init; }
}

/// <summary>
/// Response model for animal details
/// </summary>
public sealed record GetAnimalDetailsResponse
{
    public required AnimalDetailsDto Animal { get; init; }
}
