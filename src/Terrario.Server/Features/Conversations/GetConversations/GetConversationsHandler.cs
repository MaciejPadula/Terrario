using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Conversations.GetConversations;

/// <summary>
/// Handler for retrieving user's chat conversations
/// </summary>
public class GetConversationsHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetConversationsHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves all conversations for the specified user, ordered by most recent
    /// </summary>
    public async Task<GetConversationsResponse> HandleAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        var conversations = await _dbContext.ChatConversations
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.UpdatedAt)
            .Select(c => new ConversationDto
            {
                Id = c.Id,
                Title = c.Title,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return new GetConversationsResponse
        {
            Conversations = conversations,
            TotalCount = conversations.Count
        };
    }
}
