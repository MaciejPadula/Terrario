namespace Terrario.Server.Features.Conversations.GetConversation;

/// <summary>
/// DTO for a chat message
/// </summary>
public sealed record ChatMessageDto
{
    public required Guid Id { get; init; }
    public required string Role { get; init; }
    public required string Content { get; init; }
    public required DateTime CreatedAt { get; init; }
}

/// <summary>
/// Response model for a single conversation with messages
/// </summary>
public sealed record GetConversationResponse
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public required IEnumerable<ChatMessageDto> Messages { get; init; }
}
