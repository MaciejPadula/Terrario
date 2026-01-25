using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.AnimalLists.DeleteList;

/// <summary>
/// Handler for deleting an animal list
/// </summary>
public class DeleteListHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<DeleteListHandler> _logger;

    public DeleteListHandler(
        ApplicationDbContext dbContext,
        ILogger<DeleteListHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Deletes an existing animal list
    /// </summary>
    public async Task<bool> HandleAsync(
        Guid listId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var animalList = await _dbContext.AnimalLists
            .FirstOrDefaultAsync(al => al.Id == listId && al.UserId == userId, cancellationToken);

        if (animalList is null)
        {
            _logger.LogWarning(
                "List {ListId} not found or does not belong to user {UserId}",
                listId,
                userId);
            return false;
        }

        _dbContext.AnimalLists.Remove(animalList);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Deleted animal list '{Name}' (ID: {Id}) for user {UserId}",
            animalList.Name,
            animalList.Id,
            userId);

        return true;
    }
}
