using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.Conversations.UpdateConversation;

/// <summary>
/// Request model for updating a conversation title
/// </summary>
public sealed record UpdateConversationRequest
{
    [Required(ErrorMessage = "Tytuł jest wymagany")]
    [MaxLength(200, ErrorMessage = "Tytuł może mieć maksymalnie 200 znaków")]
    public string Title { get; init; } = string.Empty;
}

/// <summary>
/// Response model for updated conversation
/// </summary>
public sealed record UpdateConversationResponse
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
