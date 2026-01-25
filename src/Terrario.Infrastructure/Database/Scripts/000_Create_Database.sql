-- =============================================
-- Terrario Database - Initial Database Setup
-- Version: 1.0
-- Date: 2025-11-17
-- Description: Creates the Terrario database if it doesn't exist
-- =============================================

-- Check if database exists, if not create it
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'Terrario')
BEGIN
    CREATE DATABASE [Terrario]
    PRINT 'Database [Terrario] created successfully'
END
ELSE
BEGIN
    PRINT 'Database [Terrario] already exists'
END
GO

USE [Terrario]
GO

PRINT 'Switched to [Terrario] database';
GO
