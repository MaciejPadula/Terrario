namespace Terrario.Server.Features.AnimalLists.DeleteList;

/// <summary>
/// Response model for deleted animal list
/// </summary>
public sealed record DeleteListResponse
{
    public required string Message { get; init; }
}
