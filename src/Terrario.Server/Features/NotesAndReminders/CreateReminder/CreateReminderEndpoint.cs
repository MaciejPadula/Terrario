using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.NotesAndReminders.CreateReminder;

/// <summary>
/// Endpoint for creating a new reminder
/// </summary>
public static class CreateReminderEndpoint
{
    public static IEndpointRouteBuilder MapCreateReminderEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/reminders", async (
            [FromBody] CreateReminderRequest request,
            CreateReminderHandler handler,
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
                var result = await handler.HandleAsync(request, userId, cancellationToken);
                return Results.Created($"/api/reminders/{result.Id}", result);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new CreateReminderErrorResponse
                {
                    Message = ex.Message,
                    Errors = [ex.Message]
                });
            }
        })
        .WithName("CreateReminder")
        .WithTags("Reminders")
        .WithSummary("Create a new reminder")
        .WithDescription("Creates a new reminder for the authenticated user, optionally associated with an animal")
        .Produces<CreateReminderResponse>(StatusCodes.Status201Created)
        .Produces<CreateReminderErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}