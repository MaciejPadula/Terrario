namespace Terrario.Server.Features.Animals.DeleteImage;

/// <summary>
/// Request model for deleting animal image
/// </summary>
public sealed record DeleteAnimalImageRequest
{
    public required Guid AnimalId { get; init; }
    public required string UserId { get; init; }
}

/// <summary>
/// Response model for deleted animal image
/// </summary>
public sealed record DeleteAnimalImageResponse
{
    public required Guid AnimalId { get; init; }
    public required string Message { get; init; }
}
