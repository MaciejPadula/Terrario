-- Create Reminders table
CREATE TABLE [dbo].[Reminders] (
    [Id] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [Title] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(MAX) NULL,
    [ReminderDateTime] DATETIME2 NOT NULL,
    [IsRecurring] BIT NOT NULL DEFAULT 0,
    [RecurrencePattern] NVARCHAR(50) NULL, -- e.g., 'daily', 'weekly', 'monthly'
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2 NULL,
    [UserId] NVARCHAR(450) NOT NULL,
    [AnimalId] UNIQUEIDENTIFIER NULL,
    CONSTRAINT [FK_Reminders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reminders_Animals_AnimalId] FOREIGN KEY ([AnimalId]) REFERENCES [dbo].[Animals]([Id]) ON DELETE NO ACTION
);

-- Create index on UserId for performance
CREATE INDEX [IX_Reminders_UserId] ON [dbo].[Reminders] ([UserId]);

-- Create index on AnimalId
CREATE INDEX [IX_Reminders_AnimalId] ON [dbo].[Reminders] ([AnimalId]);

-- Create index on ReminderDateTime for querying upcoming reminders
CREATE INDEX [IX_Reminders_ReminderDateTime] ON [dbo].[Reminders] ([ReminderDateTime]);