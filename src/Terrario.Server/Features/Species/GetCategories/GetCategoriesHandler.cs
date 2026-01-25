using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Species.GetCategories;

/// <summary>
/// Handler for retrieving species categories
/// </summary>
public class GetCategoriesHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetCategoriesHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves all available species categories from database
    /// </summary>
    public async Task<GetCategoriesResponse> HandleAsync(CancellationToken cancellationToken = default)
    {
        var categories = await _dbContext.Categories
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                Icon = c.Icon,
                DisplayOrder = c.DisplayOrder
            })
            .ToListAsync(cancellationToken);

        return new GetCategoriesResponse
        {
            Categories = categories
        };
    }
}
