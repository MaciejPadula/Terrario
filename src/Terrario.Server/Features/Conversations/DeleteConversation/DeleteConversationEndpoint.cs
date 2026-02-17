using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.Conversations.DeleteConversation;

/// <summary>
/// Endpoint for deleting a chat conversation
/// </summary>
public static class DeleteConversationEndpoint
{
    public static IEndpointRouteBuilder MapDeleteConversationEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapDelete("/api/conversations/{id:guid}", async (
            [FromRoute] Guid id,
            DeleteConversationHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var success = await handler.HandleAsync(id, userId, cancellationToken);

            if (!success)
            {
                return Results.NotFound(new { Message = "Konwersacja nie została znaleziona" });
            }

            return Results.Ok(new DeleteConversationResponse { Message = "Konwersacja została usunięta" });
        })
        .WithName("DeleteConversation")
        .WithTags("Conversations")
        .WithSummary("Delete a conversation")
        .WithDescription("Permanently deletes a chat conversation and all its messages")
        .Produces<DeleteConversationResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
