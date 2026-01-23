namespace Terrario.Server.Features.NotesAndReminders.DeleteReminder;

/// <summary>
/// Response model for deleted reminder
/// </summary>
public sealed record DeleteReminderResponse
{
    public required Guid Id { get; init; }
    public required bool Success { get; init; }
}

/// <summary>
/// Error response model
/// </summary>
public sealed record DeleteReminderErrorResponse
{
    public required string Message { get; init; }
    public required string[] Errors { get; init; }
}