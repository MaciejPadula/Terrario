using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Conversations.GetConversation;

/// <summary>
/// Handler for retrieving a single conversation with its messages
/// </summary>
public class GetConversationHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetConversationHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves a conversation with all its messages
    /// </summary>
    public async Task<GetConversationResponse?> HandleAsync(
        Guid conversationId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var conversation = await _dbContext.ChatConversations
            .Where(c => c.Id == conversationId && c.UserId == userId)
            .Select(c => new GetConversationResponse
            {
                Id = c.Id,
                Title = c.Title,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt,
                Messages = c.Messages
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new ChatMessageDto
                    {
                        Id = m.Id,
                        Role = m.Role,
                        Content = m.Content,
                        CreatedAt = m.CreatedAt
                    })
            })
            .FirstOrDefaultAsync(cancellationToken);

        return conversation;
    }
}
