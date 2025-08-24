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

1. Have the LLM now take the role of a prompt engineer:

    ```
    - **Capacity and Role:** An expert prompt engineer skilled in creating efficient and effective prompts for large language models.
    - **Insight:** Our company, Acme Healthcare, is dedicated to improving healthcare outcomes through innovative technology solutions.
    - **Statement**: Write a reusable prompt template for generating job postings for software engineers in the healthcare industry. The prompt should include placeholders for key information such as job title, seniority level, required skills, and company values.
    - **Personality:** Use professional, clear, and concise language optimized for the GPT-4.1 language model.
    - **Experiment**: Provide three different versions of the prompt. The prompt itself should contain instructions to experiment on the output and provide multiple responses.
    ```

1. 

### Step 2. Use the LLM to Create a Reusable Prompt

While the preceeding process can be used to eventually get the desired outcome, we want to create a reusable prompt and save time by utilizing the LLM itself to generate a more effective prompt.

1. Have the LLM now take the role of a prompt engineer:

- Understand how to use an LLM to generate and improve prompts.

## Overview

In this exercise, you will learn how to leverage a large language model (LLM) to create effective prompts for various tasks. You will also explore how to refine and improve these prompts based on feedback and analysis.

OpenAI recently released their latest frontier model - GPT-5. We'll use an LLM to research reviews on this new model by summarizing multiple articles. However, these sources are lengthy, and full of hype and opinion. We want to create a prompt that cuts through the fluff. Instead of spending time prompt engineering we will utilize the LLM to iteratively improve the prompt itself.

## Exercise Steps

### Step 1. Use an LLM to summarize an article

1. Open a browser to https://chatgpt.com/ and enter the following prompt:

```
Summarize the following articles as a single list of bullet points:
- #fetch https://openai.com/index/introducing-gpt-5/
- #fetch https://news.microsoft.com/source/features/ai/openai-gpt-5/
- #fetch https://www.newyorker.com/culture/open-questions/what-if-ai-doesnt-get-much-better-than-this
- #fetch https://www.wired.com/story/gpt-5-coding-review-software-engineering/
```

### Step 2. Use an LLM to review the output of the prompt

1. In the same chat session, enter the following prompt:
```
You are a strict reviewer.
Check each bullet for:
1) word count <= 20
2) subjective/opinion words
3) missing key facts
Return JSON: {
  "violations":[
    {"bullet_index": n, "type":"wordcount|opinion|missing_fact", "reason": "..."}
  ],
  "summary":"..."
}
```

1.
```
Given the violations JSON, propose *specific* prompt edits. Rules:
- No vague advice
- Replace generic verbs with measurable instructions
- Limit outputs
- Add a pre-flight checklist and a post-flight self-check
Return: {"edits":[{"before":"...", "after":"..." }]}
```

### Step 3. Use the new prompt and compare results

## Key Concepts Demonstrated
-->