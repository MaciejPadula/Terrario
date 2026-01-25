using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Animals.GetRecentAnimals;

/// <summary>
/// Handler for retrieving recently added animals
/// </summary>
public class GetRecentAnimalsHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IImageStorageService _imageStorageService;

    public GetRecentAnimalsHandler(
        ApplicationDbContext dbContext,
        IImageStorageService imageStorageService)
    {
        _dbContext = dbContext;
        _imageStorageService = imageStorageService;
    }

    /// <summary>
    /// Retrieves the most recently added animals for a user
    /// </summary>
    public async Task<GetRecentAnimalsResponse> HandleAsync(
        string userId,
        int limit = 10,
        CancellationToken cancellationToken = default)
    {
        var recentAnimalsData = await _dbContext.Animals
            .Include(a => a.Species)
                .ThenInclude(s => s.Category)
            .Include(a => a.AnimalList)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .Take(limit)
            .Select(a => new
            {
                Id = a.Id,
                Name = a.Name,
                SpeciesId = a.SpeciesId,
                SpeciesCommonName = a.Species.CommonName,
                SpeciesScientificName = a.Species.ScientificName,
                CategoryId = a.Species.CategoryId,
                CategoryName = a.Species.Category.Name,
                FallbackImageUrl = a.ImageUrl ?? a.Species.ImageUrl,
                CreatedAt = a.CreatedAt,
                AnimalListName = a.AnimalList.Name,
                AnimalListId = a.AnimalListId
            })
            .ToListAsync(cancellationToken);

        var recentAnimals = new List<RecentAnimalDto>(recentAnimalsData.Count);
        foreach (var a in recentAnimalsData)
        {
            var imageUrl = await _imageStorageService.GetImageUrlAsync(a.Id)
                ?? a.FallbackImageUrl;

            recentAnimals.Add(new RecentAnimalDto
            {
                Id = a.Id,
                Name = a.Name,
                SpeciesId = a.SpeciesId,
                SpeciesCommonName = a.SpeciesCommonName,
                SpeciesScientificName = a.SpeciesScientificName,
                CategoryId = a.CategoryId,
                CategoryName = a.CategoryName,
                ImageUrl = imageUrl,
                CreatedAt = a.CreatedAt,
                AnimalListName = a.AnimalListName,
                AnimalListId = a.AnimalListId
            });
        }

        return new GetRecentAnimalsResponse
        {
            RecentAnimals = recentAnimals,
            TotalCount = recentAnimals.Count
        };
    }
}
