using Agentic.Net;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Asisstant;

public class GetCollectionsSkill(IAIClientProvider aIClientProvider, ApplicationDbContext dbContext) : ISkill
{
    private readonly IAIClient _cheapestClient = aIClientProvider.GetClientWithFallback(ClientCost.Cheap);

    public string Name => "GetUserCollections";

    public async Task<string> ExecuteAsync(string input)
    {
        var userId = await _cheapestClient.GetResponseAsync<string>(
            $"""
            Extract userId from input:
            {input}
            Return it as normal string without additional characters!!!!!!!!!, example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            """);

        var lists = await dbContext.AnimalLists
            .Where(l => l.UserId == userId)
            .ToListAsync();

        return $"All Animals Lists: {JsonSerializer.Serialize(lists)}";
    }
}
