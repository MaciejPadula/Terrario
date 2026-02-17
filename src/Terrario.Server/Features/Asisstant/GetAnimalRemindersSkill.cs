using Agentic.Net;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Terrario.Infrastructure.Database;
using Terrario.Server.Features.Animals.GetAnimals;

namespace Terrario.Server.Features.Asisstant;

public class GetAnimalRemindersSkill(IEnumerable<IAIClient> aIClients, ApplicationDbContext dbContext) : ISkill
{
    private readonly IAIClient _cheapestClient = aIClients.OrderBy(c => c.Priority).First();

    public string Name => "GetAnimalReminders";

    public async Task<string> ExecuteAsync(string input)
    {
        var animalId = await _cheapestClient.GetResponseAsync<string>(
            $"""
            Extract animal id from input:
            {input}
            Return it as normal string without additional characters!!!!!!!!!, example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            """);

        var reminders = await dbContext.Reminders
            .Where(r => r.AnimalId.ToString() == animalId)
            .ToListAsync();

        return JsonSerializer.Serialize(reminders
            .Select(x => new
            {
                x.Id,
                x.Title,
                x.Description,
                x.ReminderDateTime,
                x.IsRecurring,
                x.RecurrencePattern,
                x.IsActive
            })
            .ToList());
    }
}
