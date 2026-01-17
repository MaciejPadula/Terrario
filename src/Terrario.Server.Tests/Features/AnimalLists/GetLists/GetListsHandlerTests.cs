using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Shouldly;
using Terrario.Server.Database;
using Terrario.Server.Features.AnimalLists.GetLists;
using Terrario.Server.Features.AnimalLists.Shared;

namespace Terrario.Server.Tests.Features.AnimalLists.GetLists;

/// <summary>
/// Unit tests for GetListsHandler
/// </summary>
[TestFixture]
public class GetListsHandlerTests
{
    private ApplicationDbContext _dbContext;
    private GetListsHandler _sut;
    private readonly string _testUserId = "test-user-id";

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new ApplicationDbContext(options);
        _sut = new GetListsHandler(_dbContext);
    }

    [TearDown]
    public void TearDown()
    {
        _dbContext?.Dispose();
    }

    [Test]
    public async Task HandleAsync_ShouldReturnAllLists_ForSpecificUser()
    {
        // Arrange
        var list1 = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Reptiles",
            Description = "My reptile collection",
            UserId = _testUserId,
            CreatedAt = DateTime.UtcNow.AddDays(-2)
        };

        var list2 = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Amphibians",
            Description = "My amphibian collection",
            UserId = _testUserId,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        var otherUserList = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Other User's List",
            UserId = "other-user-id",
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.AnimalLists.AddRangeAsync(list1, list2, otherUserList);
        await _dbContext.SaveChangesAsync();

        // Act
        var response = await _sut.HandleAsync(_testUserId);

        // Assert
        response.ShouldNotBeNull();
        response.Lists.Count().ShouldBe(2);
        response.TotalCount.ShouldBe(2);
        response.Lists.ShouldNotContain(l => l.Name == "Other User's List");
        response.Lists.ShouldContain(l => l.Name == "Reptiles");
        response.Lists.ShouldContain(l => l.Name == "Amphibians");
    }

    [Test]
    public async Task HandleAsync_ShouldReturnEmptyList_WhenUserHasNoLists()
    {
        // Arrange
        // No lists added to database

        // Act
        var response = await _sut.HandleAsync(_testUserId);

        // Assert
        response.ShouldNotBeNull();
        response.Lists.ShouldBeEmpty();
        response.TotalCount.ShouldBe(0);
    }

    [Test]
    public async Task HandleAsync_ShouldOrderListsByCreatedAt_InDescendingOrder()
    {
        // Arrange
        var list1 = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Oldest",
            UserId = _testUserId,
            CreatedAt = DateTime.UtcNow.AddDays(-3)
        };

        var list2 = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Newest",
            UserId = _testUserId,
            CreatedAt = DateTime.UtcNow
        };

        var list3 = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Middle",
            UserId = _testUserId,
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };

        await _dbContext.AnimalLists.AddRangeAsync(list1, list2, list3);
        await _dbContext.SaveChangesAsync();

        // Act
        var response = await _sut.HandleAsync(_testUserId);

        // Assert
        response.Lists.Count().ShouldBe(3);
        var listArray = response.Lists.ToList();
        listArray[0].Name.ShouldBe("Newest");
        listArray[1].Name.ShouldBe("Middle");
        listArray[2].Name.ShouldBe("Oldest");
    }

    [Test]
    public async Task HandleAsync_ShouldIncludeAllListProperties()
    {
        // Arrange
        var list = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Test List",
            Description = "Test Description",
            UserId = _testUserId,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            UpdatedAt = DateTime.UtcNow
        };

        await _dbContext.AnimalLists.AddAsync(list);
        await _dbContext.SaveChangesAsync();

        // Act
        var response = await _sut.HandleAsync(_testUserId);

        // Assert
        var returnedList = response.Lists.First();
        returnedList.Id.ShouldBe(list.Id);
        returnedList.Name.ShouldBe(list.Name);
        returnedList.Description.ShouldBe(list.Description);
        (returnedList.CreatedAt - list.CreatedAt).ShouldBeLessThan(TimeSpan.FromSeconds(1));
        returnedList.UpdatedAt.HasValue.ShouldBeTrue();
        (returnedList.UpdatedAt!.Value - list.UpdatedAt!.Value).ShouldBeLessThan(TimeSpan.FromSeconds(1));
    }

    [Test]
    public async Task HandleAsync_ShouldNotReturnLists_FromOtherUsers()
    {
        // Arrange
        var userList = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "My List",
            UserId = _testUserId,
            CreatedAt = DateTime.UtcNow
        };

        var otherList1 = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Other List 1",
            UserId = "other-user-1",
            CreatedAt = DateTime.UtcNow
        };

        var otherList2 = new AnimalList
        {
            Id = Guid.NewGuid(),
            Name = "Other List 2",
            UserId = "other-user-2",
            CreatedAt = DateTime.UtcNow
        };

        await _dbContext.AnimalLists.AddRangeAsync(userList, otherList1, otherList2);
        await _dbContext.SaveChangesAsync();

        // Act
        var response = await _sut.HandleAsync(_testUserId);

        // Assert
        response.Lists.Count().ShouldBe(1);
        response.Lists.First().Name.ShouldBe("My List");
    }
}
