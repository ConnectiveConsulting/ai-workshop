# Exercise 3.1: Using an LLM to generate and improve prompts

## Learning Objectives

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