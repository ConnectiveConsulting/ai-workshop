# Exercise 1.1: Setup the environment

## Learning Objectives

The goal of this exercise is to set up the development environment for the workshop exercises. This includes connecting to a workshop VM, or configuring your local environment.

## Overview

To provide a consistent development environment for all participants, we will use a pre-configured virtual machine (VM) hosted in Azure. This VM will have all the necessary tools and software installed to complete the workshop exercises.

If you prefer, you *can* use your own local environment. In this case, you will need to install the required software and configure your environment to match the workshop VM as closely as possible. However, we will not be able to provide support for issues that arise from using a local environment.

## Prerequisites

Using the remote VM:
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

## Exercise Steps - Remote VM

### Step 1: Connect to the Remote VM

> Note - if you have a .rdp file from the instructor you can skip steps 2-5

1. Open MS Remote Desktop (Start > Search > Remote Desktop)

1. In the Computer field enter the IP address or name of the remote VM assigned to you.

1. Click 'Show Options'

1. In the 'User name' field enter 'workshopadmin'

1. Click 'Connect'

1. When prompted, enter the password provided by the instructor

1. Click 'Yes' to accept the unknown certificate

1. Note that the remote VM may take a few moments to initialize after you log in, and may be slow at first.

1. Open Google Chrome and navigate back to these instructions (https://github.com/ConnectiveConsulting/ai-workshop) so you can stay within the browser. **Do not use Microsoft Edge** as Edge requires you to log into a Microsoft account.

1. Keep this browser window open to follow along with the exercise instructions.

### Step 2: Log into GitHub Copilot

1. Open Visual Studio Code from the desktop shortcut
    - Note we are using Visual Studio *Code*, not full Visual Studio. GitHub Copilot in Visual Studio Code tends to get the latest features before all other IDEs.

1. Click the 'Set up Copilot' button on the welcome screen

![alt text](image-2.png)

1. Click 'Continue with GitHub'

1. Log in using your GitHub account that has a Copilot subscription

1. Click 'Continue' and 'Authorize Visual-Studio-Code'

1. Click 'Open Visual Studio Code' when prompted

## Exercise Steps - Local Environment

### Step 1: Install Required Software

Either install the required software by following the instructions below, or verify that you have the required software already installed and configured.

#### Install by hand

1. Install **Visual Studio Code** from https://code.visualstudio.com/

1. Install the **GitHub Copilot Chat extension** from the Visual Studio Code marketplace

1. Install **GitHub CLI** from https://cli.github.com/

1. Install **Node.js** version 20 LTS or later from https://nodejs.org/

1. Install **Java 21** (LTS) from https://www.oracle.com/java/technologies/downloads/#java21

1. Install **Maven** from https://maven.apache.org/download.cgi

### Installation script

```Powershell

```

### Step 2: Log into GitHub Copilot

1.

### Step 3: Clone the Workshop Repositories

1.

## Summary

You should now have a fully functional development environment set up for the workshop.

This repository has already been cloned to your machine in the C:\Workshop folder.

---

[Next: Project Exploration](../1.2-project-exploration.md)

