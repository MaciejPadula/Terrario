using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Terrario.Infrastructure.Database.Models;

/// <summary>
/// Represents a single message in a chat conversation
/// </summary>
public class ChatMessageEntity
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid ConversationId { get; set; }

    [ForeignKey(nameof(ConversationId))]
    public virtual ChatConversation Conversation { get; set; } = null!;

    /// <summary>
    /// Message role: "user", "assistant", or "system"
    /// </summary>
    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
