using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;
using Terrario.Server.Features.Animals.Shared;

namespace Terrario.Server.Features.Animals.CreateAnimal;

/// <summary>
/// Handler for creating a new animal
/// </summary>
public class CreateAnimalHandler
{
    private readonly ApplicationDbContext _dbContext;

    public CreateAnimalHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Creates a new animal in the user's collection
    /// </summary>
    public async Task<CreateAnimalResponse> HandleAsync(
        CreateAnimalRequest request,
        string userId,
        CancellationToken cancellationToken = default)
    {
        // Verify that the animal list belongs to the user
        var animalList = await _dbContext.AnimalLists
            .Where(al => al.Id == request.AnimalListId && al.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken);

        if (animalList == null)
        {
            throw new UnauthorizedAccessException("Animal list not found or access denied.");
        }

        // Verify that the species exists
        var species = await _dbContext.Species
            .Include(s => s.Category)
            .Where(s => s.Id == request.SpeciesId)
            .FirstOrDefaultAsync(cancellationToken);

        if (species == null)
        {
            throw new ArgumentException("Species not found.", nameof(request.SpeciesId));
        }

        // Create new animal
        var animal = new AnimalEntity
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            SpeciesId = request.SpeciesId,
            AnimalListId = request.AnimalListId,
            ImageUrl = request.ImageUrl,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Animals.Add(animal);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CreateAnimalResponse
        {
            Id = animal.Id,
            Name = animal.Name,
            SpeciesId = animal.SpeciesId,
            SpeciesName = species.CommonName,
            AnimalListId = animal.AnimalListId,
            AnimalListName = animalList.Name,
            ImageUrl = animal.ImageUrl,
            CreatedAt = animal.CreatedAt,
            Message = "Animal created successfully"
        };
    }
}
