-- Migration: Set IsLegalAttachmentsRequired for species requiring legal documentation
-- Date: 2026-03-09
-- Description:
--   Sets IsLegalAttachmentsRequired = 1 for species that require legal documentation
--   when kept as pets in Poland / European Union, based on:
--     - CITES Appendix I   → EU Annex A (strictest controls, individual permits required)
--     - CITES Appendix II  → EU Annex B (documentation of legal origin required)
--     - EU Invasive Alien Species Regulation (EU) 1143/2014 (banned in the EU, keeping requires permit)
--     - EU Habitats Directive (Annex IV) – strictly protected species in the EU
--
--   Species NOT in any of the above categories (common captive-bred species:
--   corn snakes, leopard geckos, bearded dragons, kingsnakes, pacman frogs, etc.)
--   are left with the default value of 0.

SET NOCOUNT ON;

-- ============================================================
-- 1. TARANTULAS – CITES Appendix II (EU Annex B)
--    Brachypelma / Tliltocatl (formerly Brachypelma), Poecilotheria,
--    Theraphosa, Typhochlaena
-- ============================================================
UPDATE [dbo].[Species]
SET IsLegalAttachmentsRequired = 1
WHERE ScientificName IN (
    'Brachypelma smithi',           -- Chaco Golden Knee
    'Brachypelma hamorii',          -- Mexican Red-knee
    'Brachypelma boehmei',          -- Mexican Fire Leg
    'Brachypelma emilia',           -- Mexican Rust Rump
    'Brachypelma albiceps',         -- Mexican Half and Half
    'Brachypelma klaasi',           -- Mexican Pink Tarantula
    'Tliltocatl albopilosum',       -- Curly Hair Tarantula (formerly Brachypelma)
    'Tliltocatl vagans',            -- Mexican Red-rump (formerly Brachypelma)
    'Tliltocatl aureoceps',         -- Mexican Golden Red-rump (formerly Brachypelma)
    'Poecilotheria regalis',        -- Tiger Rump / Indian Ornamental
    'Poecilotheria metallica',      -- Sapphire Ornamental Tarantula
    'Poecilotheria ornata',         -- Fringed Ornamental Tarantula
    'Poecilotheria formosa',        -- Indian Ornamental Tarantula
    'Theraphosa blondi',            -- Goliath Birdeater
    'Theraphosa apophysis',         -- Pink Foot Goliath Birdeater
    'Typhochlaena seladonia'        -- Brazilian Jewel Tarantula
);
PRINT CAST(@@ROWCOUNT AS VARCHAR) + ' tarantula species updated.';

-- ============================================================
-- 2. LIZARDS – CITES Appendix II (EU Annex B)
--    Chameleons, Green Iguana, Day Geckos (Phelsuma)
-- ============================================================
UPDATE [dbo].[Species]
SET IsLegalAttachmentsRequired = 1
WHERE ScientificName IN (
    'Chamaeleo calyptratus',        -- Veiled Chameleon
    'Furcifer pardalis',            -- Panther Chameleon
    'Iguana iguana',                -- Green Iguana
    'Phelsuma dubia',               -- Dubia Day Gecko
    'Phelsuma standingi'            -- Standing's Day Gecko
);
PRINT CAST(@@ROWCOUNT AS VARCHAR) + ' lizard species updated.';

-- ============================================================
-- 3. SNAKES – CITES Appendix I & II (EU Annex A & B)
-- ============================================================
UPDATE [dbo].[Species]
SET IsLegalAttachmentsRequired = 1
WHERE ScientificName IN (
    -- CITES Appendix I / EU Annex A (individual permit required)
    'Python molurus',               -- Burmese Python
    'Python bivittatus',            -- Burmese Python (bivittatus)
    'Epicrates subflavus',          -- Jamaican Boa
    'Acrantophis dumerili',         -- Dumeril's Ground Boa

    -- CITES Appendix II / EU Annex B (documentation of legal origin required)
    'Python regius',                -- Ball Python
    'Python reticulatus',           -- Reticulated Python
    'Morelia viridis',              -- Green Tree Python
    'Morelia spilota',              -- Carpet Python
    'Morelia spilota cheynei',      -- Jungle Carpet Python
    'Simalia boeleni',              -- Boeleni Python
    'Boa constrictor',              -- Boa Constrictor
    'Epicrates cenchria',           -- Rainbow Boa
    'Corallus caninus',             -- Emerald Tree Boa
    'Corallus hortulana',           -- Amazon Tree Boa
    'Antaresia childreni',          -- Children's Python
    'Antaresia maculosa',           -- Spotted Python
    'Antaresia stimsoni',           -- Stimson's Python
    'Aspidites ramsayi',            -- Woma Python
    'Aspidites melanocephalus',     -- Black-Headed Python
    'Liasis olivaceus',             -- Olive Python
    'Liasis mackloti',              -- Macklot's Python
    'Leiopython albertisii',        -- White-Lipped Python
    'Gongylophis colubrinus',       -- Kenyan Sand Boa
    'Gongylophis conicus',          -- Rough Scaled Sand Boa
    'Lichanura trivirgata',         -- Rosy Boa
    'Euprepiophis mandarinus'       -- Mandarin Rat Snake
);
PRINT CAST(@@ROWCOUNT AS VARCHAR) + ' snake species updated.';

-- ============================================================
-- 4. FROGS – CITES Appendix I & II (EU Annex A & B)
-- ============================================================
UPDATE [dbo].[Species]
SET IsLegalAttachmentsRequired = 1
WHERE ScientificName IN (
    -- CITES Appendix I / EU Annex A
    'Mantella aurantiaca',          -- Golden Mantella Frog
    'Dyscophus antongilii',         -- Tomato Frog

    -- CITES Appendix II / EU Annex B
    'Dendrobates tinctorius',       -- Tinctorious Poison Dart Frog
    'Dendrobates azureus',          -- Azureus Poison Dart Frog
    'Phyllobates terribilis',       -- Golden Poison Dart Frog
    'Agalychnis callidryas',        -- Red-Eyed Tree Frog
    'Agalychnis annae',             -- Blue-Sided Tree Frog
    'Agalychnis moreletii',         -- Morelet's Tree Frog
    'Litoria caerulea'              -- White's Tree Frog (Dumpy Tree Frog)
);
PRINT CAST(@@ROWCOUNT AS VARCHAR) + ' frog species updated.';

-- ============================================================
-- 5. SALAMANDERS – CITES Appendix II & EU Habitats Directive
-- ============================================================
UPDATE [dbo].[Species]
SET IsLegalAttachmentsRequired = 1
WHERE ScientificName IN (
    -- CITES Appendix II / EU Annex B
    'Ambystoma mexicanum',          -- Mexican Axolotl (all colour morphs share this name)
    'Ambystoma tigrinum',           -- Tiger Salamander

    -- EU Habitats Directive Annex IV – strictly protected in the European Union
    'Triturus cristatus'            -- Great Crested Newt
);
PRINT CAST(@@ROWCOUNT AS VARCHAR) + ' salamander species updated.';

-- ============================================================
-- 6. TURTLES & TORTOISES – CITES I, II + EU Invasive Species List
-- ============================================================
UPDATE [dbo].[Species]
SET IsLegalAttachmentsRequired = 1
WHERE ScientificName IN (
    -- CITES Appendix I / EU Annex A
    'Astrochelys radiata',          -- Radiated Tortoise
    'Dermochelys coriacea',         -- Leatherback Sea Turtle
    'Chelonia mydas',               -- Green Sea Turtle
    'Chelodina mccordi',            -- Roti Island Snake-Necked Turtle

    -- CITES Appendix II / EU Annex B
    'Testudo graeca',               -- Greek Tortoise / Spur-thighed Tortoise
    'Testudo horsfieldii',          -- Horsfield's / Russian Tortoise
    'Testudo marginata',            -- Marginated Tortoise
    'Stigmochelys pardalis',        -- Leopard Tortoise
    'Gopherus agassizii',           -- Mojave Desert Tortoise

    -- EU Invasive Alien Species Regulation (EU) 1143/2014
    -- Keeping requires a prior-use permit in the EU / Poland
    'Trachemys scripta elegans'     -- Red-Eared Slider
);
PRINT CAST(@@ROWCOUNT AS VARCHAR) + ' turtle/tortoise species updated.';

-- ============================================================
-- Summary
-- ============================================================
DECLARE @total INT;
SELECT @total = COUNT(*) FROM [dbo].[Species] WHERE IsLegalAttachmentsRequired = 1;
PRINT 'Done. Total species with IsLegalAttachmentsRequired = 1: ' + CAST(@total AS VARCHAR);
GO
