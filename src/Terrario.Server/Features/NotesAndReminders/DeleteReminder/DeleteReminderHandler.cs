using Terrario.Server.Database;
using Terrario.Server.Features.NotesAndReminders.Shared;

namespace Terrario.Server.Features.NotesAndReminders.DeleteReminder;

/// <summary>
/// Handler for deleting a reminder
/// </summary>
public class DeleteReminderHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<DeleteReminderHandler> _logger;

    public DeleteReminderHandler(
        ApplicationDbContext dbContext,
        ILogger<DeleteReminderHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Deletes an existing reminder for the specified user
    /// </summary>
    public async Task<DeleteReminderResponse> HandleAsync(
        Guid reminderId,
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

        _dbContext.Reminders.Remove(reminder);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Deleted reminder '{Title}' (ID: {Id}) for user {UserId}",
            reminder.Title,
            reminder.Id,
            userId);

        return new DeleteReminderResponse
        {
            Id = reminder.Id,
            Success = true
        };
    }
}