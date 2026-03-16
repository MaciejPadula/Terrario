namespace Terrario.Server.Features.Animals.GetAnimalsRegistrationStatus;

/// <summary>
/// DTO for a single animal's registration status
/// </summary>
public sealed record AnimalRegistrationStatusDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required bool HasRegistrationData { get; init; }
}

/// <summary>
/// Response model for animals registration status list
/// </summary>
public sealed record GetAnimalsRegistrationStatusResponse
{
    public required IEnumerable<AnimalRegistrationStatusDto> Animals { get; init; }
    public required int TotalCount { get; init; }
}
