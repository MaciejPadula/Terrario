using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;

namespace Terrario.Server.Features.Conversations.CreateConversation;

/// <summary>
/// Handler for creating a new chat conversation
/// </summary>
public class CreateConversationHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<CreateConversationHandler> _logger;

    public CreateConversationHandler(
        ApplicationDbContext dbContext,
        ILogger<CreateConversationHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new chat conversation for the specified user
    /// </summary>
    public async Task<CreateConversationResponse> HandleAsync(
        CreateConversationRequest request,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var conversation = new ChatConversation
        {
            Id = Guid.NewGuid(),
            Title = string.IsNullOrWhiteSpace(request.Title) ? "Nowa rozmowa" : request.Title,
            UserId = userId,
            CreatedAt = now,
            UpdatedAt = now
        };

        _dbContext.ChatConversations.Add(conversation);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Created new conversation '{Title}' (ID: {Id}) for user {UserId}",
            conversation.Title,
            conversation.Id,
            userId);

        return new CreateConversationResponse
        {
            Id = conversation.Id,
            Title = conversation.Title,
            CreatedAt = conversation.CreatedAt,
            UpdatedAt = conversation.UpdatedAt
        };
    }
}
