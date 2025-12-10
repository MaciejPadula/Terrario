using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Terrario.Server.Features.Animals.GetRecentAnimals;

/// <summary>
/// Endpoint for retrieving recently added animals
/// </summary>
public static class GetRecentAnimalsEndpoint
{
    public static IEndpointRouteBuilder MapGetRecentAnimalsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/animals/recent", [Authorize] async (
            [FromQuery] int? limit,
            GetRecentAnimalsHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(userId, limit ?? 10, cancellationToken);
            return Results.Ok(result);
        })
        .WithName("GetRecentAnimals")
        .WithTags("Animals")
        .WithSummary("Get recently added animals")
        .WithDescription("Retrieves the most recently added animals for the authenticated user")
        .Produces<GetRecentAnimalsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        return endpoints;
    }
}
