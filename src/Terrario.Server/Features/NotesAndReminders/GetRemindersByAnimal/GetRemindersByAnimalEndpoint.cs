using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.NotesAndReminders.GetRemindersByAnimal;

/// <summary>
/// Endpoint for getting reminders by animal
/// </summary>
public static class GetRemindersByAnimalEndpoint
{
    public static IEndpointRouteBuilder MapGetRemindersByAnimalEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/animals/{animalId}/reminders", async (
            [FromRoute] Guid animalId,
            ClaimsPrincipal user,
            GetRemindersByAnimalHandler handler,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            try
            {
                var result = await handler.HandleAsync(animalId, userId, cancellationToken);
                return Results.Ok(result);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new GetRemindersByAnimalErrorResponse
                {
                    Message = ex.Message,
                    Errors = [ex.Message]
                });
            }
        })
        .WithName("GetRemindersByAnimal")
        .WithTags("Reminders")
        .WithSummary("Get reminders for a specific animal")
        .WithDescription("Gets all active reminders for the authenticated user associated with a specific animal")
        .Produces<GetRemindersByAnimalResponse>(StatusCodes.Status200OK)
        .Produces<GetRemindersByAnimalErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        return endpoints;
    }
}