using Terrario.Infrastructure.Database.Models;
namespace Terrario.Server.Features.Animals.UpdateAnimal;

/// <summary>
/// Request model for updating an animal
/// </summary>
public sealed record UpdateAnimalRequest
{
    public required string Name { get; init; }
    public required Guid SpeciesId { get; init; }
    public required Guid AnimalListId { get; init; }
    public string? ImageUrl { get; init; }

    /// <summary>
    /// Gender of the animal (Unknown, Male, Female)
    /// </summary>
    public AnimalGender Gender { get; init; } = AnimalGender.Unknown;
}

/// <summary>
/// Response model for updated animal
/// </summary>
public sealed record UpdateAnimalResponse
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required Guid SpeciesId { get; init; }
    public required Guid AnimalListId { get; init; }
    public string? ImageUrl { get; init; }

    /// <summary>
    /// Gender of the animal (Unknown, Male, Female)
    /// </summary>
    public AnimalGender Gender { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required string Message { get; init; }
}
