using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace Terrario.Server.Shared;
public interface IImageStorageService
{
    /// <summary>
    /// Stores an image for a specific animal
    /// </summary>
    /// <param name="imageId">ID of the animal</param>
    /// <param name="imageStream">Image data stream</param>
    /// <param name="contentType">MIME type of the image</param>
    Task SaveImageAsync(Guid imageId, Stream imageStream, string contentType);

    /// <summary>
    /// Gets a local API URL to access the image
    /// </summary>
    /// <param name="imageId">ID of the animal</param>
    /// <returns>URL to the image, or null if not found</returns>
    Task<string?> GetImageUrlAsync(Guid imageId);

    /// <summary>
    /// Gets the image data as byte array and content type
    /// </summary>
    /// <param name="imageId">ID of the animal</param>
    /// <returns>Tuple of byte array and content type, or null if not found</returns>
    Task<(byte[] data, string contentType)?> GetImageAsync(Guid imageId);

    /// <summary>
    /// Deletes the image for a specific animal
    /// </summary>
    /// <param name="imageId">ID of the animal</param>
    Task DeleteImageAsync(Guid imageId);

    /// <summary>
    /// Checks if an image exists for a specific animal
    /// </summary>
    /// <param name="imageId">ID of the animal</param>
    Task<bool> ImageExistsAsync(Guid imageId);
}

/// <summary>
/// Azure Blob Storage implementation of IImageStorageService
/// </summary>
public class AzureBlobStorageImageService : IImageStorageService
{
    private readonly BlobContainerClient _containerClient;
    private readonly ILogger<AzureBlobStorageImageService> _logger;

    // Supported image extensions for fallback detection
    private static readonly string[] SupportedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };

    public AzureBlobStorageImageService(
        BlobServiceClient blobServiceClient,
        IConfiguration configuration,
        ILogger<AzureBlobStorageImageService> logger)
    {
        _logger = logger;

        var containerName = configuration["Blob:ContainerName"] ?? "animal-images";
        _containerClient = blobServiceClient.GetBlobContainerClient(containerName);
    }

    /// <summary>
    /// Saves an image using the animal ID as the blob name
    /// </summary>
    public async Task SaveImageAsync(Guid imageId, Stream imageStream, string contentType)
    {
        // Ensure container exists
        await _containerClient.CreateIfNotExistsAsync(PublicAccessType.None);

        // Determine extension from content type
        var extension = GetExtensionFromContentType(contentType);
        var blobName = $"{imageId}{extension}";

        // Delete old images with different extensions
        await DeleteAllImageVariantsAsync(imageId);

        var blobClient = _containerClient.GetBlobClient(blobName);

        // Set content type and cache control
        var blobHttpHeaders = new BlobHttpHeaders
        {
            ContentType = contentType,
            CacheControl = "public, max-age=31536000" // Cache for 1 year
        };

        // Upload the blob
        await blobClient.UploadAsync(imageStream, new BlobUploadOptions
        {
            HttpHeaders = blobHttpHeaders
        });

        _logger.LogInformation("Saved image for animal {imageId} as {BlobName}", imageId, blobName);
    }

    /// <summary>
    /// Gets a local URL to access the image through the API
    /// </summary>
    public async Task<string?> GetImageUrlAsync(Guid imageId)
    {
        // Only return a URL if an image actually exists.
        // This allows callers to fall back to species image or placeholders.
        var exists = await ImageExistsAsync(imageId);
        return exists ? $"/api/images/{imageId}" : null;
    }

    /// <summary>
    /// Gets the image data as byte array and content type from blob storage
    /// </summary>
    public async Task<(byte[] data, string contentType)?> GetImageAsync(Guid imageId)
    {
        // Try to find the image with any supported extension
        foreach (var extension in SupportedExtensions)
        {
            var blobName = $"{imageId}{extension}";
            var blobClient = _containerClient.GetBlobClient(blobName);

            if (await blobClient.ExistsAsync())
            {
                var properties = await blobClient.GetPropertiesAsync();
                var response = await blobClient.DownloadContentAsync();
                var contentType = properties.Value.ContentType;

                return (response.Value.Content.ToArray(), contentType);
            }
        }

        return null;
    }

    /// <summary>
    /// Deletes all image variants for an animal
    /// </summary>
    public async Task DeleteImageAsync(Guid imageId)
    {
        await DeleteAllImageVariantsAsync(imageId);
        _logger.LogInformation("Deleted image(s) for animal {imageId}", imageId);
    }

    /// <summary>
    /// Checks if an image exists for an animal
    /// </summary>
    public async Task<bool> ImageExistsAsync(Guid imageId)
    {
        foreach (var extension in SupportedExtensions)
        {
            var blobName = $"{imageId}{extension}";
            var blobClient = _containerClient.GetBlobClient(blobName);

            if (await blobClient.ExistsAsync())
            {
                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// Deletes all possible image variants (different extensions) for an animal
    /// </summary>
    private async Task DeleteAllImageVariantsAsync(Guid imageId)
    {
        foreach (var extension in SupportedExtensions)
        {
            var blobName = $"{imageId}{extension}";
            var blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync();
        }
    }

    /// <summary>
    /// Gets file extension from content type
    /// </summary>
    private static string GetExtensionFromContentType(string contentType)
    {
        return contentType.ToLowerInvariant() switch
        {
            "image/jpeg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            _ => ".jpg" // default
        };
    }
}

/// <summary>
/// Utility class for image processing operations
/// </summary>
public static class ImageProcessor
{
    /// <summary>
    /// Compresses and optionally resizes an image
    /// </summary>
    /// <param name="imageData">Original image data</param>
    /// <param name="contentType">Original content type</param>
    /// <param name="width">Desired width (optional)</param>
    /// <param name="height">Desired height (optional)</param>
    /// <param name="quality">JPEG quality (1-100, default 80)</param>
    /// <returns>Compressed image data</returns>
    public static async Task<byte[]> CompressImageAsync(byte[] imageData, string contentType, int? width, int? height, int quality = 80)
    {
        using var image = SixLabors.ImageSharp.Image.Load(imageData);

        // Resize if dimensions specified
        if (width.HasValue || height.HasValue)
        {
            var resizeOptions = new ResizeOptions
            {
                Mode = ResizeMode.Max,
                Size = new Size(width ?? image.Width, height ?? image.Height)
            };
            image.Mutate(x => x.Resize(resizeOptions));
        }

        // Compress to JPEG
        using var outputStream = new MemoryStream();
        var encoder = new JpegEncoder { Quality = quality };
        await image.SaveAsJpegAsync(outputStream, encoder);

        return outputStream.ToArray();
    }
}
