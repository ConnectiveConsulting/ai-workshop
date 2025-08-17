# Exercise 2.2: Using Context in GitHub Copilot

## Learning Objectives

- Understand how to use context effectively in GitHub Copilot
- Learn how to provide relevant context to improve code suggestions

## Overview

In this exercise, you will learn how to provide context to GitHub Copilot to improve its code suggestions. By understanding how to use context effectively, you can help Copilot generate more accurate and relevant code.

## Exercise Steps

### Step 1. Attempt an action that requires knowledge that the LLM does not have

1. Change to Claude Sonnet 3.5

1. Make sure Copilot is in Edit mode

1. Use the following prompt to convert the extension methods in MyExtensions to use the new syntax:

```
Change this class to use the new extension member syntax. Also, make the IsEmpty extension an extension property instead of a method.
```

1. Copilot should fail on this task. Edit mode in Copilot does not use any external tools, and the knowledge cutoff of Claude Sonnet 3.5 is April 2024, long before documentation on the new extension member syntax in C# 14 was available.

    Take note of what Copilot suggests and how it approaches the problem. It might hallucinate a solution based on its training data, or make random changes that don't seem to address the prompt.

1. Do not accept the initial suggestions from Copilot. Instead, click the "Reject" button to undo the changes.

### Step 2. Provide context required for the task

1. Add the following context to the prompt:
```
Change this class to use the new extension member syntax. Also, make the IsEmpty extension an extension property instead of a method.

#fetch https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods
```

1. Click the + button to start a new context.

1. Add the following context to the prompt:
```
Change this class to use the new extension member syntax. Also, make the IsEmpty extension an extension property instead of a method.

#fetch https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods

Double check the syntax is correct by running a dotnet build on this file.
```

1. Review the reasoning output from Copilot. Note that Copilot included the .NET 10 extension member documention in the context, and was now able to generate the correct syntax.