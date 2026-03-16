using Microsoft.AspNetCore.Mvc;

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
            const int CompressThresholdBytes = 500 * 1024;
            const string CacheControl = "public, max-age=3600"; // cache 1h, revalidate after

            // --- Cheap conditional check (no blob data transferred) ---
            var ifNoneMatch = context.Request.Headers.IfNoneMatch.FirstOrDefault();
            if (!string.IsNullOrEmpty(ifNoneMatch))
            {
                var meta = await imageStorageService.GetImageMetadataAsync(animalId);
                if (meta == null)
                    return Results.NotFound();

                var (metaEtag, contentLength, _) = meta.Value;
                var expectedEtag = contentLength > CompressThresholdBytes ? $"{metaEtag}-compressed" : metaEtag;

                if (ifNoneMatch == expectedEtag)
                {
                    context.Response.Headers.CacheControl = CacheControl;
                    context.Response.Headers.ETag = expectedEtag;
                    return Results.StatusCode(StatusCodes.Status304NotModified);
                }
            }

            // --- Full download ---
            var result = await imageStorageService.GetImageAsync(animalId);

            if (result == null)
            {
                return Results.NotFound();
            }

            var (data, contentType, etag) = result.Value;

            bool wasCompressed = false;
            if (data.Length > CompressThresholdBytes)
            {
                data = await ImageProcessor.CompressImageAsync(data, contentType, null, null, quality: 85);
                contentType = "image/jpeg";
                wasCompressed = true;
            }

            var responseEtag = wasCompressed ? $"{etag}-compressed" : etag;

            context.Response.Headers.CacheControl = CacheControl;
            context.Response.Headers.ETag = responseEtag;

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
