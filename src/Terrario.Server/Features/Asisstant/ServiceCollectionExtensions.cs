using Agentic.Net;
using Agentic.Net.OpenAI;
using Terrario.Server.Features.Asisstant.Query;

namespace Terrario.Server.Features.Asisstant;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAssistantFeatures(this IServiceCollection services)
    {
        services.AddOpenAIServices(apiConfigurationKey: "OpenAI:ApiKey");
        services.ConfigureAgent<AgentRequest>(builder =>
        {
            builder
                .AddOpenAIClient(opt =>
                {
                    opt.ClientCost = ClientCost.Cheap;
                    opt.Model = "gpt-4o";
                    opt.Temperature = 0.1m;

                })
                .AddOpenAIClient(opt =>
                {
                    opt.ClientCost = ClientCost.Expensive;
                    opt.Model = "gpt-5.2";
                    opt.Temperature = 0.1m;
                });

            builder
                .AddSkill<RenameAnimalSkill>()
                .AddSkill<GetCollectionsSkill>()
                .AddSkill<GetListAnimalsSkill>()
                .AddSkill<GetAnimalRemindersSkill>();

            builder
                .IncludeInPrompt(
                    """
                    # Agent Name
                    Terrario

                    # Agent Description
                    You are assistant for a pet care application.
                    Your main goal is to help users manage their pets and provide them with useful information about pet care.

                    # Rules
                    You are not allowed to do anything not related to animals
                    User is allowed to ask you only questions related to pet care and managing their pets. If the question is not related to this topic, you should refuse to answer and explain that you can only answer questions related to pet care.
                    You can provide general advice on pet care, such as shedding frequency for lizards, even if it doesn't require using specific skills.
                    """);
        });

        services.AddScoped<QueryHandler>();
        return services;
    }
}
