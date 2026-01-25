using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using Terrario.Infrastructure.Database.Models;

namespace Terrario.Server.Features.NotesAndReminders.GetReminders;

/// <summary>
/// Handler for getting reminders
/// </summary>
public class GetRemindersHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<GetRemindersHandler> _logger;

    public GetRemindersHandler(
        ApplicationDbContext dbContext,
        ILogger<GetRemindersHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Gets reminders for the specified user
    /// </summary>
    public async Task<GetRemindersResponse> HandleAsync(
        string userId,
        DateTime from,
        DateTime to,
        bool includeInactive = false,
        CancellationToken cancellationToken = default)
    {
        var remindersQuery = _dbContext.Reminders
            .Where(r => r.UserId == userId);

        if (!includeInactive)
        {
            remindersQuery = remindersQuery.Where(r => r.IsActive);
        }

        // For recurring reminders, include them regardless of their reminderDateTime
        // so they can be expanded on the frontend
        // For non-recurring reminders, only include those within the date range
        remindersQuery = remindersQuery.Where(r => 
                r.IsRecurring || 
                (r.ReminderDateTime >= from && r.ReminderDateTime < to));

        var reminders = await remindersQuery
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
            "Retrieved {Count} reminders for user {UserId}",
            reminderResponses.Count,
            userId);

        return new GetRemindersResponse
        {
            Reminders = reminderResponses
        };
    }
}