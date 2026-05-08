# Connective AI Workshop

Exercises for the Connective Consulting AI workshop.

# Prerequisites

Using a Connective remote workshop VM:
- **Microsoft Remote Desktop** and the ability to connect to an external VM over the standard RDP port (3389)
- An active **GitHub Copilot subscription**

Using your local machine:
- Installed software:
    - **Visual Studio Code** (latest version) with the **GitHub Copilot Chat extension** installed
    - **GitHub CLI** (latest version)
    - **Node.js** version 20 LTS or later
    - **Java 21** (LTS)
    - **Maven** (latest version)
- Ability to **clone a public repository from github.com** (i.e., no firewall or proxy blocking GitHub)
- An active **GitHub Copilot subscription**

# General Guidelines

- Prompts that contain special commands (e.g. including files with "#", "/" commands, "@" agent references) may need to be typed by hand. Copying and pasting the prompt into the Copilot text area will not pick up these commands.
- When opening the exercise project, be sure to open the project repository folder and not its parent folder. This ensures that exercise instructions are not included in the context, which would be cheating as GitHub Copilot would be able to read ahead and see what the expected outcome is!

# Exercises

1.1 [Environment Setup](exercises/1.1-setup/README.md)

1.2 [Project Exploration](exercises/1.2-project-exploration/README.md)

6.1 [Visual Bug Hunt — Teaching the Agent to See](exercises/6.1-playwright-mcp/README.md)

9.1 [Generating Tests — Edge Case Hunting with AI](exercises/9.1-generating-tests/README.md)

10.1 [DevOps Log Investigation — When the User Just Says "It's Broken"](exercises/10.1-devops-log-investigation/README.md)

11.1 [Capstone — Building a Full Feature with Superpowers](exercises/11.1-superpowers-capstone/README.md)