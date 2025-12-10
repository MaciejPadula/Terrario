namespace Terrario.Server.Features.Animals.DeleteAnimal;

/// <summary>
/// Response model for animal deletion
/// </summary>
public sealed record DeleteAnimalResponse
{
    public required string Message { get; init; }
}
