# Exercise 4.1: Using MCP Servers with GitHub Copilot

## Learning Objectives
By the end of this exercise, you will be able to:
- Install and configure an MCP (Model Context Protocol) server for SQL Server
- Use GitHub Copilot with MCP servers to query database tables
- Generate C# enumerations from database data using AI assistance
- Understand how MCP servers extend Copilot's capabilities beyond code generation

## Overview
Model Context Protocol (MCP) servers allow GitHub Copilot to interact with external systems like databases, APIs, and file systems. In this exercise, you'll install an MCP server for SQL Server and use it to query a Pokemon database table, then generate a C# enumeration from the results.

The code for an example SQL Server MCP server from Microsoft has already been pulled down from https://github.com/Azure-Samples/SQL-AI-samples into the exercises/4.1-mcp/mssql-mcp-dotnet folder.

## Prerequisites
- Visual Studio Code with GitHub Copilot extension installed
- SQL Server or SQL Server Express with sample Pokemon database
- .NET 8 SDK installed on your machine

## Exercise Steps

### Step 1: Add the MCP Server to your Workspace

1. Create a .vscode/mcp.json file in your workspace.

1. Open the mcp.json file and add the following configuration:

   ```json
   {
     "servers": {
       "sqlserver": {
         "type": "stdio",
         "command": "dotnet",
         "args": [
           "exercises/4.1-mcp/mssql-mcp-dotnet/MssqlMcp.dll"
         ],
         "env": {
           "CONNECTION_STRING": "Server=localhost;Database=PokemonDB;Integrated Security=true;"
         }
       }
     }
   }
   ```

1. Note that VS Code also provides a button to add a template for a new server. Clicking the Add Server button (lower right in editor window) will walk you through adding a template for a new server.

### Step 2: Start and Test the MCP Server

1. Save the Settings file, and then you should see the "Start" button appear in the settings file above the "sqlserver" line.  Click "Start" to start the MCP Server. (You can then click on "Running" to view the Output window).

1. Note that VS Code should have detected 7 tools available from the MCP server. This MCP server exposes tools like "ListTables", "DescribeTable", "CreateTable", "DropTable", "InsertData", "ReadData", and "UpdateData".

1. Start Chat (Ctrl+Shift+I), make sure Agent Mode is selected.

1. Ask Copilot to list all tables in the database 

    **Prompt to use:**
    ```
    List all tables in the database.
    ```

1. If you have other tools loaded, you may need to specify "MSSQL MCP" in the initial prompt, e.g.:

    ```
    Using MSSQL MCP, list tables.
    ```

1. Copilot should use the MCP server to connect and show you the list of tables in the database.

### Step 3: Use the MCP Server

1. Open the `Program.cs` file in your new project

1. Start a conversation with GitHub Copilot Chat

1. Ask Copilot to show you the structure of the `PokemonType` table:

   **Prompt to use:**
   ```
   Using MSSQL MCP, show me the structure of the PokemonType table.
   ```

1. With the database results visible, ask Copilot to generate a C# enumeration:

   **Prompt to use:**
   ```
   Based on the PokemonType table data you just showed me, create a C# enumeration called PokemonType that includes all the types with their corresponding numeric values and XML documentation comments that include the descriptions.
   ```

1. Copilot should generate something like:
   ```csharp
   /// <summary>
   /// Represents the different types of Pokemon
   /// </summary>
   public enum PokemonType
   {
       /// <summary>
       /// Fire-type Pokemon are strong against Grass and Ice types
       /// </summary>
       Fire = 1,
       
       /// <summary>
       /// Water-type Pokemon are strong against Fire and Rock types
       /// </summary>
       Water = 2,
       
       /// <summary>
       /// Grass-type Pokemon are strong against Water and Rock types
       /// </summary>
       Grass = 3,
       
       // ... additional types
   }
   ```
3. Run your application to verify the project correctly compiles.

## Key Concepts Demonstrated

- **MCP Integration**: How MCP servers extend GitHub Copilot's capabilities to interact with external systems
- **Prompting Techniques**: Crafting effective prompts to guide Copilot in using MCP data (e.g. first asking Copilot for the structure of a table, then asking it to generate code based on that structure).
- **Code Generation**: Converting external data into strongly-typed code constructs
- **Documentation**: Generating comprehensive code documentation from external sources

## Troubleshooting

**MCP Server not appearing:**
- Verify the `mcp-config.json` file is in the correct location
- Check that the SQL Server connection string is correct
- Restart VS Code completely

**Database connection issues:**
- Ensure SQL Server is running and accessible
- Verify the connection string format and credentials
- Test the connection string with SQL Server Management Studio first

**Copilot not using MCP data:**
- Try being more specific in your prompts about querying the database
- Mention the table name and that you want to use the connected SQL Server
