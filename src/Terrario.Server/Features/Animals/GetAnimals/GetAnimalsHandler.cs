using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;

namespace Terrario.Server.Features.Animals.GetAnimals;

/// <summary>
/// Handler for retrieving animals
/// </summary>
public class GetAnimalsHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetAnimalsHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
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

        var animals = await animalsQuery
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AnimalDto
            {
                Id = a.Id,
                Name = a.Name,
                SpeciesId = a.SpeciesId,
                SpeciesCommonName = a.Species.CommonName,
                SpeciesScientificName = a.Species.ScientificName ?? string.Empty,
                CategoryId = a.Species.CategoryId,
                CategoryName = a.Species.Category.Name,
                AnimalListId = a.AnimalListId,
                ImageUrl = a.ImageUrl ?? a.Species.ImageUrl,
                CreatedAt = a.CreatedAt
            })
            .ToListAsync(cancellationToken);

        return new GetAnimalsResponse
        {
            Animals = animals,
            TotalCount = animals.Count
        };
    }
}
