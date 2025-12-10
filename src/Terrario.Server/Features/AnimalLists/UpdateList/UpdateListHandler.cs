using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;

namespace Terrario.Server.Features.AnimalLists.UpdateList;

/// <summary>
/// Handler for updating an animal list
/// </summary>
public class UpdateListHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<UpdateListHandler> _logger;

    public UpdateListHandler(
        ApplicationDbContext dbContext,
        ILogger<UpdateListHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Updates an existing animal list
    /// </summary>
    public async Task<UpdateListResponse?> HandleAsync(
        Guid listId,
        UpdateListRequest request,
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
            return null;
        }

        animalList.Name = request.Name;
        animalList.Description = request.Description;
        animalList.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Updated animal list '{Name}' (ID: {Id}) for user {UserId}",
            animalList.Name,
            animalList.Id,
            userId);

        return new UpdateListResponse
        {
            Id = animalList.Id,
            Name = animalList.Name,
            Description = animalList.Description,
            CreatedAt = animalList.CreatedAt,
            UpdatedAt = animalList.UpdatedAt.Value
        };
    }
}
