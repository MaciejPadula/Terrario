namespace Terrario.Server.Features.Animals.LegalAttachments;

/// <summary>
/// DTO returned for a single legal attachment in list/upload responses
/// </summary>
public sealed record LegalAttachmentItemDto
{
    public required Guid Id { get; init; }
    public required string FileName { get; init; }
    public required string ContentType { get; init; }
    public required long FileSizeBytes { get; init; }
    public required DateTime UploadedAt { get; init; }
    public required string DownloadUrl { get; init; }
}

// ── Upload ──────────────────────────────────────────────────────────────────

/// <summary>
/// Request for uploading a legal attachment
/// </summary>
public sealed class UploadLegalAttachmentRequest
{
    public required Guid AnimalId { get; init; }
    public required string UserId { get; init; }
    public required IFormFile File { get; init; }
}

/// <summary>
/// Response after uploading a legal attachment
/// </summary>
public sealed record UploadLegalAttachmentResponse
{
    public required LegalAttachmentItemDto Attachment { get; init; }
    public required string Message { get; init; }
}

// ── Get list ────────────────────────────────────────────────────────────────

/// <summary>
/// Response for listing all legal attachments for an animal
/// </summary>
public sealed record GetLegalAttachmentsResponse
{
    public required IEnumerable<LegalAttachmentItemDto> Attachments { get; init; }
    public required int TotalCount { get; init; }
}

// ── Delete ──────────────────────────────────────────────────────────────────

/// <summary>
/// Response after deleting a legal attachment
/// </summary>
public sealed record DeleteLegalAttachmentResponse
{
    public required string Message { get; init; }
}
