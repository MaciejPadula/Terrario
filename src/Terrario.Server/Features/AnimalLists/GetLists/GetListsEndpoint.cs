using System.Security.Claims;

namespace Terrario.Server.Features.AnimalLists.GetLists;

/// <summary>
/// Endpoint for retrieving user's animal lists
/// </summary>
public static class GetListsEndpoint
{
    public static IEndpointRouteBuilder MapGetListsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/lists", async (
            GetListsHandler handler,
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
        .WithName("GetLists")
        .WithTags("Animal Lists")
        .WithSummary("Get all animal lists")
        .WithDescription("Retrieves all animal lists for the authenticated user")
        .Produces<GetListsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
