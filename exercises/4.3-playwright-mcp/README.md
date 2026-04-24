# Exercise 4.3: Visual Bug Hunt — Teaching the Agent to See

## Learning Objectives

- Install and configure the **Playwright MCP** server so Copilot can drive a real browser
- Use browser-based MCP tools to let an agent *see* a running app — not just read its source
- Reproduce a bug report at the viewport the customer is actually using, not the one on your monitor
- Diagnose a responsive CSS bug that is invisible from both desktop-only testing and source-only review
- Verify a fix at multiple viewport widths before declaring the ticket closed
- Feel the gap between "reads code" and "sees rendered output across device sizes," and why closing that gap unlocks a whole class of bug fixes

## Overview

Up to now, your AI agent has been flying blind. It reads your code. It reads your files. It reads your configs. But it has never actually **looked** at the app it's working on. For a large class of bugs — layout, spacing, alignment, color, responsive weirdness — that's like asking a surgeon to operate by reading the patient's medical history. Useful! But you probably also want them to, you know, *see the patient*.

Today we're giving the agent eyes.

**Playwright MCP** is a Microsoft-maintained server that exposes a real browser instance as MCP tools. The agent can navigate pages, click buttons, type into inputs, take screenshots, resize the viewport, and inspect the DOM — everything a QA engineer does, minus the existential dread of manual regression testing. And the first thing we're going to do with this new superpower is hunt a bug that **cannot** be found by reading the code alone.

Here's the setup. You're going to play the role of a developer who just received a vague, slightly grumpy bug report from Support:

> *"Mobile users are saying the home page layout is messed up."*

That's it. No screenshots. No repro steps. No device information. Welcome to real life.

On your desktop the page looks fine, so if you only know how to read source and poke around in your own browser at 1440px wide, you are about to have a bad day. But with Playwright MCP, the agent can resize its browser to a phone viewport and see exactly what the customer sees — and then fix it.

## Exercise Steps

### Step 1: Make Sure the App Is Running

If you already have the app running from a previous exercise, skip ahead to Step 2.

1. Open the workshop project (`ai-workshop-project`) in VS Code.

1. Make sure you're on your personal branch:

    ```bash
    git checkout user/[your-name-here]
    ```

1. In **Agent** mode, have the agent start things up:

    ```
    Start both the frontend and backend. When the frontend is ready, tell me the URL.
    ```

1. Open the app in your regular browser at the URL it reports (typically `http://localhost:5173`). If it's empty, click **Seed Sample Data** in the admin area (`/admin`) so the home page has some courses on it.

1. Take a quick look at the home page. It probably looks fine to you — clean grid of course cards, nothing obviously broken. That's part of the setup. The issue only shows up under certain conditions, and you may not catch it by eyeballing it in your desktop browser. **Resist the temptation to go hunting yourself.** Let the agent do the work.

### Step 2: Install the Playwright MCP Server

MCP servers are installed once and can then be used across any Copilot session. We're going to install Playwright MCP at **user scope** so it's available on every project going forward, not just this one.

1. Open the **Copilot Chat** panel and switch to **Agent** mode.

1. Prompt:

    ```
    Register the Microsoft Playwright MCP server (npm package @playwright/mcp)
    in my Copilot MCP configuration at user scope so it's available across
    all projects. After it's registered, verify the new tools are available
    by listing them. Do NOT use it to do anything yet — just confirm
    it's wired up.
    ```

1. The agent will edit your MCP configuration (typically `~/.config/github-copilot/mcp.json` or similar, depending on your OS and Copilot version) and then list the new tools. You should see a family of tools prefixed with something like `playwright_` — navigate, click, type, screenshot, snapshot, and friends.

    > **Why user scope?** Playwright MCP is useful on essentially every web project. Installing it globally means you don't re-register it every time you `cd` into a new repo. Per-project scope is great for MCPs that are specific to one codebase. Global scope is better for tools that are generally useful, like a browser.

1. If Copilot asks you to reload the window or restart the chat session to pick up the new MCP server, do that. Then open a **fresh chat** so the new tools are available in your session.

### Step 3: Point the Agent at the App

Let's confirm the agent can actually reach the running app with its new eyes.

1. In Agent mode, prompt:

    ```
    Using the Playwright MCP tools, open http://localhost:5173 in the browser,
    wait for the page to finish loading, and take a screenshot of the home
    page. Then describe in 2–3 sentences what you see.
    ```

1. Watch the tool calls. The agent will navigate, snapshot the page, and give you a short description. Congratulations — your agent just *saw your app* for the first time.

1. Take a quick look at the screenshot too, just to confirm the page loaded correctly (courses visible, nav bar at the top, etc.). Still, try not to stare too hard — you're not the detective today.

### Step 4: Forward the Bug Report to the Agent

Now the interesting part. We're going to hand the agent the same thin bug report you'd get from a real support queue — and see if it knows what to do with it.

1. Paste this verbatim into Copilot Chat (Agent mode, Playwright MCP available):

    ```
    We just got a support ticket: "Mobile users are saying the home page
    layout of the training app is messed up." That's all we have.

    The app is running at http://localhost:5173. Please investigate using
    the Playwright MCP tools and tell me what's wrong. Rules:
    - Do NOT fix anything yet — I want a diagnosis first.
    - Do NOT guess from reading the code alone. Reproduce the problem
      in the browser first, then confirm the cause in the source.
    - Show me a screenshot of what the customer is seeing.
    ```

1. Watch the agent work. A good run looks like this:

    - Navigate to the home page in Playwright.
    - Notice the desktop view looks fine.
    - **Realize the report is about mobile** and resize the Playwright browser to a phone viewport (typically 375×667 or similar).
    - Reload / re-screenshot at that viewport.
    - See an immediately obvious layout problem.
    - Inspect the DOM / computed styles to identify which CSS rule is at fault.

    If the agent *doesn't* think to resize the viewport, that's itself an interesting miss — it's reading the same ticket you did, and "mobile users" is the key word. Nudge it:

    ```
    Did you actually test this at a mobile viewport size? The report is
    about mobile users specifically. Please resize the browser to a
    common phone size (e.g. 375px wide) and try again.
    ```

1. **Pause here before moving on.** What did the agent show you? Is the problem at mobile width obvious in the screenshot? This is the payoff moment — a bug that would be *invisible* to anyone doing desktop-only review is screaming at you on the agent's phone-sized browser.

    > **If you're stuck** — e.g. the agent keeps insisting it can't see a problem, or it's reporting the wrong thing — here's a hint about what the customer is actually experiencing. Don't read this unless you need it:
    >
    > - At mobile viewport widths (say 375px wide), the home page has severe horizontal overflow. The course cards are way wider than the screen. The user has to scroll sideways to see any card in full, and the layout looks completely broken — classic "this website doesn't work on my phone" complaint. The cause is in the grid CSS for the course list.

### Step 5: Root-Cause It

If the agent correctly spotted a visual issue but didn't chase it down to a specific CSS rule, push it one level deeper. Seeing is the first half; naming the cause is the second half.

1. Prompt:

    ```
    Good. Now find the exact CSS rule causing this. Inspect the computed
    styles on the affected elements using Playwright, then cross-reference
    against the frontend source to identify the specific file and property
    that's wrong.

    Tell me:
    1. The file path and property that's incorrect.
    2. The current value.
    3. The value it should be.
    4. In one or two sentences, WHY the current value produces the wrong
       visual result.
    ```

1. The agent will inspect the DOM, find the relevant class (likely `.course-grid`), then search the `frontend/src` directory for that class and locate the offending rule. This is where rendering + code search combine into something more powerful than either on its own — reading the CSS in isolation, the rule probably looks like an innocent "responsive tweak." At a 375px viewport it's a disaster.

1. Read the agent's explanation. If it's doing its job, it should be able to tell you not just *what* rule is wrong, but *why* the rule breaks at mobile widths specifically — the math behind how the grid computes its column widths given the rule's inputs and the available viewport.

### Step 6: Fix It — and Verify Visually at Mobile Width

Now we commit the fix, and we verify it with the **same tools** we used to find it.

1. Prompt:

    ```
    Apply the minimal fix for this bug. After applying the fix, reload
    the home page in the Playwright browser AT THE SAME MOBILE VIEWPORT
    WIDTH you used to reproduce the issue, and take a new screenshot to
    confirm the layout now looks correct on mobile. Also take a
    screenshot at desktop width (1440px) to confirm you haven't broken
    the desktop layout. Put the before/after screenshots in your summary
    so we can compare.
    ```

    The "verify at the same viewport you reproduced at" rule is important. Agents often "fix" a bug and then screenshot the *default* browser size, which in Playwright is usually desktop-ish. You can easily close out a ticket that still reproduces for the actual customer.

1. The agent should:

    - Edit the CSS.
    - Reload the page via Playwright.
    - Screenshot the "after" state.
    - Explicitly confirm the fix worked based on what it sees, not based on "my edit was correct."

1. Review both screenshots yourself. The before/after comparison is the point — this is what a tight visual-feedback loop feels like when the AI is also the one closing the loop.

### Step 7: Close the Loop (Teach AGENTS.md)

Remember the workshop's #1 habit: **close the feedback loop**. We just taught the agent how to use a browser *and* how to test at multiple viewport widths. Let's make sure it doesn't forget by next Tuesday.

1. Prompt:

    ```
    Update AGENTS.md with a short note that for visual, layout, or styling
    issues, the agent should use the Playwright MCP tools to inspect the
    rendered page rather than guessing from source alone — and when the
    issue mentions a specific device or viewport (mobile, tablet, etc.),
    to reproduce and verify at that viewport width. Keep it tight — two
    or three lines max. AGENTS.md is loaded every session and we don't
    want bloat.
    ```

1. Review the diff. Two lines is plenty. A future agent session will now know to reach for the browser instead of reading CSS and hoping.

### Step 8: Commit

1. Prompt:

    ```
    Commit the CSS fix and the AGENTS.md update with a descriptive commit
    message. Stay on the user/[your-name] branch — do NOT commit to main.
    Verify the branch with `git branch --show-current` before committing.
    ```

1. Done. You now have a working MCP-driven visual bug workflow, a clean fix on a branch, and a project that will default to visual inspection on layout issues going forward.

## Summary

Take a step back. In this exercise you:

- Installed the Playwright MCP server at user scope and gave your agent a real browser
- Handed your agent a realistic, thin support ticket and watched it diagnose the problem at the viewport width that mattered
- Found a responsive CSS bug that is effectively invisible from desktop-only review — and *also* invisible from a code-only review
- Had the agent propose, apply, and *visually verify* a fix at both mobile and desktop widths
- Updated `AGENTS.md` so multi-viewport visual inspection becomes the default approach on layout work

**Think about this:**

- **Would you have caught this just by reading the CSS?** The offending rule is sitting under a comment that says "Responsive tweaks for smaller screens." That's exactly the kind of thing that looks innocent in a diff. The only way to be sure it's wrong is to render it at the sizes it's supposed to support.

- **How often do you personally test at mobile widths?** Be honest. Most of us resize the browser once when a ticket lands, eyeball it, and move on. The agent will do it on every touch of every layout, forever, if you tell it to. That's a durable upgrade.

- **How many production bugs of this shape are lurking in your real codebase?** Responsive issues at specific breakpoints. Components that look fine in the storybook and blow up in context. Accessibility regressions at narrow widths where tap targets overlap. Visual testing has historically been the flakiest corner of automation — MCP gives us a cheap, agent-driven alternative that lives in the same tool where the code gets written.

- **What else could an agent do with a browser?** This barely scratches the surface. Full user-flow smoke tests. Accessibility audits with `axe-core`. Visual regression diffs across branches. Performance profiling. Anything a human QA engineer does, but repeatable and integrated into the same agent that writes your features in the first place.

- **"AI first" reflection.** When the agent can read the code *and* see the rendered page *and* resize the browser, the loop of "open DevTools, toggle device toolbar, refresh, squint, tweak CSS, repeat" collapses into a single prompt. What does your normal workflow look like a year from now if this is *easy*?

### Additional Things to Try

If you still have time:

- **Sweep more viewports.** Prompt the agent to take screenshots of the home page at 1440px, 1024px, 768px, 480px, and 320px, and report any other responsive weirdness it notices. The bug you fixed was the big one, but responsive edges often hide multiple issues clustered around the same breakpoint.

- **Audit other pages.** Point the agent at `/courses/1`, `/admin`, and `/admin/courses/new` at mobile width. Are any of *those* pages broken on a phone? Worth knowing before a real user tells you.

- **Drive a full user flow on mobile.** Try *"Using Playwright at a 375px viewport, browse to a course, register with test data, and confirm you land on the confirmation page. Report whether the mobile flow works end to end."* This is your first taste of agent-driven mobile E2E testing, and it's genuinely fun.

- **Reverse the exercise.** Break something else yourself at a specific breakpoint, hand the page to the agent with a deliberately vague ticket (*"some users say the admin page looks off"*), and see if it thinks to probe multiple viewports. Great calibration for how well your agent handles ambiguity.

---

[Next: Building Features with AI](../5.1-building-features)
