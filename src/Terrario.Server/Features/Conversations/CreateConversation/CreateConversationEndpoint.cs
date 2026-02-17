using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.Conversations.CreateConversation;

/// <summary>
/// Endpoint for creating a new chat conversation
/// </summary>
public static class CreateConversationEndpoint
{
    public static IEndpointRouteBuilder MapCreateConversationEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/conversations", async (
            [FromBody] CreateConversationRequest request,
            CreateConversationHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(request, userId, cancellationToken);
            return Results.Created($"/api/conversations/{result.Id}", result);
        })
        .WithName("CreateConversation")
        .WithTags("Conversations")
        .WithSummary("Create a new conversation")
        .WithDescription("Creates a new chat conversation for the authenticated user")
        .Produces<CreateConversationResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
