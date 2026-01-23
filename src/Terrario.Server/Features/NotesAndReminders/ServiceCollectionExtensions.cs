using Microsoft.Extensions.DependencyInjection;
using Terrario.Server.Features.NotesAndReminders.CreateReminder;
using Terrario.Server.Features.NotesAndReminders.DeleteReminder;
using Terrario.Server.Features.NotesAndReminders.GetReminders;
using Terrario.Server.Features.NotesAndReminders.GetRemindersByAnimal;
using Terrario.Server.Features.NotesAndReminders.UpdateReminder;
// using Terrario.Server.Features.NotesAndReminders.CreateReminder;
// using Terrario.Server.Features.NotesAndReminders.DeleteNote;
// using Terrario.Server.Features.NotesAndReminders.DeleteReminder;
// using Terrario.Server.Features.NotesAndReminders.GetNotes;
// using Terrario.Server.Features.NotesAndReminders.GetReminders;
// using Terrario.Server.Features.NotesAndReminders.UpdateNote;
// using Terrario.Server.Features.NotesAndReminders.UpdateReminder;

namespace Terrario.Server.Features.NotesAndReminders;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddNotesAndRemindersFeature(this IServiceCollection services)
    {
        // Register handlers as scoped services
        services.AddScoped<CreateReminderHandler>();
        services.AddScoped<GetRemindersHandler>();
        services.AddScoped<GetRemindersByAnimalHandler>();
        services.AddScoped<UpdateReminderHandler>();
        services.AddScoped<DeleteReminderHandler>();
        // Add other handlers as they are created

        return services;
    }
}