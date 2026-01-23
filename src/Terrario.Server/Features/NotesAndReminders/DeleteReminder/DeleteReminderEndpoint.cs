using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.NotesAndReminders.DeleteReminder;

/// <summary>
/// Endpoint for deleting a reminder
/// </summary>
public static class DeleteReminderEndpoint
{
    public static IEndpointRouteBuilder MapDeleteReminderEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapDelete("/api/reminders/{id}", async (
            [FromRoute] Guid id,
            DeleteReminderHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            try
            {
                var result = await handler.HandleAsync(id, userId, cancellationToken);
                return Results.Ok(result);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new DeleteReminderErrorResponse
                {
                    Message = ex.Message,
                    Errors = [ex.Message]
                });
            }
        })
        .WithName("DeleteReminder")
        .WithTags("Reminders")
        .WithSummary("Delete a reminder")
        .WithDescription("Deletes an existing reminder for the authenticated user")
        .Produces<DeleteReminderResponse>(StatusCodes.Status200OK)
        .Produces<DeleteReminderErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}