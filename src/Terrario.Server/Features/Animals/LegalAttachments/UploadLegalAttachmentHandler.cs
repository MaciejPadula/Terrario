using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;
using Terrario.Server.Features.Images;

namespace Terrario.Server.Features.Animals.LegalAttachments;

/// <summary>
/// Handler for uploading a legal attachment to an animal
/// </summary>
public class UploadLegalAttachmentHandler
{
    private readonly ApplicationDbContext _context;
    private readonly IDocumentStorageService _documentStorage;
    private readonly ILogger<UploadLegalAttachmentHandler> _logger;

    private static readonly string[] AllowedMimeTypes =
    {
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp"
    };

    private static readonly string[] AllowedExtensions = { ".pdf", ".jpg", ".jpeg", ".png", ".webp" };
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    public UploadLegalAttachmentHandler(
        ApplicationDbContext context,
        IDocumentStorageService documentStorage,
        ILogger<UploadLegalAttachmentHandler> logger)
    {
        _context = context;
        _documentStorage = documentStorage;
        _logger = logger;
    }

    public async Task<UploadLegalAttachmentResponse?> HandleAsync(UploadLegalAttachmentRequest request)
    {
        if (request.File == null || request.File.Length == 0)
            throw new ArgumentException("No file provided");

        if (request.File.Length > MaxFileSizeBytes)
            throw new ArgumentException($"File size exceeds maximum allowed size of {MaxFileSizeBytes / 1024 / 1024} MB");

        var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new ArgumentException($"File type not allowed. Allowed: {string.Join(", ", AllowedExtensions)}");

        if (!AllowedMimeTypes.Contains(request.File.ContentType.ToLowerInvariant()))
            throw new ArgumentException($"Invalid content type. Allowed: {string.Join(", ", AllowedMimeTypes)}");

        // Verify animal exists and belongs to user
        var animalExists = await _context.Animals
            .AnyAsync(a => a.Id == request.AnimalId && a.UserId == request.UserId);

        if (!animalExists)
            return null;

        var attachmentId = Guid.NewGuid();

        using (var stream = request.File.OpenReadStream())
        {
            await _documentStorage.SaveDocumentAsync(
                attachmentId,
                stream,
                request.File.ContentType,
                request.File.FileName);
        }

        var entity = new AnimalLegalAttachmentEntity
        {
            Id = attachmentId,
            AnimalId = request.AnimalId,
            UserId = request.UserId,
            FileName = request.File.FileName,
            ContentType = request.File.ContentType,
            FileSizeBytes = request.File.Length,
            UploadedAt = DateTime.UtcNow
        };

        _context.AnimalLegalAttachments.Add(entity);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Uploaded legal attachment {AttachmentId} for animal {AnimalId}", attachmentId, request.AnimalId);

        return new UploadLegalAttachmentResponse
        {
            Attachment = new LegalAttachmentItemDto
            {
                Id = entity.Id,
                FileName = entity.FileName,
                ContentType = entity.ContentType,
                FileSizeBytes = entity.FileSizeBytes,
                UploadedAt = entity.UploadedAt,
                DownloadUrl = $"/api/legal-attachments/{entity.Id}"
            },
            Message = "Attachment uploaded successfully"
        };
    }
}
