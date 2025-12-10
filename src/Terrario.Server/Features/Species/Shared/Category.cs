using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.Species.Shared;

/// <summary>
/// Represents a category of species (e.g., Spiders, Lizards, Snakes)
/// </summary>
public class Category
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(50)]
    public string? Icon { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public virtual ICollection<SpeciesEntity> Species { get; set; } = new List<SpeciesEntity>();
}
