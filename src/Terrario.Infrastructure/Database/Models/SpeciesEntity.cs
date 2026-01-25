using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Terrario.Infrastructure.Database.Models;

/// <summary>
/// Represents a species (gatunek) in the terrarium database
/// </summary>
public class SpeciesEntity
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string CommonName { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? ScientificName { get; set; }

    [Required]
    public Guid CategoryId { get; set; }

    [ForeignKey(nameof(CategoryId))]
    public virtual Category Category { get; set; } = null!;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    /// <summary>
    /// Care level ID
    /// </summary>
    public Guid? CareLevelId { get; set; }

    /// <summary>
    /// Care level navigation property
    /// </summary>
    /// 
    [ForeignKey(nameof(CareLevelId))]
    public virtual CareLevelEntity CareLevel { get; set; } = null!;

    /// <summary>
    /// Typical adult size in cm
    /// </summary>
    public int? AdultSizeCm { get; set; }

    /// <summary>
    /// Typical lifespan in years
    /// </summary>
    public int? LifespanYears { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
