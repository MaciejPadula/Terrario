using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Animals.UploadImage;

/// <summary>
/// Handler for uploading animal images
/// </summary>
public class UploadAnimalImageHandler
{
    private readonly ApplicationDbContext _context;
    private readonly IImageStorageService _imageStorageService;
    private readonly ILogger<UploadAnimalImageHandler> _logger;

    // Allowed image formats
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private static readonly string[] AllowedMimeTypes = { "image/jpeg", "image/png", "image/webp" };
    private const int MaxFileSizeBytes = 5 * 1024 * 1024; // 5 MB

    public UploadAnimalImageHandler(
        ApplicationDbContext context,
        IImageStorageService imageStorageService,
        ILogger<UploadAnimalImageHandler> logger)
    {
        _context = context;
        _imageStorageService = imageStorageService;
        _logger = logger;
    }

    public async Task<UploadAnimalImageResponse?> HandleAsync(UploadAnimalImageRequest request)
    {
        // Validate file
        if (request.Image == null || request.Image.Length == 0)
        {
            throw new ArgumentException("No image file provided");
        }

        if (request.Image.Length > MaxFileSizeBytes)
        {
            throw new ArgumentException($"File size exceeds maximum allowed size of {MaxFileSizeBytes / 1024 / 1024} MB");
        }

        var extension = Path.GetExtension(request.Image.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
        {
            throw new ArgumentException($"File type not allowed. Allowed types: {string.Join(", ", AllowedExtensions)}");
        }

        if (!AllowedMimeTypes.Contains(request.Image.ContentType.ToLowerInvariant()))
        {
            throw new ArgumentException($"Invalid content type. Allowed types: {string.Join(", ", AllowedMimeTypes)}");
        }

        // Find the animal
        var animal = await _context.Animals
            .Where(a => a.Id == request.AnimalId && a.UserId == request.UserId)
            .FirstOrDefaultAsync();

        if (animal == null)
        {
            return null;
        }

        // Upload new image using animal ID as blob name
        using (var stream = request.Image.OpenReadStream())
        {
            await _imageStorageService.SaveImageAsync(
                animal.Id,
                stream,
                request.Image.ContentType);
        }

        _logger.LogInformation("Uploaded image for animal {AnimalId}", animal.Id);

        // Get URL (storage service will handle this)
        var imageUrl = await _imageStorageService.GetImageUrlAsync(animal.Id);

        return new UploadAnimalImageResponse
        {
            AnimalId = animal.Id,
            ImageUrl = imageUrl ?? string.Empty,
            Message = "Image uploaded successfully"
        };
    }
}
