using Microsoft.AspNetCore.Identity;
using Terrario.Infrastructure.Database.Models;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Auth.Register;

/// <summary>
/// Handler for user registration logic
/// </summary>
public class RegisterHandler
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenService _tokenService;
    private readonly ILogger<RegisterHandler> _logger;

    public RegisterHandler(
        UserManager<ApplicationUser> userManager,
        JwtTokenService tokenService,
        ILogger<RegisterHandler> logger)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _logger = logger;
    }

    /// <summary>
    /// Handles user registration
    /// </summary>
    public async Task<Result<RegisterResponse>> HandleAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            _logger.LogWarning("Registration attempt for existing email: {Email}", request.Email);
            return Result<RegisterResponse>.Failure("Użytkownik z tym adresem email już istnieje");
        }

        // Create new user
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            _logger.LogWarning("Failed to create user {Email}. Errors: {Errors}",
                request.Email, string.Join(", ", errors));
            return Result<RegisterResponse>.Failure("Nie udało się utworzyć użytkownika", errors);
        }

        _logger.LogInformation("User {Email} registered successfully", request.Email);

        // Generate JWT token
        var token = _tokenService.GenerateToken(user);

        var response = new RegisterResponse
        {
            UserId = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            Token = token,
            CreatedAt = user.CreatedAt
        };

        return Result<RegisterResponse>.Success(response);
    }
}
