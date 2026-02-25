using Agentic.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;

namespace Terrario.Server.Features.Asisstant.Query;

public static class QueryEndpoint
{
    public static IEndpointRouteBuilder MapQueryEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints
            .MapPost("/api/assistant/query", [Authorize] async (
                [FromBody] QueryRequest request,
                QueryHandler handler,
                ApplicationDbContext dbContext,
                ClaimsPrincipal user,
                CancellationToken cancellationToken) =>
            {
                var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Results.Unauthorized();
                }

                // Resolve or create the conversation
                ChatConversation? conversation = null;
                if (request.ConversationId.HasValue)
                {
                    conversation = await dbContext.ChatConversations
                        .FindAsync([request.ConversationId.Value], cancellationToken);

                    if (conversation is null || conversation.UserId != userId)
                    {
                        return Results.NotFound(new { Message = "Konwersacja nie została znaleziona" });
                    }
                }

                var history = conversation is not null
                    ? await dbContext.ChatMessages
                        .Where(m => m.ConversationId == conversation.Id)
                        .OrderBy(m => m.CreatedAt)
                        .Select(m => $"{m.Role}: {m.Content}")
                        .ToListAsync(cancellationToken)
                    : new List<string>();

                // Save user message
                if (conversation is not null)
                {
                    dbContext.ChatMessages.Add(new ChatMessageEntity
                    {
                        Id = Guid.NewGuid(),
                        ConversationId = conversation.Id,
                        Role = "user",
                        Content = request.Query,
                        CreatedAt = DateTime.UtcNow
                    });
                    conversation.UpdatedAt = DateTime.UtcNow;
                    await dbContext.SaveChangesAsync(cancellationToken);
                }
                

                var result = handler.HandleAsync(new AgentRequest
                {
                    Query = request.Query,
                    UserId = userId,
                    ConversationHistory = history
                }, cancellationToken);

                // Wrap the stream to capture the full assistant response
                async IAsyncEnumerable<ResponsePart> WrapStream()
                {
                    var fullResponse = new StringBuilder();

                    await foreach (var part in result)
                    {
                        if (part.Type == ResponsePartType.Text && !string.IsNullOrEmpty(part.Body)) // Text type
                        {
                            fullResponse.Append(part.Body);
                        }
                        yield return part;
                    }

                    // Save assistant response after streaming completes
                    if (conversation is not null && fullResponse.Length > 0)
                    {
                        dbContext.ChatMessages.Add(new ChatMessageEntity
                        {
                            Id = Guid.NewGuid(),
                            ConversationId = conversation.Id,
                            Role = "assistant",
                            Content = fullResponse.ToString(),
                            CreatedAt = DateTime.UtcNow
                        });

                        // Auto-generate title from first user message if still default
                        if (conversation.Title == "Nowa rozmowa")
                        {
                            conversation.Title = request.Query.Length > 50
                                ? request.Query[..50] + "..."
                                : request.Query;
                        }

                        conversation.UpdatedAt = DateTime.UtcNow;
                        await dbContext.SaveChangesAsync(CancellationToken.None);
                    }
                }

                return Results.ServerSentEvents(WrapStream());
            })
            .WithName("AssistantQuery")
            .WithTags("Assistant")
            .WithSummary("Process a query for the assistant")
            .WithDescription("Processes a user query and returns a response from the assistant");
        return endpoints;
    }
}
