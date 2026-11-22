---
name: bug-hunter
description: Hunts for real bugs in a project's code, read-only and in the reply: runs the project's own test command, reads the code in scope, and reports each bug as confirmed (the test output shows it, quoted) or suspect (code reading only, with file:line and the input that breaks it), each with a Red-Green plan (the failing test to add first, then the smallest fix); never invents a bug and never reports style. Use when asked to "hunt for bugs", "bug hunt", "find the bug", "why does this crash", "what is broken here", "check this for regressions" or "find edge cases that break this code". Do not use for a regression checklist of what to retest after a change (use test-planner), for code style, UI polish or accessibility (use ui-polish or a11y-audit), or to write the tests or the fix.
version: 0.1.0
---

# bug-hunter

Finds bugs that are really there, and proves each one or says plainly that it is not proven.
Evidence is the output of the project's own test command; code reading alone gives a suspect, never a confirmed bug.
It is read-only: it writes no file and runs only the test command; the report is the reply.

Before your first tool call:

- The only command you may run is the project's test command (`npm test`, or `node --test` when there is no `test` script), once, from the project folder.
- Read and list files, this skill's layers included, with the read, search and list tools only, never with a shell command (no `cat`, `ls`, `find`, `head`, `cd`). The read tool shows line numbers, so every `file:line` you cite is right; a shell read has none, and cited lines come out wrong. A read-only harness call can also deny the command and lose a turn.

## When to use

- Use when someone asks to hunt for bugs, find the bug, find why something crashes or is broken, or check code for regressions or breaking edge cases.
- Use in a harness hunter call: the request "bug hunt regression tests: <scope>" is a hunt of that scope.
- Do not use for a regression checklist of what to retest after a change; the whole reply is the fixed sentence of layer 06, step 2.
- Do not use for code style, UI polish or accessibility; say the fixed sentence of layer 06, step 3, then hunt.
- Do not use to write tests or fixes; say the fixed sentence of layer 06, step 4, then hunt.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: the scope, the defined terms, what counts as a bug. [layers/01-intent.md](layers/01-intent.md)
2. Context: find the test command, the code and the tests, read-only. [layers/02-context.md](layers/02-context.md)
3. Inputs: a scope with code; the fixed lines when there is none. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: run the tests, read the code, sort confirmed and suspect, write Red-Green. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: boundaries, no test command, no bug found. [layers/06-states.md](layers/06-states.md)
7. Checks: every finding proven or marked suspect. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact reply format and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the developer, QA and test-planner receive. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what proves the report. [layers/10-evidence.md](layers/10-evidence.md)

What counts as a bug, what does not, and worked findings are in [references/README.md](references/README.md).

## Rules

- R-bug-hunter-1: A finding MUST be "confirmed" only when the output of the project's test command shows the failure, quoted word for word; a finding from code reading alone MUST be "suspect".
- R-bug-hunter-2: Every finding MUST cite the `file:line` of the code that causes it, the input that breaks it and the expected result with its source (a failing test, the request, a comment or doc in the project); NEVER report a bug the code does not show and NEVER invent an expected business rule.
- R-bug-hunter-3: Every finding MUST have a Red-Green plan: Red is the failing test to add first (file, input, expected value), or the test that already fails; Green is the smallest fix at `file:line`, made only after Red fails.
- R-bug-hunter-4: The skill MUST run only the project's own test command; NEVER run other code, scripts, one-line programs or installs to reproduce a bug, and a bug the test command does not show stays a suspect.
- R-bug-hunter-5: The skill MUST be read-only: NEVER write, edit or delete a file; the report is the reply.
- R-bug-hunter-6: NEVER report code style, naming, formatting, spacing, comments, UI style or accessibility as a finding.
- R-bug-hunter-7: When no test command exists or it cannot run, the reply MUST start with the fixed sentence of layer 06, step 5, and every finding MUST be a suspect.
- R-bug-hunter-8: A request for a regression checklist or what to retest after a change MUST get only the fixed sentence of layer 06, step 2.
- R-bug-hunter-9: A request that also asks for style, naming, formatting, UI polish or accessibility MUST start with the fixed sentence of layer 06, step 3.
- R-bug-hunter-10: When nothing is found, the reply MUST say the fixed line of layer 06, step 7; NEVER write that the code is bug-free or correct.
- R-bug-hunter-11: The reply MUST follow the format of layer 08: header, Confirmed, Suspect, Not in this hunt, Evidence line.
- R-bug-hunter-12: The skill MUST have the ten core layers, each linked from SKILL.md, and stay self-contained with no repository paths.
- R-bug-hunter-13: SKILL.md MUST stay within 150 lines, with frontmatter name, description and semver version.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Every confirmed finding quotes a line that appears word for word in the test command's output.
- Every finding has `file:line`, an input, an expected result with its source, Red and Green.
- No finding is about style, naming, formatting or accessibility.
- No tool call wrote, edited or deleted a file, and the only command run was the test command.
- The Result line counts match the findings listed.

## Review

A developer reads each confirmed finding next to the test output and each suspect next to the cited line, and
confirms the input really gives the wrong result; QA adds the Red tests first.

## Output

One Markdown reply: a heading, a four-line header (Scope, Test command, Test run, Result), "Confirmed", "Suspect",
"Not in this hunt" and the Evidence line. The exact shape is in [layers/08-output.md](layers/08-output.md).
