using System.ComponentModel.DataAnnotations;

namespace Terrario.Server.Features.NotesAndReminders.UpdateReminder;

/// <summary>
/// Request model for updating a reminder
/// </summary>
public sealed record UpdateReminderRequest
{
    [Required(ErrorMessage = "Tytuł przypomnienia jest wymagany")]
    [MaxLength(200, ErrorMessage = "Tytuł może mieć maksymalnie 200 znaków")]
    public string Title { get; init; } = string.Empty;

    public string? Description { get; init; }

    [Required(ErrorMessage = "Data i godzina przypomnienia są wymagane")]
    public DateTime ReminderDateTime { get; init; }

    public bool IsRecurring { get; init; } = false;

    [MaxLength(50, ErrorMessage = "Wzorzec powtarzania może mieć maksymalnie 50 znaków")]
    public string? RecurrencePattern { get; init; }

    public bool IsActive { get; init; } = true;
}

/// <summary>
/// Response model for updated reminder
/// </summary>
public sealed record UpdateReminderResponse
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public required DateTime ReminderDateTime { get; init; }
    public bool IsRecurring { get; init; }
    public string? RecurrencePattern { get; init; }
    public bool IsActive { get; init; }
    public Guid? AnimalId { get; init; }
    public required DateTime UpdatedAt { get; init; }
}

/// <summary>
/// Error response model
/// </summary>
public sealed record UpdateReminderErrorResponse
{
    public required string Message { get; init; }
    public required string[] Errors { get; init; }
}