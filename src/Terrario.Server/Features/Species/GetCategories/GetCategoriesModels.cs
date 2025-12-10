namespace Terrario.Server.Features.Species.GetCategories;

/// <summary>
/// DTO for category information
/// </summary>
public sealed record CategoryDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public string? Icon { get; init; }
    public required int DisplayOrder { get; init; }
}

/// <summary>
/// Response model for species categories
/// </summary>
public sealed record GetCategoriesResponse
{
    public required IEnumerable<CategoryDto> Categories { get; init; }
}
