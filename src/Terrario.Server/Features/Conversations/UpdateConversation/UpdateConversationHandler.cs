using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Conversations.UpdateConversation;

/// <summary>
/// Handler for updating a conversation title
/// </summary>
public class UpdateConversationHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<UpdateConversationHandler> _logger;

    public UpdateConversationHandler(
        ApplicationDbContext dbContext,
        ILogger<UpdateConversationHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Updates the title of an existing conversation
    /// </summary>
    public async Task<UpdateConversationResponse?> HandleAsync(
        Guid conversationId,
        UpdateConversationRequest request,
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
            return null;
        }

        conversation.Title = request.Title;
        conversation.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Updated conversation '{Title}' (ID: {Id}) for user {UserId}",
            conversation.Title,
            conversation.Id,
            userId);

        return new UpdateConversationResponse
        {
            Id = conversation.Id,
            Title = conversation.Title,
            CreatedAt = conversation.CreatedAt,
            UpdatedAt = conversation.UpdatedAt
        };
    }
}
