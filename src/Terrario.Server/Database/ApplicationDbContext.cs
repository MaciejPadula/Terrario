using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Terrario.Server.Features.AnimalLists.Shared;
using Terrario.Server.Features.Auth.Shared;
using Terrario.Server.Features.Species.Shared;

namespace Terrario.Server.Database;

/// <summary>
/// Database context for the Terrario application.
/// Includes Identity tables and custom entities.
/// </summary>
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    /// <summary>
    /// Animal lists created by users
    /// </summary>
    public DbSet<AnimalList> AnimalLists => Set<AnimalList>();

    /// <summary>
    /// Species (gatunki) available in the system
    /// </summary>
    public DbSet<SpeciesEntity> Species => Set<SpeciesEntity>();

    /// <summary>
    /// Categories for species
    /// </summary>
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Customize table names for Identity tables
        builder.Entity<ApplicationUser>(entity =>
        {
            entity.ToTable("Users");
        });

        // Configure AnimalList entity
        builder.Entity<AnimalList>(entity =>
        {
            entity.ToTable("AnimalLists");
            
            entity.HasOne(al => al.User)
                .WithMany()
                .HasForeignKey(al => al.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(al => al.UserId);
        });

        // Configure Species entity
        builder.Entity<SpeciesEntity>(entity =>
        {
            entity.ToTable("Species");
            
            entity.HasOne(s => s.Category)
                .WithMany(c => c.Species)
                .HasForeignKey(s => s.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(s => s.CategoryId);
            entity.HasIndex(s => s.CommonName);
        });

        // Configure Category entity
        builder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            
            entity.HasIndex(c => c.DisplayOrder);
        });
    }
}
