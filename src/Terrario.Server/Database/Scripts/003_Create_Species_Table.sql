-- Migration: Create Categories and Species tables with seed data
-- Date: 2025-12-10
-- Description: Creates Categories and Species tables with proper foreign key relationships

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
        [CareLevel] NVARCHAR(50) NULL,
        [AdultSizeCm] INT NULL,
        [LifespanYears] INT NULL,
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        
        CONSTRAINT [FK_Species_Categories_CategoryId] 
            FOREIGN KEY ([CategoryId]) 
            REFERENCES [dbo].[Categories] ([Id])
            ON DELETE NO ACTION
    );

    CREATE NONCLUSTERED INDEX [IX_Species_CategoryId] 
        ON [dbo].[Species] ([CategoryId]);
    
    CREATE NONCLUSTERED INDEX [IX_Species_CommonName] 
        ON [dbo].[Species] ([CommonName]);

    PRINT 'Table Species created successfully.';
END
ELSE
BEGIN
    PRINT 'Table Species already exists.';
END
GO

-- Seed Categories
IF NOT EXISTS (SELECT * FROM [dbo].[Categories])
BEGIN
    PRINT 'Seeding categories...';

    DECLARE @SpidersId UNIQUEIDENTIFIER = NEWID();
    DECLARE @LizardsId UNIQUEIDENTIFIER = NEWID();
    DECLARE @SnakesId UNIQUEIDENTIFIER = NEWID();
    DECLARE @FrogsId UNIQUEIDENTIFIER = NEWID();
    DECLARE @SalamandersId UNIQUEIDENTIFIER = NEWID();
    DECLARE @TurtlesId UNIQUEIDENTIFIER = NEWID();
    DECLARE @OtherId UNIQUEIDENTIFIER = NEWID();

    INSERT INTO [dbo].[Categories] (Id, Name, Description, Icon, DisplayOrder)
    VALUES 
        (@SpidersId, 'Pająki', 'Ptaszniki i inne pająki terrarystyczne', '🕷️', 1),
        (@LizardsId, 'Jaszczurki', 'Gekony, agamy, kameleony i inne jaszczurki', '🦎', 2),
        (@SnakesId, 'Węże', 'Pytony, węże zbożowe, boa i inne węże', '🐍', 3),
        (@FrogsId, 'Żaby', 'Rzekotki, drzewołazy i inne płazy bezogonowe', '🐸', 4),
        (@SalamandersId, 'Salamandry', 'Aksolotl i inne płazy ogoniaste', '🦎', 5),
        (@TurtlesId, 'Żółwie', 'Żółwie wodne i lądowe', '🐢', 6),
        (@OtherId, 'Inne', 'Pozostałe zwierzęta terrarystyczne', '🦗', 7);

    PRINT 'Categories seeded successfully.';

    -- Seed Species
    PRINT 'Seeding species...';

    -- Pająki
    INSERT INTO [dbo].[Species] (Id, CommonName, ScientificName, CategoryId, Description, CareLevel, AdultSizeCm, LifespanYears)
    VALUES 
    (NEWID(), 'Ptasznik kolanowy', 'Brachypelma smithi', @SpidersId, 'Popularny ptasznik dla początkujących. Spokojny i łatwy w hodowli.', 'Beginner', 15, 25),
    (NEWID(), 'Ptasznik różowy', 'Grammostola rosea', @SpidersId, 'Spokojny gatunek, idealny dla początkujących.', 'Beginner', 13, 20),
    (NEWID(), 'Ptasznik tygrysi', 'Poecilotheria regalis', @SpidersId, 'Szybki i aktywny gatunek dla doświadczonych hodowców.', 'Advanced', 20, 12),
    (NEWID(), 'Ptasznik ogrodowy', 'Avicularia avicularia', @SpidersId, 'Arborealna odmiana, preferuje wysokie terraria.', 'Intermediate', 13, 10);

    -- Jaszczurki
    INSERT INTO [dbo].[Species] (Id, CommonName, ScientificName, CategoryId, Description, CareLevel, AdultSizeCm, LifespanYears)
    VALUES 
    (NEWID(), 'Gekon lamparci', 'Eublepharis macularius', @LizardsId, 'Najpopularniejsza jaszczurka dla początkujących. Łatwa w hodowli.', 'Beginner', 25, 15),
    (NEWID(), 'Gekon orzęsiony', 'Correlophus ciliatus', @LizardsId, 'Nocny gatunek, nie wymaga dodatkowego oświetlenia UV.', 'Beginner', 20, 15),
    (NEWID(), 'Agama brodata', 'Pogona vitticeps', @LizardsId, 'Przyjazna jaszczurka, wymaga dużego terrarium.', 'Intermediate', 50, 12),
    (NEWID(), 'Kameleon jemeński', 'Chamaeleo calyptratus', @LizardsId, 'Wymaga specjalistycznej opieki i wilgotności.', 'Advanced', 45, 8),
    (NEWID(), 'Niebiesko-języki', 'Tiliqua scincoides', @LizardsId, 'Duża, spokojna jaszczurka z charakterystycznym niebieskim językiem.', 'Intermediate', 50, 20);

    -- Węże
    INSERT INTO [dbo].[Species] (Id, CommonName, ScientificName, CategoryId, Description, CareLevel, AdultSizeCm, LifespanYears)
    VALUES 
    (NEWID(), 'Wąż zbożowy', 'Pantherophis guttatus', @SnakesId, 'Idealny wąż dla początkujących. Łagodny i łatwy w hodowli.', 'Beginner', 150, 20),
    (NEWID(), 'Pyton królewski', 'Python regius', @SnakesId, 'Popularny wąż, spokojny charakter.', 'Beginner', 120, 30),
    (NEWID(), 'Pyton zielony', 'Morelia viridis', @SnakesId, 'Piękny arborealan, wymaga wyższej wilgotności.', 'Intermediate', 180, 20),
    (NEWID(), 'Boa dusiciel', 'Boa constrictor', @SnakesId, 'Większy wąż, wymaga przestronnego terrarium.', 'Intermediate', 250, 25),
    (NEWID(), 'Wąż mleczny honduraski', 'Lampropeltis triangulum hondurensis', @SnakesId, 'Kolorowy wąż, łatwy w hodowli.', 'Beginner', 120, 15);

    -- Żaby
    INSERT INTO [dbo].[Species] (Id, CommonName, ScientificName, CategoryId, Description, CareLevel, AdultSizeCm, LifespanYears)
    VALUES 
    (NEWID(), 'Rzekotka czerwonooka', 'Agalychnis callidryas', @FrogsId, 'Piękna arborealna żaba z charakterystycznymi czerwonymi oczami.', 'Intermediate', 7, 5),
    (NEWID(), 'Drzewołaz barwny', 'Dendrobates tinctorius', @FrogsId, 'Małe, kolorowe żaby. Wymaga akwaterrarium.', 'Advanced', 5, 10),
    (NEWID(), 'Pacman żaba', 'Ceratophrys ornata', @FrogsId, 'Duża, naziemna żaba z dużym apetytem.', 'Beginner', 15, 8),
    (NEWID(), 'Ropucha aga', 'Rhinella marina', @FrogsId, 'Duża, odporna ropucha. Łatwa w hodowli.', 'Beginner', 20, 10);

    -- Salamandry
    INSERT INTO [dbo].[Species] (Id, CommonName, ScientificName, CategoryId, Description, CareLevel, AdultSizeCm, LifespanYears)
    VALUES 
    (NEWID(), 'Aksolotl meksykański', 'Ambystoma mexicanum', @SalamandersId, 'Wodna salamandra, wymaga akwarium z zimną wodą.', 'Intermediate', 25, 15),
    (NEWID(), 'Salamandra plamista', 'Salamandra salamandra', @SalamandersId, 'Europejska salamandra, wymaga chłodnego terrarium.', 'Intermediate', 20, 20);

    -- Żółwie
    INSERT INTO [dbo].[Species] (Id, CommonName, ScientificName, CategoryId, Description, CareLevel, AdultSizeCm, LifespanYears)
    VALUES 
    (NEWID(), 'Żółw czerwonolicy', 'Trachemys scripta elegans', @TurtlesId, 'Popularny żółw wodny, wymaga dużego akwarium.', 'Beginner', 30, 40),
    (NEWID(), 'Żółw grecki', 'Testudo graeca', @TurtlesId, 'Lądowy żółw, wymaga przestronnego terrarium.', 'Intermediate', 25, 50),
    (NEWID(), 'Żółw lamparci', 'Stigmochelys pardalis', @TurtlesId, 'Duży lądowy żółw, wymaga dużo przestrzeni.', 'Advanced', 60, 80);

    PRINT 'Species seeded successfully.';
END
ELSE
BEGIN
    PRINT 'Species table already contains data.';
END
GO
