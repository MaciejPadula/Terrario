using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.AnimalLists.UpdateList;

/// <summary>
/// Endpoint for updating an animal list
/// </summary>
public static class UpdateListEndpoint
{
    public static IEndpointRouteBuilder MapUpdateListEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPut("/api/lists/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateListRequest request,
            UpdateListHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(id, request, userId, cancellationToken);
            
            if (result is null)
            {
                return Results.NotFound(new { Message = "Lista nie została znaleziona" });
            }

            return Results.Ok(result);
        })
        .WithName("UpdateList")
        .WithTags("Animal Lists")
        .WithSummary("Update an animal list")
        .WithDescription("Updates the name and description of an existing animal list")
        .Produces<UpdateListResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
