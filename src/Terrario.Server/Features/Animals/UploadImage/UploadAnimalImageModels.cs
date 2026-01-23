namespace Terrario.Server.Features.Animals.UploadImage;

/// <summary>
/// Request model for uploading animal image
/// </summary>
public sealed class UploadAnimalImageRequest
{
    public required Guid AnimalId { get; init; }
    public required string UserId { get; init; }
    public required IFormFile Image { get; init; }
}

/// <summary>
/// Response model for uploaded animal image
/// </summary>
public sealed record UploadAnimalImageResponse
{
    public required Guid AnimalId { get; init; }
    public required string ImageUrl { get; init; }
    public required string Message { get; init; }
}
