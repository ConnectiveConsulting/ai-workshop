# Connective AI Workshop

Exercises for the Connective Consulting AI workshop.

# Prerequisites

Using a Connective remote workshop VM:
- Microsoft Remote Desktop and the ability to connect to an external VM over the standard RDP port (3389)
- A GitHub Copilot subscription

Using your local machine:
- The latest version of Visual Studio Code
- .NET 9 SDK
- .NET 10 SDK preview
- Node.js (latest LTS version)
- SQL Server localdb installed (Create the demo database using the /infrastructure/database.sql script)
- A GitHub Copilot subscription

# General Guidelines

- Prompts that contain special commands (e.g. including files with "#", "/" commands, "@" agent references) may need to be typed by hand. Copying and pasting the prompt into the Copilot text area will not pick up these commands.
- When starting an exercise, be sure to open the corresponding exercise folder. Do not just use the root /ai-workshop folder. This ensures that GitHub Copilot does not get confused about the current context of the project it is working on.

# Exercises

1.1 [Environment Setup](exercises/1.1-setup/README.md)

2.1 [Copilot Basics - Generating Unit Tests](exercises/2.1-generating-unit-tests/README.md)

2.2 [Copilot Basics - Prompts & Context](exercises/2.2-copilot-context/README.md)

2.3 [Copilot Basics - Terminal](exercises/2.3-copilot-terminal/README.md)

2.4 [Copilot Basics - Understanding Code](exercises/2.4-understanding-code/README.md)

3.1 [Prompt Engineering](exercises/3.1-prompt-engineering/README.md)

4.1 [Copilot Custom Instructions](exercises/4.1-instructions/README.md)

4.2 [MCP Servers](exercises/4.2-mcp/README.md)

5.1 [Building Features with AI](exercises/5.1-building-features/README.md)