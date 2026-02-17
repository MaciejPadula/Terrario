using System.Security.Claims;

namespace Terrario.Server.Features.Auth.ValidateToken;

/// <summary>
/// Endpoint for validating JWT token
/// </summary>
public static class ValidateTokenEndpoint
{
    public static IEndpointRouteBuilder MapValidateTokenEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/auth/validate", (HttpContext context) =>
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = context.User.FindFirstValue(ClaimTypes.Email);
            var firstName = context.User.FindFirstValue(ClaimTypes.GivenName);

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(email))
            {
                return Results.Unauthorized();
            }

            var response = new ValidateTokenResponse
            {
                IsValid = true,
                UserId = userId,
                Email = email,
                FirstName = firstName
            };

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithName("ValidateToken")
        .WithTags("Authentication")
        .WithSummary("Validate current JWT token")
        .WithDescription("Validates if the current JWT token is valid and returns user information")
        .Produces<ValidateTokenResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        return endpoints;
    }
}
