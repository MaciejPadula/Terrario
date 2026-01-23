using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Animals.DeleteImage;

/// <summary>
/// Handler for deleting animal images
/// </summary>
public class DeleteAnimalImageHandler
{
    private readonly ApplicationDbContext _context;
    private readonly IImageStorageService _imageStorageService;
    private readonly ILogger<DeleteAnimalImageHandler> _logger;

    public DeleteAnimalImageHandler(
        ApplicationDbContext context,
        IImageStorageService imageStorageService,
        ILogger<DeleteAnimalImageHandler> logger)
    {
        _context = context;
        _imageStorageService = imageStorageService;
        _logger = logger;
    }

    public async Task<DeleteAnimalImageResponse?> HandleAsync(DeleteAnimalImageRequest request)
    {
        // Find the animal
        var animal = await _context.Animals
            .Where(a => a.Id == request.AnimalId && a.UserId == request.UserId)
            .FirstOrDefaultAsync();

        if (animal == null)
        {
            return null;
        }

        // Delete image using animal ID
        try
        {
            await _imageStorageService.DeleteImageAsync(animal.Id);
            _logger.LogInformation("Deleted image for animal {AnimalId}", animal.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete image for animal {AnimalId}", animal.Id);
            throw;
        }

        return new DeleteAnimalImageResponse
        {
            AnimalId = animal.Id,
            Message = "Image deleted successfully"
        };
    }
}
