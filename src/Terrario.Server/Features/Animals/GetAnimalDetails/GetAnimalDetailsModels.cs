using Terrario.Infrastructure.Database.Models;

namespace Terrario.Server.Features.Animals.GetAnimalDetails;

/// <summary>
/// DTO for a single legal attachment
/// </summary>
public sealed record LegalAttachmentDto
{
    public required Guid Id { get; init; }
    public required string FileName { get; init; }
    public required string ContentType { get; init; }
    public required long FileSizeBytes { get; init; }
    public required DateTime UploadedAt { get; init; }
    public required string DownloadUrl { get; init; }
}

/// <summary>
/// DTO for detailed animal information
/// </summary>
public sealed record AnimalDetailsDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required Guid SpeciesId { get; init; }
    public required string SpeciesCommonName { get; init; }
    public required string SpeciesScientificName { get; init; }
    public required Guid CategoryId { get; init; }
    public required string CategoryName { get; init; }
    public required Guid AnimalListId { get; init; }
    public required string AnimalListName { get; init; }
    public string? ImageUrl { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required AnimalGender Gender { get; init; }
    public bool IsLegalAttachmentsRequired { get; init; }
    public required IEnumerable<LegalAttachmentDto> LegalAttachments { get; init; }
}

/// <summary>
/// Response model for animal details
/// </summary>
public sealed record GetAnimalDetailsResponse
{
    public required AnimalDetailsDto Animal { get; init; }
}
