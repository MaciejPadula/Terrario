using Agentic.Net;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Asisstant;

public class RenameAnimalSkill(IAIClientProvider aIClientProvider, ApplicationDbContext dbContext) : ISkill
{
    private readonly IAIClient _cheapestClient = aIClientProvider.GetClientWithFallback(ClientCost.Cheap);

    public string Name => "RenameAnimal";

    public string Description => 
        """
        This skill is supposed to rename provided animal.
        """;

    private class RenameAnimalRequest
    {
        public Guid AnimalId { get; set; }
        public string NewName { get; set; } = null!;
    }

    public async Task<string> ExecuteAsync(string input)
    {
        var details = await _cheapestClient.GetResponseAsync<RenameAnimalRequest>(
            $"""
            Extract animal id and new name from input:
            {input}
            Respond only with json in format:
            {JsonSerializer.Serialize(new RenameAnimalRequest { AnimalId = Guid.NewGuid(), NewName = "Dog" })}
            """);

        await dbContext.Animals
            .Where(a => a.Id == details.AnimalId)
            .ExecuteUpdateAsync(a => a.SetProperty(a => a.Name, details.NewName));

        return $"Animal with id {details.AnimalId} name was changed successfully";
    }
}
