using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Terrario.Infrastructure.Database.Models;

/// <summary>
/// Represents a time-based reminder related to an animal
/// </summary>
public class Reminder
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Required]
    public DateTime ReminderDateTime { get; set; }

    public bool IsRecurring { get; set; } = false;

    [MaxLength(50)]
    public string? RecurrencePattern { get; set; } // e.g., "daily", "weekly", "monthly"

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? LastSentAt { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser User { get; set; } = null!;

    public Guid? AnimalId { get; set; }

    [ForeignKey(nameof(AnimalId))]
    public virtual AnimalEntity? Animal { get; set; }
}