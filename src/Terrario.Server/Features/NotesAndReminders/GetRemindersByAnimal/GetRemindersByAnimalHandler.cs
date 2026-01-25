using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;

namespace Terrario.Server.Features.NotesAndReminders.GetRemindersByAnimal;

/// <summary>
/// Handler for getting reminders by animal
/// </summary>
public class GetRemindersByAnimalHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<GetRemindersByAnimalHandler> _logger;

    public GetRemindersByAnimalHandler(
        ApplicationDbContext dbContext,
        ILogger<GetRemindersByAnimalHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Gets all active reminders for the specified user and animal
    /// </summary>
    public async Task<GetRemindersByAnimalResponse> HandleAsync(
        Guid animalId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        // First verify that the animal belongs to the user
        var animal = await _dbContext.Animals.FindAsync([animalId], cancellationToken);
        if (animal == null || animal.UserId != userId)
        {
            throw new ArgumentException("Animal not found or does not belong to the user.");
        }

        var reminders = await _dbContext.Reminders
            .Where(r => r.UserId == userId && r.AnimalId == animalId && r.IsActive)
            .Include(r => r.Animal)
            .OrderBy(r => r.ReminderDateTime)
            .ToListAsync(cancellationToken);

        var reminderResponses = reminders.Select(r => new ReminderResponse
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            ReminderDateTime = r.ReminderDateTime,
            IsRecurring = r.IsRecurring,
            RecurrencePattern = r.RecurrencePattern,
            IsActive = r.IsActive,
            AnimalId = r.AnimalId,
            AnimalName = r.Animal?.Name,
            CreatedAt = r.CreatedAt
        }).ToList();

        _logger.LogInformation(
            "Retrieved {Count} reminders for animal {AnimalId} and user {UserId}",
            reminderResponses.Count,
            animalId,
            userId);

        return new GetRemindersByAnimalResponse
        {
            Reminders = reminderResponses
        };
    }
}