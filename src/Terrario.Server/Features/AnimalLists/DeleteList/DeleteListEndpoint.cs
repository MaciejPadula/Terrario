using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.AnimalLists.DeleteList;

/// <summary>
/// Endpoint for deleting an animal list
/// </summary>
public static class DeleteListEndpoint
{
    public static IEndpointRouteBuilder MapDeleteListEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapDelete("/api/lists/{id:guid}", async (
            [FromRoute] Guid id,
            DeleteListHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var success = await handler.HandleAsync(id, userId, cancellationToken);
            
            if (!success)
            {
                return Results.NotFound(new { Message = "Lista nie została znaleziona" });
            }

            return Results.Ok(new DeleteListResponse { Message = "Lista została usunięta" });
        })
        .WithName("DeleteList")
        .WithTags("Animal Lists")
        .WithSummary("Delete an animal list")
        .WithDescription("Permanently deletes an animal list and all its animals")
        .Produces<DeleteListResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}
