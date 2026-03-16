using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using Terrario.Server.Features.Images;

namespace Terrario.Server.Features.Animals.LegalAttachments;

/// <summary>
/// Handler for deleting a legal attachment
/// </summary>
public class DeleteLegalAttachmentHandler
{
    private readonly ApplicationDbContext _context;
    private readonly IDocumentStorageService _documentStorage;
    private readonly ILogger<DeleteLegalAttachmentHandler> _logger;

    public DeleteLegalAttachmentHandler(
        ApplicationDbContext context,
        IDocumentStorageService documentStorage,
        ILogger<DeleteLegalAttachmentHandler> logger)
    {
        _context = context;
        _documentStorage = documentStorage;
        _logger = logger;
    }

    public async Task<DeleteLegalAttachmentResponse?> HandleAsync(
        Guid attachmentId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var attachment = await _context.AnimalLegalAttachments
            .Include(a => a.Animal)
            .FirstOrDefaultAsync(
                a => a.Id == attachmentId && a.Animal.UserId == userId,
                cancellationToken);

        if (attachment == null)
            return null;

        // Delete from blob storage
        await _documentStorage.DeleteDocumentAsync(attachmentId);

        // Delete from database
        _context.AnimalLegalAttachments.Remove(attachment);
        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted legal attachment {AttachmentId}", attachmentId);

        return new DeleteLegalAttachmentResponse { Message = "Attachment deleted successfully" };
    }
}
