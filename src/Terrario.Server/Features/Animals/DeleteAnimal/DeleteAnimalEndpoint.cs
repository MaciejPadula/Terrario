using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Terrario.Server.Features.Animals.DeleteAnimal;

/// <summary>
/// Endpoint for deleting an animal
/// </summary>
public static class DeleteAnimalEndpoint
{
    public static IEndpointRouteBuilder MapDeleteAnimalEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapDelete("/api/animals/{id:guid}", [Authorize] async (
            Guid id,
            DeleteAnimalHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            try
            {
                var result = await handler.HandleAsync(id, userId, cancellationToken);
                return Results.Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.Problem(
                    statusCode: StatusCodes.Status403Forbidden,
                    title: "Access Denied",
                    detail: ex.Message);
            }
        })
        .WithName("DeleteAnimal")
        .WithTags("Animals")
        .WithSummary("Delete an animal")
        .WithDescription("Removes an animal from the user's collection")
        .Produces<DeleteAnimalResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status403Forbidden);

        return endpoints;
    }
}
