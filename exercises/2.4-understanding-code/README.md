# Exercise 2.4: Understanding and Exploring a Codebase

## Learning Objectives


## Overview

In this exercise, you will learn how to use AI to explore a new codebase, understand it's conventions, and learn new frameworks.

## Exercise Steps

### Step 1. Get Familiar with the Demo Application

1. Open a new Visual Studio Code instance and open the C:\Workshop\projects\pokedex folder.

1. Open the terminal in Visual Studio Code using ``Ctrl + ` `` or by selecting "View" > "Terminal" from the top menu.

1. In the terminal, build and run the API project by changing to the Pokedex.API folder and executing a ```dotnet run```:
    
    ```shell
    cd ./Pokedex.API
    dotnet run
    ```

1. Open a second terminal in Visual Studio Code using ``Ctrl + Shift + ` ``, selecting "Terminal" > "New Terminal" from the top menu, or by clicking the + icon on the right side of the TERMINAL panel header.

1. In the second terminal, navigate to the pokedex-frontend folder and run the following command to start the user interface:

    ```shell
    cd ./pokedex-frontend
    npm run start
    ```

1. The front-end application should now be running on `http://localhost:3000`.

1. Explore the application to get an idea of its functionality.

### Step 2. Explore the codebase

1. In the GitHub Copilot chat window, select "Ask" mode

1. Enter the following prompt:
    
    ```
    Explain the general codebase to someone who is new to the project. Provide diagrams and guidance on where to start.
    ```

1. Review the output from Copilot. What types of information did it provide about the codebase?

### Step 3. Learn a new framework

The front end of this application is built using React and the Redux Toolkit for state management. The flux pattern, Redux, and Redux Toolkit are fairly advanced concepts that developers struggle to learn when first exposed to them. Let's use Copilot to help us understand these concepts in the context of the codebase.

> If you are already very familiar with these concepts, you can try this exercise using some other code in this repository or an open source project that uses a technology you are interested in. For example, the root folder contains a Terraform configuration in /infrastructure/vms that is used to provision the virtual machines used in this workshop. Take a look at this if you are unfamiliar with Terraform and it's syntax.

1. Start a new chat session. Make sure the mode is ``Ask``.

    Click the ``Add Context`` button and select the PokemonList.js file.

    ```
    Describe step by step how data gets loaded by Redux Toolkit into the PokemonList component. Reference line numbers for the various actions.
    ```
