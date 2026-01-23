using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Animals.UploadImage;

/// <summary>
/// Endpoint for uploading animal images to Azure Blob Storage
/// </summary>
public static class UploadAnimalImageEndpoint
{
    public static void MapUploadAnimalImageEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/animals/{animalId:guid}/image", 
            [Authorize] async (
                [FromRoute] Guid animalId,
                [FromForm] IFormFile image,
                [FromServices] UploadAnimalImageHandler handler,
                ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User not authenticated");

            var request = new UploadAnimalImageRequest
            {
                AnimalId = animalId,
                UserId = userId,
                Image = image
            };

            var result = await handler.HandleAsync(request);

            if (result == null)
            {
                return Results.NotFound(new { message = "Animal not found" });
            }

            return Results.Ok(result);
        })
        .WithName("UploadAnimalImage")
        .WithTags("Animals")
        .DisableAntiforgery() // Required for file uploads
        .Produces<UploadAnimalImageResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized);
    }
}
