using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;

namespace Terrario.Server.Features.Animals.GetAnimalDetails;

/// <summary>
/// Handler for retrieving animal details
/// </summary>
public class GetAnimalDetailsHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetAnimalDetailsHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves details of a specific animal
    /// </summary>
    public async Task<GetAnimalDetailsResponse?> HandleAsync(
        Guid animalId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var animal = await _dbContext.Animals
            .Include(a => a.Species)
                .ThenInclude(s => s.Category)
            .Include(a => a.AnimalList)
            .Where(a => a.Id == animalId && a.UserId == userId)
            .Select(a => new AnimalDetailsDto
            {
                Id = a.Id,
                Name = a.Name,
                SpeciesId = a.SpeciesId,
                SpeciesCommonName = a.Species.CommonName,
                SpeciesScientificName = a.Species.ScientificName ?? string.Empty,
                CategoryId = a.Species.CategoryId,
                CategoryName = a.Species.Category.Name,
                AnimalListId = a.AnimalListId,
                AnimalListName = a.AnimalList.Name,
                ImageUrl = a.ImageUrl ?? a.Species.ImageUrl,
                CreatedAt = a.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (animal == null)
        {
            return null;
        }

        return new GetAnimalDetailsResponse
        {
            Animal = animal
        };
    }
}
