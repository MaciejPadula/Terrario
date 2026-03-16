using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Terrario.Infrastructure.Database.Models;

/// <summary>
/// Represents a legal document/attachment associated with an animal (e.g. CITES permits, purchase receipts)
/// </summary>
public class AnimalLegalAttachmentEntity
{
    [Key]
    public Guid Id { get; set; }

    /// <summary>
    /// Foreign key to the animal this attachment belongs to
    /// </summary>
    public Guid AnimalId { get; set; }

    [ForeignKey(nameof(AnimalId))]
    public virtual AnimalEntity Animal { get; set; } = null!;

    /// <summary>
    /// Original file name provided by the user
    /// </summary>
    [Required]
    [MaxLength(300)]
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// MIME content type of the file
    /// </summary>
    [MaxLength(100)]
    public string ContentType { get; set; } = string.Empty;

    /// <summary>
    /// File size in bytes
    /// </summary>
    public long FileSizeBytes { get; set; }

    /// <summary>
    /// Date when the attachment was uploaded
    /// </summary>
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Foreign key to the user who uploaded this attachment
    /// </summary>
    [Required]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey(nameof(UserId))]
    public virtual ApplicationUser User { get; set; } = null!;
}
