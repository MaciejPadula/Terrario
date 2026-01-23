using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Animals.GetAnimalDetails;

/// <summary>
/// Handler for retrieving animal details
/// </summary>
public class GetAnimalDetailsHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IImageStorageService _imageStorageService;

    public GetAnimalDetailsHandler(
        ApplicationDbContext dbContext,
        IImageStorageService imageStorageService)
    {
        _dbContext = dbContext;
        _imageStorageService = imageStorageService;
    }

    /// <summary>
    /// Retrieves details of a specific animal
    /// </summary>
    public async Task<GetAnimalDetailsResponse?> HandleAsync(
        Guid animalId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var animalData = await _dbContext.Animals
            .Include(a => a.Species)
                .ThenInclude(s => s.Category)
            .Include(a => a.AnimalList)
            .Where(a => a.Id == animalId && a.UserId == userId)
            .Select(a => new
            {
                a.Id,
                a.Name,
                a.SpeciesId,
                SpeciesCommonName = a.Species.CommonName,
                SpeciesScientificName = a.Species.ScientificName ?? string.Empty,
                CategoryId = a.Species.CategoryId,
                CategoryName = a.Species.Category.Name,
                a.AnimalListId,
                AnimalListName = a.AnimalList.Name,
                FallbackImageUrl = a.ImageUrl ?? a.Species.ImageUrl,
                a.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (animalData == null)
        {
            return null;
        }

        // Get image URL from storage service using animal ID
        var imageUrl = await _imageStorageService.GetImageUrlAsync(animalData.Id)
            ?? animalData.FallbackImageUrl;

        var animal = new AnimalDetailsDto
        {
            Id = animalData.Id,
            Name = animalData.Name,
            SpeciesId = animalData.SpeciesId,
            SpeciesCommonName = animalData.SpeciesCommonName,
            SpeciesScientificName = animalData.SpeciesScientificName,
            CategoryId = animalData.CategoryId,
            CategoryName = animalData.CategoryName,
            AnimalListId = animalData.AnimalListId,
            AnimalListName = animalData.AnimalListName,
            ImageUrl = imageUrl,
            CreatedAt = animalData.CreatedAt
        };

        return new GetAnimalDetailsResponse
        {
            Animal = animal
        };
    }
}
