-- Migration: Create ChatConversations and ChatMessages tables
-- Date: 2026-02-17
-- Description: Creates tables for storing AI assistant chat history

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatConversations')
BEGIN
    CREATE TABLE [dbo].[ChatConversations] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [Title] NVARCHAR(200) NOT NULL,
        [UserId] NVARCHAR(450) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT [FK_ChatConversations_Users_UserId]
            FOREIGN KEY ([UserId])
            REFERENCES [dbo].[Users] ([Id])
            ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX [IX_ChatConversations_UserId]
        ON [dbo].[ChatConversations] ([UserId]);

    CREATE NONCLUSTERED INDEX [IX_ChatConversations_UpdatedAt]
        ON [dbo].[ChatConversations] ([UpdatedAt] DESC);

    PRINT 'Table ChatConversations created successfully.';
END
ELSE
BEGIN
    PRINT 'Table ChatConversations already exists.';
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatMessages')
BEGIN
    CREATE TABLE [dbo].[ChatMessages] (
        [Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWSEQUENTIALID(),
        [ConversationId] UNIQUEIDENTIFIER NOT NULL,
        [Role] NVARCHAR(20) NOT NULL,
        [Content] NVARCHAR(MAX) NOT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT [FK_ChatMessages_ChatConversations_ConversationId]
            FOREIGN KEY ([ConversationId])
            REFERENCES [dbo].[ChatConversations] ([Id])
            ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX [IX_ChatMessages_ConversationId]
        ON [dbo].[ChatMessages] ([ConversationId]);

    CREATE NONCLUSTERED INDEX [IX_ChatMessages_CreatedAt]
        ON [dbo].[ChatMessages] ([CreatedAt]);

    PRINT 'Table ChatMessages created successfully.';
END
ELSE
BEGIN
    PRINT 'Table ChatMessages already exists.';
END
GO
