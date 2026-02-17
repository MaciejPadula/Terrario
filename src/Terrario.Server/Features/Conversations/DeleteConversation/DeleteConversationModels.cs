namespace Terrario.Server.Features.Conversations.DeleteConversation;

/// <summary>
/// Response model for deleted conversation
/// </summary>
public sealed record DeleteConversationResponse
{
    public required string Message { get; init; }
}
