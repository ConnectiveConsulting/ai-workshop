## Getting Started

First, make sure that any other project processes are killed. Then install dependencies and run the development server (run the commands in a shell of your choice in the `/projects/checklist` directory):

```bash
npm install

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see view the web app.

## Exercises
* Peruse and familiarize yourself with the provided code, use copilot to explain any section you don't understand
* See if you can identify any unnecessary code. Ask copilot if it can identify anything you missed
* There is at least one bug in this code, see if you can find it before revealing the bug below
  * <details>
        <summary>Bug 1 description</summary>
        On the checklist page, the 'Total Tasks Completed' counter should count each task that has been marked completed. This includes tasks that have been marked completed and subsequently deleted.
        Your product owner has noted that the counter seems to double-count completed tasks.
    </details>
* See if you can prompt copilot to explain the root of the problem
* Next, see if you can get copilot to suggest a fix or make the changes for you
* Ask copilot if there is a better way to structure the source code. Do you agree with its assessment?
* Optional Challenge: At present, after creating checklist items, if you navigate to the home page and back to the checklist manager, your previous items are lost. Your product owner has requested that the checklist items remain if you navigate elsewhere in the app.
  * Ask copilot for several options on how to approach this ask
  * If you are feeling brave, implement the suggestion you are most comfortable with. Either using copilot's help, or on your own.
  * <details><summary>Hint</summary> If you are struggling for what to prompt, try asking about Contexts, Providers, and how to persist state between pages. Go with the simplest recommended solution, or move on. This is an optional challenge after all.</details>

## Documentation

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!