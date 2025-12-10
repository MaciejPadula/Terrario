using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.Auth.Login;

/// <summary>
/// Endpoint for user login
/// </summary>
public static class LoginEndpoint
{
    public static IEndpointRouteBuilder MapLoginEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/auth/login", async (
            [FromBody] LoginRequest request,
            LoginHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(request, cancellationToken);

            if (!result.IsSuccess)
            {
                return Results.Unauthorized();
            }

            return Results.Ok(result.Data);
        })
        .WithName("Login")
        .WithTags("Authentication")
        .WithSummary("Login a user")
        .WithDescription("Authenticates a user with email and password, returns JWT token")
        .Produces<LoginResponse>(StatusCodes.Status200OK)
        .Produces<LoginErrorResponse>(StatusCodes.Status401Unauthorized);

        return endpoints;
    }
}
