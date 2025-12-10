using Terrario.Server.Features.AnimalLists.Shared;
using Terrario.Server.Features.Auth.Shared;
using Terrario.Server.Features.Species.Shared;

namespace Terrario.Server.Features.Animals.Shared;

/// <summary>
/// Entity representing an animal in a user's collection
/// </summary>
public class AnimalEntity
{
    /// <summary>
    /// Unique identifier for the animal
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Name/nickname of the animal
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Foreign key to Species
    /// </summary>
    public Guid SpeciesId { get; set; }

    /// <summary>
    /// Navigation property to Species
    /// </summary>
    public SpeciesEntity Species { get; set; } = null!;

    /// <summary>
    /// Foreign key to AnimalList
    /// </summary>
    public Guid AnimalListId { get; set; }

    /// <summary>
    /// Navigation property to AnimalList
    /// </summary>
    public AnimalList AnimalList { get; set; } = null!;

    /// <summary>
    /// Optional custom image URL for the animal
    /// </summary>
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Foreign key to User who owns this animal
    /// </summary>
    public required string UserId { get; set; }

    /// <summary>
    /// Navigation property to User
    /// </summary>
    public ApplicationUser User { get; set; } = null!;

    /// <summary>
    /// Date when the animal was added to the collection
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Date when the animal record was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}
