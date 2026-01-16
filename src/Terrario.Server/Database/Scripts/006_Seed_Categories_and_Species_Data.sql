-- Migration: Seed Categories and Species data
-- Date: 2025-12-10
-- Description: Seeds initial data for Categories and Species tables

-- Declare category IDs
DECLARE @SpidersId UNIQUEIDENTIFIER = NEWID();
DECLARE @LizardsId UNIQUEIDENTIFIER = NEWID();
DECLARE @SnakesId UNIQUEIDENTIFIER = NEWID();
DECLARE @FrogsId UNIQUEIDENTIFIER = NEWID();
DECLARE @SalamandersId UNIQUEIDENTIFIER = NEWID();
DECLARE @TurtlesId UNIQUEIDENTIFIER = NEWID();
DECLARE @OtherId UNIQUEIDENTIFIER = NEWID();

-- Declare care level IDs
DECLARE @BeginnerId UNIQUEIDENTIFIER = '2a8a3db9-8e26-4ba4-8677-f0aa7f7022ac';
DECLARE @IntermediateId UNIQUEIDENTIFIER = 'debd04e5-ee3e-4ea1-adb3-165a9bb20ef1';
DECLARE @AdvancedId UNIQUEIDENTIFIER = '76c34522-8f8b-4515-a27d-6e2267c9a4e5';

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE Name = 'categories.spiders.name')
BEGIN
    INSERT INTO [dbo].[Categories] (Id, Name, Description, Icon, DisplayOrder)
    VALUES (@SpidersId, 'categories.spiders.name', 'categories.spiders.description', '🕷️', 1);
    PRINT 'Category categories.spiders.name added.';
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE Name = 'categories.lizards.name')
BEGIN
    INSERT INTO [dbo].[Categories] (Id, Name, Description, Icon, DisplayOrder)
    VALUES (@LizardsId, 'categories.lizards.name', 'categories.lizards.description', '🦎', 2);
    PRINT 'Category categories.lizards.name added.';
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE Name = 'categories.snakes.name')
BEGIN
    INSERT INTO [dbo].[Categories] (Id, Name, Description, Icon, DisplayOrder)
    VALUES (@SnakesId, 'categories.snakes.name', 'categories.snakes.description', '🐍', 3);
    PRINT 'Category categories.snakes.name added.';
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE Name = 'categories.frogs.name')
BEGIN
    INSERT INTO [dbo].[Categories] (Id, Name, Description, Icon, DisplayOrder)
    VALUES (@FrogsId, 'categories.frogs.name', 'categories.frogs.description', '🐸', 4);
    PRINT 'Category categories.frogs.name added.';
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE Name = 'categories.salamanders.name')
BEGIN
    INSERT INTO [dbo].[Categories] (Id, Name, Description, Icon, DisplayOrder)
    VALUES (@SalamandersId, 'categories.salamanders.name', 'categories.salamanders.description', '🦎', 5);
    PRINT 'Category categories.salamanders.name added.';
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE Name = 'categories.turtles.name')
BEGIN
    INSERT INTO [dbo].[Categories] (Id, Name, Description, Icon, DisplayOrder)
    VALUES (@TurtlesId, 'categories.turtles.name', 'categories.turtles.description', '🐢', 6);
    PRINT 'Category categories.turtles.name added.';
END

IF NOT EXISTS (SELECT * FROM [dbo].[Categories] WHERE Name = 'categories.other.name')
BEGIN
    INSERT INTO [dbo].[Categories] (Id, Name, Description, Icon, DisplayOrder)
    VALUES (@OtherId, 'categories.other.name', 'categories.other.description', '🦗', 7);
    PRINT 'Category categories.other.name added.';
END

PRINT 'Categories seeding completed.';

    -- Seed Species
    PRINT 'Seeding species...';

MERGE [dbo].[Species] AS target
USING (VALUES
(NEWID(), 'species.chacoGoldenKnee.name', 'Brachypelma smithi', @SpidersId, 'species.chacoGoldenKnee.description', @BeginnerId, 15, 25),
(NEWID(), 'species.roseHair.name', 'Grammostola rosea', @SpidersId, 'species.roseHair.description', @BeginnerId, 13, 20),
(NEWID(), 'species.tigerRumpTarantula.name', 'Poecilotheria regalis', @SpidersId, 'species.tigerRumpTarantula.description', @AdvancedId, 20, 12),
(NEWID(), 'species.pinkToeTarantula.name', 'Avicularia avicularia', @SpidersId, 'species.pinkToeTarantula.description', @IntermediateId, 13, 10),
(NEWID(), 'species.mexicanRedkneeTarantula.name', 'Brachypelma hamorii', @SpidersId, 'species.mexicanRedkneeTarantula.description', @BeginnerId, 16, 20),
(NEWID(), 'species.curlyHairTarantula.name', 'Tliltocatl albopilosum', @SpidersId, 'species.curlyHairTarantula.description', @IntermediateId, 18, 15),
(NEWID(), 'species.salmonPinkBirdeater.name', 'Lasiodora parahybana', @SpidersId, 'species.salmonPinkBirdeater.description', @IntermediateId, 25, 15),
(NEWID(), 'species.sunTarantula.name', 'Psalmopoeus irminia', @SpidersId, 'species.sunTarantula.description', @AdvancedId, 15, 12),
(NEWID(), 'species.goliathBirdeater.name', 'Theraphosa blondi', @SpidersId, 'species.goliathBirdeater.description', @AdvancedId, 30, 25),
(NEWID(), 'species.mexicanFireLegTarantula.name', 'Brachypelma boehmei', @SpidersId, 'species.mexicanFireLegTarantula.description', @BeginnerId, 16, 20),
(NEWID(), 'species.mexicanRustRumpTarantula.name', 'Brachypelma emilia', @SpidersId, 'species.mexicanRustRumpTarantula.description', @BeginnerId, 14, 20),
(NEWID(), 'species.goldenChacoTarantula.name', 'Grammostola iheringi', @SpidersId, 'species.goldenChacoTarantula.description', @IntermediateId, 20, 15),
(NEWID(), 'species.costaRicanZebraTarantula.name', 'Grammostola porteri', @SpidersId, 'species.costaRicanZebraTarantula.description', @IntermediateId, 18, 15),
(NEWID(), 'species.trinidadChevronTarantula.name', 'Psalmopoeus cambridgei', @SpidersId, 'species.trinidadChevronTarantula.description', @AdvancedId, 16, 12),
(NEWID(), 'species.panamanianBlondTarantula.name', 'Psalmopoeus pulcher', @SpidersId, 'species.panamanianBlondTarantula.description', @AdvancedId, 15, 10),
(NEWID(), 'species.sapphireOrnamentalTarantula.name', 'Poecilotheria metallica', @SpidersId, 'species.sapphireOrnamentalTarantula.description', @AdvancedId, 18, 12),
(NEWID(), 'species.fringedOrnamentalTarantula.name', 'Poecilotheria ornata', @SpidersId, 'species.fringedOrnamentalTarantula.description', @AdvancedId, 20, 12),
(NEWID(), 'species.pinkFootTarantula.name', 'Avicularia juruensis', @SpidersId, 'species.pinkFootTarantula.description', @IntermediateId, 14, 12),
(NEWID(), 'species.purplePinkToeTarantula.name', 'Avicularia purpurea', @SpidersId, 'species.purplePinkToeTarantula.description', @IntermediateId, 13, 10),
(NEWID(), 'species.brazilianSalmonPinkBirdeater.name', 'Lasiodora klugi', @SpidersId, 'species.brazilianSalmonPinkBirdeater.description', @IntermediateId, 22, 15),
(NEWID(), 'species.pinkFootGoliathBirdeater.name', 'Theraphosa apophysis', @SpidersId, 'species.pinkFootGoliathBirdeater.description', @AdvancedId, 28, 20),
(NEWID(), 'species.asianBeautyTarantula.name', 'Chilobrachys dyscolus', @SpidersId, 'species.asianBeautyTarantula.description', @AdvancedId, 16, 12),
(NEWID(), 'species.cobaltBlueTarantula.name', 'Haplopelma lividum', @SpidersId, 'species.cobaltBlueTarantula.description', @AdvancedId, 18, 10),
(NEWID(), 'species.blackVelvetTarantula.name', 'Lampropelma nigerrimum', @SpidersId, 'species.blackVelvetTarantula.description', @IntermediateId, 20, 15),
(NEWID(), 'species.leopardGecko.name', 'Eublepharis macularius', @LizardsId, 'species.leopardGecko.description', @BeginnerId, 25, 15),
(NEWID(), 'species.crestedGecko.name', 'Correlophus ciliatus', @LizardsId, 'species.crestedGecko.description', @BeginnerId, 20, 15),
(NEWID(), 'species.beardedDragon.name', 'Pogona vitticeps', @LizardsId, 'species.beardedDragon.description', @IntermediateId, 50, 12),
(NEWID(), 'species.veiledChameleon.name', 'Chamaeleo calyptratus', @LizardsId, 'species.veiledChameleon.description', @AdvancedId, 45, 8),
(NEWID(), 'species.blueTongueSkink.name', 'Tiliqua scincoides', @LizardsId, 'species.blueTongueSkink.description', @IntermediateId, 50, 20),
(NEWID(), 'species.tokayGecko.name', 'Gekko gecko', @LizardsId, 'species.tokayGecko.description', @IntermediateId, 35, 10),
(NEWID(), 'species.dayGecko.name', 'Phelsuma dubia', @LizardsId, 'species.dayGecko.description', @BeginnerId, 15, 8),
(NEWID(), 'species.greenAnole.name', 'Anolis carolinensis', @LizardsId, 'species.greenAnole.description', @BeginnerId, 20, 5),
(NEWID(), 'species.chineseWaterDragon.name', 'Physignathus cocincinus', @LizardsId, 'species.chineseWaterDragon.description', @AdvancedId, 100, 15),
(NEWID(), 'species.pantherChameleon.name', 'Furcifer pardalis', @LizardsId, 'species.pantherChameleon.description', @AdvancedId, 50, 8),
(NEWID(), 'species.greenIguana.name', 'Iguana iguana', @LizardsId, 'species.greenIguana.description', @AdvancedId, 150, 20),
(NEWID(), 'species.greenBasilisk.name', 'Basiliscus plumifrons', @LizardsId, 'species.greenBasilisk.description', @IntermediateId, 75, 10),
(NEWID(), 'species.desertUromastyx.name', 'Uromastyx acanthinura', @LizardsId, 'species.desertUromastyx.description', @IntermediateId, 40, 20),
(NEWID(), 'species.madagascarGecko.name', 'Phelsuma standingi', @LizardsId, 'species.madagascarGecko.description', @IntermediateId, 12, 8),
(NEWID(), 'species.steppeAgama.name', 'Trapelus agilis', @LizardsId, 'species.steppeAgama.description', @BeginnerId, 25, 8),
(NEWID(), 'species.cornSnake.name', 'Pantherophis guttatus', @SnakesId, 'species.cornSnake.description', @BeginnerId, 150, 20),
(NEWID(), 'species.ballPython.name', 'Python regius', @SnakesId, 'species.ballPython.description', @BeginnerId, 120, 30),
(NEWID(), 'species.greenTreePython.name', 'Morelia viridis', @SnakesId, 'species.greenTreePython.description', @IntermediateId, 180, 20),
(NEWID(), 'species.boaConstrictor.name', 'Boa constrictor', @SnakesId, 'species.boaConstrictor.description', @IntermediateId, 250, 25),
(NEWID(), 'species.honduranMilkSnake.name', 'Lampropeltis triangulum hondurensis', @SnakesId, 'species.honduranMilkSnake.description', @BeginnerId, 120, 15),
(NEWID(), 'species.reticulatedPython.name', 'Python reticulatus', @SnakesId, 'species.reticulatedPython.description', @AdvancedId, 600, 25),
(NEWID(), 'species.burmesePython.name', 'Python molurus', @SnakesId, 'species.burmesePython.description', @AdvancedId, 400, 25),
(NEWID(), 'species.rainbowBoa.name', 'Epicrates cenchria', @SnakesId, 'species.rainbowBoa.description', @IntermediateId, 150, 20),
(NEWID(), 'species.kingsnake.name', 'Lampropeltis getula', @SnakesId, 'species.kingsnake.description', @BeginnerId, 100, 15),
(NEWID(), 'species.childrenPython.name', 'Antaresia childreni', @SnakesId, 'species.childrenPython.description', @BeginnerId, 80, 20),
(NEWID(), 'species.californiaKingsnake.name', 'Pantherophis guttatus guttatus', @SnakesId, 'species.californiaKingsnake.description', @BeginnerId, 120, 20),
(NEWID(), 'species.jamaicanBoa.name', 'Epicrates subflavus', @SnakesId, 'species.jamaicanBoa.description', @IntermediateId, 200, 25),
(NEWID(), 'species.scarletKingsnake.name', 'Lampropeltis triangulum elapsoides', @SnakesId, 'species.scarletKingsnake.description', @AdvancedId, 120, 15),
(NEWID(), 'species.carpetPython.name', 'Morelia spilota', @SnakesId, 'species.carpetPython.description', @AdvancedId, 300, 20),
(NEWID(), 'species.rosyBoa.name', 'Lichanura trivirgata', @SnakesId, 'species.rosyBoa.description', @IntermediateId, 120, 20),
(NEWID(), 'species.redEyedTreeFrog.name', 'Agalychnis callidryas', @FrogsId, 'species.redEyedTreeFrog.description', @IntermediateId, 7, 5),
(NEWID(), 'species.tinctoriusPoisonDartFrog.name', 'Dendrobates tinctorius', @FrogsId, 'species.tinctoriusPoisonDartFrog.description', @AdvancedId, 5, 10),
(NEWID(), 'species.ornatePacmanFrog.name', 'Ceratophrys ornata', @FrogsId, 'species.ornatePacmanFrog.description', @BeginnerId, 15, 8),
(NEWID(), 'species.caneToad.name', 'Rhinella marina', @FrogsId, 'species.caneToad.description', @BeginnerId, 20, 10),
(NEWID(), 'species.whiteLippedTreeFrog.name', 'Polypedates leucomystax', @FrogsId, 'species.whiteLippedTreeFrog.description', @IntermediateId, 8, 8),
(NEWID(), 'species.azureusPoisonDartFrog.name', 'Dendrobates azureus', @FrogsId, 'species.azureusPoisonDartFrog.description', @AdvancedId, 4, 8),
(NEWID(), 'species.tomatoFrog.name', 'Dyscophus antongilii', @FrogsId, 'species.tomatoFrog.description', @IntermediateId, 10, 6),
(NEWID(), 'species.blueGlassFrog.name', 'Agalychnis annae', @FrogsId, 'species.blueGlassFrog.description', @AdvancedId, 6, 5),
(NEWID(), 'species.chacoanHornedFrog.name', 'Ceratophrys cranwelli', @FrogsId, 'species.chacoanHornedFrog.description', @BeginnerId, 18, 8),
(NEWID(), 'species.goldenPoisonDartFrog.name', 'Phyllobates terribilis', @FrogsId, 'species.goldenPoisonDartFrog.description', @AdvancedId, 5, 10),
(NEWID(), 'species.surinamHornedFrog.name', 'Ceratophrys cornuta', @FrogsId, 'species.surinamHornedFrog.description', @BeginnerId, 20, 8),
(NEWID(), 'species.moreletsTreeFrog.name', 'Agalychnis moreletii', @FrogsId, 'species.moreletsTreeFrog.description', @IntermediateId, 7, 5),
(NEWID(), 'species.africanClawedFrog.name', 'Xenopus laevis', @FrogsId, 'species.africanClawedFrog.description', @BeginnerId, 12, 15),
(NEWID(), 'species.mantellaFrog.name', 'Mantella aurantiaca', @FrogsId, 'species.mantellaFrog.description', @AdvancedId, 3, 8),
(NEWID(), 'species.whiteTreeFrog.name', 'Litoria caerulea', @FrogsId, 'species.whiteTreeFrog.description', @IntermediateId, 10, 10),
(NEWID(), 'species.mexicanAxolotl.name', 'Ambystoma mexicanum', @SalamandersId, 'species.mexicanAxolotl.description', @IntermediateId, 25, 15),
(NEWID(), 'species.fireSalamander.name', 'Salamandra salamandra', @SalamandersId, 'species.fireSalamander.description', @IntermediateId, 20, 20),
(NEWID(), 'species.tigerSalamander.name', 'Ambystoma tigrinum', @SalamandersId, 'species.tigerSalamander.description', @IntermediateId, 30, 15),
(NEWID(), 'species.crestedNewt.name', 'Triturus cristatus', @SalamandersId, 'species.crestedNewt.description', @IntermediateId, 18, 12),
(NEWID(), 'species.whiteAxolotl.name', 'Ambystoma mexicanum', @SalamandersId, 'species.whiteAxolotl.description', @IntermediateId, 25, 15),
(NEWID(), 'species.caveSalamander.name', 'Eurycea lucifuga', @SalamandersId, 'species.caveSalamander.description', @AdvancedId, 15, 10),
(NEWID(), 'species.alpineNewt.name', 'Ichthyosaura alpestris', @SalamandersId, 'species.alpineNewt.description', @IntermediateId, 10, 8),
(NEWID(), 'species.californiaNewt.name', 'Taricha torosa', @SalamandersId, 'species.californiaNewt.description', @AdvancedId, 20, 15),
(NEWID(), 'species.blackAxolotl.name', 'Ambystoma mexicanum', @SalamandersId, 'species.blackAxolotl.description', @IntermediateId, 25, 15),
(NEWID(), 'species.redEaredSlider.name', 'Trachemys scripta elegans', @TurtlesId, 'species.redEaredSlider.description', @BeginnerId, 30, 40),
(NEWID(), 'species.greekTortoise.name', 'Testudo graeca', @TurtlesId, 'species.greekTortoise.description', @IntermediateId, 25, 50),
(NEWID(), 'species.leopardTortoise.name', 'Stigmochelys pardalis', @TurtlesId, 'species.leopardTortoise.description', @AdvancedId, 60, 80),
(NEWID(), 'species.yellowBelliedSlider.name', 'Mauremys mutica', @TurtlesId, 'species.yellowBelliedSlider.description', @IntermediateId, 25, 30),
(NEWID(), 'species.paintedTurtle.name', 'Chrysemys picta', @TurtlesId, 'species.paintedTurtle.description', @BeginnerId, 15, 30),
(NEWID(), 'species.horsfieldTortoise.name', 'Testudo horsfieldii', @TurtlesId, 'species.horsfieldTortoise.description', @IntermediateId, 20, 50),
(NEWID(), 'species.chineseStripeNeckedTurtle.name', 'Mauremys sinensis', @TurtlesId, 'species.chineseStripeNeckedTurtle.description', @BeginnerId, 12, 25),
(NEWID(), 'species.mudTurtle.name', 'Kinosternon subrubrum', @TurtlesId, 'species.mudTurtle.description', @BeginnerId, 10, 20),
(NEWID(), 'species.desertTortoise.name', 'Gopherus agassizii', @TurtlesId, 'species.desertTortoise.description', @AdvancedId, 35, 80),
(NEWID(), 'species.snakeNeckedTurtle.name', 'Chelodina mccordi', @TurtlesId, 'species.snakeNeckedTurtle.description', @IntermediateId, 25, 40),
(NEWID(), 'species.radiatedTortoise.name', 'Astrochelys radiata', @TurtlesId, 'species.radiatedTortoise.description', @AdvancedId, 40, 70),
(NEWID(), 'species.chineseThreeKeelTurtle.name', 'Mauremys reevesii', @TurtlesId, 'species.chineseThreeKeelTurtle.description', @BeginnerId, 15, 20),
(NEWID(), 'species.leatherbackSeaTurtle.name', 'Dermochelys coriacea', @TurtlesId, 'species.leatherbackSeaTurtle.description', @AdvancedId, 200, 80),
(NEWID(), 'species.greenSeaTurtle.name', 'Chelonia mydas', @TurtlesId, 'species.greenSeaTurtle.description', @AdvancedId, 120, 80),
(NEWID(), 'species.marginatedTortoise.name', 'Testudo marginata', @TurtlesId, 'species.marginatedTortoise.description', @AdvancedId, 35, 100)
) AS source (Id, CommonName, ScientificName, CategoryId, Description, CareLevelId, AdultSizeCm, LifespanYears)
ON target.ScientificName = source.ScientificName
WHEN NOT MATCHED THEN
INSERT (Id, CommonName, ScientificName, CategoryId, Description, CareLevelId, AdultSizeCm, LifespanYears)
VALUES (source.Id, source.CommonName, source.ScientificName, source.CategoryId, source.Description, source.CareLevelId, source.AdultSizeCm, source.LifespanYears);

PRINT 'Species seeded successfully.';
GO

