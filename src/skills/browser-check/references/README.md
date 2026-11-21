# browser-check references

## Table 1: steps for the script

The steps file is a JSON array. Each step has `do`, and `target` and `value` where the table says so.

| do | target | value | What it does |
|----|--------|-------|--------------|
| `goto` | | path or local address | Opens another page on the same host |
| `find` | | the user's words | Lists the buttons, links and fields whose name has those words, best first; always passes |
| `click` | yes | | Clicks the target |
| `fill` | yes | text | Types the text into a field (replaces its content) |
| `select` | yes | option | Chooses an option in a select list |
| `check` | yes | | Ticks a checkbox or radio button |
| `press` | optional | key, e.g. `Enter` | Presses a key in the target or the page |
| `expect-text` | | text | Passes when the text is visible within 5 seconds |
| `expect-no-text` | | text | Passes when the text is not visible |
| `expect-url` | | part of the address | Passes when the address contains it |
| `wait` | | milliseconds, at most 5000 | Waits |
| `screenshot` | | a name | Saves a full-page screenshot with that name |

Targets: `text=Sign in` (visible text), `label=Email` (a field by its label), `placeholder=Search`,
`role=button[name=Save]` (a role and its accessible name), or a CSS selector such as `#email`.
Prefer `label=` for fields and `role=button[name=...]` for buttons: they match what a user sees.
An exact name wins first (`Join` is the button Join, not "Join the team"); a partial match is used only when nothing is exact.
Each action step reports the element it used. With no match, or several, the step fails and lists the closest controls on the page.

Example steps (passed inline as `--steps '<this array on one line>'`):

```json
[
  { "do": "fill", "target": "label=Email", "value": "ana@example.test" },
  { "do": "click", "target": "role=button[name=Sign up]" },
  { "do": "expect-text", "value": "Welcome" }
]
```

## Table 2: the same steps with the Playwright browser tools

| Step | Tool (names vary a little between versions) |
|------|------|
| open | `browser_navigate` |
| click | `browser_click` on the element from `browser_snapshot` |
| fill | `browser_type` or `browser_fill_form` |
| select | `browser_select_option` |
| press | `browser_press_key` |
| see a text | `browser_snapshot`, then look for the text |
| screenshot | `browser_take_screenshot` |
| width | `browser_resize` to 1280 and 390 |
| errors | `browser_console_messages`, `browser_network_requests` |

## Table 3: the script

- Command: `node <path of this skill>/engine/check.mjs (--file <page.html> | --url <address>) [--steps <file>] [--out <dir>] [--widths 1280,390] [--allow-host <host>]`.
- `--file` serves the file's folder on 127.0.0.1 with a free port, so no server needs to be started.
- `--allow-host` lets the script open one more host; use it only for an address the user typed.
- Output folder: a new `browser-check-<time>` folder in the system temp folder by default (never the project; `--out <dir>` to choose), with `end-<width>.png`, `fail-step-<n>.png`, named screenshots and `report.json`.
- Exit codes: 0 every step passed and the page threw no error; 1 a step failed or the page threw; 2 it could not run.
- After a failed step the later steps are NOT RUN; the screenshots at the end are still taken.
- It needs Node.js 18 or later and the `playwright` package (project or global) with its Chromium. When either is missing it prints what to install and exits 2.

## Reviewer items

- [ ] Every PASS and FAIL in the reply matches a browser result.
- [ ] No step reads PASS when the reply starts with the could-not-run sentence.
- [ ] Only local addresses or user-typed addresses were opened.
- [ ] No real password, card or personal data was typed.
- [ ] Errors are copied as reported; no code cause is guessed.
- [ ] No app file was changed.
- [ ] Every action step names the element it used; no element was picked by guess.
