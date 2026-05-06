# Exercise 9.1: Generating Tests — Edge Case Hunting with AI

## Learning Objectives

- Use AI to work productively in stacks and frameworks you don't know yourself
- Develop intuition for when to spend on a reasoning model vs. a fast/cheap one — model selection is a real skill
- Recognize that AI surfaces subtle edge cases (leap years, timezones, race conditions, weird inputs) that human reviewers routinely miss
- Build safe automation patterns when handing the agent destructive operations like commit and push
- Practice **meta-prompting** — codify what you learn into `AGENTS.md` so the project itself gets smarter over time

## Overview

So far in this course we've mostly been using AI to *understand* code. Now we're going to use it to *verify* code — by generating tests.

Here's the dirty little secret of test writing: most developers are quietly bad at it. Not because we don't know how to write tests — because we can't see around corners. We write tests for the cases we thought of when we wrote the code. The cases we *didn't* think of are, by definition, the ones that bite us in production at 3 AM on a long weekend.

This is where AI earns its keep. LLMs have read millions of real-world bugs — leap year failures, DST spring-forwards, timezone disasters, Unicode in names, integer overflow, race conditions, empty-string form submissions — and they'll happily suggest tests for every one of them. If you ask the right model, the right way.

In this exercise you'll:

1. Let the agent scaffold an entire test project for you — first time we're doing this, and the first time you won't do any setup yourself.
1. See what a **lazy prompt** produces with a **fast, cheap** model at **Low thinking effort**.
1. See what a **well-designed prompt** produces with a **reasoning model** at **High thinking effort**.
1. Compare the two and get an intuition for when each is worth the money.
1. Let the agent commit *and push* for the first time (with guardrails).
1. Teach the agent to run your new tests on every future change.

**One rule:** Pick the side of the stack (frontend *or* backend) you're **less** comfortable with. If you live in Spring Boot all day, pick the React side. If you're a React dev who hasn't touched Java since college, pick the backend. The whole point of this exercise is that **you don't need to know the test framework** — the agent does. That's AI First: reach for AI when you're in unfamiliar territory, not just when you already know what to do.

## Exercise Steps

### Step 1: Pick Your Side

1. Decide: **frontend** or **backend**? Pick the one you'd normally avoid.

    - **Backend** = Java / Spring Boot / Maven → you'll be testing `RegistrationService.java` (the class that handles student registrations and capacity checks).
    - **Frontend** = React / Vite → you'll be testing `CourseDetail.jsx` (the page that displays a course and handles the registration form).

    Both files have a lot of business logic crammed into them. Both have at least one *delicious* edge case hiding in plain sight. No peeking ahead.

1. Open the workshop project in VS Code if it isn't already, and make sure you're on your personal branch:

    ```bash
    git checkout user/[your-name-here]
    ```

    If that branch doesn't exist yet, back up to Exercise 1.1 and create it. Do **not** work on `main`.

1. Open **Copilot Chat** and set the mode to **Agent**. For this first step, use your daily-driver model at **Medium** thinking effort — this is our "serious work" setup.

### Step 2: Let the Agent Scaffold the Test Project

Normally, setting up a test project is the boring part. You dig through docs, copy-paste a `pom.xml` snippet, wrestle with a `vitest.config.js`, pray the imports resolve. We're going to skip all of that.

1. In Agent mode, enter a prompt like the one below. Type it rather than paste — it's short, and the `#file` reference needs to be picked up by Copilot.

    **If you picked backend:**

    ```
    Set up a unit-testing project for the backend. Use JUnit 5 and Mockito
    (the standard Spring Boot testing stack). Do NOT write any real tests
    yet — I just want the test project scaffolded, with a single
    sanity-check test that asserts 1 + 1 == 2, to prove the plumbing works.

    When you're done, update README.md with a section titled "Running
    Backend Tests" that explains how to run the tests from the command line.
    ```

    **If you picked frontend:**

    ```
    Set up a unit-testing project for the frontend. Use Vitest and React
    Testing Library (the standard Vite + React testing stack). Do NOT write
    any real tests yet — I just want the test project scaffolded, with a
    single sanity-check test that asserts 1 + 1 == 2, to prove the
    plumbing works.

    When you're done, update README.md with a section titled "Running
    Frontend Tests" that explains how to run the tests from the command line.
    ```

1. Watch what the agent does. It'll add dependencies, create config files, wire up a test runner, and write a tiny smoke test. Approve its changes as it goes.

1. Review the README changes. Does the command it documented actually look right? (Don't run it yourself yet — we're letting the agent do that.)

### Step 3: Verify the Plumbing (Let the Agent Run the Tests)

Before you touch a terminal, have the agent prove its own work.

1. Prompt:

    ```
    Run the tests you just set up. Report the output.
    ```

1. The agent will execute the command in its integrated terminal and report back. If the sanity test passes — great, plumbing works. If it fails, let the agent fix it before you move on. Do not move on until the smoke test is green.

    > **Why have the agent run them and not you?** Two reasons. First, we're practicing AI First — the agent can do the rote verification faster than you can. Second, if something is wrong with its own setup, *it* should be the one to find out. You have better things to do than chase other people's Maven errors.

### Step 4: Downshift — Fast Model, Low Thinking

Time for a controlled experiment. We're going to intentionally use a weaker setup, see what we get, then upgrade and compare.

1. In the Copilot Chat model picker (bottom of the chat panel), switch to **Claude Sonnet**. Sonnet is Copilot's current latest **1x token rate** model — think of it as your general-purpose workhorse. Fast, cheap, good enough for most tasks.

1. Set **thinking effort** to **Low**. (You'll see this as a dropdown near the model picker.) This tells the model to essentially *not* think before answering — shoot from the hip, first-draft energy.

1. Stay in **Agent** mode.

### Step 5: The Lazy Prompt

Let's prompt like a tired developer at 4:45 PM on a Friday.

1. In the editor, open the file you're testing:

    - Backend: `backend/src/main/java/com/example/trainingmanagement/registration/RegistrationService.java`
    - Frontend: `frontend/src/pages/CourseDetail.jsx`

1. With the file open and focused, type this into Copilot Chat:

    ```
    add some tests for this class
    ```

    Yes, really. All lowercase, no context, no details, no goals. This is the prompt people *actually* write when they're rushed. We're going to see what it gets us.

1. Let the agent run. It'll probably:

    - Generate 4–8 tests covering the obvious happy paths
    - Run them to see which pass
    - Maybe try to fix a failure or two along the way

1. **Watch out for rabbit holes.** If the agent gets stuck in a cycle of "run tests → one fails → tweak the test → run again → now a *different* one fails → tweak again…" for more than a couple of minutes, stop it:

    ```
    Stop. Leave the tests as they are. We'll review what you've written so far.
    ```

    This is a teachable moment in itself — a low-effort model with a bad prompt will happily spin forever chasing green test output. Humans would step back and think. AI won't.

### Step 6: Find What the Lazy Prompt Missed

1. Open the generated test file(s) and read them. Slowly. *Slower than that.*

1. Ask yourself:

    - What obvious cases did it cover? (Happy path? Course not found? Course full?)
    - What edge cases feel like they're **not** there?

1. Here's a short checklist to hold the tests up against. Jot down which of these you think are **missing**:

    **If you picked backend (`RegistrationService.register()`):**

    - Capacity is `null` (unlimited course) — does registration still work?
    - Capacity is `0` — should this always reject?
    - Capacity is negative (somehow set to `-5`) — what happens?
    - Two concurrent registrations on the last seat (race condition)
    - `name` is an empty string, or whitespace only
    - `email` has no `@`, has multiple `@`, is 400 characters long
    - Same email registers twice — allowed or rejected?
    - `courseId` refers to a soft-deleted or archived course
    - `LocalDateTime.now()` — what timezone is the server in? Does CI match dev?

    **If you picked frontend (`CourseDetail.jsx`):**

    - Course date is `"2024-02-29"` — a leap day. Renders correctly?
    - Course date is `"2023-02-29"` — a *non-existent* date. Renders "Invalid Date"?
    - Course date is `"2026-03-08"` — a US DST spring-forward day. Right weekday?
    - User is in UTC-8, backend sends `"2026-01-01"`. What day does the UI show? *(Hint: try it.)*
    - `capacity` is `0`, `null`, negative, or a string like `"25"` — what does the seats-remaining math do?
    - `registrationCount` arrives before `course` — is there a flash of "Full" in the UI?
    - Someone submits the form with an email containing leading/trailing spaces: `"  user@example.com  "`

1. You almost certainly have a list of 3–6 edge cases the lazy prompt missed. **This is the point of the exercise.** Your tests are only as good as the cases you thought to ask about — and a lazy prompt with a fast model doesn't think of many.

### Step 7: Upshift — Reasoning Model, High Thinking

Now let's see what a serious model can do when you give it a serious prompt.

1. Switch the model to **Claude Opus 4.7**. Opus is Copilot's current top-tier reasoning model — roughly 10x the token rate of Sonnet. Use it where it pays off, and test generation on tricky business logic definitely pays off.

1. Set **thinking effort** to **High**. This tells Opus to really chew on the problem before answering — evaluate multiple approaches, hunt for tricky inputs, self-check its own assumptions.

1. Stay in **Agent** mode.

### Step 8: A Well-Designed Edge-Case Prompt

We're going to give the model a *role*, a *goal*, *constraints*, and explicit permission to think adversarially.

1. Use a prompt like the one below. Feel free to tweak — the idea is to set the model up for success, not recite a script.

    **If you picked backend:**

    ```
    You are acting as a senior engineer doing a test-coverage review on
    #file:RegistrationService.java.

    Our existing tests (which you just wrote) cover the obvious happy and
    unhappy paths. I want you to hunt for the SUBTLE edge cases that a
    normal reviewer would MISS — the ones that only cause problems under
    unusual inputs, concurrent requests, timezone boundaries, null
    handling, Unicode or whitespace weirdness, integer edge conditions,
    or assumptions about the server's locale.

    For each missed edge case:
    1. State the case in one sentence.
    2. Explain why it's a real risk (not a theoretical one).
    3. Add a test for it.

    After you've written the tests, run them. If any FAIL, that means you
    found a real bug in the PRODUCTION code — do NOT fix the production
    code. Leave the failing test in place and flag it clearly in your
    summary so we can discuss it.
    ```

    **If you picked frontend:**

    ```
    You are acting as a senior engineer doing a test-coverage review on
    #file:CourseDetail.jsx.

    Our existing tests (which you just wrote) cover the obvious happy and
    unhappy paths. I want you to hunt for the SUBTLE edge cases that a
    normal reviewer would MISS — especially around:
      - date parsing (leap years, DST, timezone boundaries, invalid date
        strings, date-only vs. date-time strings)
      - the seats-remaining arithmetic (null, zero, negative, string
        coercion, floating-point capacity)
      - race conditions between the course fetch and the registrations
        fetch
      - form input quirks (whitespace, Unicode, extreme lengths, copy-
        pasted emails with trailing spaces)

    For each missed edge case:
    1. State the case in one sentence.
    2. Explain why it's a real risk (not a theoretical one).
    3. Add a test for it.

    After you've written the tests, run them. If any FAIL, that means you
    found a real bug in the PRODUCTION code — do NOT fix the production
    code. Leave the failing test in place and flag it clearly in your
    summary so we can discuss it.
    ```

1. Let the agent do its thing. This will take noticeably longer than Step 5 — high thinking effort means the model is actually planning before it writes. That's fine. Go refill your coffee.

### Step 9: Review Round Two — What Surprised You?

1. Read the new tests. For each one, ask:

    - **Did I think of this case in Step 6?** If not, that's a keeper.
    - **Is the test exercising something meaningful?** Or is it theatre?
    - **Did any of them FAIL?** (Congrats — you just found a real bug.)

1. Pause here and genuinely think about it. On the backend, it's very likely the Opus run caught the `LocalDateTime.now()` server-timezone issue, the race condition on the capacity check, or the null-capacity-means-unlimited semantics. On the frontend, it's *almost certain* it caught the UTC-vs-local-date bug in `new Date(course.date).toLocaleDateString(...)` — a bug that probably shipped to production the day this app was built.

    These are bugs a human reviewer would only find after an incident. AI found them in thirty seconds.

    > **Not every suggestion is a winner.** Reasoning models on high effort sometimes over-test — they'll write tests for "what if the name contains a null byte?" or "what if the user's locale is Burmese?" even when that's never going to happen in practice. Delete tests that are more theoretical than real. **You still own every line you commit.**

### Step 10: Commit and Push — Via the Agent (Yes, Push Too!)

We've had the agent commit in earlier exercises, but this is the **first time we're letting it push**. Read the prompt carefully before you send it.

1. Prompt:

    ```
    Commit all of the test-related changes (the new test project, the
    README updates, and all the tests you wrote) with a good descriptive
    commit message. Then push the commit to the remote.

    IMPORTANT: Do NOT commit to main. I should already be on a branch
    named user/[your-name]. Verify this with `git branch --show-current`
    before you commit. If for any reason I'm on main, STOP and tell me —
    do not create the branch yourself, and do not switch branches
    without my approval.
    ```

1. Watch the agent's plan. It should:

    - Run `git status` and `git branch --show-current` to verify
    - Stage the right files (and not, say, your `.env` or a stray log)
    - Write a commit message you'd actually approve
    - Push with `-u` if the branch isn't yet tracked on the remote

1. If anything looks wrong at any step, hit **Cancel**. Guardrails first. You can always re-prompt.

    > You were told to create the `user/[your-name]` branch back in Exercise 1.1. This step is the safety check — if you skipped it, now's when you'll find out.

### Step 11: Teach the Agent to Always Run These Tests

Remember the course's #1 habit: **close the feedback loop.** We just wrote a beautiful set of tests. If we don't tell the agent to actually *run* them on future changes, we're back to square one the next time someone prompts "refactor the registration service" and the agent happily breaks everything.

1. Prompt:

    ```
    Update AGENTS.md so that any future agent working on this project
    ALWAYS runs the [backend|frontend] tests after making changes to
    the [backend|frontend] code, and fixes any failures before
    reporting the work as done. Include the exact command to run the
    tests. Be concise — AGENTS.md is loaded into every session and we
    don't want to bloat it with paragraphs when two lines will do.
    ```

    Swap `[backend|frontend]` for the side you tested. If you want to be bold, ask it to add a rule for *both* sides, and commit to running the equivalent tests on whichever side is changed.

1. Review the `AGENTS.md` diff. Is the instruction clear? Is it short? Could a future agent follow it with no extra context?

1. **This is meta-prompting in action** — the thing we introduced back in Module 6. Every time you learn something the agent should know, teach it to the agent. Codify it. Make the codebase *itself* smarter with every correction, not just the developer sitting in front of it.

### Step 12: Commit and Push (Again)

1. Prompt:

    ```
    Commit the AGENTS.md update and push. Same branch rule as before —
    never main, only user/[your-name]. Use a short, specific commit message.
    ```

1. Done. You now have a test project, a set of real tests that caught real edge cases, AND the project itself will run those tests on every relevant future agent change.

## Summary

Take a step back. In this exercise you:

- Let an agent scaffold an entire test project in a language or framework you may have never used yourself
- Wrote a deliberately lazy prompt with a fast/cheap model and low thinking — got tests, but they missed most of the interesting bugs
- Wrote a careful prompt with a reasoning model and high thinking — got tests that found real, subtle edge cases a human reviewer would almost certainly miss
- Had the agent **commit and push** for the first time, with an explicit guardrail against main
- Taught the project itself (via `AGENTS.md`) to run these tests on every future change

**Think about this:**

- **How many of the edge cases the Opus run found would you have thought of on your own?** Be honest with yourself. This is not a gotcha — it's the entire reason AI-assisted test generation is worth learning.

- **Was the Opus run worth ~10x the tokens?** For test generation on tricky business logic, almost certainly yes. For boilerplate getters and setters? Probably not. Model selection is a real skill, not a line item.

- **Did the lazy prompt produce *dangerous* tests?** Sometimes the bigger problem isn't missing cases — it's *false confidence*. A green test suite that doesn't cover the interesting inputs can feel like coverage when it isn't. Think about what that means for CI/CD.

- **If the agent found a failing test (a real bug in production code), what should happen next?** In a real team, this is a bug to triage and discuss — not a thing to quietly "fix" by tweaking the test until it passes. Remember the "make the tests pass" anti-pattern from Module 7? This is how you avoid its evil twin.

- **AI-First reflection.** You just wrote production-quality tests in a framework you don't know. Twelve months ago that sentence would have read as science fiction. What does your normal workflow look like a year from now if this is *easy*?

### Additional Things to Try

If you still have time:

- **Do it again on the other side of the stack.** You picked backend? Do the frontend now. You picked frontend? Go write some Java. The contrast between stacks is striking — edge cases in date formatting look nothing like edge cases in registration logic, but AI catches both. (And honestly, doing it in both languages in one sitting is a great confidence-builder.)

- **Try the middle setup: Claude Sonnet + Medium thinking + the good prompt.** Is it noticeably worse than Opus High? Sometimes not. When it *is* noticeably worse, that's a data point for your Copilot Journal: "this task needs the heavy-hitter."

- **Go hunt edge cases in a different file.** Try `CourseController.updateCourse()` (backend — partial updates, null overwrites, past dates) or `CourseForm.jsx` (frontend — form input coercion, the hidden `Number("")` quirk). Both are quieter than the files you already tested but just as bug-rich.

- **Turn your best edge-case prompt into a reusable prompt file** at `.github/prompts/edge-case-tests.prompt.md`. Next time you want this workflow, it's a single `/` command away. This is the kind of small investment that compounds.

---

[Next: DevOps Log Investigation](../10.1-devops-log-investigation)
