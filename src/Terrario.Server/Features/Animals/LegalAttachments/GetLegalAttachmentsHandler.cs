using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Animals.LegalAttachments;

/// <summary>
/// Handler for listing legal attachments of an animal
/// </summary>
public class GetLegalAttachmentsHandler
{
    private readonly ApplicationDbContext _context;

    public GetLegalAttachmentsHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<GetLegalAttachmentsResponse?> HandleAsync(
        Guid animalId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        // Verify animal exists and belongs to user
        var animalExists = await _context.Animals
            .AnyAsync(a => a.Id == animalId && a.UserId == userId, cancellationToken);

        if (!animalExists)
            return null;

        var attachments = await _context.AnimalLegalAttachments
            .Where(a => a.AnimalId == animalId)
            .OrderByDescending(a => a.UploadedAt)
            .Select(a => new LegalAttachmentItemDto
            {
                Id = a.Id,
                FileName = a.FileName,
                ContentType = a.ContentType,
                FileSizeBytes = a.FileSizeBytes,
                UploadedAt = a.UploadedAt,
                DownloadUrl = $"/api/legal-attachments/{a.Id}"
            })
            .ToListAsync(cancellationToken);

        return new GetLegalAttachmentsResponse
        {
            Attachments = attachments,
            TotalCount = attachments.Count
        };
    }
}
