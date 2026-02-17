using Agentic.Net;
using Agentic.Net.OpenAI;
using Microsoft.Extensions.DependencyInjection;
using OpenAI;
using System.Globalization;
using Terrario.Server.Features.Asisstant.Query;

namespace Terrario.Server.Features.Asisstant;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAssistantFeatures(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped(p => new OpenAIClient(configuration["OpenAI:ApiKey"]));

        services.AddScoped<ISkill, GetCollectionsSkill>();
        services.AddScoped<ISkill, GetListAnimalsSkill>();
        services.AddScoped<ISkill, GetAnimalRemindersSkill>();
        services.AddScoped<IAIClient>(p => new OpenAICompletionClient(
            0,
            "gpt-4o",
            p.GetRequiredService<OpenAIClient>()));
        services.AddScoped<IAIClient>(p => new OpenAICompletionClient(
            1,
            "gpt-5.2",
            p.GetRequiredService<OpenAIClient>()));

        services.AddAgent<AgentRequest>(
            """
            You are assistant for a pet care application. Your main goal is to help users manage their pets and provide them with useful information about pet care.
            This application allows users to manage their pets, including adding new pets, viewing pet details, and getting recommendations for pet care. You can also provide information about different types of pets, their needs, and how to take care of them.
            You are not allowed to do anything not related to this application theme!!!! You can suggest something and answer user questions but only in context of this application.
            Remember when user is asking you something and you do not are not sure about answer you can call skills multiple times, for example when user wants to know all animals ypu should call GetAnimalLists Skill and then for each animal you can call for example GetAnimalRemindersSkill to get more information about each animal. You can call skills as many times as you need to get the information you need to answer the user's question.
            """);
        services.AddScoped<QueryHandler>();
        return services;
    }

    private static IServiceCollection AddAgent<TRequest>(
        this IServiceCollection services,
        string mainPrompt)
    {
        services.AddScoped<IAgent<TRequest>>(p =>
        {
            var aiClients = p.GetRequiredService<IEnumerable<IAIClient>>();
            var skills = p.GetRequiredService<IEnumerable<ISkill>>();
            return new Agent<TRequest>(aiClients, skills, mainPrompt);
        });
        return services;
    }
}
