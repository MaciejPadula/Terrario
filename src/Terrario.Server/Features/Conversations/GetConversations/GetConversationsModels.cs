namespace Terrario.Server.Features.Conversations.GetConversations;

/// <summary>
/// DTO for a conversation in the list (without messages)
/// </summary>
public sealed record ConversationDto
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Response model for list of conversations
/// </summary>
public sealed record GetConversationsResponse
{
    public required IEnumerable<ConversationDto> Conversations { get; init; }
    public required int TotalCount { get; init; }
}
