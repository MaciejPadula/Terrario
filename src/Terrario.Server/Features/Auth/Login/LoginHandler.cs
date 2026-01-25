using Microsoft.AspNetCore.Identity;
using Terrario.Infrastructure.Database.Models;
using Terrario.Server.Features.Auth.Register;
using Terrario.Server.Shared;

namespace Terrario.Server.Features.Auth.Login;

/// <summary>
/// Handler for user login logic
/// </summary>
public class LoginHandler
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtTokenService _tokenService;
    private readonly ILogger<LoginHandler> _logger;

    public LoginHandler(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        JwtTokenService tokenService,
        ILogger<LoginHandler> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _logger = logger;
    }

    /// <summary>
    /// Handles user login
    /// </summary>
    public async Task<Result<LoginResponse>> HandleAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        // Find user by email
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Login attempt for non-existent user: {Email}", request.Email);
            return Result<LoginResponse>.Failure("Nieprawidłowy email lub hasło");
        }

        // Check password
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            _logger.LogWarning("Failed login attempt for user: {Email}", request.Email);
            return Result<LoginResponse>.Failure("Nieprawidłowy email lub hasło");
        }

        _logger.LogInformation("User {Email} logged in successfully", request.Email);

        // Generate JWT token
        var token = _tokenService.GenerateToken(user);

        var response = new LoginResponse
        {
            UserId = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            Token = token
        };

        return Result<LoginResponse>.Success(response);
    }
}
