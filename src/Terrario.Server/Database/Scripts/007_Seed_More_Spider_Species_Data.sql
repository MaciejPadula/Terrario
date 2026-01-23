-- Migration: Seed additional Spider species data
-- Date: 2026-01-23
-- Description: Adds more popular captive-bred tarantula species to the Species table.

SET NOCOUNT ON;

DECLARE @SpidersId UNIQUEIDENTIFIER;
SELECT @SpidersId = [Id]
FROM [dbo].[Categories]
WHERE [Name] = 'categories.spiders.name';

IF @SpidersId IS NULL
BEGIN
    PRINT 'Category categories.spiders.name not found. Run 006_Seed_Categories_and_Species_Data.sql first.';
    RETURN;
END

-- Care level IDs (seeded in 005_Seed_CareLevels_Data.sql)
DECLARE @BeginnerId UNIQUEIDENTIFIER = '2a8a3db9-8e26-4ba4-8677-f0aa7f7022ac';
DECLARE @IntermediateId UNIQUEIDENTIFIER = 'debd04e5-ee3e-4ea1-adb3-165a9bb20ef1';
DECLARE @AdvancedId UNIQUEIDENTIFIER = '76c34522-8f8b-4515-a27d-6e2267c9a4e5';

PRINT 'Seeding additional spider species...';

MERGE [dbo].[Species] AS target
USING (VALUES
    (NEWID(), 'species.greenbottleBlueTarantula.name', 'Chromatopelma cyaneopubescens', @SpidersId, 'species.greenbottleBlueTarantula.description', @IntermediateId, 14, 12),
    (NEWID(), 'species.antillesPinktoeTarantula.name', 'Caribena versicolor', @SpidersId, 'species.antillesPinktoeTarantula.description', @IntermediateId, 13, 10),
    (NEWID(), 'species.brazilianGiantWhiteknee.name', 'Acanthoscurria geniculata', @SpidersId, 'species.brazilianGiantWhiteknee.description', @IntermediateId, 22, 15),
    (NEWID(), 'species.brazilianRedandWhite.name', 'Nhandu chromatus', @SpidersId, 'species.brazilianRedandWhite.description', @IntermediateId, 20, 15),
    (NEWID(), 'species.costaRicanStripedKnee.name', 'Aphonopelma seemanni', @SpidersId, 'species.costaRicanStripedKnee.description', @BeginnerId, 14, 20),

    (NEWID(), 'species.arizonaBlondTarantula.name', 'Aphonopelma chalcodes', @SpidersId, 'species.arizonaBlondTarantula.description', @BeginnerId, 13, 30),
    (NEWID(), 'species.brazilianBlackTarantula.name', 'Grammostola pulchra', @SpidersId, 'species.brazilianBlackTarantula.description', @BeginnerId, 18, 25),
    (NEWID(), 'species.pinkZebraBeauty.name', 'Eupalaestrus campestratus', @SpidersId, 'species.pinkZebraBeauty.description', @BeginnerId, 14, 20),
    (NEWID(), 'species.brazilianWhiteknee.name', 'Acanthoscurria paulensis', @SpidersId, 'species.brazilianWhiteknee.description', @IntermediateId, 20, 15),

    (NEWID(), 'species.orangeBaboonTarantula.name', 'Pterinochilus murinus', @SpidersId, 'species.orangeBaboonTarantula.description', @AdvancedId, 14, 12),
    (NEWID(), 'species.togoStarburstTarantula.name', 'Heteroscodra maculata', @SpidersId, 'species.togoStarburstTarantula.description', @AdvancedId, 18, 15),
    (NEWID(), 'species.pumpkinPatchTarantula.name', 'Hapalopus sp. Colombia', @SpidersId, 'species.pumpkinPatchTarantula.description', @IntermediateId, 7, 8),

    (NEWID(), 'species.brazilianWhiteandRed.name', 'Nhandu tripepii', @SpidersId, 'species.brazilianWhiteandRed.description', @IntermediateId, 22, 15),
    (NEWID(), 'species.cameroonRedBaboon.name', 'Hysterocrates gigas', @SpidersId, 'species.cameroonRedBaboon.description', @AdvancedId, 20, 15),
    (NEWID(), 'species.colombianGiantRedleg.name', 'Megaphobema robustum', @SpidersId, 'species.colombianGiantRedleg.description', @IntermediateId, 18, 15),

    (NEWID(), 'species.colombianGiantTarantula.name', 'Pamphobeteus sp. machala', @SpidersId, 'species.colombianGiantTarantula.description', @AdvancedId, 24, 15),
    (NEWID(), 'species.brazilianJewelTarantula.name', 'Typhochlaena seladonia', @SpidersId, 'species.brazilianJewelTarantula.description', @AdvancedId, 3, 12),

    (NEWID(), 'species.mexicanHalfandHalf.name', 'Brachypelma albiceps', @SpidersId, 'species.mexicanHalfandHalf.description', @BeginnerId, 16, 20),
    (NEWID(), 'species.indianOrnamentalTarantula.name', 'Poecilotheria formosa', @SpidersId, 'species.indianOrnamentalTarantula.description', @AdvancedId, 20, 12),
    (NEWID(), 'species.indianVioletTarantula.name', 'Chilobrachys fimbriatus', @SpidersId, 'species.indianVioletTarantula.description', @AdvancedId, 16, 12),

    (NEWID(), 'species.mexicanPinkTarantula.name', 'Brachypelma klaasi', @SpidersId, 'species.mexicanPinkTarantula.description', @BeginnerId, 16, 20),
    (NEWID(), 'species.mexicanRedrumpTarantula.name', 'Tliltocatl vagans', @SpidersId, 'species.mexicanRedrumpTarantula.description', @BeginnerId, 14, 20),

    (NEWID(), 'species.guatemalanTigerRump.name', 'Davus pentaloris', @SpidersId, 'species.guatemalanTigerRump.description', @IntermediateId, 13, 12),
    (NEWID(), 'species.mexicanGoldenRedrump.name', 'Tliltocatl aureoceps', @SpidersId, 'species.mexicanGoldenRedrump.description', @BeginnerId, 14, 20),

    (NEWID(), 'species.brazilianWhitekneeNewWorld.name', 'Acanthoscurria brocklehursti', @SpidersId, 'species.brazilianWhitekneeNewWorld.description', @IntermediateId, 22, 15),

    (NEWID(), 'species.socotraIslandBlueBaboon.name', 'Monocentropus balfouri', @SpidersId, 'species.socotraIslandBlueBaboon.description', @AdvancedId, 13, 15)
) AS source (Id, CommonName, ScientificName, CategoryId, Description, CareLevelId, AdultSizeCm, LifespanYears)
ON target.ScientificName = source.ScientificName
WHEN NOT MATCHED THEN
    INSERT (Id, CommonName, ScientificName, CategoryId, Description, CareLevelId, AdultSizeCm, LifespanYears)
    VALUES (source.Id, source.CommonName, source.ScientificName, source.CategoryId, source.Description, source.CareLevelId, source.AdultSizeCm, source.LifespanYears);

PRINT 'Additional spider species seeded successfully.';
GO
