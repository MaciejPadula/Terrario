using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.NotesAndReminders.GetReminders;

/// <summary>
/// Response model for a reminder
/// </summary>
public sealed record ReminderResponse
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public required DateTime ReminderDateTime { get; init; }
    public bool IsRecurring { get; init; }
    public string? RecurrencePattern { get; init; }
    public bool IsActive { get; init; }
    public Guid? AnimalId { get; init; }
    public string? AnimalName { get; init; }
    public required DateTime CreatedAt { get; init; }
}

/// <summary>
/// Response model for get reminders
/// </summary>
public sealed record GetRemindersResponse
{
    public required List<ReminderResponse> Reminders { get; init; }
}

/// <summary>
/// Error response model
/// </summary>
public sealed record GetRemindersErrorResponse
{
    public required string Message { get; init; }
    public required string[] Errors { get; init; }
}