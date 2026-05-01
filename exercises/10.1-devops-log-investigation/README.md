# Exercise 10.1: DevOps Log Investigation — When the User Just Says "It's Broken"

## Learning Objectives

- Use Copilot Agent mode to reach beyond your editor and investigate **live cloud resources** (Azure Blob Storage)
- Triage a vague production bug report by routing it to the agent *first*, not after an hour of grep
- Practice giving the agent the *minimum sufficient context* to do real cross-service investigation (frontend → backend → cloud logs)
- Skip the soul-crushing manual ritual of downloading log archives, unzipping them, and `grep`-ing through 47 timestamped files
- Demand evidence — make the agent quote real log lines, not hallucinate stack traces from the source code
- Decide what an agent should and should *not* be allowed to do autonomously when production is on the other end of the prompt
- Have the agent **codify the entire workflow as a reusable skill**, so future production investigations start with one command instead of a fresh prompt

## Overview

You've spent most of this workshop pointing the agent at code. Today we point it at **production**.

Welcome to DevOps, where the bug reports are vague, the logs are voluminous, and the customers are *not* impressed. The traditional help desk procedure for log investigation looks something like this:

1. Click your way through Azure Portal until you find the storage account.
2. Download a few thousand log blobs.
3. Unzip them.
4. Open VS Code with hands shaking.
5. `grep` for "ERROR".
6. Realize that "ERROR" appears 11,000 times in the last 24 hours.
7. Refine your grep with a timestamp.
8. Realize the timestamps are in UTC and the user said "around 5pm."
9. Question your career choices.

We're going to do approximately none of that. Instead, we'll hand the whole problem to the agent — with a carefully written prompt — and let it earn its keep. The agent will reach into Azure Blob Storage, pull the relevant logs, correlate them with the user's report, and tell us what's actually going on.

This is not science fiction. Your agent already has the network access, can authenticate via the tools you have installed (Azure CLI, the Azure SDK, possibly an Azure MCP server), and has the read-comprehension to scan structured logs faster than you can. What it has been missing all this time is **the prompt that tells it to**.

## Exercise Steps

### Step 1: Confirm the Patient Is Actually Sick

Before you investigate a bug, confirm the bug exists. Always.

1. In a regular browser tab (not Copilot), navigate to the live demo site:

    ```
    https://ai-workshop-demo-sb-app.azurewebsites.net/
    ```

1. Take a quick look around. Yes, this is the same Training Management app you've been working with locally — but this is an **actual deployed instance**, sitting on Azure App Service, that "real" users have been hitting. Confirm the home page loads, courses are listed, and the app generally seems alive.

1. **Don't try to reproduce the bug yourself yet.** We're playing the role of a developer who got a ticket and hasn't dug in. We'll let the agent dig.

### Step 2: The Ticket Lands

Open your ticketing system of choice (or just imagine one — go on, picture Jira's loading spinner). Here's what just landed in the queue:

> *"User reports they were unable to register on May 1st for a course and are getting an error."*

That's it. No course ID. No screenshot. No browser info. No timestamp more precise than "May 1st." No error message. Just a vibe.

This is what every help desk ticket eventually looks like, and a *lot* of senior developer time is spent translating tickets like this into actionable problems. Today, we delegate.

### Step 3: Where the Logs Live

The deployed Java/Spring Boot backend writes its console output (stdout/stderr) to an **Azure Storage Account**, in a Blob container at this URL:

```
https://aiworkshopdemologs.blob.core.windows.net/insights-logs-appserviceconsolelogs
```

A few things to notice:

- It's an **Azure Storage Account Blob container** — Azure's S3 bucket equivalent. It holds many small log blobs organized by date and hour.
- The contents are the **App Service console logs** for the backend Java app — i.e., everything our Spring Boot app printed to stdout/stderr while running.
- **The logs are voluminous.** You wouldn't want to download these by hand. (You can, technically. Don't.)

In the Old Days™ (six months ago) you'd open Azure Portal, navigate to the storage account, click around through dated folders, download a `.zip`, extract, and start grepping. Or you'd configure App Insights queries and pretend you remember KQL syntax. Today we're going to ask the agent to do all of that for us, in plain English.

### Step 4: Construct a Real Investigation Prompt

Here's the prompt you're going to use. Read it carefully — this is an example of what *you* would write when handing a real production issue to the agent. The agent isn't psychic; it needs the same context a junior teammate would.

1. In **Copilot Chat**, switch to **Agent** mode. Pick a **reasoning model** (Claude Opus or equivalent) at **High** thinking effort — log correlation across many files is exactly the kind of task where reasoning pays for itself.

1. Type this prompt into the chat. (Type it — don't just paste — to keep the muscle memory from earlier exercises intact.)

    ```
    I have a production bug report that says:

      "User reports they were unable to register on May 1st for a course
       and are getting an error."

    That's all I have — no error message, no course ID, no exact time.

    The backend Java/Spring Boot app is deployed to Azure App Service, and
    it writes its console logs (stdout/stderr) to an Azure Storage Account
    BLOB container at:

      https://aiworkshopdemologs.blob.core.windows.net/insights-logs-appserviceconsolelogs

    These are the Azure App Service console logs for the backend Java app.
    They are organized by date/hour as many small blobs. There are a lot
    of them — please query the blob container directly rather than
    downloading the whole thing.

    Some context that should help you focus the search:
    - Course registration is handled by the backend endpoint
      POST /api/registrations.
    - The relevant frontend page is the course detail page
      (CourseDetail.jsx), which posts the registration form.
    - The relevant backend service is RegistrationService.register(),
      which validates capacity and persists the registration.
    - If something is wrong with capacity, validation, or the database,
      the error will most likely surface as a non-2xx response from
      POST /api/registrations and a stack trace in the console logs.

    Please:
    1. Investigate the logs for May 1st (UTC) and find the failing
       registration attempt(s).
    2. Identify the specific error — exception type, message, and stack
       trace if available.
    3. Correlate it with the registration endpoint and tell me which
       request failed and why.
    4. Propose a fix in the source code (do NOT apply or deploy it yet —
       just propose).
    ```

1. Hit Enter and watch the agent go.

### Step 5: Watch the Agent Investigate

A good run looks roughly like this:

- The agent recognizes it needs to query Azure Storage and reaches for an appropriate tool — `az storage blob list` via the Azure CLI, the Azure SDK, or an Azure MCP server if one is configured. If your environment is set up well, it'll just work. If it isn't, the agent will tell you what credentials it needs (e.g. `az login`).
- It lists blobs under the May 1st date prefix.
- It reads a small handful of the most relevant blobs (it should NOT download all of them — push back if it tries).
- It searches the contents for ERROR / Exception lines around registration calls.
- It identifies the failing request, extracts the stack trace and the offending input.
- It cross-references the stack trace against `RegistrationService.java` (and possibly `CourseDetail.jsx`) to figure out which line is throwing.
- It summarizes the root cause in human language.

A few things to watch for as you observe:

- **Did it cheat by downloading everything?** If it tried to `azcopy sync` the entire container or pull thousands of blobs locally, stop it. That's the *opposite* of what we wanted — we wanted the agent to be smart about which blobs to read.

- **Did it actually open a log file?** Or did it just speculate from the source code? Speculating is not investigating. If the agent says "the bug is probably X" without quoting an actual log line, push back:

    ```
    Show me the exact log line(s) that confirm this. I don't want a guess
    based on the code — I want evidence from the production logs.
    ```

- **Did it propose a fix without an explanation?** A good investigation ends with a *causal story*, not just a patch. "X happened because Y, which is caused by Z at line 47." If the summary is missing the "why," ask for it.

### Step 6: Validate the Diagnosis

Once the agent has produced a summary, your job is to be the skeptical engineer.

1. Read the agent's diagnosis. Then ask yourself:

    - **Does the stack trace make sense given the code?** Open `RegistrationService.java` and trace it yourself. The agent's summary should match what the source can plausibly do.
    - **Is the proposed fix appropriate?** Or is it a band-aid that papers over a deeper issue?
    - **Are there other failing registrations on the same day with a *different* root cause?** Ask the agent to widen the search if it only looked at one log line.

1. Useful follow-up prompts to try:

    ```
    How many registration failures happened on May 1st in total? Group
    them by exception type so I can see whether this is one bug or
    several.
    ```

    ```
    Are there any related WARN or ERROR lines in the minute before the
    failure that suggest an upstream cause (DB connection issue, GC pause,
    request timeout)?
    ```

    ```
    Show me one full log line verbatim so I can see its structure — what
    fields are available, and is there a request ID or user ID we could
    use to correlate frontend telemetry with backend logs?
    ```

### Step 7: Decide the Fix (But Don't Cowboy It)

You now have a diagnosed bug and a proposed fix. **Resist the urge to apply it directly to production.** This is not where AI First means "AI Loose."

1. Ask the agent to produce the fix as a plain code diff against `main`, not a deployed patch:

    ```
    Show me the exact code change you'd make in the source. Do NOT push,
    deploy, or modify the running App Service. I want to review the diff
    and decide whether to take it through normal PR review.
    ```

1. Read the diff. Apply your normal "would I let this through code review?" filter — variable names, edge cases, tests, the lot.

1. If you're feeling adventurous, have the agent commit the fix on a `user/[your-name]` branch — same rule as the rest of the workshop, never `main`, never auto-deploy. Actually shipping the fix to production App Service is **out of scope** for this exercise. We're investigating, not shipping. The blast radius is too big to YOLO.

### Step 8: Close the Loop — Have the Agent Create a Production Troubleshooting Skill

Updating `AGENTS.md` is a fine close-the-loop move. But this whole investigation was meaty enough — and reusable enough — that we can do something better. We're going to ask the agent to **create a skill** out of what it just learned, so that the next vague production ticket can kick off the same workflow with a single command.

This is meta-prompting taken up a level: instead of *us* writing down the lessons, the agent writes them down, because the agent is the one that just lived through them.

1. Prompt the agent — same Agent mode, same reasoning model:

    ```
    Based on everything you just did in this session, create a reusable
    skill called something like "production-troubleshooting" (you pick
    the exact name) so a future agent — or future me in a fresh chat —
    can run this same investigation workflow with one prompt.

    The skill should be saved in the appropriate location for Copilot
    skills/prompt files in this repo (e.g. .github/prompts/ or wherever
    skills live in our setup) and should capture the things YOU learned
    during this session, not just generic advice. Specifically include:

    - The Azure Storage Account BLOB container URL where the App Service
      console logs live, and the fact that they are stored as many small
      blobs organized by date/hour.
    - The fact that these are Java/Spring Boot App Service console logs
      (not App Insights, not Log Analytics).
    - The investigation methodology you actually followed: query the
      blob container directly rather than downloading everything, scope
      the search to the date range from the user report, identify the
      failing request, extract the exception type and stack trace,
      cross-reference against the source code.
    - The non-negotiables you discovered the hard way: demand verbatim
      log lines as evidence (no speculation), do NOT modify or deploy
      to the running App Service, propose fixes as plain diffs that go
      through normal PR review.
    - The relevant code surface area for registration-related issues
      (POST /api/registrations, RegistrationService.register(),
      CourseDetail.jsx) — but written generally enough that the skill
      is useful for ANY production issue, not just registration bugs.
    - A short "inputs the user should provide" section so a future
      caller knows what to include in their initial prompt (the bug
      report text, any timestamps, any affected user/course IDs).

    Be concise but specific. Skills should read like a checklist a
    competent on-call engineer would actually follow, not a wall of
    motivational advice.
    ```

1. Watch where it puts the file. If it picks `.github/prompts/production-troubleshooting.prompt.md` (or whatever the current Copilot skills convention is in this repo), great. If it invents a path that isn't supported by your Copilot setup, push back and tell it to use the location your team actually loads skills from.

1. Review the resulting skill file like you'd review any PR. Some things to check:

    - **Does the skill capture what it's like to *do* the investigation, or does it just describe it?** A good skill is procedural — it tells the next agent what to do, in what order, with what guardrails. A bad skill reads like a blog post.
    - **Did it preserve the guardrails?** "Never deploy directly," "demand evidence," "propose fixes don't apply them" should all be in there. If they got dropped, add them back.
    - **Is it generalized enough?** It should be useful for *any* production issue, not just registration bugs. The registration-specific code references are fine as examples — but the methodology should travel.

1. Commit the skill file on your `user/[your-name]` branch (same rule as always — never `main`, never auto-deploy):

    ```
    Commit the new skill file with a descriptive commit message. Stay on
    the user/[your-name] branch — verify with `git branch --show-current`
    before committing.
    ```

1. **Test it.** Open a fresh Copilot chat, invoke the new skill (e.g. type `/production-troubleshooting` or however your setup invokes it), and feed it a different bug report — even a made-up one like *"reports of slow page loads on /courses around 9am UTC."* Watch the agent step through the same disciplined investigation flow you just walked through. If it does, you've durably leveled up the project.

    > **This is the real payoff.** Step 5 saved you an afternoon. Step 8 saves *every future on-call engineer* an afternoon, every ticket, forever. AI First isn't just about getting the agent to do *this* task faster — it's about getting the project to teach itself how to do whole categories of tasks faster.

## Summary

Take a step back. In this exercise you:

- Verified a live, deployed Azure App Service is up and serving the Training Management app
- Took a *real-shaped* production bug report — vague, sparse, frustrating — and routed it directly to the agent instead of opening a download manager
- Used Copilot Agent mode to query an **Azure Storage Account Blob container** and read structured App Service console logs without downloading them
- Got a real diagnosis (exception type, stack trace, suspect line of code) and a proposed fix without ever running `grep` on a `.log` file by hand
- Demanded evidence — verbatim log lines — instead of accepting the agent's confident-sounding speculation
- Drew a line at "do not deploy" and had the agent **build a reusable skill** out of the session — so the next ticket starts with a single command, not a fresh prompt-engineering exercise

**Think about this:**

- **How long would Step 5 have taken you manually?** Honestly. Open Azure Portal, find the storage account, navigate to the right date, download a zip, extract, grep, sift, correlate, cross-reference against the source. *Hours*, especially if you've never touched the storage account before. The agent did it in *minutes*. That's not a productivity boost — that's a different job description.

- **What's the failure mode you should worry about most?** A confident agent that hallucinates a stack trace it didn't actually read. Always demand evidence. If the agent says "the error was X," ask "show me the exact log line." A good agent quotes; a sloppy one paraphrases; a dangerous one invents.

- **What would you give the agent permission to do *autonomously* in this flow?** Reading logs? Probably yes. Proposing diffs? Yes. Opening PRs on a feature branch? Maybe, with review. Modifying the running App Service or pushing a hot-patch? **Never** — at least not without an extra approval gate. AI First doesn't mean AI Loose. The blast radius matters.

- **The "vague ticket" problem isn't going away.** Real users will always tell you "it's broken" with no further detail. The defining DevOps skill in an AI-First world isn't `grep` mastery — it's writing good investigative prompts and recognizing when an agent is bluffing instead of investigating.

- **AI First reflection.** A year ago, this kind of cross-service investigation (frontend → backend → cloud logs → root cause) was a senior engineer's full afternoon. With one well-written prompt, the agent did the bulk of it in one chat session. What does that mean for how on-call rotations are staffed? For how junior engineers learn the systems they support? For what "level 1 support" even means?

### Additional Things to Try

If you still have time:

- **Widen the time range.** Ask the agent to look at the last 7 days of logs and find any *other* persistent error patterns — slow DB queries, recurring 500s on a particular endpoint, suspicious 401s. Most teams have low-grade error noise that nobody's looked at in months. Surfacing it is free intelligence.

- **Install an Azure MCP server.** If your team uses Azure heavily, install the official Azure MCP server (search the marketplace) so the agent has structured tools for Storage, App Insights, and Log Analytics rather than shelling out to `az`. The investigation gets noticeably tighter, and a future agent in a fresh chat will pick the workflow up immediately.

- **Generate a postmortem draft.** Once you've got the diagnosis, prompt the agent: *"Write a short blameless postmortem in the standard 5-section format (summary, impact, root cause, resolution, prevention) suitable for sharing with the team."* This is a 2-minute task that most teams skip because nobody enjoys writing postmortems. Now nobody has to.

- **Reverse the workflow.** Pretend you're QA. Ask the agent to introduce a *new* subtle bug into the registration flow on a throwaway branch (e.g., "make `register()` throw a NullPointerException when capacity is null"), spin the app up, send a failing request, and immediately re-run today's investigation prompt against the resulting log output. Did the agent diagnose its own sabotage? Great calibration exercise for how much you can trust the workflow on a real ticket.

---

[Next: Capstone — Building a Full Feature with Superpowers](../11.1-superpowers-capstone)
