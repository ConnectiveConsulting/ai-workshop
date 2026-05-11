# Exercise 4.3: Visual Bug Hunt — Teaching the Agent to See

## Learning Objectives

- Understand how MCP servers extend an agent's capabilities — in this case, by giving it a real browser
- Recognize that some bugs only exist at runtime, and that agents which can *see* the rendered app find an entire class of issues that source-only review cannot
- Reproduce issues in the conditions the customer is actually in (viewport, device, environment), not yours
- Use the same visual feedback loop to verify a fix that you used to find the bug
- Codify durable habits in `AGENTS.md` so future sessions default to the right approach

## Overview

Up to now, your AI agent has been flying blind. It reads your code. It reads your files. It reads your configs. But it has never actually **looked** at the app it's working on. For a large class of bugs — layout, spacing, alignment, color, responsive weirdness — that's like asking a surgeon to operate by reading the patient's medical history. Useful! But you probably also want them to, you know, *see the patient*.

Today we're giving the agent eyes.

**Playwright MCP** is a Microsoft-maintained server that exposes a real browser instance as MCP tools. The agent can navigate pages, click buttons, type into inputs, take screenshots, resize the viewport, and inspect the DOM — everything a QA engineer does, minus the existential dread of manual regression testing. And the first thing we're going to do with this new superpower is hunt a bug that **cannot** be found by reading the code alone.

Here's the setup. You're going to play the role of a developer who just received a vague, slightly grumpy bug report from Support:

> *"Mobile users are saying the home page layout is messed up."*

That's it. No screenshots. No repro steps. No device information. Welcome to real life.

On your desktop the page looks fine, so if you only know how to read source and poke around in your own browser at 1440px wide, you are about to have a bad day. But with Playwright MCP, the agent can resize its browser to a phone viewport and see exactly what the customer sees — and then fix it.

> **Heads up: this is a Copilot CLI exercise.** We're driving everything from the terminal, not from the VS Code chat panel. The MCP server we'll be using is registered at the CLI's user scope (more on that in Step 2), and the IDE chat panel reads MCP servers from a different file — so Playwright wouldn't even show up over there. Keep your editor open if you want to peek at code, but the agent prompts all go to the CLI.

## Exercise Steps

### Step 1: Start a CLI Session and Get the App Running

We'll use the **Copilot CLI** to start the project, just like you did in Exercise 1.2 — except this time we're driving from the terminal. The same CLI session you start here is the one you'll use for the entire exercise, so keep this terminal open.

1. Open a fresh terminal, navigate to the workshop project, and start a Copilot CLI session:

    ```
    cd C:\Workshop\project              # on the lab VM
    cd C:\workshop\ai-workshop-project  # on your local machine (example path — use wherever you cloned it)
    copilot
    ```

1. **If the app isn't already running from a previous exercise**, ask the CLI to start it:

    ```
    Start up the project - both the backend and frontend. When it's running,
    tell me the URL to open the frontend in my browser.
    ```

    The agent will run the dev commands, watch the logs, and tell you when both are up. If you get a Windows firewall prompt for the JDK, click "Allow access" so the agent can confirm the backend is reachable.

    If the app *is* already running from a previous exercise, just tell the agent that and ask it to confirm — e.g., "The backend should be up at localhost:8080 and the frontend at localhost:5173. Confirm both are reachable." Then move on.

1. Open the app in your regular browser at the frontend URL (typically `http://localhost:5173`). If it's empty, click **Seed Sample Data** in the admin area (`/admin`) so the home page has some courses on it.

1. Take a quick look at the home page. It probably looks fine to you — clean grid of course cards, nothing obviously broken. That's part of the setup. The issue only shows up under certain conditions, and you may not catch it by eyeballing it in your desktop browser. **Resist the temptation to go hunting yourself.** Let the agent do the work.

### Step 2: Inspect (or Install) the Playwright MCP Server

The MCP server registration is just a small JSON snippet — you'll see how small in a moment. The lab VMs have it pre-installed; if you're on your own machine you'll register it yourself in this step (it's quick). Either way, the goal is the same: by the end of Step 2, your Copilot CLI knows how to launch Playwright MCP, and you've seen the under-the-hood config that makes it tick.

Pick the path that matches your setup.

#### Path A — Lab VM (already installed)

Good news: we already installed the Playwright MCP server on your workshop machine for you, so you can skip the wrestling-with-config part and get straight to the fun stuff. But before we move on, let's open the config file so you can see what an MCP server registration actually looks like under the hood — it's surprisingly small.

1. Open **File Explorer** and navigate to `C:\Users\workshopadmin\.copilot`. This folder is where your user-specific Copilot settings and customizations live — MCP server registrations, your AGENTS.md overrides, custom skills, and so on. Anything you put here applies to every project on this machine, not just one repo.

1. Open the `mcp-config.json` file. It should look like this:

    ```json
    {"mcpServers":{"playwright":{"args":["@playwright/mcp@latest"],"command":"npx"}}}
    ```

1. Take a moment to read through the syntax. There isn't much to it, and that's kind of the point. A couple of things worth noticing:

    - **MCP servers come in two flavors.** Some are remote websites that speak the MCP protocol over HTTP. Others — like this one — are local processes that speak it over stdio. The agent doesn't really care which is which; it just needs to know how to reach the server.
    - **This particular MCP server is just an npm package.** `@playwright/mcp` is published on the public npm registry. We use `npx` to download and run it on demand — no global install needed. The agent simply runs whatever `command` and `args` you put here to start the server, then talks to it over stdio.
    - That's the whole trick: **you give the agent a way to start a process; the process speaks MCP; the agent gets new tools.** Demystifying, right?

1. Close the file without saving. We didn't change anything — we just wanted you to see the wiring before we go use it. (If you accidentally edited it, hit Ctrl+Z until it looks like the original, or just don't save.)

    > **Why pre-install?** In a real engineering org you'd register MCP servers yourself, often at user scope so they're available across every project — exactly the kind of thing your onboarding doc or platform team should hand you. We did it for you on these workshop machines purely to save time, not because the install is hard. The actual registration is exactly the one-line snippet you just looked at — and it's exactly what your local-machine classmates are doing for themselves right now.

#### Path B — Local machine (install it yourself)

You're going to do exactly what's pre-baked on the lab VMs: drop a small JSON snippet into your user-scope Copilot config file. Two ways to do it — pick whichever you prefer.

**Option 1 — Let Copilot CLI add it interactively.** This is the easiest path. At the Copilot CLI `>` prompt (the session you started in Step 1), run:

```
/mcp add
```

The CLI walks you through it. When prompted, name the server `playwright`, set the type to `local`, set the command to `npx`, and set the args to `@playwright/mcp@latest`. That's it.

**Option 2 — Edit the config file by hand.** Open `%USERPROFILE%\.copilot\mcp-config.json` in your editor. If the file (or the `.copilot` folder) doesn't exist, create it. Add the following:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "local",
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "tools": ["*"]
    }
  }
}
```

If you already have other MCP servers in this file, just add `playwright` as another entry under `mcpServers` — don't overwrite the file.

After you've added the server (either option), take a moment to read the snippet. There isn't much to it, and that's kind of the point:

- **MCP servers come in two flavors.** Some are remote websites that speak the MCP protocol over HTTP. Others — like this one — are local processes that speak it over stdio. The agent doesn't really care which is which; it just needs to know how to reach the server.
- **This particular MCP server is just an npm package.** `@playwright/mcp` is published on the public npm registry. We use `npx` to download and run it on demand — no global install needed. The agent simply runs whatever `command` and `args` you put here to start the server, then talks to it over stdio.
- That's the whole trick: **you give the agent a way to start a process; the process speaks MCP; the agent gets new tools.** Demystifying, right?

Now restart your Copilot CLI session so it picks up the new server registration: hit `Ctrl+C` (or type `/exit`) to leave the session, then run `copilot` again from the same project folder.

> **What you just did, in one sentence:** you registered Playwright MCP at *user scope* — meaning every Copilot CLI session on your machine, in any project, will now have a browser available. That's the same scope the lab VMs use, and it's a sensible default for tools you'd want everywhere.

### Step 3: Verify Playwright MCP Is Loaded

The CLI session you started in Step 1 should already have Playwright MCP available — it's wired into the user-scope config you just looked at, so every CLI session on this machine picks it up automatically. Let's confirm.

1. Pop back over to your CLI session and run:

    ```
    /mcp
    ```

    You should see `playwright` listed with a healthy status and a family of tools (navigate, click, take_screenshot, resize, snapshot, and friends). If it's missing or shows an error, something's off with the registration we looked at in Step 2 — flag a workshop instructor before you spin your wheels.

1. From here on out, every "prompt" in this exercise goes into this CLI session. If you've been bouncing between the IDE chat panel and the CLI in earlier exercises, this is one of those exercises where it really has to be the CLI.

### Step 4: Point the Agent at the App

Let's confirm the agent can actually reach the running app with its new eyes.

1. At the CLI prompt, type:

    ```
    Using the Playwright MCP tools, open http://localhost:5173 in the browser,
    wait for the page to finish loading, and take a screenshot of the home
    page. Then describe in 2–3 sentences what you see.
    ```

1. Watch the tool calls. The agent will navigate, snapshot the page, and give you a short description. Congratulations — your agent just *saw your app* for the first time.

1. Take a quick look at the screenshot using VS Code (it will be in the root of the project), just to confirm the page loaded correctly (courses visible, nav bar at the top, etc.). Still, try not to stare too hard — you're not the detective today.

1. Keep the browser window that Playwright created open. This is the agent's viewport into the app, and it will use this same window for the rest of the exercise.

### Step 5: Forward the Bug Report to the Agent

Now the interesting part. We're going to hand the agent the same thin bug report you'd get from a real support queue — and see if it knows what to do with it.

1. Paste this verbatim into your CLI session:

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

### Step 6: Root-Cause It

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

### Step 7: Fix It — and Verify Visually at Mobile Width

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

### Step 8: Close the Loop (Teach AGENTS.md)

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

### Step 9: Commit

1. Prompt:

    ```
    Commit the CSS fix and the AGENTS.md update with a descriptive commit
    message. Stay on the user/[your-name] branch — do NOT commit to main.
    Verify the branch with `git branch --show-current` before committing.
    ```

1. Done. You now have a working MCP-driven visual bug workflow, a clean fix on a branch, and a project that will default to visual inspection on layout issues going forward.

## Summary

Take a step back. In this exercise you:

- Saw how the Playwright MCP server is registered with the Copilot CLI at user scope, and started a CLI session that gave your agent a real browser
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

[Next: DevOps Log Investigation — When the User Just Says "It's Broken"](../10.1-devops-log-investigation)
