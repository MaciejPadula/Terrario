-- Migration: Add IsLegalAttachmentsRequired to Species and create AnimalLegalAttachments table
-- Date: 2026-03-09
-- Description: Adds a boolean flag to Species indicating whether animals of that species require
--              legal documentation (e.g. CITES permits), and creates the AnimalLegalAttachments
--              table for storing references to uploaded documents.

-- ============================================================
-- 1. Add IsLegalAttachmentsRequired column to Species
-- ============================================================
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'[dbo].[Species]')
      AND name = 'IsLegalAttachmentsRequired'
)
BEGIN
    ALTER TABLE [dbo].[Species]
    ADD [IsLegalAttachmentsRequired] BIT NOT NULL DEFAULT 0;

    PRINT 'Column IsLegalAttachmentsRequired added to Species.';
END
ELSE
BEGIN
    PRINT 'Column IsLegalAttachmentsRequired already exists in Species.';
END
GO

-- ============================================================
-- 2. Create AnimalLegalAttachments table
-- ============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AnimalLegalAttachments')
BEGIN
    CREATE TABLE [dbo].[AnimalLegalAttachments] (
        [Id]            UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [AnimalId]      UNIQUEIDENTIFIER NOT NULL,
        [UserId]        NVARCHAR(450)    NOT NULL,
        [FileName]      NVARCHAR(300)    NOT NULL,
        [ContentType]   NVARCHAR(100)    NOT NULL,
        [FileSizeBytes] BIGINT           NOT NULL,
        [UploadedAt]    DATETIME2        NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT [FK_AnimalLegalAttachments_Animals_AnimalId]
            FOREIGN KEY ([AnimalId])
            REFERENCES [dbo].[Animals] ([Id])
            ON DELETE CASCADE,

        CONSTRAINT [FK_AnimalLegalAttachments_Users_UserId]
            FOREIGN KEY ([UserId])
            REFERENCES [dbo].[Users] ([Id])
            ON DELETE NO ACTION
    );

    CREATE NONCLUSTERED INDEX [IX_AnimalLegalAttachments_AnimalId]
        ON [dbo].[AnimalLegalAttachments] ([AnimalId]);

    CREATE NONCLUSTERED INDEX [IX_AnimalLegalAttachments_UserId]
        ON [dbo].[AnimalLegalAttachments] ([UserId]);

    CREATE NONCLUSTERED INDEX [IX_AnimalLegalAttachments_UploadedAt]
        ON [dbo].[AnimalLegalAttachments] ([UploadedAt] DESC);

    PRINT 'Table AnimalLegalAttachments created successfully.';
END
ELSE
BEGIN
    PRINT 'Table AnimalLegalAttachments already exists.';
END
GO
