using Microsoft.Extensions.Azure;

namespace Terrario.Server.Features.Images;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddImageFeatures(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAzureClients(clientBuilder =>
        {
            var connectionString = configuration.GetConnectionString("BlobStorage")
                ?? throw new InvalidOperationException("BlobStorage connection string not configured");

            clientBuilder.AddBlobServiceClient(connectionString);
        });

        services.AddScoped<IImageStorageService, AzureBlobStorageImageService>();
        return services;
    }
}
