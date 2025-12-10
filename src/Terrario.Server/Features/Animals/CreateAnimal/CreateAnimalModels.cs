namespace Terrario.Server.Features.Animals.CreateAnimal;

/// <summary>
/// Request model for creating a new animal
/// </summary>
public sealed record CreateAnimalRequest
{
    public required string Name { get; init; }
    public required Guid SpeciesId { get; init; }
    public required Guid AnimalListId { get; init; }
    public string? ImageUrl { get; init; }
}

/// <summary>
/// Response model for created animal
/// </summary>
public sealed record CreateAnimalResponse
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required Guid SpeciesId { get; init; }
    public required string SpeciesName { get; init; }
    public required Guid AnimalListId { get; init; }
    public required string AnimalListName { get; init; }
    public string? ImageUrl { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required string Message { get; init; }
}
