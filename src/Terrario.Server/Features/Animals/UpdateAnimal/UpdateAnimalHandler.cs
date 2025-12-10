using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;

namespace Terrario.Server.Features.Animals.UpdateAnimal;

/// <summary>
/// Handler for updating an animal
/// </summary>
public class UpdateAnimalHandler
{
    private readonly ApplicationDbContext _dbContext;

    public UpdateAnimalHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Updates an existing animal
    /// </summary>
    public async Task<UpdateAnimalResponse> HandleAsync(
        Guid animalId,
        UpdateAnimalRequest request,
        string userId,
        CancellationToken cancellationToken = default)
    {
        // Find the animal and verify ownership
        var animal = await _dbContext.Animals
            .Where(a => a.Id == animalId && a.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken);

        if (animal == null)
        {
            throw new UnauthorizedAccessException("Animal not found or access denied.");
        }

        // Verify that the new animal list belongs to the user
        var animalList = await _dbContext.AnimalLists
            .Where(al => al.Id == request.AnimalListId && al.UserId == userId)
            .FirstOrDefaultAsync(cancellationToken);

        if (animalList == null)
        {
            throw new ArgumentException("Animal list not found or access denied.", nameof(request.AnimalListId));
        }

        // Verify that the species exists
        var species = await _dbContext.Species
            .Where(s => s.Id == request.SpeciesId)
            .FirstOrDefaultAsync(cancellationToken);

        if (species == null)
        {
            throw new ArgumentException("Species not found.", nameof(request.SpeciesId));
        }

        // Update animal properties
        animal.Name = request.Name;
        animal.SpeciesId = request.SpeciesId;
        animal.AnimalListId = request.AnimalListId;
        animal.ImageUrl = request.ImageUrl;
        animal.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        return new UpdateAnimalResponse
        {
            Id = animal.Id,
            Name = animal.Name,
            SpeciesId = animal.SpeciesId,
            AnimalListId = animal.AnimalListId,
            ImageUrl = animal.ImageUrl,
            UpdatedAt = animal.UpdatedAt.Value,
            Message = "Animal updated successfully"
        };
    }
}
