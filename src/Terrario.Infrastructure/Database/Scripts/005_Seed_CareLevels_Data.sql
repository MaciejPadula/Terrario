-- Migration: Seed CareLevels data
-- Date: 2026-01-16
-- Description: Seeds initial data for CareLevels table

-- Declare care level IDs (using fixed GUIDs for consistency)
DECLARE @BeginnerId UNIQUEIDENTIFIER = '2a8a3db9-8e26-4ba4-8677-f0aa7f7022ac';
DECLARE @IntermediateId UNIQUEIDENTIFIER = 'debd04e5-ee3e-4ea1-adb3-165a9bb20ef1';
DECLARE @AdvancedId UNIQUEIDENTIFIER = '76c34522-8f8b-4515-a27d-6e2267c9a4e5';

IF NOT EXISTS (SELECT * FROM [dbo].[CareLevels] WHERE Name = 'careLevels.beginner')
BEGIN
    INSERT INTO [dbo].[CareLevels] (Id, Name, DisplayOrder)
    VALUES (@BeginnerId, 'careLevels.beginner', 1);
    PRINT 'CareLevel careLevels.beginner added.';
END

IF NOT EXISTS (SELECT * FROM [dbo].[CareLevels] WHERE Name = 'careLevels.intermediate')
BEGIN
    INSERT INTO [dbo].[CareLevels] (Id, Name, DisplayOrder)
    VALUES (@IntermediateId, 'careLevels.intermediate', 2);
    PRINT 'CareLevel careLevels.intermediate added.';
END

IF NOT EXISTS (SELECT * FROM [dbo].[CareLevels] WHERE Name = 'careLevels.advanced')
BEGIN
    INSERT INTO [dbo].[CareLevels] (Id, Name, DisplayOrder)
    VALUES (@AdvancedId, 'careLevels.advanced', 3);
    PRINT 'CareLevel careLevels.advanced added.';
END

PRINT 'CareLevels seeding completed.';