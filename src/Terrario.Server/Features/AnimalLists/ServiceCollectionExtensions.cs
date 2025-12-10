using Terrario.Server.Features.AnimalLists.CreateList;
using Terrario.Server.Features.AnimalLists.DeleteList;
using Terrario.Server.Features.AnimalLists.GetLists;
using Terrario.Server.Features.AnimalLists.UpdateList;

namespace Terrario.Server.Features.AnimalLists;

/// <summary>
/// Extension methods for registering AnimalLists feature services
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers all AnimalLists feature handlers
    /// </summary>
    public static IServiceCollection AddAnimalListsFeature(this IServiceCollection services)
    {
        services.AddScoped<CreateListHandler>();
        services.AddScoped<GetListsHandler>();
        services.AddScoped<UpdateListHandler>();
        services.AddScoped<DeleteListHandler>();

        return services;
    }
}
