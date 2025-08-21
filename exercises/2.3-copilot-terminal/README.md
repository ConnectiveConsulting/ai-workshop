# Exercise 2.2: Using GitHub Copilot in the Terminal

## Learning Objectives

- Understand how to use GitHub Copilot in the terminal to perform common tasks.

## Overview

Git in particular has a rich set of commands and workflows that are not always intuitive. By using GitHub Copilot in the terminal, you can streamline your Git operations, automate repetitive tasks, and even generate complex commands with ease.

## Exercise Steps

### Step 1. Open the project and commit a change

1. In Visual Studio Code, go to File > Open Folder and select the c:\Workshop\projects\DotNet10Extensions folder.

1. Open the terminal in Visual Studio Code using ``Ctrl + ` `` or by selecting "View" > "Terminal" from the top menu.

1. Open the ExtensionMethods.cs file and make a minor change like deleting a comment.

1. Commit the change using the Visual Studio Code IDE or the terminal with

    ```
    git add .
    git commit -m "Your commit message"
    ```
### Step 2. Fix a git mistake

1. Oh no! You must committed to main instead of feature branch! Undoing this isn't difficult in git, but it happens rarely enough that you might not always remember the commands off the top of your head. You could Google them, but let's use GitHub Copilot to help us.

1. Focus on the VS Code terminal and hit ``Ctrl-i`` to open a git command palette.

1. Enter the following prompt:

    ```
    I accidentally committed my last changes to the main branch in git. I have not pushed anything to my remote yet. Give me the git commands to move this change to a new feature branch named "my-feature-branch" and revert them from the main branch in my local git instance.
    ```

1. If the model correctly understood your request it should suggest something similar to 

    ```bash
    # Create a new feature branch off of main that includes the latest commit
    git branch my-feature-branch
    # Undo the last commit from main
    git reset --hard HEAD~1 
    # Change to your new feature branch with the latest commit
    git checkout my-feature-branch

1. Click the ``Run`` button to run the commands in the terminal.

## Summary

In this exercise, you learned how to use GitHub Copilot in the terminal to help you with common Git tasks. You practiced leveraging AI assistance to generate the necessary commands without the need to reference documentation.

---

[Next: Prompt Engineering](../exercises/3.1-prompt-engineering/README.md)