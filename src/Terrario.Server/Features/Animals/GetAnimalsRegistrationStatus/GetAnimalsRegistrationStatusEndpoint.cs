using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Terrario.Server.Features.Animals.GetAnimalsRegistrationStatus;

/// <summary>
/// Endpoint for retrieving animals with their registration status
/// </summary>
public static class GetAnimalsRegistrationStatusEndpoint
{
    public static IEndpointRouteBuilder MapGetAnimalsRegistrationStatusEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/animals/registration-status", [Authorize] async (
            GetAnimalsRegistrationStatusHandler handler,
            ClaimsPrincipal user,
            CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(userId, cancellationToken);
            return Results.Ok(result);
        })
        .WithName("GetAnimalsRegistrationStatus")
        .WithTags("Animals")
        .WithSummary("Get animals registration status")
        .WithDescription("Retrieves all animals for the user with information whether legal attachment (registration) data has been uploaded")
        .Produces<GetAnimalsRegistrationStatusResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        return endpoints;
    }
}
