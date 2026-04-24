# Exercise 11.1: Capstone — Building a Full Feature with Superpowers

## Learning Objectives

- Work with **Copilot CLI** (not just the VS Code chat panel) as a full-featured agent environment
- Install and use the **Copilot plugin marketplace** to extend your agent with community skills
- Use the **`superpowers`** plugin to turn a vague feature idea into a designed, implemented, end-to-end change
- Experience an agent-driven *brainstorming → requirements → design → code* workflow — instead of jumping straight to code
- Embrace the chaos: different conversations, different questions, different paths, same underlying workflow

## Overview

You've lived inside the VS Code Copilot chat panel for most of this workshop. That's a lovely environment for day-to-day "help me tweak this file" work. But the agent ecosystem has grown bigger than the chat panel can comfortably hold — community plugins, custom skills, and longer multi-step workflows all fit more naturally into a terminal-driven agent session.

Enter **Copilot CLI** — a terminal-first Copilot agent that runs in any shell, supports plugins, and treats agentic workflows as first-class citizens. In this exercise we'll swap over, install a community plugin called **`superpowers`**, and use it to drive a capstone feature from scratch.

The twist: we are going to deliberately write a **bad, skinny prompt**. In the real world you should cram new-feature prompts with *everything* — acceptance criteria, UX direction, files to touch, patterns to mirror — and you've practiced that all workshop. Today we're doing the opposite on purpose, so you can feel what a plugin like `superpowers` does when given the kind of "let's build X" one-liner a tired developer actually writes. You'll sit in the passenger seat. The agent will drive the brainstorm, the requirements, the design conversation, and only *then* the code.

This is how high-ambiguity features get built in an AI-first workflow. Not with one god-tier prompt, but with a back-and-forth that looks a lot like pair programming with a patient colleague who happens to have read the entire internet.

## Exercise Steps

### Step 1: Switch to Copilot CLI

Up to now you've been in the VS Code Copilot Chat panel. For this exercise we want a terminal-first session — plugins, long conversations, and agentic workflows live more happily there.

1. If you haven't installed Copilot CLI yet, install it globally via npm (Node 20+ was set up in Exercise 1.1):

    ```bash
    npm install -g @github/copilot
    ```

1. Open a fresh terminal and `cd` into the workshop project:

    ```bash
    cd D:/projects/Connective/github/training-management-initial
    ```

1. Make sure you're on your personal branch (**not** `main`):

    ```bash
    git checkout user/[your-name-here]
    ```

1. Start a Copilot CLI session:

    ```bash
    copilot
    ```

    First time? You'll get a browser-based GitHub auth flow. Follow it through and come back to the terminal. You should land at a friendly `>` prompt waiting for input.

    > **Why leave VS Code?** The chat panel is optimized for editing. The CLI is optimized for *composing* — plugins, long-running sessions, scripting, piping, and generally treating the agent as a tool you build workflows around rather than a sidebar you click on. For a feature this open-ended, the CLI is just a better fit. Also: it is genuinely fun.

### Step 2: Install the Superpowers Plugin

`superpowers` is a community plugin (from [@obra](https://github.com/obra)) that ships a library of *skills* — prompted behaviours the agent triggers on specific kinds of tasks. The ones we care about today are the **brainstorming**, **requirements**, and **design-first** skills, which kick in on new-feature prompts and walk through thinking, spec-ing, and sketching *before* any code is written.

1. Inside your Copilot CLI session, add the superpowers marketplace:

    ```
    copilot plugin marketplace add obra/superpowers-marketplace
    ```

1. Install the plugin:

    ```
    copilot plugin install superpowers@superpowers-marketplace
    ```

1. Confirm it landed. You should see a short confirmation message; if you want to be thorough, ask Copilot `/plugin list` (or equivalent) and verify `superpowers` shows up.

### Step 3: Pick a Feature

We're going to build **one** new end-to-end feature for the training-management app. Pick whichever of the four options calls to you. All three of A–C touch the full stack (React + Spring Boot + SQLite) and have enough UX ambiguity to make the agent want to stop and think before writing code.

**Option A — Course Waitlists.** When a course hits capacity, students can join a waitlist. When someone cancels, the next person gets promoted. Good branching UX — the registration form behaves differently when the course is full, waitlisted students need some kind of position indicator, admins need a way to see the whole picture without getting lost.

**Option B — Admin Analytics Dashboard.** A new `/admin/dashboard` page showing aggregate stats: total registrations, fill rates, most popular courses, recent activity. Mostly a read-side feature — some new aggregate API endpoints, a front-end that has to decide how to present the numbers. A study in "what goes on this page and in what shape?"

**Option C — Course Prerequisites.** Let an admin flag one course as a prerequisite for another. Students can't register for a course until they've registered for (or completed) the prerequisite. A new join table, a pre-registration check, a prerequisite display on the course detail page, and an admin UI for picking prerequisites per course.

**Option D — Your own feature.** If none of those inspire you, propose your own. **One strong warning:** resist ambition. Features that sound fun on a whiteboard have a cruel way of eating 45 minutes of agent time. Keep it full-stack but *small* — something like "email a confirmation when someone registers" or "add an admin-visible notes field to registrations." If you're on the fence, pick A, B, or C.

### Step 4: Fire the Starting Prompt

Time for the deliberately sparse prompt we promised.

Reminder: **in real life, this is not how you'd start a feature.** You'd bring specifics — acceptance criteria, which files will be affected, UX direction, patterns to mirror. The fatter the prompt, the less back-and-forth needed. You've done this all workshop.

**Today we go the other way on purpose**, because the whole point is to feel how `superpowers` *fills in the missing structure* — the brainstorm, the spec, the design — instead of plowing into code.

1. Find the starter prompt for your chosen option:

    **Option A (Waitlists):**

    ```
    Let's start a new feature to add course waitlists to the application.
    ```

    **Option B (Analytics Dashboard):**

    ```
    Let's start a new feature to add an admin analytics dashboard to the application.
    ```

    **Option C (Prerequisites):**

    ```
    Let's start a new feature to add course prerequisites to the application.
    ```

    **Option D (Your own):**

    ```
    Let's start a new feature to add [YOUR FEATURE] to the application.
    ```

1. Before you send, you can tack on **one or two** light requirements if you already have strong opinions — e.g. "the waitlist should auto-promote when someone cancels," or "the dashboard should not pull in a new chart library." Keep it light. We want the agent to do the real thinking.

1. Send it.

### Step 5: Confirm Superpowers Actually Kicks In

This is the one checkpoint that matters in this exercise. Without the plugin actively driving, your skinny prompt will just produce skinny code — exactly what we've been training *against* all workshop.

1. Watch Copilot's output for the first few seconds after you send. You should see some sign that the `superpowers` plugin is loading a skill — typically a line mentioning something like `loading skill: brainstorming` (or similar), or language like "before we start writing code, let's think through…". The exact wording varies by version.

1. If you **don't** see any sign that superpowers is engaging — the agent just says "Sure! I'll add a `waitlist` table and…" and starts writing code — something's wrong. Probably the plugin didn't install cleanly, or your prompt didn't trip any of its triggers. Bail out:

    - Press **Esc** to cancel the current turn (or **Ctrl+C** if Esc doesn't do it).
    - Confirm the plugin is installed (`copilot plugin list` or equivalent).
    - Try again with slightly more leading language, e.g. *"Let's brainstorm a new feature to add course waitlists."* The word "brainstorm" is a reliable trigger.

1. Once superpowers is clearly driving the session, carry on.

### Step 6: Ride the Conversation

From here it's a genuine back-and-forth. Everyone's session is going to look different — so rather than follow a script, just engage with whatever conversation you find yourself in. Your agent will probably do some mix of the following:

- **Ask clarifying questions.** How should a waitlist behave when someone cancels? Who can see the dashboard? Should a prerequisite be required or just recommended? Answer honestly. If you don't know, say so — the agent can propose options and you pick.

- **Produce artifacts *before* code.** Expect a requirements doc, a design doc, a data-model sketch, maybe an ASCII wireframe or a markdown UX spec. *Actually read them.* Push back on anything that doesn't match your intent. This is where the feature gets designed, and your input here matters more than any code review later.

- **Offer to show you something visually.** Superpowers has a skill that kicks in when a UX decision is ambiguous and essentially says *"this would be easier to show you visually…"* **Let it.** It may generate an HTML mock, a sketch, or a preview you can open in a browser. This is one of the highlights of the plugin — don't wave it off.

- **Start implementing.** Only after requirements and design are settled. Review the code the same way you've reviewed code all workshop.

- **Poke the app in a browser.** The agent may try to run the app and click around your new feature. Let it. The feedback loop between code and runtime is part of the workflow.

- **Make mistakes.** It will. Fix them together. A bug in generated code is not a failure of the exercise — it's half the point.

> **Go with the flow.** The set of questions your agent asks, the shape of the design doc, the bugs it hits, the UX it surfaces — all of that varies by feature, by model, by phase of the moon. Your neighbour's session will look nothing like yours, and that's fine. This is what high-ambiguity AI-assisted work actually feels like.

### Step 7: Keep Going Until the Feature Works

There is no scripted end state for this exercise. You're done when:

- The feature works end-to-end in the browser.
- You're comfortable with the UX the agent settled on.
- You've reviewed the code (all of it — you still own every line you commit).
- You'd be okay defending the design in a code review.

If you run out of time before the feature is fully finished, commit what you have to your `user/[your-name]` branch so you can pick up later. The conversation history disappears at end of session, but the code and design artifacts stay with you.

## Summary

In this exercise you:

- Swapped from the VS Code Copilot chat panel to **Copilot CLI** — a terminal-first agent environment
- Installed a community **plugin** (`superpowers`) that extended your agent with new skills
- Fired a deliberately vague feature prompt and watched the plugin do the brainstorming, requirements, and design work *before* touching code
- Sat through the first genuinely non-linear agent session of the workshop — one that probably looked nothing like the person next to you
- Built a real end-to-end feature in an app you don't own, in a workflow most of the industry hasn't caught up to yet

**Think about this:**

- **What did the superpowers plugin do that you wouldn't have done on your own?** Be honest. Most developers skip the design step when they're under deadline pressure — that's why so much software looks the way it does.

- **Was the agent's design *your* design?** If not, how did you negotiate? A good AI-first workflow is not "agent proposes, human rubber-stamps." It's a real conversation, and the best feature comes out of the friction.

- **When the agent offered to show you something visually, did you take it up on the offer?** If you said no, why? Visual design sketches in agent-land cost a few seconds of model time and save you minutes of "wait, that's not what I meant." It's a ridiculously good deal.

- **Could you have done this with the skinny prompt and no plugin?** You've felt how much guidance the plugin provides. A base agent with a skinny prompt just writes code. A plugged-in agent with a skinny prompt designs a feature.

- **Does this change how you'll start a feature next Monday at work?** If nothing else, the lesson is that **the first hour of a feature is design, not code** — and AI is now good enough to be your design partner, not just your autocomplete.

### Additional Things to Try

If you still have time (and energy):

- **Iterate on the feature.** Once it works, tell the agent: *"critique this feature from a UX perspective"*, or *"what edge cases haven't we handled?"* The same conversational pattern applies to iteration.

- **Try a different option.** Start a fresh session on a new branch and pick another one from A/B/C. The second one will go about twice as fast — you now know the shape of the conversation.

- **Compare CLI-with-plugin vs. VS Code Chat alone.** Fresh branch, same feature, no plugin, VS Code chat. See how different the output feels. The gap is the *plugin* — not the model, not the tooling, the *behaviour library*.

- **Capture your favourite starter prompt as a prompt file** at `.github/prompts/new-feature.prompt.md`. After today you know the shape of a prompt that triggers the design-first workflow. Future-you will thank you.

---

*This is the final exercise on the demo training application. Congratulations — you've built, tested, and extended a full-stack app end-to-end with AI as your copilot.*
