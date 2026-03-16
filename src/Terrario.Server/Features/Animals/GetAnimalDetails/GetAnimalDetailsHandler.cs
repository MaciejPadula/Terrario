using Microsoft.EntityFrameworkCore;
using Terrario.Infrastructure.Database;
using Terrario.Server.Features.Images;

namespace Terrario.Server.Features.Animals.GetAnimalDetails;

/// <summary>
/// Handler for retrieving animal details
/// </summary>
public class GetAnimalDetailsHandler
{
    private readonly ApplicationDbContext _dbContext;
    private readonly IImageStorageService _imageStorageService;

    public GetAnimalDetailsHandler(
        ApplicationDbContext dbContext,
        IImageStorageService imageStorageService)
    {
        _dbContext = dbContext;
        _imageStorageService = imageStorageService;
    }

    /// <summary>
    /// Retrieves details of a specific animal
    /// </summary>
    public async Task<GetAnimalDetailsResponse?> HandleAsync(
        Guid animalId,
        string userId,
        CancellationToken cancellationToken = default)
    {
        var animalData = await _dbContext.Animals
            .Include(a => a.Species)
                .ThenInclude(s => s.Category)
            .Include(a => a.AnimalList)
            .Include(a => a.LegalAttachments)
            .Where(a => a.Id == animalId && a.UserId == userId)
            .Select(a => new
            {
                a.Id,
                a.Name,
                a.SpeciesId,
                SpeciesCommonName = a.Species.CommonName,
                SpeciesScientificName = a.Species.ScientificName ?? string.Empty,
                CategoryId = a.Species.CategoryId,
                CategoryName = a.Species.Category.Name,
                a.AnimalListId,
                AnimalListName = a.AnimalList.Name,
                FallbackImageUrl = a.ImageUrl ?? a.Species.ImageUrl,
                a.CreatedAt,
                a.Gender,
                IsLegalAttachmentsRequired = a.Species.IsLegalAttachmentsRequired,
                LegalAttachments = a.LegalAttachments.Select(la => new
                {
                    la.Id,
                    la.FileName,
                    la.ContentType,
                    la.FileSizeBytes,
                    la.UploadedAt
                }).ToList()
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (animalData == null)
        {
            return null;
        }

        // Get image URL from storage service using animal ID
        var imageUrl = await _imageStorageService.GetImageUrlAsync(animalData.Id)
            ?? animalData.FallbackImageUrl;

        var animal = new AnimalDetailsDto
        {
            Id = animalData.Id,
            Name = animalData.Name,
            SpeciesId = animalData.SpeciesId,
            SpeciesCommonName = animalData.SpeciesCommonName,
            SpeciesScientificName = animalData.SpeciesScientificName,
            CategoryId = animalData.CategoryId,
            CategoryName = animalData.CategoryName,
            AnimalListId = animalData.AnimalListId,
            AnimalListName = animalData.AnimalListName,
            ImageUrl = imageUrl,
            CreatedAt = animalData.CreatedAt,
            Gender = animalData.Gender,
            IsLegalAttachmentsRequired = animalData.IsLegalAttachmentsRequired,
            LegalAttachments = animalData.LegalAttachments.Select(la => new LegalAttachmentDto
            {
                Id = la.Id,
                FileName = la.FileName,
                ContentType = la.ContentType,
                FileSizeBytes = la.FileSizeBytes,
                UploadedAt = la.UploadedAt,
                DownloadUrl = $"/api/legal-attachments/{la.Id}"
            })
        };

        return new GetAnimalDetailsResponse
        {
            Animal = animal
        };
    }
}
