CREATE DATABASE PokemonDB;
GO

USE PokemonDB;
GO


-- Drop tables if they exist to allow for clean recreation
IF OBJECT_ID('dbo.Capture', 'U') IS NOT NULL
    DROP TABLE dbo.Capture;
IF OBJECT_ID('dbo.Pokemon', 'U') IS NOT NULL
    DROP TABLE dbo.Pokemon;
IF OBJECT_ID('dbo.Trainer', 'U') IS NOT NULL
    DROP TABLE dbo.Trainer;
IF OBJECT_ID('dbo.PokemonType', 'U') IS NOT NULL
    DROP TABLE dbo.PokemonType;
    
-- Create Pokemon type table
CREATE TABLE dbo.PokemonType (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(50) NOT NULL UNIQUE,
    Description VARCHAR(255) NOT NULL
);

-- Create Pokemon table
CREATE TABLE dbo.Pokemon (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR (500) NOT NULL,
    TypeId int NOT NULL,
    CONSTRAINT FK_Pokemon_PokemonType FOREIGN KEY (TypeId) REFERENCES dbo.PokemonType(Id) ON DELETE CASCADE
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

INSERT INTO dbo.PokemonType (Name, Description) VALUES
('Fire', 'Fire-type Pokémon are known for their fiery abilities.'),
('Water', 'Water-type Pokémon are adept at using water-based attacks.'),
('Grass', 'Grass-type Pokémon are associated with plant life and nature.'),
('Electric', 'Electric-type Pokémon can generate and manipulate electricity.'),
('Psychic', 'Psychic-type Pokémon possess mental powers and abilities.');

GO