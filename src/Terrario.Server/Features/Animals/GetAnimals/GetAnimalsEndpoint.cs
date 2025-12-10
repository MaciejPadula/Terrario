using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Terrario.Server.Features.Animals.GetAnimals;

/// <summary>
/// Endpoint for retrieving animals
/// </summary>
public static class GetAnimalsEndpoint
{
    public static IEndpointRouteBuilder MapGetAnimalsEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/animals", [Authorize] async (
            [FromQuery] Guid? animalListId,
            [FromQuery] Guid? speciesId,
            [FromQuery] string? search,
            GetAnimalsHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var query = new GetAnimalsQuery
            {
                AnimalListId = animalListId,
                SpeciesId = speciesId,
                Search = search
            };

            var result = await handler.HandleAsync(query, userId, cancellationToken);
            return Results.Ok(result);
        })
        .WithName("GetAnimals")
        .WithTags("Animals")
        .WithSummary("Get all animals")
        .WithDescription("Retrieves all animals for the user, optionally filtered by list, species, or search term")
        .Produces<GetAnimalsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        return endpoints;
    }
}
