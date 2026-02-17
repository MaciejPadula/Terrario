using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Conversations.DeleteConversation;

/// <summary>
/// Handler for deleting a chat conversation
/// </summary>
public class DeleteConversationHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<DeleteConversationHandler> _logger;

    public DeleteConversationHandler(
        ApplicationDbContext dbContext,
        ILogger<DeleteConversationHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Deletes an existing conversation and all its messages
    /// </summary>
    public async Task<bool> HandleAsync(
        Guid conversationId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var conversation = await _dbContext.ChatConversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId, cancellationToken);

        if (conversation is null)
        {
            _logger.LogWarning(
                "Conversation {ConversationId} not found or does not belong to user {UserId}",
                conversationId,
                userId);
            return false;
        }

        _dbContext.ChatConversations.Remove(conversation);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Deleted conversation '{Title}' (ID: {Id}) for user {UserId}",
            conversation.Title,
            conversation.Id,
            userId);

        return true;
    }
}
