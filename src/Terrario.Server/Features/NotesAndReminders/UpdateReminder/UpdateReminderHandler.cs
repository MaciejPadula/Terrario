using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;

namespace Terrario.Server.Features.NotesAndReminders.UpdateReminder;

/// <summary>
/// Handler for updating a reminder
/// </summary>
public class UpdateReminderHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<UpdateReminderHandler> _logger;

    public UpdateReminderHandler(
        ApplicationDbContext dbContext,
        ILogger<UpdateReminderHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Updates an existing reminder for the specified user
    /// </summary>
    public async Task<UpdateReminderResponse> HandleAsync(
        Guid reminderId,
        UpdateReminderRequest request,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var reminder = await _dbContext.Reminders.FindAsync([reminderId], cancellationToken);

        if (reminder == null)
        {
            throw new ArgumentException("Reminder not found.");
        }

        if (reminder.UserId != userId)
        {
            throw new ArgumentException("Reminder does not belong to the user.");
        }

        reminder.Title = request.Title;
        reminder.Description = request.Description;
        reminder.ReminderDateTime = request.ReminderDateTime;
        reminder.IsRecurring = request.IsRecurring;
        reminder.RecurrencePattern = request.RecurrencePattern;
        reminder.IsActive = request.IsActive;
        reminder.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Updated reminder '{Title}' (ID: {Id}) for user {UserId}",
            reminder.Title,
            reminder.Id,
            userId);

        return new UpdateReminderResponse
        {
            Id = reminder.Id,
            Title = reminder.Title,
            Description = reminder.Description,
            ReminderDateTime = reminder.ReminderDateTime,
            IsRecurring = reminder.IsRecurring,
            RecurrencePattern = reminder.RecurrencePattern,
            IsActive = reminder.IsActive,
            AnimalId = reminder.AnimalId,
            UpdatedAt = reminder.UpdatedAt.Value
        };
    }
}