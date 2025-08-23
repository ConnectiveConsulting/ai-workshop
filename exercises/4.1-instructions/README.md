# Exercise 4.1: Customizing GitHub Copilot with Instructions

## Learning Objectives

## Overview

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
    - All variable names should be written in UPPER_SNAKE_CASE.
    - Keep methods short and focused on a single task.
    - Use XML comments for public APIs.
    - All comments should be written in pirate speak. Arr matey!
    ```

1. css-style.instructions.md
    ```
    ---
    applyTo: '**/*.css'
    ---

    # CSS Style Guide
    - All CSS should use BEM (Block Element Modifier) naming conventions.
    - Rewrite styles to follow BEM if they don't already.
    - Keep styles focused and modular.
    - Use comments to explain complex styles.
    ```

```
Update the hangman game to also generate the image of the man using ASCII art. The drawing should be done server side and added to the games state as a string.
```