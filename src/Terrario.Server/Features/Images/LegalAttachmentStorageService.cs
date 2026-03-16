using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Terrario.Server.Features.Images;

public interface IDocumentStorageService
{
    /// <summary>Stores a document and returns the blob name used</summary>
    Task SaveDocumentAsync(Guid documentId, Stream stream, string contentType, string fileName);

    /// <summary>Gets document data and content type, or null if not found</summary>
    Task<(byte[] data, string contentType, string fileName)?> GetDocumentAsync(Guid documentId);

    /// <summary>Deletes the document</summary>
    Task DeleteDocumentAsync(Guid documentId);

    /// <summary>Checks whether the document exists</summary>
    Task<bool> DocumentExistsAsync(Guid documentId);

    /// <summary>Returns an API URL to download the document</summary>
    Task<string?> GetDocumentUrlAsync(Guid documentId);
}

/// <summary>
/// Azure Blob Storage implementation of IDocumentStorageService.
/// Documents are stored in the "legal-attachments" container using GUID + original extension.
/// </summary>
public class AzureBlobDocumentStorageService : IDocumentStorageService
{
    private readonly BlobContainerClient _containerClient;
    private readonly ILogger<AzureBlobDocumentStorageService> _logger;

    private static readonly string[] SupportedExtensions = { ".pdf", ".jpg", ".jpeg", ".png", ".webp" };

    public AzureBlobDocumentStorageService(
        BlobServiceClient blobServiceClient,
        IConfiguration configuration,
        ILogger<AzureBlobDocumentStorageService> logger)
    {
        _logger = logger;
        var containerName = configuration["Blob:LegalAttachmentsContainerName"] ?? "legal-attachments";
        _containerClient = blobServiceClient.GetBlobContainerClient(containerName);
    }

    public async Task SaveDocumentAsync(Guid documentId, Stream stream, string contentType, string fileName)
    {
        await _containerClient.CreateIfNotExistsAsync(PublicAccessType.None);

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!SupportedExtensions.Contains(extension))
            extension = GetExtensionFromContentType(contentType);

        var blobName = $"{documentId}{extension}";
        var blobClient = _containerClient.GetBlobClient(blobName);

        var headers = new BlobHttpHeaders
        {
            ContentType = contentType,
            ContentDisposition = $"attachment; filename=\"{fileName}\""
        };

        await blobClient.UploadAsync(stream, new BlobUploadOptions { HttpHeaders = headers });
        _logger.LogInformation("Saved legal attachment {DocumentId} as {BlobName}", documentId, blobName);
    }

    public async Task<(byte[] data, string contentType, string fileName)?> GetDocumentAsync(Guid documentId)
    {
        foreach (var extension in SupportedExtensions)
        {
            var blobClient = _containerClient.GetBlobClient($"{documentId}{extension}");
            if (!await blobClient.ExistsAsync()) continue;

            var properties = await blobClient.GetPropertiesAsync();
            var response = await blobClient.DownloadContentAsync();

            var contentType = properties.Value.ContentType;
            var disposition = properties.Value.ContentDisposition ?? string.Empty;
            var fileName = ExtractFileName(disposition, documentId, extension);

            return (response.Value.Content.ToArray(), contentType, fileName);
        }
        return null;
    }

    public async Task DeleteDocumentAsync(Guid documentId)
    {
        foreach (var extension in SupportedExtensions)
        {
            var blobClient = _containerClient.GetBlobClient($"{documentId}{extension}");
            await blobClient.DeleteIfExistsAsync();
        }
        _logger.LogInformation("Deleted legal attachment {DocumentId}", documentId);
    }

    public async Task<bool> DocumentExistsAsync(Guid documentId)
    {
        foreach (var extension in SupportedExtensions)
        {
            var blobClient = _containerClient.GetBlobClient($"{documentId}{extension}");
            if (await blobClient.ExistsAsync()) return true;
        }
        return false;
    }

    public async Task<string?> GetDocumentUrlAsync(Guid documentId)
    {
        var exists = await DocumentExistsAsync(documentId);
        return exists ? $"/api/legal-attachments/{documentId}" : null;
    }

    private static string GetExtensionFromContentType(string contentType) =>
        contentType.ToLowerInvariant() switch
        {
            "application/pdf" => ".pdf",
            "image/jpeg" => ".jpg",
            "image/png" => ".png",
            "image/webp" => ".webp",
            _ => ".pdf"
        };

    private static string ExtractFileName(string disposition, Guid documentId, string extension)
    {
        const string prefix = "attachment; filename=\"";
        if (disposition.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
        {
            var name = disposition[prefix.Length..].TrimEnd('"');
            if (!string.IsNullOrWhiteSpace(name)) return name;
        }
        return $"{documentId}{extension}";
    }
}
