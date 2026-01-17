using Microsoft.Extensions.Configuration;
using NUnit.Framework;
using Shouldly;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Terrario.Server.Features.Auth.Shared;
using Terrario.Server.Shared;

namespace Terrario.Server.Tests.Shared;

/// <summary>
/// Unit tests for JwtTokenService
/// </summary>
[TestFixture]
public class JwtTokenServiceTests
{
    private readonly IConfiguration _configuration;
    private readonly JwtTokenService _sut;

    public JwtTokenServiceTests()
    {
        var configValues = new Dictionary<string, string>
        {
            ["JwtSettings:SecretKey"] = "SuperSecretKeyForTestingPurposesOnly12345678901234567890",
            ["JwtSettings:Issuer"] = "TestIssuer",
            ["JwtSettings:Audience"] = "TestAudience",
            ["JwtSettings:ExpirationHours"] = "24"
        };

        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configValues!)
            .Build();

        _sut = new JwtTokenService(_configuration);
    }

    [Test]
    public void GenerateToken_ShouldReturnValidToken_WhenUserIsProvided()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "test-user-id",
            Email = "test@example.com",
            FirstName = "Test"
        };

        // Act
        var token = _sut.GenerateToken(user);

        // Assert
        token.ShouldNotBeNullOrEmpty();
    }

    [Test]
    public void GenerateToken_ShouldIncludeCorrectClaims_WhenUserIsProvided()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "test-user-id",
            Email = "test@example.com",
            FirstName = "John"
        };

        // Act
        var token = _sut.GenerateToken(user);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        // Assert
        jwtToken.Claims.ShouldContain(c => c.Type == ClaimTypes.NameIdentifier && c.Value == user.Id);
        jwtToken.Claims.ShouldContain(c => c.Type == ClaimTypes.Email && c.Value == user.Email);
        jwtToken.Claims.ShouldContain(c => c.Type == ClaimTypes.GivenName && c.Value == user.FirstName);
        jwtToken.Claims.ShouldContain(c => c.Type == JwtRegisteredClaimNames.Jti);
    }

    [Test]
    public void GenerateToken_ShouldSetCorrectIssuerAndAudience()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "test-user-id",
            Email = "test@example.com"
        };

        // Act
        var token = _sut.GenerateToken(user);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        // Assert
        jwtToken.Issuer.ShouldBe("TestIssuer");
        jwtToken.Audiences.ShouldContain("TestAudience");
    }

    [Test]
    public void GenerateToken_ShouldSetExpirationTime_BasedOnConfiguration()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "test-user-id",
            Email = "test@example.com"
        };

        // Act
        var token = _sut.GenerateToken(user);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        var expectedExpiry = DateTime.UtcNow.AddHours(24);

        // Assert
        (jwtToken.ValidTo - expectedExpiry).Duration().ShouldBeLessThan(TimeSpan.FromMinutes(1));
    }

    [Test]
    public void GenerateToken_ShouldThrowException_WhenSecretKeyIsNotConfigured()
    {
        // Arrange
        var emptyConfig = new ConfigurationBuilder().Build();
        var service = new JwtTokenService(emptyConfig);
        var user = new ApplicationUser
        {
            Id = "test-user-id",
            Email = "test@example.com"
        };

        // Act & Assert
        Should.Throw<InvalidOperationException>(() => service.GenerateToken(user))
            .Message.ShouldBe("JWT Secret Key not configured");
    }

    [Test]
    public void GenerateToken_ShouldNotIncludeFirstNameClaim_WhenFirstNameIsNull()
    {
        // Arrange
        var user = new ApplicationUser
        {
            Id = "test-user-id",
            Email = "test@example.com",
            FirstName = null
        };

        // Act
        var token = _sut.GenerateToken(user);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        // Assert
        jwtToken.Claims.ShouldNotContain(c => c.Type == ClaimTypes.GivenName);
    }
}
