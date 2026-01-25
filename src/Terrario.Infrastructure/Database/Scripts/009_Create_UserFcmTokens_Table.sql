-- Create UserFcmTokens table
CREATE TABLE [dbo].[UserFcmTokens] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
    [UserId] NVARCHAR (450) NOT NULL,
    [Token] NVARCHAR (MAX) NOT NULL,
    [DeviceId] NVARCHAR (MAX) NULL,
    [CreatedAt] DATETIME2 NOT NULL,
    [UpdatedAt] DATETIME2 NULL,
    CONSTRAINT [PK_UserFcmTokens] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_UserFcmTokens_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([Id]) ON DELETE CASCADE
);

GO
CREATE NONCLUSTERED INDEX [IX_UserFcmTokens_UserId]
    ON [dbo].[UserFcmTokens]([UserId] ASC);