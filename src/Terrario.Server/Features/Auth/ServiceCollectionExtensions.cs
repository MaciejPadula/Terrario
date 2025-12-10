using Terrario.Server.Features.Auth.Login;
using Terrario.Server.Features.Auth.Register;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Auth;

/// <summary>
/// Extension methods for registering Auth feature services
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers all Auth feature handlers and services
    /// </summary>
    public static IServiceCollection AddAuthFeature(this IServiceCollection services)
    {
        services.AddScoped<JwtTokenService>();
        services.AddScoped<RegisterHandler>();
        services.AddScoped<LoginHandler>();

        return services;
    }
}
