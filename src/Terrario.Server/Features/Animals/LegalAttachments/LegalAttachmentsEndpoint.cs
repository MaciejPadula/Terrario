using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Terrario.Infrastructure.Database;
using Terrario.Server.Features.Images;

namespace Terrario.Server.Features.Animals.LegalAttachments;

/// <summary>
/// Endpoints for managing legal attachments on animals and serving attachment files
/// </summary>
public static class LegalAttachmentsEndpoint
{
    public static void MapLegalAttachmentsEndpoints(this IEndpointRouteBuilder app)
    {
        // POST /api/animals/{animalId}/legal-attachments  – upload
        app.MapPost("/api/animals/{animalId:guid}/legal-attachments",
            [Authorize] async (
                [FromRoute] Guid animalId,
                [FromForm] IFormFile file,
                [FromServices] UploadLegalAttachmentHandler handler,
                ClaimsPrincipal user) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User not authenticated");

            var request = new UploadLegalAttachmentRequest
            {
                AnimalId = animalId,
                UserId = userId,
                File = file
            };

            UploadLegalAttachmentResponse? result;
            try
            {
                result = await handler.HandleAsync(request);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { message = ex.Message });
            }

            return result is null
                ? Results.NotFound(new { message = "Animal not found" })
                : Results.Ok(result);
        })
        .WithName("UploadLegalAttachment")
        .WithTags("Animals")
        .DisableAntiforgery()
        .Produces<UploadLegalAttachmentResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized);

        // GET /api/animals/{animalId}/legal-attachments  – list
        app.MapGet("/api/animals/{animalId:guid}/legal-attachments",
            [Authorize] async (
                [FromRoute] Guid animalId,
                [FromServices] GetLegalAttachmentsHandler handler,
                ClaimsPrincipal user,
                CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var result = await handler.HandleAsync(animalId, userId, cancellationToken);
            return result is null
                ? Results.NotFound(new { message = "Animal not found" })
                : Results.Ok(result);
        })
        .WithName("GetLegalAttachments")
        .WithTags("Animals")
        .Produces<GetLegalAttachmentsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized);

        // DELETE /api/animals/legal-attachments/{attachmentId}  – delete
        app.MapDelete("/api/animals/legal-attachments/{attachmentId:guid}",
            [Authorize] async (
                [FromRoute] Guid attachmentId,
                [FromServices] DeleteLegalAttachmentHandler handler,
                ClaimsPrincipal user,
                CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            var result = await handler.HandleAsync(attachmentId, userId, cancellationToken);
            return result is null
                ? Results.NotFound(new { message = "Attachment not found" })
                : Results.Ok(result);
        })
        .WithName("DeleteLegalAttachment")
        .WithTags("Animals")
        .Produces<DeleteLegalAttachmentResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized);

        // GET /api/legal-attachments/{attachmentId}  – download file (auth required)
        app.MapGet("/api/legal-attachments/{attachmentId:guid}",
            [Authorize] async (
                [FromRoute] Guid attachmentId,
                [FromServices] IDocumentStorageService documentStorage,
                [FromServices] ApplicationDbContext db,
                ClaimsPrincipal user,
                CancellationToken cancellationToken) =>
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Results.Unauthorized();

            // Verify ownership
            var attachment = await db.AnimalLegalAttachments
                .Include(a => a.Animal)
                .FirstOrDefaultAsync(
                    a => a.Id == attachmentId && a.Animal.UserId == userId,
                    cancellationToken);

            if (attachment == null)
                return Results.NotFound();

            var fileData = await documentStorage.GetDocumentAsync(attachmentId);
            if (fileData == null)
                return Results.NotFound();

            var (data, contentType, fileName) = fileData.Value;
            return Results.File(data, contentType, fileName);
        })
        .WithName("DownloadLegalAttachment")
        .WithTags("Animals")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status401Unauthorized);
    }
}
