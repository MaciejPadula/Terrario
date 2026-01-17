using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Shouldly;
using Terrario.Server.Database;
using Terrario.Server.Features.Animals.CreateAnimal;
using Terrario.Server.Features.Animals.Shared;
using Terrario.Server.Features.AnimalLists.Shared;
using Terrario.Server.Features.Species.Shared;

namespace Terrario.Server.Tests.Features.Animals.CreateAnimal;

/// <summary>
/// Unit tests for CreateAnimalHandler
/// </summary>
[TestFixture]
public class CreateAnimalHandlerTests
{
    private ApplicationDbContext _dbContext;
    private CreateAnimalHandler _sut;
    private readonly string _testUserId = "test-user-id";

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new ApplicationDbContext(options);
        _sut = new CreateAnimalHandler(_dbContext);
    }

    [TearDown]
    public void TearDown()
    {
        _dbContext?.Dispose();
    }

    [Test]
    public async Task HandleAsync_ShouldCreateAnimal_WhenRequestIsValid()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var speciesId = Guid.NewGuid();
        var category = new Category { Id = categoryId, Name = "Reptiles" };
        var species = new SpeciesEntity
        {
            Id = speciesId,
            CommonName = "Ball Python",
            ScientificName = "Python regius",
            CategoryId = categoryId,
            Category = category
        };

        var animalList = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "My Collection",
            UserId = _testUserId
        };

        await _dbContext.Categories.AddAsync(category);
        await _dbContext.Species.AddAsync(species);
        await _dbContext.AnimalLists.AddAsync(animalList);
        await _dbContext.SaveChangesAsync();

        var request = new CreateAnimalRequest
        {
            Name = "Monty",
            SpeciesId = species.Id,
            AnimalListId = animalList.Id,
            ImageUrl = "https://example.com/image.jpg"
        };

        // Act
        var response = await _sut.HandleAsync(request, _testUserId);

        // Assert
        response.ShouldNotBeNull();
        response.Name.ShouldBe("Monty");
        response.SpeciesName.ShouldBe("Ball Python");
        response.AnimalListName.ShouldBe("My Collection");
        response.Message.ShouldBe("Animal created successfully");

        var animalInDb = await _dbContext.Animals.FirstOrDefaultAsync(a => a.Id == response.Id);
        animalInDb.ShouldNotBeNull();
        animalInDb!.Name.ShouldBe("Monty");
        animalInDb.UserId.ShouldBe(_testUserId);
    }

    [Test]
    public async Task HandleAsync_ShouldThrowException_WhenAnimalListDoesNotExist()
    {
        // Arrange
        var request = new CreateAnimalRequest
        {
            Name = "Monty",
            SpeciesId = Guid.NewGuid(),
            AnimalListId = Guid.NewGuid(),
            ImageUrl = "https://example.com/image.jpg"
        };

        // Act & Assert
        await Should.ThrowAsync<UnauthorizedAccessException>(
            async () => await _sut.HandleAsync(request, _testUserId));
    }

    [Test]
    public async Task HandleAsync_ShouldThrowException_WhenAnimalListBelongsToDifferentUser()
    {
        // Arrange
        var animalList = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Someone Else's Collection",
            UserId = "different-user-id"
        };

        await _dbContext.AnimalLists.AddAsync(animalList);
        await _dbContext.SaveChangesAsync();

        var request = new CreateAnimalRequest
        {
            Name = "Monty",
            SpeciesId = Guid.NewGuid(),
            AnimalListId = animalList.Id,
            ImageUrl = "https://example.com/image.jpg"
        };

        // Act & Assert
        await Should.ThrowAsync<UnauthorizedAccessException>(
            async () => await _sut.HandleAsync(request, _testUserId));
    }

    [Test]
    public async Task HandleAsync_ShouldThrowException_WhenSpeciesDoesNotExist()
    {
        // Arrange
        var animalList = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "My Collection",
            UserId = _testUserId
        };

        await _dbContext.AnimalLists.AddAsync(animalList);
        await _dbContext.SaveChangesAsync();

        var request = new CreateAnimalRequest
        {
            Name = "Monty",
            SpeciesId = Guid.NewGuid(),
            AnimalListId = animalList.Id,
            ImageUrl = "https://example.com/image.jpg"
        };

        // Act & Assert
        await Should.ThrowAsync<ArgumentException>(
            async () => await _sut.HandleAsync(request, _testUserId));
    }

    [Test]
    public async Task HandleAsync_ShouldSetCreatedAtToUtcNow()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var speciesId = Guid.NewGuid();
        var category = new Category { Id = categoryId, Name = "Reptiles" };
        var species = new SpeciesEntity
        {
            Id = speciesId,
            CommonName = "Ball Python",
            ScientificName = "Python regius",
            CategoryId = categoryId,
            Category = category
        };

        var animalList = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "My Collection",
            UserId = _testUserId
        };

        await _dbContext.Categories.AddAsync(category);
        await _dbContext.Species.AddAsync(species);
        await _dbContext.AnimalLists.AddAsync(animalList);
        await _dbContext.SaveChangesAsync();

        var request = new CreateAnimalRequest
        {
            Name = "Monty",
            SpeciesId = species.Id,
            AnimalListId = animalList.Id
        };

        var beforeCreation = DateTime.UtcNow;

        // Act
        var response = await _sut.HandleAsync(request, _testUserId);

        // Assert
        (response.CreatedAt - beforeCreation).ShouldBeLessThan(TimeSpan.FromSeconds(2));
    }

    [Test]
    public async Task HandleAsync_ShouldGenerateUniqueId_ForEachAnimal()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var speciesId = Guid.NewGuid();
        var category = new Category { Id = categoryId, Name = "Reptiles" };
        var species = new SpeciesEntity
        {
            Id = speciesId,
            CommonName = "Ball Python",
            ScientificName = "Python regius",
            CategoryId = categoryId,
            Category = category
        };

        var animalList = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "My Collection",
            UserId = _testUserId
        };

        await _dbContext.Categories.AddAsync(category);
        await _dbContext.Species.AddAsync(species);
        await _dbContext.AnimalLists.AddAsync(animalList);
        await _dbContext.SaveChangesAsync();

        var request1 = new CreateAnimalRequest
        {
            Name = "Monty",
            SpeciesId = species.Id,
            AnimalListId = animalList.Id
        };

        var request2 = new CreateAnimalRequest
        {
            Name = "Slinky",
            SpeciesId = species.Id,
            AnimalListId = animalList.Id
        };

        // Act
        var response1 = await _sut.HandleAsync(request1, _testUserId);
        var response2 = await _sut.HandleAsync(request2, _testUserId);

        // Assert
        response1.Id.ShouldNotBe(response2.Id);
        response1.Id.ShouldNotBe(Guid.Empty);
        response2.Id.ShouldNotBe(Guid.Empty);
    }
}
