using Terrario.Server.Features.Animals.CreateAnimal;
using Terrario.Server.Features.Animals.DeleteAnimal;
using Terrario.Server.Features.Animals.GetAnimals;
using Terrario.Server.Features.Animals.GetRecentAnimals;
using Terrario.Server.Features.Animals.UpdateAnimal;

namespace Terrario.Server.Features.Animals;

/// <summary>
/// Extension methods for registering Animals feature services
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers all Animals feature handlers
    /// </summary>
    public static IServiceCollection AddAnimalsFeature(this IServiceCollection services)
    {
        services.AddScoped<CreateAnimalHandler>();
        services.AddScoped<GetAnimalsHandler>();
        services.AddScoped<UpdateAnimalHandler>();
        services.AddScoped<DeleteAnimalHandler>();
        services.AddScoped<GetRecentAnimalsHandler>();

        return services;
    }
}
