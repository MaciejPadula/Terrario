using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.Species.Shared;

/// <summary>
/// Represents a care level for species
/// </summary>
public class CareLevelEntity
{
    /// <summary>
    /// Unique identifier
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Translation key for the care level name
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Display order
    /// </summary>
    public int DisplayOrder { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Species with this care level
    /// </summary>
    public ICollection<SpeciesEntity> Species { get; set; } = new List<SpeciesEntity>();
}