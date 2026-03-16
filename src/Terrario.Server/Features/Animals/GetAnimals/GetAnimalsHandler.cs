using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using Terrario.Server.Features.Images;

namespace Terrario.Server.Features.Animals.GetAnimals;

/// <summary>
/// Handler for retrieving animals
/// </summary>
public class GetAnimalsHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IImageStorageService _imageStorageService;

    public GetAnimalsHandler(
        ApplicationDbContext dbContext,
        IImageStorageService imageStorageService)
    {
        _dbContext = dbContext;
        _imageStorageService = imageStorageService;
    }

    /// <summary>
    /// Retrieves animals for a user, optionally filtered
    /// </summary>
    public async Task<GetAnimalsResponse> HandleAsync(
        GetAnimalsQuery query,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var animalsQuery = _dbContext.Animals
            .Include(a => a.Species)
                .ThenInclude(s => s.Category)
            .Include(a => a.AnimalList)
            .Where(a => a.UserId == userId);

        // Filter by animal list
        if (query.AnimalListId.HasValue)
        {
            animalsQuery = animalsQuery.Where(a => a.AnimalListId == query.AnimalListId.Value);
        }

        // Filter by species
        if (query.SpeciesId.HasValue)
        {
            animalsQuery = animalsQuery.Where(a => a.SpeciesId == query.SpeciesId.Value);
        }

        // Filter by search term (searches in animal name and species name)
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchTerm = query.Search.ToLower();
            animalsQuery = animalsQuery.Where(a => 
                a.Name.ToLower().Contains(searchTerm) ||
                a.Species.CommonName.ToLower().Contains(searchTerm) ||
                (a.Species.ScientificName != null && a.Species.ScientificName.ToLower().Contains(searchTerm)));
        }

        var animalsData = await animalsQuery
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                Id = a.Id,
                Name = a.Name,
                SpeciesId = a.SpeciesId,
                SpeciesCommonName = a.Species.CommonName,
                SpeciesScientificName = a.Species.ScientificName ?? string.Empty,
                CategoryId = a.Species.CategoryId,
                CategoryName = a.Species.Category.Name,
                AnimalListId = a.AnimalListId,
                AnimalListName = a.AnimalList != null ? a.AnimalList.Name : string.Empty,
                FallbackImageUrl = a.ImageUrl ?? a.Species.ImageUrl,
                CreatedAt = a.CreatedAt,
                Gender = a.Gender
            })
            .ToListAsync(cancellationToken);

        // Fetch all image URLs in parallel instead of sequentially to avoid N×Blob calls
        var imageUrlTasks = animalsData.Select(a => _imageStorageService.GetImageUrlAsync(a.Id));
        var imageUrls = await Task.WhenAll(imageUrlTasks);

        var animals = animalsData.Select((a, i) => new AnimalDto
        {
            Id = a.Id,
            Name = a.Name,
            SpeciesId = a.SpeciesId,
            SpeciesCommonName = a.SpeciesCommonName,
            SpeciesScientificName = a.SpeciesScientificName,
            CategoryId = a.CategoryId,
            CategoryName = a.CategoryName,
            AnimalListId = a.AnimalListId,
            AnimalListName = a.AnimalListName,
            ImageUrl = imageUrls[i] ?? a.FallbackImageUrl,
            CreatedAt = a.CreatedAt,
            Gender = a.Gender
        }).ToList();

        return new GetAnimalsResponse
        {
            Animals = animals,
            TotalCount = animals.Count
        };
    }
}
