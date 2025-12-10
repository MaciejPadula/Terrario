using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.Species.GetSpecies;

/// <summary>
/// Endpoint for retrieving species
/// </summary>
public static class GetSpeciesEndpoint
{
    public static IEndpointRouteBuilder MapGetSpeciesEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/species", async (
            [FromQuery] Guid? categoryId,
            [FromQuery] string? search,
            GetSpeciesHandler handler,
            CancellationToken cancellationToken) =>
        {
            var query = new GetSpeciesQuery
            {
                CategoryId = categoryId,
                Search = search
            };

            var result = await handler.HandleAsync(query, cancellationToken);
            return Results.Ok(result);
        })
        .WithName("GetSpecies")
        .WithTags("Species")
        .WithSummary("Get all species")
        .WithDescription("Retrieves all species, optionally filtered by category ID or search term")
        .Produces<GetSpeciesResponse>(StatusCodes.Status200OK);

        return endpoints;
    }
}
