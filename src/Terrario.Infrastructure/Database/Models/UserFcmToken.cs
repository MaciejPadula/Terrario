namespace Terrario.Infrastructure.Database.Models;

/// <summary>
/// Represents an FCM token for a user, allowing multiple devices per user.
/// </summary>
public class UserFcmToken
{
    /// <summary>
    /// Primary key
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Foreign key to ApplicationUser
    /// </summary>
    public string UserId { get; set; } = null!;

    /// <summary>
    /// The FCM token
    /// </summary>
    public string Token { get; set; } = null!;

    /// <summary>
    /// Device identifier (optional)
    /// </summary>
    public string? DeviceId { get; set; }

    /// <summary>
    /// Date when the token was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Date when the token was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// Navigation property to user
    /// </summary>
    public ApplicationUser User { get; set; } = null!;
}