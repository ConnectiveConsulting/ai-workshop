# Exercise 3.1: Using an LLM to generate and improve prompts

## Learning Objectives

## Overview

## Exercise Steps

### Step 1. Use an LLM to summarize an article

1.
```
Summarize the article in 5 bullet points: https://www.wired.com/story/gpt-5-coding-review-software-engineering/
```

### Step 2. Use an LLM to review and improve the prompt

1.
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
- Add a pre-flight checklist and a post-flight self-check
Return: {"edits":[{"before":"...", "after":"..." }]}
```

### Step 3. Use the new prompt and compare results

## Key Concepts Demonstrated