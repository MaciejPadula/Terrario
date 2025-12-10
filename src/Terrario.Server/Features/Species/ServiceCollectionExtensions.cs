using Terrario.Server.Features.Species.GetCategories;
using Terrario.Server.Features.Species.GetSpecies;

namespace Terrario.Server.Features.Species;

/// <summary>
/// Extension methods for registering Species feature services
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers all Species feature handlers
    /// </summary>
    public static IServiceCollection AddSpeciesFeature(this IServiceCollection services)
    {
        services.AddScoped<GetSpeciesHandler>();
        services.AddScoped<GetCategoriesHandler>();

        return services;
    }
}
