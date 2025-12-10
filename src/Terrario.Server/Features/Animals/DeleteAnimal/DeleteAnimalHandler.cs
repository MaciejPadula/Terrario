using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;

namespace Terrario.Server.Features.Animals.DeleteAnimal;

/// <summary>
/// Handler for deleting an animal
/// </summary>
public class DeleteAnimalHandler
{
    private readonly ApplicationDbContext _dbContext;

    public DeleteAnimalHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Deletes an animal from the user's collection
    /// </summary>
    public async Task<DeleteAnimalResponse> HandleAsync(
        Guid animalId,
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

        _dbContext.Animals.Remove(animal);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new DeleteAnimalResponse
        {
            Message = "Animal deleted successfully"
        };
    }
}
