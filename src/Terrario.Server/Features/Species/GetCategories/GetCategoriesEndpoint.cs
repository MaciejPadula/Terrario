namespace Terrario.Server.Features.Species.GetCategories;

/// <summary>
/// Endpoint for retrieving species categories
/// </summary>
public static class GetCategoriesEndpoint
{
    public static IEndpointRouteBuilder MapGetCategoriesEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/species/categories", async (
            GetCategoriesHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(cancellationToken);
            return Results.Ok(result);
        })
        .WithName("GetSpeciesCategories")
        .WithTags("Species")
        .WithSummary("Get species categories")
        .WithDescription("Retrieves all available species categories")
        .Produces<GetCategoriesResponse>(StatusCodes.Status200OK);

        return endpoints;
    }
}
