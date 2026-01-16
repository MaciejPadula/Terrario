-- Migration: Create Categories, CareLevels and Species tables
-- Date: 2025-12-10
-- Description: Creates Categories, CareLevels and Species tables with proper foreign key relationships

-- Create Categories table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE [dbo].[Categories] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [Name] NVARCHAR(100) NOT NULL,
        [Description] NVARCHAR(500) NULL,
        [Icon] NVARCHAR(50) NULL,
        [DisplayOrder] INT NOT NULL DEFAULT 0,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    CREATE NONCLUSTERED INDEX [IX_Categories_DisplayOrder] 
        ON [dbo].[Categories] ([DisplayOrder]);

    PRINT 'Table Categories created successfully.';
END
ELSE
BEGIN
    PRINT 'Table Categories already exists.';
END
GO

-- Create CareLevels table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CareLevels')
BEGIN
    CREATE TABLE [dbo].[CareLevels] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [Name] NVARCHAR(100) NOT NULL,
        [DisplayOrder] INT NOT NULL DEFAULT 0,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );

    CREATE NONCLUSTERED INDEX [IX_CareLevels_DisplayOrder]
        ON [dbo].[CareLevels] ([DisplayOrder]);

    PRINT 'Table CareLevels created successfully.';
END
ELSE
BEGIN
    PRINT 'Table CareLevels already exists.';
END
GO

-- Create Species table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Species')
BEGIN
    CREATE TABLE [dbo].[Species] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [CommonName] NVARCHAR(200) NOT NULL,
        [ScientificName] NVARCHAR(300) NULL,
        [CategoryId] UNIQUEIDENTIFIER NOT NULL,
        [Description] NVARCHAR(2000) NULL,
        [ImageUrl] NVARCHAR(500) NULL,
        [CareLevelId] UNIQUEIDENTIFIER NULL,
        [AdultSizeCm] INT NULL,
        [LifespanYears] INT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        
        CONSTRAINT [FK_Species_Categories_CategoryId] 
            FOREIGN KEY ([CategoryId]) 
            REFERENCES [dbo].[Categories] ([Id])
            ON DELETE NO ACTION,
        CONSTRAINT [FK_Species_CareLevels_CareLevelId] 
            FOREIGN KEY ([CareLevelId]) 
            REFERENCES [dbo].[CareLevels] ([Id])
            ON DELETE NO ACTION
    );

    CREATE NONCLUSTERED INDEX [IX_Species_CategoryId] 
        ON [dbo].[Species] ([CategoryId]);

    CREATE NONCLUSTERED INDEX [IX_Species_CareLevelId] 
        ON [dbo].[Species] ([CareLevelId]);
    
    CREATE NONCLUSTERED INDEX [IX_Species_CommonName] 
        ON [dbo].[Species] ([CommonName]);

    PRINT 'Table Species created successfully.';
END
ELSE
BEGIN
    PRINT 'Table Species already exists.';
END
GO
