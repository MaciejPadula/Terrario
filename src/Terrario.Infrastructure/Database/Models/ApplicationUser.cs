using Microsoft.AspNetCore.Identity;

namespace Terrario.Infrastructure.Database.Models;

/// <summary>
/// Represents a user in the Terrario application.
/// Extends IdentityUser with additional properties.
/// </summary>
public class ApplicationUser : IdentityUser
{
    /// <summary>
    /// Optional first name of the user
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// Date when the user account was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Date when the user account was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// FCM tokens for push notifications
    /// </summary>
    public ICollection<UserFcmToken> FcmTokens { get; set; } = new List<UserFcmToken>();
}
