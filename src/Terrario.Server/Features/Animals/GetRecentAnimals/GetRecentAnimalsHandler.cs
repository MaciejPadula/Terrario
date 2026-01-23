using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;

namespace Terrario.Server.Features.Animals.GetRecentAnimals;

/// <summary>
/// Handler for retrieving recently added animals
/// </summary>
public class GetRecentAnimalsHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetRecentAnimalsHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves the most recently added animals for a user
    /// </summary>
    public async Task<GetRecentAnimalsResponse> HandleAsync(
        string userId,
        int limit = 10,
        CancellationToken cancellationToken = default)
    {
        var recentAnimals = await _dbContext.Animals
            .Include(a => a.Species)
                .ThenInclude(s => s.Category)
            .Include(a => a.AnimalList)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .Take(limit)
            .Select(a => new RecentAnimalDto
            {
                Id = a.Id,
                Name = a.Name,
                SpeciesCommonName = a.Species.CommonName,
                SpeciesScientificName = a.Species.ScientificName,
                CategoryName = a.Species.Category.Name,
                ImageUrl = a.ImageUrl ?? a.Species.ImageUrl,
                CreatedAt = a.CreatedAt,
                AnimalListName = a.AnimalList.Name,
                AnimalListId = a.AnimalListId
            })
            .ToListAsync(cancellationToken);

        return new GetRecentAnimalsResponse
        {
            RecentAnimals = recentAnimals,
            TotalCount = recentAnimals.Count
        };
    }
}
