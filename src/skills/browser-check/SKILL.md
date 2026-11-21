---
name: browser-check
description: Opens the user's own app on a local address (localhost, 127.0.0.1, a local HTML file, or a preview address the user names) in a real browser, clicks through one user flow step by step, and reports each step as PASS or FAIL with the console errors, failed requests and screenshots as evidence. Use when asked to "check it in the browser", "click through the sign-up flow", "take a screenshot of the page", "does the page work", "run a journey test" or "check for console errors". Do not use to write a test plan (use test-planner), to audit markup for accessibility (use a11y-audit), to judge visual design (use ui-polish or ux-review), or to open public websites.
version: 0.1.0
---

# browser-check

Opens a page the user runs locally, finds each button, link and field from the user's own words, does what a user would do, and says plainly what happened and which element it used.
Every PASS comes from a real browser: the Playwright browser tools when the agent has them, or the script
`engine/check.mjs` in this folder, run as ONE plain command. Nothing is reported as checked that did not run.

## Allowed commands (read first)

Only these shell commands are needed. Each is one plain command with the full path of the script:
no `cd`, no `node -e`, no shell variables, no pipes, no `;` or `&&`, no temporary scripts.

- `node <path of this skill>/engine/check.mjs --file <page.html> --steps <steps.json>`
- `node <path of this skill>/engine/check.mjs --url http://localhost:<port>/<path> --steps <steps.json>`
- add `--allow-host <host>` only for a preview address the user typed themselves; add `--widths 1280,390` to change widths.

Write the steps file with the file-writing tool, inside `browser-check-out/`. Never install anything, start a server
or run the user's own scripts without asking; when the app is not running, ask the user to start it (layer 06).

## When to use

- Use when someone asks to open their app or a local HTML file in a browser and click through a flow: sign in, sign up, checkout, a form, a menu.
- Use when someone asks whether a page works, for screenshots at desktop and phone width, or for the console errors of a page.
- Do not use to write a test plan or test code; say the fixed sentence of layer 06, step 6.
- Do not use for an accessibility audit or a design review; say the fixed sentence of layer 06, step 7, then check the flow if one was asked.
- Do not use on a public or production website; say the fixed sentence of layer 06, step 3.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: the flow, the address and the defined terms. [layers/01-intent.md](layers/01-intent.md)
2. Context: browser tools first, the script second. [layers/02-context.md](layers/02-context.md)
3. Inputs: an address and a flow; ask when one is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: write the steps, run them, read the result. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: no app, no browser, public site, secrets, boundaries. [layers/06-states.md](layers/06-states.md)
7. Checks: every step ran, every claim has evidence. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact reply format and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the reader and the next agent receive. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

Step actions, targets, the browser-tool mapping and the script's exit codes are in [references/README.md](references/README.md).

## Rules

- R-browser-check-1: A step MUST be reported PASS only when the browser tools or the script ran it and it passed; NEVER report a step that did not run as passed.
- R-browser-check-2: When no browser could run, the first line of the reply MUST be the fixed sentence of layer 06, step 2, and no step may read PASS.
- R-browser-check-3: The skill MUST open only a local address or a local file; another address only when the user typed it themselves; NEVER a public or production site.
- R-browser-check-4: The script MUST be run as ONE plain command with its path (no cd, no node -e, no variable, no pipe, no ; or &&).
- R-browser-check-5: NEVER install packages, start servers or run the user's scripts without the user's yes; ask for it instead.
- R-browser-check-6: NEVER type a real password, card number or personal data; use test values ending in `.test` or given by the user, and say which values were typed.
- R-browser-check-7: Every FAIL MUST give the step, what the browser saw and the screenshot path; NEVER guess a cause in the code.
- R-browser-check-8: Console errors, page errors and failed requests MUST be copied as the browser reported them, also when every step passed.
- R-browser-check-9: NEVER edit the user's app code; the reply reports, the user or a developer fixes.
- R-browser-check-10: The reply MUST follow the format of layer 08: header, Steps, Console and page errors, Failed requests, Screenshots, Not checked, Open questions.
- R-browser-check-11: A request outside the boundary (test plan, accessibility audit, design review) MUST get its fixed sentence from layer 06.
- R-browser-check-12: The skill MUST have the ten core layers, each linked from SKILL.md, and stay self-contained with no repository paths.
- R-browser-check-13: SKILL.md MUST stay within 150 lines, with frontmatter name, description and semver version.
- R-browser-check-14: Every element MUST be found from the user's own words, and the reply MUST say which element was used; when none or several match, NEVER pick one by guess: list the closest elements the page has and ask the user.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Every step in the reply appears in the browser-tool results or the script output, with the same status.
- Every screenshot path in the reply exists on disk.
- Search the reply for "PASS" when the first line is the could-not-run sentence: it must not appear.
- The address in the header is a local address, a local file, or one the user typed.

## Review

A QA lead opens the screenshots next to the reply and confirms each PASS and FAIL; a developer confirms the
errors are copied as reported and no cause is guessed.

## Output

One Markdown reply: a heading, a three-line header (address, browser and widths, step count), numbered Steps,
"Console and page errors", "Failed requests", "Screenshots", "Not checked" and "Open questions".
The exact shape is in [layers/08-output.md](layers/08-output.md).
