# Changelog

## 0.1.0 - 2026-11-21

- First version: opens a local address or HTML file in a real browser, clicks through one user flow and reports each step as PASS, FAIL or NOT RUN with console errors, page errors, failed requests and screenshots at 1280 and 390 px.
- Uses the agent's Playwright browser tools when it has them; otherwise the script `engine/check.mjs` (Node.js, uses the project's or the global `playwright` package), run as ONE plain command. The allowed commands are listed at the top of SKILL.md, because harness workers lost turns on denied shell commands.
- Local addresses only, or a preview address the user typed (`--allow-host`); test values only; never installs, starts servers, runs the user's scripts or edits the app without a yes.
- When no browser can run, the first line says so and no step reads PASS.
- Finds every button, link and field from the user's own words (exact name first, then partial), says which element each step used, and when none or several match lists the closest controls on the page and asks the user instead of guessing (R-browser-check-14, new `find` step).
- Writes nothing in the project: steps go inline with `--steps '<json>'` and screenshots to the system temp folder, because a harness worker may only write its assigned files and moves new ones out. When neither the browser tools nor `node` is allowed, it says so with the fix (enable the playwright MCP preset or allow `Bash(node:*)`) and tries no other command (from the Agentic-Harness risk check).
- Requested by Agentic-Harness 1.0.36+ for QA_AUDITOR, UX_DESIGNER and DEV_ENGINEER (journey tests, `mcp__playwright`).
- Windows fix in `engine/check.mjs`: resolve the script path with `fileURLToPath(import.meta.url)` so CLI runs execute on Windows, and split `NODE_PATH` with `path.delimiter` (`;`).
