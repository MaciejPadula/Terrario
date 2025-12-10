namespace Terrario.Server.Features.Auth.Logout;

/// <summary>
/// Endpoint for user logout
/// </summary>
public static class LogoutEndpoint
{
    public static IEndpointRouteBuilder MapLogoutEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/auth/logout", () =>
        {
            // With JWT tokens, logout is primarily handled client-side by removing the token.
            // This endpoint exists for:
            // 1. API consistency
            // 2. Future token blacklisting implementation
            // 3. Server-side logging/auditing of logout events

            return Results.Ok(new LogoutResponse { Message = "Successfully logged out" });
        })
        .WithName("Logout")
        .WithTags("Authentication")
        .WithSummary("Logout a user")
        .WithDescription("Logs out the current user. Client should discard the JWT token after calling this endpoint.")
        .Produces<LogoutResponse>(StatusCodes.Status200OK)
        .RequireAuthorization();

        return endpoints;
    }
}

public record LogoutResponse
{
    public string Message { get; init; } = string.Empty;
}
