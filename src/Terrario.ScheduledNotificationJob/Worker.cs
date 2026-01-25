using FirebaseAdmin.Messaging;
using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.ScheduledNotificationJob;

public class Worker(ILogger<Worker> logger, IServiceProvider serviceProvider, IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        try
        {
            await ProcessRemindersAsync(stoppingToken);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while processing reminders.");
        }
        finally
        {
            hostApplicationLifetime.StopApplication();
        }
    }

    private async Task ProcessRemindersAsync(CancellationToken stoppingToken)
    {
        await using var scope = serviceProvider.CreateAsyncScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var now = DateTime.UtcNow;
        const int batchSize = 100;
        int offset = 0;

        while (true)
        {
            var reminders = await dbContext.Reminders
                .Where(r => r.IsActive)
                .OrderBy(r => r.Id)
                .Skip(offset)
                .Take(batchSize)
                .Include(r => r.User)
                    .ThenInclude(u => u.FcmTokens)
                .Include(r => r.Animal)
                .ToListAsync(stoppingToken);

            if (reminders.Count == 0)
                break;

            foreach (var reminder in reminders)
            {
                var nextOccurrence = reminder.IsRecurring
                    ? CalculateNextOccurrence(reminder.ReminderDateTime, reminder.RecurrencePattern, now)
                    : reminder.ReminderDateTime;

                var lastSent = reminder.LastSentAt ?? DateTime.MinValue;

                if (nextOccurrence <= now && nextOccurrence > lastSent)
                {
                    var animal = reminder.Animal;

                    var descriptionWithDate = $"{reminder.Description ?? ""}\n\n{nextOccurrence:yyyy-MM-dd HH:mm}";

                    foreach (var fcmToken in reminder.User.FcmTokens)
                    {
                        await SendNotificationAsync(fcmToken.Token, reminder.Title, descriptionWithDate, animal!.Id.ToString());
                    }

                    // Mark as sent
                    reminder.LastSentAt = now;
                    reminder.UpdatedAt = now;

                    // Deactivate for one-time reminders
                    if (!reminder.IsRecurring)
                    {
                        reminder.IsActive = false;
                    }
                }
            }

            await dbContext.SaveChangesAsync(stoppingToken);

            offset += batchSize;
        }
    }

    private async Task SendNotificationAsync(string fcmToken, string title, string body, string animalId)
    {
        var message = new Message()
        {
            Token = fcmToken,
            Notification = new Notification()
            {
                Title = title,
                Body = body
            },
            Data = new Dictionary<string, string>
            {
                { "icon", $"api/images/{animalId}" },
                { "link", $"animals/{animalId}" }
            }
        };

        var response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
        logger.LogInformation("Notification sent: {response}", response);
    }

    private DateTime CalculateNextOccurrence(DateTime baseTime, string? recurrencePattern, DateTime now)
    {
        if (string.IsNullOrEmpty(recurrencePattern))
        {
            return baseTime; // For non-recurring, just return base time
        }

        var current = baseTime;
        while (current <= now)
        {
            var newCurrent = recurrencePattern.ToLower() switch
            {
                "daily" => current.AddDays(1),
                "weekly" => current.AddDays(7),
                "monthly" => current.AddMonths(1),
                _ => current.AddDays(1) // Default to daily
            };

            if (newCurrent > now)
            {
                break;
            }

            current = newCurrent;
        }
        return current;
    }
}
