using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Terrario.Server.Features.Animals.GetAnimalDetails;

/// <summary>
/// Endpoint for retrieving animal details
/// </summary>
public static class GetAnimalDetailsEndpoint
{
    public static IEndpointRouteBuilder MapGetAnimalDetailsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/animals/{id:guid}", [Authorize] async (
            [FromRoute] Guid id,
            GetAnimalDetailsHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(id, userId, cancellationToken);
            
            if (result == null)
            {
                return Results.NotFound(new { message = "Animal not found" });
            }

            return Results.Ok(result);
        })
        .WithName("GetAnimalDetails")
        .WithTags("Animals")
        .WithSummary("Get animal details")
        .WithDescription("Retrieves detailed information about a specific animal")
        .Produces<GetAnimalDetailsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status404NotFound);

        return endpoints;
    }
}
