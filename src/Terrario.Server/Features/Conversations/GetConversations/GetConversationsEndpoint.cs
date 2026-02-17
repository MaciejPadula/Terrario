using System.Security.Claims;

namespace Terrario.Server.Features.Conversations.GetConversations;

/// <summary>
/// Endpoint for retrieving user's chat conversations
/// </summary>
public static class GetConversationsEndpoint
{
    public static IEndpointRouteBuilder MapGetConversationsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/conversations", async (
            GetConversationsHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(userId, cancellationToken);
            return Results.Ok(result);
        })
        .WithName("GetConversations")
        .WithTags("Conversations")
        .WithSummary("Get all conversations")
        .WithDescription("Retrieves all chat conversations for the authenticated user")
        .Produces<GetConversationsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
