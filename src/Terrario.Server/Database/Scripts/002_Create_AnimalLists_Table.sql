-- Migration: Create AnimalLists table
-- Date: 2025-12-10
-- Description: Creates the AnimalLists table for storing user's animal collections

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AnimalLists')
BEGIN
    CREATE TABLE [dbo].[AnimalLists] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [Name] NVARCHAR(100) NOT NULL,
        [Description] NVARCHAR(500) NULL,
        [UserId] NVARCHAR(450) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NULL,
        
        CONSTRAINT [FK_AnimalLists_Users_UserId] 
            FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users] ([Id]) 
            ON DELETE CASCADE
    );

    -- Create index on UserId for faster lookups
    CREATE NONCLUSTERED INDEX [IX_AnimalLists_UserId] 
        ON [dbo].[AnimalLists] ([UserId]);

    PRINT 'Table AnimalLists created successfully.';
END
ELSE
BEGIN
    PRINT 'Table AnimalLists already exists.';
END
GO
