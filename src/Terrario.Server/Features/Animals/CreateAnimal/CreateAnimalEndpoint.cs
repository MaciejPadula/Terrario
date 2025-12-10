using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Terrario.Server.Features.Animals.CreateAnimal;

/// <summary>
/// Endpoint for creating a new animal
/// </summary>
public static class CreateAnimalEndpoint
{
    public static IEndpointRouteBuilder MapCreateAnimalEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/animals", [Authorize] async (
            CreateAnimalRequest request,
            CreateAnimalHandler handler,
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
                var result = await handler.HandleAsync(request, userId, cancellationToken);
                return Results.Created($"/api/animals/{result.Id}", result);
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
        .WithName("CreateAnimal")
        .WithTags("Animals")
        .WithSummary("Create a new animal")
        .WithDescription("Adds a new animal to the user's collection in the specified list")
        .Produces<CreateAnimalResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .Produces(StatusCodes.Status403Forbidden);

        return endpoints;
    }
}
