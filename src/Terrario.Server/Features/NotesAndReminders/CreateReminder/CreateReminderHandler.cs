using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;

namespace Terrario.Server.Features.NotesAndReminders.CreateReminder;

/// <summary>
/// Handler for creating a new reminder
/// </summary>
public class CreateReminderHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<CreateReminderHandler> _logger;

    public CreateReminderHandler(
        ApplicationDbContext dbContext,
        ILogger<CreateReminderHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new reminder for the specified user
    /// </summary>
    public async Task<CreateReminderResponse> HandleAsync(
        CreateReminderRequest request,
        string userId,
        CancellationToken cancellationToken = default)
    {
        // Validate that AnimalId belongs to the user if provided
        if (request.AnimalId.HasValue)
        {
            var animal = await _dbContext.Animals.FindAsync([request.AnimalId.Value], cancellationToken);
            if (animal == null || animal.UserId != userId)
            {
                throw new ArgumentException("Animal not found or does not belong to the user.");
            }
        }

        var reminder = new Reminder
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            ReminderDateTime = request.ReminderDateTime,
            IsRecurring = request.IsRecurring,
            RecurrencePattern = request.RecurrencePattern,
            IsActive = true,
            UserId = userId,
            AnimalId = request.AnimalId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Reminders.Add(reminder);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Created new reminder '{Title}' (ID: {Id}) for user {UserId}",
            reminder.Title,
            reminder.Id,
            userId);

        return new CreateReminderResponse
        {
            Id = reminder.Id,
            Title = reminder.Title,
            Description = reminder.Description,
            ReminderDateTime = reminder.ReminderDateTime,
            IsRecurring = reminder.IsRecurring,
            RecurrencePattern = reminder.RecurrencePattern,
            IsActive = reminder.IsActive,
            AnimalId = reminder.AnimalId,
            CreatedAt = reminder.CreatedAt
        };
    }
}