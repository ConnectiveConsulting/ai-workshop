# Exercise 2.1: GitHub Copilot Basics

## Learning Objectives

## Overview

## Exercise Steps

### Step 1.

### Step 2. 

1. Change to Claude Sonnet 3.5

1. Make sure Copilot is in Edit mode

1. Use the following prompt to convert the extension methods in MyExtensions to use the new syntax:

```
Change this class to use the new extension member syntax. Also, make the IsEmpty extension an extension property instead of a method.
```

1. Copilot should fail on this task. Edit mode in Copilot does not use any external tools, and the knowledge cutoff of Claude Sonnet 3.5 is April 2024, long before documentation on the new extension member syntax in C# 14 was available.

    Take note of what Copilot suggests and how it approaches the problem. It will likely hallucinate a solution based on its training data, or make random changes that don't seem to address the prompt.

1.
```
Change this class to use the new extension member syntax. Also, make the IsEmpty extension an extension property instead of a method.

#fetch https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods
```

1.

1. Undo the changes. Now

1.
```
Change this class to use the new extension member syntax. Also, make the IsEmpty extension an extension property instead of a method.

#fetch https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods

Double check the syntax is correct by running a dotnet build on this file.
```