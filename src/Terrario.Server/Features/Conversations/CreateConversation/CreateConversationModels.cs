using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.Conversations.CreateConversation;

/// <summary>
/// Request model for creating a new conversation
/// </summary>
public sealed record CreateConversationRequest
{
    [MaxLength(200, ErrorMessage = "Tytuł może mieć maksymalnie 200 znaków")]
    public string? Title { get; init; }
}

/// <summary>
/// Response model for created conversation
/// </summary>
public sealed record CreateConversationResponse
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}
