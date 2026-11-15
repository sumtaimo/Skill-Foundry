---
name: a11y-audit
description: Audits the HTML or JSX a user gives for what users cannot see (semantic elements and landmarks, heading order, page language and title, names for controls and form fields, errors and required state, keyboard access, ARIA, status messages, link purpose, tables, media, zoom) and returns numbered findings, each with the element, a rule id, the WCAG 2.2 success criterion (level A or AA), who is affected and the exact fix as a small code change. Use when asked for an "accessibility audit", "a11y check", "screen reader check" or "ARIA review" of code the user pastes. Do not use to fix contrast, focus style, spacing or target size (use ui-polish), to judge usability, to rewrite text (use copy-tight) or to certify conformance.
version: 1.0.0
---

# a11y-audit

Reads the markup of a screen and lists what a keyboard, screen reader, voice control or zoom user would hit:
no names, wrong roles, missing labels, unreachable controls, silent messages.
A script in this folder finds the structural problems by search, so the list does not depend on anyone's eyes;
each finding cites its rule, its success criterion and the exact code change.

## When to use

- Use when someone pastes HTML or JSX (a page, a component, a form) and asks for an accessibility audit, an a11y check, a screen reader or keyboard check, or an ARIA review.
- Use when someone asks "what can a screen reader not read here?" about code they give.
- Do not use for contrast, focus-ring style, spacing or target size; say the fixed sentence of layer 06, step 2, then audit the rest.
- Do not use to judge the flow or usability, or to rewrite visible text; say the fixed sentence of layer 06, step 3 or 4.
- Do not use to certify conformance; say the fixed sentence of layer 06, step 5, then audit.
- Do not use without code; ask for it with the exact sentence in layer 03, step 3.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: confirm the goal and the defined terms. [layers/01-intent.md](layers/01-intent.md)
2. Context: the pasted code is the only source. [layers/02-context.md](layers/02-context.md)
3. Inputs: code is required; ask when it is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: run the script, check each finding, write the fixes. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: no code, boundary requests, fragments, JSX, clean code. [layers/06-states.md](layers/06-states.md)
7. Checks: element in input, numbers, boundary, format. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact reply format and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the reader receives. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

The 38 checks with their success criteria, who they affect and the manual tests are in [references/README.md](references/README.md).
The script is `engine/audit.mjs` in this folder (Node.js, no dependencies).

## Rules

- R-a11y-audit-1: Every finding MUST come from the script output and MUST name an element copied from the input with its line; NEVER report an element that is not in the input.
- R-a11y-audit-2: Every finding MUST give the rule id, the success criterion number, its name and level (A or AA) of WCAG 2.2, who is affected and the fix as a code change.
- R-a11y-audit-3: The criterion number, name, level and status (failure or advisory) MUST be the ones the script prints; NEVER change or invent them.
- R-a11y-audit-4: A fix MUST be a small code change on the element in diff form; NEVER change a visible word, and fill every placeholder from the input.
- R-a11y-audit-5: A fix MUST use a native HTML element where one does the job; NEVER add ARIA that native HTML already provides.
- R-a11y-audit-6: NEVER report or fix contrast ratios, focus-ring style, spacing or target size; when asked, say the fixed sentence of layer 06, step 2.
- R-a11y-audit-7: NEVER judge the flow or usability; when asked, say the fixed sentence of layer 06, step 3.
- R-a11y-audit-8: NEVER rewrite visible text; when asked, say the fixed sentence of layer 06, step 4.
- R-a11y-audit-9: NEVER claim or imply full conformance or give a certificate; say the fixed sentence of layer 06, step 5, and list the checks that ran and those that need a manual test.
- R-a11y-audit-10: With no code, the skill MUST ask for it with the exact sentence and NEVER produce findings.
- R-a11y-audit-11: The reply MUST follow the format of layer 08: Findings, Needs a manual test, Not checked here, Open questions.
- R-a11y-audit-12: The script MUST be run on the input; when it cannot run, the reply MUST say so in Open questions and use only the checks of the references, by reading.
- R-a11y-audit-13: The skill MUST have the ten core layers, each linked from SKILL.md.
- R-a11y-audit-14: The skill MUST be self-contained; NEVER name a repository path in SKILL.md, layers or references.
- R-a11y-audit-15: SKILL.md MUST stay within 150 lines, with frontmatter name, description and semver version.
- R-a11y-audit-16: Every relative link MUST point to a file inside the skill folder.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Every element quoted in a finding appears in the input (search the input for it).
- Every criterion number and level in the reply appears in the script output.
- Search the reply for "contrast", "focus ring", "spacing" and "target size": they appear only in the fixed sentence and the "Not checked here" line.
- Answer the reviewer items in [references/README.md](references/README.md); any "no" blocks the reply.

## Review

A front-end developer opens the findings next to the code and confirms each element exists and each fix is a small change;
a QA lead confirms the manual tests are listed and nothing claims conformance.

## Output

One Markdown reply: a heading, a one-line scope statement, numbered findings (element, criterion, who, fix in a diff block),
"Needs a manual test", "Not checked here" and "Open questions". The exact shape is in [layers/08-output.md](layers/08-output.md).
