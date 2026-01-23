using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Terrario.Server.Database;
using Terrario.Server.Features.Animals;
using Terrario.Server.Features.Animals.CreateAnimal;
using Terrario.Server.Features.Animals.DeleteAnimal;
using Terrario.Server.Features.Animals.DeleteImage;
using Terrario.Server.Features.Animals.GetAnimals;
using Terrario.Server.Features.Animals.GetAnimalDetails;
using Terrario.Server.Features.Animals.GetRecentAnimals;
using Terrario.Server.Features.Animals.UpdateAnimal;
using Terrario.Server.Features.Animals.UploadImage;
using Terrario.Server.Features.Auth;
using Terrario.Server.Features.Auth.Login;
using Terrario.Server.Features.Auth.Logout;
using Terrario.Server.Features.Auth.Register;
using Terrario.Server.Features.Auth.Shared;
using Terrario.Server.Features.AnimalLists;
using Terrario.Server.Features.AnimalLists.CreateList;
using Terrario.Server.Features.AnimalLists.DeleteList;
using Terrario.Server.Features.AnimalLists.GetLists;
using Terrario.Server.Features.AnimalLists.UpdateList;
using Terrario.Server.Features.Species;
using Terrario.Server.Features.Species.GetCategories;
using Terrario.Server.Features.Species.GetSpecies;
using Terrario.Server.Features.Images;
using Terrario.Server.Shared;
using Microsoft.Extensions.Azure;

var builder = WebApplication.CreateBuilder(args);

// Add Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()));

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;

    // User settings
    options.User.RequireUniqueEmail = true;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT Secret Key not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:60136", "http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register Feature services (Vertical Slice Architecture)
builder.Services.AddAuthFeature();
builder.Services.AddAnimalListsFeature();
builder.Services.AddSpeciesFeature();
builder.Services.AddAnimalsFeature();

// Register Azure Blob Storage client
builder.Services.AddAzureClients(clientBuilder =>
{
    var connectionString = builder.Configuration["AzureBlobStorage:ConnectionString"]
        ?? throw new InvalidOperationException("Azure Blob Storage connection string not configured");
    
    clientBuilder.AddBlobServiceClient(connectionString);
});

// Register Image Storage Service
builder.Services.AddScoped<IImageStorageService, AzureBlobStorageImageService>();

// Add OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

// Map Feature Endpoints (Vertical Slices)
app.MapRegisterEndpoint();
app.MapLoginEndpoint();
app.MapLogoutEndpoint();
app.MapCreateListEndpoint();
app.MapGetListsEndpoint();
app.MapUpdateListEndpoint();
app.MapDeleteListEndpoint();
app.MapGetSpeciesEndpoint();
app.MapGetCategoriesEndpoint();
app.MapCreateAnimalEndpoint();
app.MapGetAnimalsEndpoint();
app.MapGetAnimalDetailsEndpoint();
app.MapUpdateAnimalEndpoint();
app.MapDeleteAnimalEndpoint();
app.MapGetRecentAnimalsEndpoint();
app.MapUploadAnimalImageEndpoint();
app.MapDeleteAnimalImageEndpoint();

// Map Image Endpoints (Independent from features)
app.MapGetImageEndpoint();

app.MapFallbackToFile("/index.html");

app.Run();
