using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Terrario.Server.Features.Animals.UpdateAnimal;

/// <summary>
/// Endpoint for updating an animal
/// </summary>
public static class UpdateAnimalEndpoint
{
    public static IEndpointRouteBuilder MapUpdateAnimalEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPut("/api/animals/{id:guid}", [Authorize] async (
            Guid id,
            UpdateAnimalRequest request,
            UpdateAnimalHandler handler,
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
                var result = await handler.HandleAsync(id, request, userId, cancellationToken);
                return Results.Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.Problem(
                    statusCode: StatusCodes.Status403Forbidden,
                    title: "Access Denied",
                    detail: ex.Message);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("UpdateAnimal")
        .WithTags("Animals")
        .WithSummary("Update an animal")
        .WithDescription("Updates an existing animal in the user's collection")
        .Produces<UpdateAnimalResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status403Forbidden);

        return endpoints;
    }
}
