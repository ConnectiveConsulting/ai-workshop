-- Pokedex SQL Server Database Schema
-- Created based on Pokedex.Core.Models

-- Drop tables if they exist to allow for clean recreation
IF OBJECT_ID('dbo.Capture', 'U') IS NOT NULL
    DROP TABLE dbo.Capture;
IF OBJECT_ID('dbo.Pokemon', 'U') IS NOT NULL
    DROP TABLE dbo.Pokemon;
IF OBJECT_ID('dbo.Trainer', 'U') IS NOT NULL
    DROP TABLE dbo.Trainer;

-- Create Pokemon table
CREATE TABLE dbo.Pokemon (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    ImageUrl VARCHAR(255) NOT NULL
);

-- Create Trainer table
CREATE TABLE dbo.Trainer (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Region VARCHAR(100) NOT NULL
);

-- Create Capture table with composite key and foreign key relationships
CREATE TABLE dbo.Capture (
    PokemonId INT NOT NULL,
    TrainerId INT NOT NULL,
    CaptureDate DATETIME NOT NULL,
    -- Define composite primary key
    CONSTRAINT PK_Capture PRIMARY KEY (PokemonId, TrainerId),
    -- Define foreign key relationships
    CONSTRAINT FK_Capture_Pokemon FOREIGN KEY (PokemonId) 
        REFERENCES dbo.Pokemon(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Capture_Trainer FOREIGN KEY (TrainerId) 
        REFERENCES dbo.Trainer(Id) ON DELETE CASCADE
);

CREATE TABLE dbo.PokemonType (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(50) NOT NULL UNIQUE,
    Description VARCHAR(255) NOT NULL
);

INSERT INTO dbo.PokemonType (Name, Description) VALUES
('Fire', 'Fire-type Pokémon are known for their fiery abilities.'),
('Water', 'Water-type Pokémon are adept at using water-based attacks.'),
('Grass', 'Grass-type Pokémon are associated with plant life and nature.'),
('Electric', 'Electric-type Pokémon can generate and manipulate electricity.'),
('Psychic', 'Psychic-type Pokémon possess mental powers and abilities.');

-- Add indexes to improve query performance
CREATE INDEX IX_Capture_PokemonId ON dbo.Capture(PokemonId);
CREATE INDEX IX_Capture_TrainerId ON dbo.Capture(TrainerId);
CREATE INDEX IX_Pokemon_Name ON dbo.Pokemon(Name);
CREATE INDEX IX_Trainer_Name ON dbo.Trainer(Name);