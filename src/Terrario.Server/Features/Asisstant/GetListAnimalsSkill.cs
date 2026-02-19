using Agentic.Net;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Terrario.Infrastructure.Database;

namespace Terrario.Server.Features.Asisstant;

internal class AnimalList
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

}

public class GetListAnimalsSkill(IAIClientProvider aIClientProvider, ApplicationDbContext dbContext) : ISkill
{
    private readonly IAIClient _cheapestClient = aIClientProvider.GetClientWithFallback(ClientCost.Cheap);

    public string Name => "GetListAnimals";

    public async Task<string> ExecuteAsync(string input)
    {
        var list = await _cheapestClient.GetResponseAsync<AnimalList>(
            $"""
            Extract animal list details from input:
            {input}
            IMPORTANT:
            1. Extract both Id and Name of the animal list.
            2. Extract only one list, if there are multiple, choose the most relevant one which is not processed yet (no animals in input).
            Return it as JSON string with exactly the following format:
            {JsonSerializer.Serialize(new AnimalList { Id = Guid.NewGuid(), Name = "Example" })}
            """);

        var animals = await dbContext.Animals
            .Include(a => a.Species)
                .ThenInclude(s => s.Category)
            .Include(a => a.Species)
                .ThenInclude(s => s.CareLevel)
            .Where(a => a.AnimalListId == list.Id)
            .ToListAsync();

        var animalDtos = animals
            .Select(a => new AnimalDto
            {
                Id = a.Id,
                Name = a.Name,
                SpeciesName = a.Species?.ScientificName,
                CategoryName = a.Species?.Category?.Name,
                CareLevel = a.Species?.CareLevel?.Name
            })
            .ToList();

        return $"Animals from list {list.Name}: {JsonSerializer.Serialize(animalDtos)}";
    }

    private record AnimalDto
    {
        public Guid Id { get; init; }
        public string? Name { get; init; }
        public string? SpeciesName { get; init; }
        public string? CategoryName { get; init; }
        public string? CareLevel { get; init; }
    }
}
