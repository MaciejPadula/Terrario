using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.NotesAndReminders.GetReminders;

/// <summary>
/// Endpoint for getting reminders
/// </summary>
public static class GetRemindersEndpoint
{
    public static IEndpointRouteBuilder MapGetRemindersEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/reminders", async (
            [FromQuery] bool includeInactive,
            [FromQuery] DateTime? from,
            [FromQuery] DateTime? to,
            ClaimsPrincipal user,
            GetRemindersHandler handler,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            if (!from.HasValue || !to.HasValue)
            {
                return Results.BadRequest(new
                {
                    message = "Query params 'from' and 'to' are required for this endpoint."
                });
            }

            if (from.HasValue && to.HasValue && from.Value >= to.Value)
            {
                return Results.BadRequest(new
                {
                    message = "Invalid date range. 'from' must be earlier than 'to'."
                });
            }

            try
            {
                var result = await handler.HandleAsync(userId, from.Value, to.Value, includeInactive, cancellationToken);
                return Results.Ok(result);
            }
            catch (Exception ex)
            {
                return Results.Problem(
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError);
            }
        })
        .WithName("GetReminders")
        .WithTags("Reminders")
        .WithSummary("Get all reminders")
        .WithDescription("Gets reminders for the authenticated user. Optional query params: includeInactive=true, from, to. When provided, results are filtered by ReminderDateTime in the [from, to) range.")
        .Produces<GetRemindersResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}