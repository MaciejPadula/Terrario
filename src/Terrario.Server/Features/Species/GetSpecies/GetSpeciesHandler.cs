using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;

namespace Terrario.Server.Features.Species.GetSpecies;

/// <summary>
/// Handler for retrieving species
/// </summary>
public class GetSpeciesHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetSpeciesHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves all species, optionally filtered by category or search term
    /// </summary>
    public async Task<GetSpeciesResponse> HandleAsync(
        GetSpeciesQuery query,
        CancellationToken cancellationToken = default)
    {
        var speciesQuery = _dbContext.Species
            .Include(s => s.Category)
            .Include(s => s.CareLevel)
            .AsQueryable();

        // Filter by category ID
        if (query.CategoryId.HasValue)
        {
            speciesQuery = speciesQuery.Where(s => s.CategoryId == query.CategoryId.Value);
        }

        // Filter by search term
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var searchTerm = query.Search.ToLower();
            speciesQuery = speciesQuery.Where(s => 
                s.CommonName.ToLower().Contains(searchTerm) ||
                (s.ScientificName != null && s.ScientificName.ToLower().Contains(searchTerm)));
        }

        var species = await speciesQuery
            .OrderBy(s => s.Category.DisplayOrder)
            .ThenBy(s => s.CommonName)
            .Select(s => new SpeciesDto
            {
                Id = s.Id,
                CommonName = s.CommonName,
                ScientificName = s.ScientificName,
                CategoryId = s.CategoryId,
                CategoryName = s.Category.Name,
                Description = s.Description,
                ImageUrl = s.ImageUrl,
                CareLevel = s.CareLevel.Name,
                AdultSizeCm = s.AdultSizeCm,
                LifespanYears = s.LifespanYears
            })
            .ToListAsync(cancellationToken);

        return new GetSpeciesResponse
        {
            Species = species,
            TotalCount = species.Count
        };
    }
}
