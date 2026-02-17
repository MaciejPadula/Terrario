using Terrario.Server.Features.Conversations.CreateConversation;
using Terrario.Server.Features.Conversations.DeleteConversation;
using Terrario.Server.Features.Conversations.GetConversation;
using Terrario.Server.Features.Conversations.GetConversations;
using Terrario.Server.Features.Conversations.UpdateConversation;

namespace Terrario.Server.Features.Conversations;

/// <summary>
/// Extension methods for registering Conversations feature services
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers all Conversations feature handlers
    /// </summary>
    public static IServiceCollection AddConversationsFeature(this IServiceCollection services)
    {
        services.AddScoped<CreateConversationHandler>();
        services.AddScoped<GetConversationsHandler>();
        services.AddScoped<GetConversationHandler>();
        services.AddScoped<UpdateConversationHandler>();
        services.AddScoped<DeleteConversationHandler>();

        return services;
    }
}
