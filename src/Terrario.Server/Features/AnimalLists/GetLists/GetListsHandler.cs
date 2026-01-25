using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.AnimalLists.GetLists;

/// <summary>
/// Handler for retrieving user's animal lists
/// </summary>
public class GetListsHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetListsHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves all animal lists for the specified user
    /// </summary>
    public async Task<GetListsResponse> HandleAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        var lists = await _dbContext.AnimalLists
            .Where(al => al.UserId == userId)
            .OrderByDescending(al => al.CreatedAt)
            .Select(al => new AnimalListDto
            {
                Id = al.Id,
                Name = al.Name,
                Description = al.Description,
                CreatedAt = al.CreatedAt,
                UpdatedAt = al.UpdatedAt
            })
            .ToListAsync(cancellationToken);

        return new GetListsResponse
        {
            Lists = lists,
            TotalCount = lists.Count
        };
    }
}
