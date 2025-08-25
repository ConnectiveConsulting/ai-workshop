# Exercise 3.1: Writing Better Job Descriptions with Prompt Engineering

## Learning Objectives

- Understand how vague prompts lead to generic or unhelpful outputs.
- Practice iterative refinement of prompts by adding context, constraints, and roles.
- Learn how to collaborate with an LLM to optimize prompts for reuse.
- Apply prompt-engineering frameworks (e.g., CRISPE: Context, Role, Intent, Style, Persona, Examples) to build structured, reusable prompts.

## Overview

In this exercise, you will explore how prompt engineering improves results in two phases:

1. Iteratively refining a vague prompt to produce a stronger, more tailored output.
1. Collaborating with the LLM to build a reusable job description prompt template for software engineers that you could apply again and again.

This will demonstrate both the tactical skill of refining prompts on the fly and the strategic skill of designing reusable prompt frameworks.


## Excercise Steps

### Step 1. Write and refine a prompt

1. Open a new instance of Visual Studio Code without any open folder.
    
    > We don't want the model to have any context from previous projects or files, so starting fresh is essential.

1. In the GitHub Copilot chat window change the agent mode to ``Ask``.

1. Enter the following prompt:

    ```
    Write a job description for a software engineer.
    ```

    Observe that the result is likely too generic. The model fulfilled your request but didn't bother to ask clarifying questions or seek additional context.

1. Add specificity: Refine the prompt by adding constraints such as:
    - Seniority level (junior, mid, senior).
    - Industry (e.g., healthcare, manufacturing, finance, SaaS).
    - Tech stack (e.g., JavaScript, Python, AWS).
    - Location (e.g., remote, onsite, hybrid).

    Example prompt:
    ```
    Write a job description for a senior software engineer in the healthcare industry with expertise in .NET, React, and Azure, and a preference for remote work.
    ```

1. Add structure: Refine the prompt further by providing a clear structure or template for the job description. This could include sections for responsibilities, qualifications, and company culture.
    
    Example prompt:
    ```
    Write a job description for a senior software engineer in the healthcare industry with expertise in .NET, React, and Azure, and a preference for remote work.

    Our company, Acme Healthcare, is dedicated to improving healthcare outcomes through innovative technology solutions.

    Use the following format:

    # Overview

    (Company description, job description)

    # Responsibilities

    (List of responsibilities for the job)

    # Qualifications:

    (List of qualifications for the job)
    ```

1. Rewrite into the CRISPE format (Capacity & Role, Insight, Statement, Personality, Experiment):

    Example prompt:
    ```
    - **Capacity and Role:** Technical recruiter with expertise in hiring software engineering roles.
    - **Insight:** Our company, Acme Healthcare, is dedicated to improving healthcare outcomes through innovative technology solutions.
    - **Statement**: Write a job posting for a senior software engineer in the healthcare industry with expertise in .NET, React, and Azure, and a preference for remote work.
    - **Personality:** Use professional, clear, and concise language; bullet points for responsibilities and qualifications; highlight growth opportunities and company values.  
    - **Experiment**: Provide three different versions of the job posting using different approaches.
    ```

1. Read through the outputs. Did they meet your expectations? Were there any surprising elements?

### Step 2. Use the LLM to Create a Reusable Prompt

While the preceeding process can be used to eventually get the desired outcome, we want to create a reusable prompt and save time by utilizing the LLM itself to generate a more effective prompt.

1. Start a new chat session by clicking the ``+`` button in the Copilot chat window.

1. Have the LLM now take the role of a prompt engineer. We will create a simple prompt telling the LLM to create the prompt for us.

    Prompt:
    ```
    You are an expert prompt engineer skilled in creating efficient and effective prompts for large language models.
    Write a prompt for generating job postings for software engineers roles.
    Ask me questions until you have enough information to create a detailed and effective prompt.
    ```

1. Answer the questions the LLM asks. Iterate until the prompt seems to contain all of the context required for the posting.

1. Copy the prompt, start a new chat session and paste it in.

1. Review the output. Was the prompt effective in generating the desired job posting? How did this strategy compare to writing the prompt from scratch?

## Summary

In this exercise, we learned how to create effective prompts for generating job postings for software engineering roles. By iterating on our prompts and incorporating feedback, we were able to refine our approach and produce high-quality job descriptions.

---

[Next: GitHub Copilot Custom Instructions](../exercises/4.1-instructions/README.md)
