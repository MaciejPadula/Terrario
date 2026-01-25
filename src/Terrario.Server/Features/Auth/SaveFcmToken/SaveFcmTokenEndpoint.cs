using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Terrario.Server.Features.Auth.SaveFcmToken;

/// <summary>
/// Endpoint for saving FCM token
/// </summary>
public static class SaveFcmTokenEndpoint
{
    public static IEndpointRouteBuilder MapSaveFcmTokenEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/auth/save-fcm-token", async (
            HttpContext context,
            [FromBody] SaveFcmTokenRequest request,
            SaveFcmTokenHandler handler,
            CancellationToken cancellationToken) =>
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Results.Unauthorized();
            }

            var result = await handler.HandleAsync(userId, request, cancellationToken);

            if (!result.IsSuccess)
            {
                return Results.BadRequest(new SaveFcmTokenErrorResponse
                {
                    Message = result.ErrorMessage ?? "Wystąpił błąd podczas zapisywania tokenu"
                });
            }

            return Results.Ok(result.Data);
        })
        .RequireAuthorization()
        .WithName("SaveFcmToken")
        .WithTags("Authentication")
        .WithSummary("Save FCM token for user")
        .WithDescription("Saves or updates FCM token for push notifications")
        .Produces<SaveFcmTokenResponse>(StatusCodes.Status200OK)
        .Produces<SaveFcmTokenErrorResponse>(StatusCodes.Status400BadRequest);

        return endpoints;
    }
}