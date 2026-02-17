-- Migration: Add additional snake species
-- Date: 2026-02-17
-- Description: Adds more snake species including various Lampropeltis, pythons and other popular species

-- Resolve category and care level IDs
DECLARE @SnakesId UNIQUEIDENTIFIER;
SELECT @SnakesId = Id FROM [dbo].[Categories] WHERE Name = 'categories.snakes.name';

DECLARE @BeginnerId UNIQUEIDENTIFIER = '2a8a3db9-8e26-4ba4-8677-f0aa7f7022ac';
DECLARE @IntermediateId UNIQUEIDENTIFIER = 'debd04e5-ee3e-4ea1-adb3-165a9bb20ef1';
DECLARE @AdvancedId UNIQUEIDENTIFIER = '76c34522-8f8b-4515-a27d-6e2267c9a4e5';

PRINT 'Adding additional snake species...';

MERGE [dbo].[Species] AS target
USING (VALUES
-- Lampropeltis (kingsnakes & milk snakes)
(NEWID(), 'species.mexicanBlackKingsnake.name', 'Lampropeltis getula nigrita', @SnakesId, 'species.mexicanBlackKingsnake.description', @BeginnerId, 120, 20),
(NEWID(), 'species.brooksMilkSnake.name', 'Lampropeltis triangulum brooksi', @SnakesId, 'species.brooksMilkSnake.description', @BeginnerId, 100, 15),
(NEWID(), 'species.sinaloaMilkSnake.name', 'Lampropeltis triangulum sinaloae', @SnakesId, 'species.sinaloaMilkSnake.description', @BeginnerId, 120, 15),
(NEWID(), 'species.pueblanMilkSnake.name', 'Lampropeltis triangulum campbelli', @SnakesId, 'species.pueblanMilkSnake.description', @BeginnerId, 90, 15),
(NEWID(), 'species.nelsonsMilkSnake.name', 'Lampropeltis triangulum nelsoni', @SnakesId, 'species.nelsonsMilkSnake.description', @BeginnerId, 110, 15),
(NEWID(), 'species.easternMilkSnake.name', 'Lampropeltis triangulum triangulum', @SnakesId, 'species.easternMilkSnake.description', @IntermediateId, 90, 15),
(NEWID(), 'species.floridaKingsnake.name', 'Lampropeltis getula floridana', @SnakesId, 'species.floridaKingsnake.description', @BeginnerId, 140, 20),
(NEWID(), 'species.speckledKingsnake.name', 'Lampropeltis holbrooki', @SnakesId, 'species.speckledKingsnake.description', @BeginnerId, 120, 20),
(NEWID(), 'species.grayBandedKingsnake.name', 'Lampropeltis alterna', @SnakesId, 'species.grayBandedKingsnake.description', @IntermediateId, 100, 20),
(NEWID(), 'species.thayeriKingsnake.name', 'Lampropeltis mexicana thayeri', @SnakesId, 'species.thayeriKingsnake.description', @IntermediateId, 100, 18),

-- Pythons
(NEWID(), 'species.wamaPython.name', 'Aspidites ramsayi', @SnakesId, 'species.wamaPython.description', @IntermediateId, 200, 20),
(NEWID(), 'species.blackHeadedPython.name', 'Aspidites melanocephalus', @SnakesId, 'species.blackHeadedPython.description', @IntermediateId, 200, 20),
(NEWID(), 'species.spottedPython.name', 'Antaresia maculosa', @SnakesId, 'species.spottedPython.description', @BeginnerId, 100, 20),
(NEWID(), 'species.stimsonsPython.name', 'Antaresia stimsoni', @SnakesId, 'species.stimsonsPython.description', @BeginnerId, 100, 20),
(NEWID(), 'species.jungleCarpetPython.name', 'Morelia spilota cheynei', @SnakesId, 'species.jungleCarpetPython.description', @IntermediateId, 200, 20),
(NEWID(), 'species.olivesPython.name', 'Liasis olivaceus', @SnakesId, 'species.olivesPython.description', @AdvancedId, 400, 25),
(NEWID(), 'species.whiteLabiaPython.name', 'Leiopython albertisii', @SnakesId, 'species.whiteLabiaPython.description', @IntermediateId, 200, 20),
(NEWID(), 'species.macklotsPython.name', 'Liasis mackloti', @SnakesId, 'species.macklotsPython.description', @IntermediateId, 200, 20),
(NEWID(), 'species.boeleniPython.name', 'Simalia boeleni', @SnakesId, 'species.boeleniPython.description', @AdvancedId, 250, 20),
(NEWID(), 'species.burmesePythonBivittatus.name', 'Python bivittatus', @SnakesId, 'species.burmesePythonBivittatus.description', @AdvancedId, 500, 25),

-- Boas & others
(NEWID(), 'species.emeraldTreeBoa.name', 'Corallus caninus', @SnakesId, 'species.emeraldTreeBoa.description', @AdvancedId, 200, 20),
(NEWID(), 'species.amazonTreeBoa.name', 'Corallus hortulana', @SnakesId, 'species.amazonTreeBoa.description', @IntermediateId, 180, 20),
(NEWID(), 'species.dumerisBoa.name', 'Acrantophis dumerili', @SnakesId, 'species.dumerisBoa.description', @IntermediateId, 200, 20),
(NEWID(), 'species.kenyanSandBoa.name', 'Gongylophis colubrinus', @SnakesId, 'species.kenyanSandBoa.description', @BeginnerId, 70, 20),
(NEWID(), 'species.roughScaledSandBoa.name', 'Gongylophis conicus', @SnakesId, 'species.roughScaledSandBoa.description', @IntermediateId, 80, 15),
(NEWID(), 'species.hognosSnake.name', 'Heterodon nasicus', @SnakesId, 'species.hognosSnake.description', @BeginnerId, 60, 18),
(NEWID(), 'species.easternHognosSnake.name', 'Heterodon platirhinos', @SnakesId, 'species.easternHognosSnake.description', @IntermediateId, 80, 18),
(NEWID(), 'species.ratSnake.name', 'Pantherophis obsoletus', @SnakesId, 'species.ratSnake.description', @BeginnerId, 180, 20),
(NEWID(), 'species.blackRatSnake.name', 'Pantherophis alleghaniensis', @SnakesId, 'species.blackRatSnake.description', @BeginnerId, 180, 20),
(NEWID(), 'species.russianRatSnake.name', 'Elaphe schrenckii', @SnakesId, 'species.russianRatSnake.description', @IntermediateId, 180, 18),
(NEWID(), 'species.mandarinRatSnake.name', 'Euprepiophis mandarinus', @SnakesId, 'species.mandarinRatSnake.description', @AdvancedId, 140, 15),
(NEWID(), 'species.beautySnake.name', 'Orthriophis taeniurus', @SnakesId, 'species.beautySnake.description', @IntermediateId, 200, 18)
) AS source (Id, CommonName, ScientificName, CategoryId, Description, CareLevelId, AdultSizeCm, LifespanYears)
ON target.ScientificName = source.ScientificName
WHEN NOT MATCHED THEN
INSERT (Id, CommonName, ScientificName, CategoryId, Description, CareLevelId, AdultSizeCm, LifespanYears)
VALUES (source.Id, source.CommonName, source.ScientificName, source.CategoryId, source.Description, source.CareLevelId, source.AdultSizeCm, source.LifespanYears);

PRINT 'Additional snake species seeded successfully.';
GO
