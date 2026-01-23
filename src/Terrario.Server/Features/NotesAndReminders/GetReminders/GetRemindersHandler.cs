using Microsoft.EntityFrameworkCore;
using Terrario.Server.Database;
using Terrario.Server.Features.NotesAndReminders.Shared;

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
        bool includeInactive = false,
        DateTime? from = null,
        DateTime? to = null,
        CancellationToken cancellationToken = default)
    {
        var remindersQuery = _dbContext.Reminders
            .Where(r => r.UserId == userId);

        if (!includeInactive)
        {
            remindersQuery = remindersQuery.Where(r => r.IsActive);
        }

        if (from.HasValue)
        {
            remindersQuery = remindersQuery.Where(r => r.ReminderDateTime >= from.Value);
        }

        if (to.HasValue)
        {
            remindersQuery = remindersQuery.Where(r => r.ReminderDateTime < to.Value);
        }

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