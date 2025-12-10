namespace Terrario.Server.Features.Species.GetSpecies;

/// <summary>
/// DTO for species information
/// </summary>
public sealed record SpeciesDto
{
    public required Guid Id { get; init; }
    public required string CommonName { get; init; }
    public string? ScientificName { get; init; }
    public required Guid CategoryId { get; init; }
    public required string CategoryName { get; init; }
    public string? Description { get; init; }
    public string? ImageUrl { get; init; }
    public string? CareLevel { get; init; }
    public int? AdultSizeCm { get; init; }
    public int? LifespanYears { get; init; }
}

/// <summary>
/// Response model for species list
/// </summary>
public sealed record GetSpeciesResponse
{
    public required IEnumerable<SpeciesDto> Species { get; init; }
    public required int TotalCount { get; init; }
}

/// <summary>
/// Query parameters for filtering species
/// </summary>
public sealed record GetSpeciesQuery
{
    public Guid? CategoryId { get; init; }
    public string? Search { get; init; }
}
