using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Animals.GetAnimalsRegistrationStatus;

/// <summary>
/// Handler for retrieving animals registration status
/// </summary>
public class GetAnimalsRegistrationStatusHandler
{
    private readonly ApplicationDbContext _dbContext;

    public GetAnimalsRegistrationStatusHandler(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves all animals for a user with information whether legal attachment (registration) data has been uploaded
    /// </summary>
    public async Task<GetAnimalsRegistrationStatusResponse> HandleAsync(
        string userId,
        CancellationToken cancellationToken = default)
    {
        var animals = await _dbContext.Animals
            .Where(a => a.UserId == userId && a.Species.IsLegalAttachmentsRequired)
            .OrderBy(a => a.Name)
            .Select(a => new AnimalRegistrationStatusDto
            {
                Id = a.Id,
                Name = a.Name,
                HasRegistrationData = a.LegalAttachments.Any()
            })
            .ToListAsync(cancellationToken);

        return new GetAnimalsRegistrationStatusResponse
        {
            Animals = animals,
            TotalCount = animals.Count
        };
    }
}
