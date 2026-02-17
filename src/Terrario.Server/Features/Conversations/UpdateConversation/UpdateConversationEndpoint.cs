using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.Conversations.UpdateConversation;

/// <summary>
/// Endpoint for updating a conversation title
/// </summary>
public static class UpdateConversationEndpoint
{
    public static IEndpointRouteBuilder MapUpdateConversationEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPut("/api/conversations/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateConversationRequest request,
            UpdateConversationHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(id, request, userId, cancellationToken);

            if (result is null)
            {
                return Results.NotFound(new { Message = "Konwersacja nie została znaleziona" });
            }

            return Results.Ok(result);
        })
        .WithName("UpdateConversation")
        .WithTags("Conversations")
        .WithSummary("Update a conversation title")
        .WithDescription("Updates the title of an existing chat conversation")
        .Produces<UpdateConversationResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
