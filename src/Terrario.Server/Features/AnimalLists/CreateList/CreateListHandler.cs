using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;

namespace Terrario.Server.Features.AnimalLists.CreateList;

/// <summary>
/// Handler for creating a new animal list
/// </summary>
public class CreateListHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<CreateListHandler> _logger;

    public CreateListHandler(
        ApplicationDbContext dbContext,
        ILogger<CreateListHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new animal list for the specified user
    /// </summary>
    public async Task<CreateListResponse> HandleAsync(
        CreateListRequest request,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var animalList = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.AnimalLists.Add(animalList);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Created new animal list '{Name}' (ID: {Id}) for user {UserId}",
            animalList.Name,
            animalList.Id,
            userId);

        return new CreateListResponse
        {
            Id = animalList.Id,
            Name = animalList.Name,
            Description = animalList.Description,
            CreatedAt = animalList.CreatedAt
        };
    }
}
