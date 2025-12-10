-- Migration: Create Animals table
-- Date: 2025-12-10
-- Description: Creates the Animals table with foreign keys to Species, AnimalLists, and Users

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Animals')
BEGIN
    CREATE TABLE [dbo].[Animals] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [Name] NVARCHAR(200) NOT NULL,
        [SpeciesId] UNIQUEIDENTIFIER NOT NULL,
        [AnimalListId] UNIQUEIDENTIFIER NOT NULL,
        [ImageUrl] NVARCHAR(500) NULL,
        [UserId] NVARCHAR(450) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NULL,
        
        -- Foreign key constraints
        CONSTRAINT [FK_Animals_Species_SpeciesId] 
            FOREIGN KEY ([SpeciesId]) 
            REFERENCES [dbo].[Species] ([Id])
            ON DELETE NO ACTION,
            
        CONSTRAINT [FK_Animals_AnimalLists_AnimalListId] 
            FOREIGN KEY ([AnimalListId]) 
            REFERENCES [dbo].[AnimalLists] ([Id])
            ON DELETE CASCADE,
            
        CONSTRAINT [FK_Animals_Users_UserId] 
            FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users] ([Id])
            ON DELETE CASCADE
    );

    -- Create indexes for better query performance
    CREATE NONCLUSTERED INDEX [IX_Animals_SpeciesId] 
        ON [dbo].[Animals] ([SpeciesId]);
    
    CREATE NONCLUSTERED INDEX [IX_Animals_AnimalListId] 
        ON [dbo].[Animals] ([AnimalListId]);
    
    CREATE NONCLUSTERED INDEX [IX_Animals_UserId] 
        ON [dbo].[Animals] ([UserId]);
    
    CREATE NONCLUSTERED INDEX [IX_Animals_CreatedAt] 
        ON [dbo].[Animals] ([CreatedAt] DESC);

    PRINT 'Table Animals created successfully.';
END
ELSE
BEGIN
    PRINT 'Table Animals already exists.';
END
GO
