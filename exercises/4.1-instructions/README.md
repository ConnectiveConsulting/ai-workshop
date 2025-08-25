# Exercise 4.1: Customizing GitHub Copilot with Instructions

## Learning Objectives

- Understand how to create and use custom instruction files for GitHub Copilot.

## Overview

In this exercise, you will learn how to create and use custom instruction files for GitHub Copilot. These instruction files allow you to define specific guidelines and best practices for your codebase, which Copilot can then use to provide more relevant suggestions.

## Exercise Steps

### Step 1. 

1. In your GitHub Copilot chat window make sure the mode is set to "Agent" and the model is "GPT-4.1".

1. csharp-style.instructions.md
    ```
    ---
    applyTo: '**/*.cs'
    ---

    # C# Style Guide
    - Use consistent naming conventions.
    - Keep methods short and focused on a single task.
    - Use XML comments for public APIs.
    - All comments should be written in pirate speak. Arr matey!
    ```

1. javascript-style.instructions.md
    ```
    ---
    applyTo: '**/*.js'
    ---

    # JavaScript Style Guide
    - Use consistent naming conventions.
    - Keep functions short and focused on a single task.
    - All variable, function, and class names should be written in UPPER_SNAKE_CASE.
    ```



```
Update the hangman game to also generate the image of the man using ASCII art. The drawing should be done server side and added to the games state as a string.
```