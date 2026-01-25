using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NSubstitute;
using NUnit.Framework;
using Shouldly;
using Terrario.Server.Features.Auth.Login;
using Terrario.Infrastructure.Database.Models;
using Terrario.Server.Shared;

namespace Terrario.Server.Tests.Features.Auth.Login;

/// <summary>
/// Unit tests for LoginHandler
/// </summary>
[TestFixture]
public class LoginHandlerTests
{
    private UserManager<ApplicationUser> _userManagerMock;
    private SignInManager<ApplicationUser> _signInManagerMock;
    private JwtTokenService _tokenService;
    private ILogger<LoginHandler> _loggerMock;
    private LoginHandler _sut;

    [SetUp]
    public void SetUp()
    {
        var userStore = Substitute.For<IUserStore<ApplicationUser>>();
        _userManagerMock = Substitute.For<UserManager<ApplicationUser>>(
            userStore, null!, null!, null!, null!, null!, null!, null!, null!);
        
        var contextAccessor = Substitute.For<Microsoft.AspNetCore.Http.IHttpContextAccessor>();
        var claimsFactory = Substitute.For<IUserClaimsPrincipalFactory<ApplicationUser>>();
        _signInManagerMock = Substitute.For<SignInManager<ApplicationUser>>(
            _userManagerMock,
            contextAccessor,
            claimsFactory,
            null!, null!, null!, null!);

        var configValues = new Dictionary<string, string>
        {
            ["JwtSettings:SecretKey"] = "SuperSecretKeyForTestingPurposesOnly12345678901234567890",
            ["JwtSettings:Issuer"] = "TestIssuer",
            ["JwtSettings:Audience"] = "TestAudience",
            ["JwtSettings:ExpirationHours"] = "24"
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues!)
            .Build();

        _tokenService = new JwtTokenService(configuration);
        _loggerMock = Substitute.For<ILogger<LoginHandler>>();

        _sut = new LoginHandler(
            _userManagerMock,
            _signInManagerMock,
            _tokenService,
            _loggerMock
        );
    }

    [Test]
    public async Task HandleAsync_ShouldReturnSuccess_WhenCredentialsAreValid()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-id",
            Email = "test@example.com",
            FirstName = "John"
        };

        var request = new LoginRequest
        {
            Email = "test@example.com",
            Password = "ValidPassword123!"
        };

        _userManagerMock.FindByEmailAsync(request.Email).Returns(user);
        _signInManagerMock.CheckPasswordSignInAsync(user, request.Password, false).Returns(SignInResult.Success);

        // Act
        var result = await _sut.HandleAsync(request);

        // Assert
        result.IsSuccess.ShouldBeTrue();
        result.Data.ShouldNotBeNull();
        result.Data!.UserId.ShouldBe(user.Id);
        result.Data.Email.ShouldBe(user.Email);
        result.Data.FirstName.ShouldBe(user.FirstName);
        result.Data.Token.ShouldNotBeNullOrEmpty();
    }

    [Test]
    public async Task HandleAsync_ShouldReturnFailure_WhenUserDoesNotExist()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "nonexistent@example.com",
            Password = "Password123!"
        };

        _userManagerMock.FindByEmailAsync(request.Email).Returns((ApplicationUser?)null);

        // Act
        var result = await _sut.HandleAsync(request);

        // Assert
        result.IsSuccess.ShouldBeFalse();
        result.ErrorMessage.ShouldBe("Nieprawidłowy email lub hasło");
    }

    [Test]
    public async Task HandleAsync_ShouldReturnFailure_WhenPasswordIsInvalid()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-id",
            Email = "test@example.com"
        };

        var request = new LoginRequest
        {
            Email = "test@example.com",
            Password = "WrongPassword123!"
        };

        _userManagerMock.FindByEmailAsync(request.Email).Returns(user);
        _signInManagerMock.CheckPasswordSignInAsync(user, request.Password, false).Returns(SignInResult.Failed);

        // Act
        var result = await _sut.HandleAsync(request);

        // Assert
        result.IsSuccess.ShouldBeFalse();
        result.ErrorMessage.ShouldBe("Nieprawidłowy email lub hasło");
    }

    [Test]
    public async Task HandleAsync_ShouldGenerateToken_WhenLoginIsSuccessful()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "user-id",
            Email = "test@example.com"
        };

        var request = new LoginRequest
        {
            Email = "test@example.com",
            Password = "ValidPassword123!"
        };

        _userManagerMock.FindByEmailAsync(request.Email).Returns(user);
        _signInManagerMock.CheckPasswordSignInAsync(user, request.Password, false).Returns(SignInResult.Success);

        // Act
        var result = await _sut.HandleAsync(request);

        // Assert
        result.Data!.Token.ShouldNotBeNullOrEmpty();
    }

    [Test]
    public async Task HandleAsync_ShouldLogWarning_WhenUserDoesNotExist()
    {
        // Arrange
        var request = new LoginRequest
        {
            Email = "nonexistent@example.com",
            Password = "Password123!"
        };

        _userManagerMock.FindByEmailAsync(request.Email).Returns((ApplicationUser?)null);

        // Act
        await _sut.HandleAsync(request);

        // Assert
        _loggerMock.Received(1).Log(
            LogLevel.Warning,
            Arg.Any<EventId>(),
            Arg.Is<object>(v => v.ToString()!.Contains("non-existent")),
            Arg.Any<Exception>(),
            Arg.Any<Func<object, Exception?, string>>());
    }
}
