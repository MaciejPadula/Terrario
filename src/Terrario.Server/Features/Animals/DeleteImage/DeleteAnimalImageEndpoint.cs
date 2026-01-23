using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Terrario.Server.Features.Animals.DeleteImage;

/// <summary>
/// Endpoint for deleting animal images from Azure Blob Storage
/// </summary>
public static class DeleteAnimalImageEndpoint
{
    public static void MapDeleteAnimalImageEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/animals/{animalId:guid}/image",
            [Authorize] async (
                Guid animalId,
                DeleteAnimalImageHandler handler,
                ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User not authenticated");

            var request = new DeleteAnimalImageRequest
            {
                AnimalId = animalId,
                UserId = userId
            };

            var result = await handler.HandleAsync(request);

            if (result == null)
            {
                return Results.NotFound(new { message = "Animal not found" });
            }

            return Results.Ok(result);
        })
        .WithName("DeleteAnimalImage")
        .WithTags("Animals")
        .Produces<DeleteAnimalImageResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized);
    }
}
