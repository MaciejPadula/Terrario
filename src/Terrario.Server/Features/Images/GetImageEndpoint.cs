using Microsoft.AspNetCore.Mvc;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Images;

/// <summary>
/// Endpoint for serving animal images
/// Independent controller that abstracts storage implementation
/// </summary>
public static class GetImageEndpoint
{
    public static void MapGetImageEndpoint(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/images/{animalId:guid}", async (
            [FromRoute] Guid animalId,
            [FromServices] IImageStorageService imageStorageService,
            HttpContext context) =>
        {
            var result = await imageStorageService.GetImageAsync(animalId);

            if (result == null)
            {
                return Results.NotFound();
            }

            var (data, contentType) = result.Value;

            // Auto-compress large images for better performance
            if (data.Length > 500 * 1024) // If image > 500KB
            {
                data = await ImageProcessor.CompressImageAsync(data, contentType, null, null, quality: 85); // Max 1200px, 85% quality
                contentType = "image/jpeg"; // Compressed images are JPEG
            }

            // Set cache headers for better performance
            var isAutoCompressed = data.Length > 500 * 1024;
            context.Response.Headers.CacheControl = "public, max-age=3600"; // Cache for 1 hour

            return Results.Bytes(data, contentType);
        })
        .WithName("GetImage")
        .WithTags("Images")
        .Produces(StatusCodes.Status200OK, contentType: "image/jpeg")
        .Produces(StatusCodes.Status200OK, contentType: "image/png")
        .Produces(StatusCodes.Status200OK, contentType: "image/webp")
        .Produces(StatusCodes.Status404NotFound)
        .AllowAnonymous(); // Images can be accessed without authentication
    }
}
