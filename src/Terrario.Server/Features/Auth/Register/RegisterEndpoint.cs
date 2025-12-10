using Microsoft.AspNetCore.Mvc;

namespace Terrario.Server.Features.Auth.Register;

/// <summary>
/// Endpoint for user registration
/// </summary>
public static class RegisterEndpoint
{
    public static IEndpointRouteBuilder MapRegisterEndpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/auth/register", async (
            [FromBody] RegisterRequest request,
            RegisterHandler handler,
            CancellationToken cancellationToken) =>
        {
            var result = await handler.HandleAsync(request, cancellationToken);

            if (!result.IsSuccess)
            {
                return Results.BadRequest(new RegisterErrorResponse
                {
                    Message = result.ErrorMessage ?? "Wystąpił błąd podczas rejestracji",
                    Errors = result.Errors
                });
            }

            return Results.Ok(result.Data);
        })
        .WithName("Register")
        .WithTags("Authentication")
        .WithSummary("Register a new user")
        .WithDescription("Creates a new user account with email and password")
        .Produces<RegisterResponse>(StatusCodes.Status200OK)
        .Produces<RegisterErrorResponse>(StatusCodes.Status400BadRequest);

        return endpoints;
    }
}
