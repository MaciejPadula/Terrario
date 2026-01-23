using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.NotesAndReminders.UpdateReminder;

/// <summary>
/// Endpoint for updating a reminder
/// </summary>
public static class UpdateReminderEndpoint
{
    public static IEndpointRouteBuilder MapUpdateReminderEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPut("/api/reminders/{id}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateReminderRequest request,
            UpdateReminderHandler handler,
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
                var result = await handler.HandleAsync(id, request, userId, cancellationToken);
                return Results.Ok(result);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new UpdateReminderErrorResponse
                {
                    Message = ex.Message,
                    Errors = [ex.Message]
                });
            }
        })
        .WithName("UpdateReminder")
        .WithTags("Reminders")
        .WithSummary("Update a reminder")
        .WithDescription("Updates an existing reminder for the authenticated user")
        .Produces<UpdateReminderResponse>(StatusCodes.Status200OK)
        .Produces<UpdateReminderErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}