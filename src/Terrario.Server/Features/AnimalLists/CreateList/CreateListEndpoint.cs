using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.AnimalLists.CreateList;

/// <summary>
/// Endpoint for creating a new animal list
/// </summary>
public static class CreateListEndpoint
{
    public static IEndpointRouteBuilder MapCreateListEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/lists", async (
            [FromBody] CreateListRequest request,
            CreateListHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(request, userId, cancellationToken);
            return Results.Created($"/api/lists/{result.Id}", result);
        })
        .WithName("CreateList")
        .WithTags("Animal Lists")
        .WithSummary("Create a new animal list")
        .WithDescription("Creates a new animal list for the authenticated user")
        .Produces<CreateListResponse>(StatusCodes.Status201Created)
        .Produces<CreateListErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
