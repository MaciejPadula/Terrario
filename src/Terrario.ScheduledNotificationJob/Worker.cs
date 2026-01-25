using FirebaseAdmin.Messaging;
using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;

namespace Terrario.ScheduledNotificationJob;

public class Worker(ILogger<Worker> logger, IServiceProvider serviceProvider) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await ProcessRemindersAsync(stoppingToken);
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
                .Where(r => r.IsActive && (r.IsRecurring || r.ReminderDateTime <= now))
                .OrderBy(r => r.Id)
                .Skip(offset)
                .Take(batchSize)
                .Include(r => r.User)
                    .ThenInclude(u => u.FcmTokens)
                .ToListAsync(stoppingToken);

            if (reminders.Count == 0)
                break;

            foreach (var reminder in reminders)
            {
                if (reminder.ReminderDateTime <= now)
                {
                    // Send to all user's FCM tokens
                    foreach (var fcmToken in reminder.User.FcmTokens)
                    {
                        await SendNotificationAsync(fcmToken.Token, reminder.Title, reminder.Description ?? "");
                    }
                }
            }

            offset += batchSize;
        }
    }

    private async Task SendNotificationAsync(string fcmToken, string title, string body)
    {
        var message = new Message()
        {
            Token = fcmToken,
            Notification = new Notification()
            {
                Title = title,
                Body = body
            }
        };

        var response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
        logger.LogInformation("Notification sent: {response}", response);
    }
}
