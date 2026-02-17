using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.Conversations.GetConversation;

/// <summary>
/// Endpoint for retrieving a single conversation with messages
/// </summary>
public static class GetConversationEndpoint
{
    public static IEndpointRouteBuilder MapGetConversationEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/conversations/{id:guid}", async (
            [FromRoute] Guid id,
            GetConversationHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(id, userId, cancellationToken);

            if (result is null)
            {
                return Results.NotFound(new { Message = "Konwersacja nie została znaleziona" });
            }

            return Results.Ok(result);
        })
        .WithName("GetConversation")
        .WithTags("Conversations")
        .WithSummary("Get a conversation with messages")
        .WithDescription("Retrieves a single chat conversation with all its messages")
        .Produces<GetConversationResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
