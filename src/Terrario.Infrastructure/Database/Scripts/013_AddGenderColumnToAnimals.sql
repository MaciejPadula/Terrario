-- Dodanie kolumny Gender typu int (enum) do tabeli Animals
ALTER TABLE [dbo].[Animals]
ADD [Gender] int NOT NULL DEFAULT 0;
