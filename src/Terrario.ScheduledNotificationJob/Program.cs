using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Terrario.ScheduledNotificationJob;

var builder = Host.CreateApplicationBuilder(args);

// Add Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()));

// Initialize Firebase
var firebaseConfig = builder.Configuration.GetSection("Firebase");
var projectId = firebaseConfig["ProjectId"];
var serviceAccountKeyPath = firebaseConfig["ServiceAccountKey"];

FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.FromJson(serviceAccountKeyPath),
    ProjectId = projectId
});

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();
