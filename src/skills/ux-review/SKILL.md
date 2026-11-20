---
name: ux-review
description: Reviews the usability of an existing screen or flow from its code, a step-by-step description of the flow, or both, and returns a numbered list of findings, each with the place, what the user experiences, the rule it breaks, a severity from S1 to S4 and one recommendation in words. Use when asked for a "UX review", a "usability review", "where will users get stuck in this flow" or to "rate the usability problems by severity". Do not use to fix or polish the code (use ui-polish), to rewrite text (use copy-tight), to check contrast, ARIA or screen readers, to design a new screen, or to plan what to retest (use test-planner).
version: 1.0.1
---

# ux-review

Judges whether a user can find and complete the task on an existing screen or flow, against eighteen checkable usability rules (thirteen about controls and steps, five about the shape of a screen) and reports what breaks them.
Every finding quotes something present in the input, carries one severity from a fixed four-level scale and one recommendation in words.
The skill reviews; it changes no code, writes no text and designs nothing.

## When to use

- Use when someone gives the code of a screen, a step-by-step description of a flow, or both, and asks for a UX or usability review. An optional measurement sheet or screenshot description lets it judge the shape of the screen (first screen, order, length, repeats, calls to action).
- Use when someone asks where users get stuck, or asks for usability problems rated by severity.
- Do not use without a screen or flow to review; reply with the exact sentence in layer 03, clause 5.
- Do not use to fix code (ui-polish), to rewrite text, to measure sizes, gaps or tokens, to check contrast, focus styles, spacing scales, semantics, ARIA or screen-reader output, or to design a new screen (ui-craft); reply with the exact sentences in layer 06, clauses 2 to 5 and 18.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step; its clauses are numbered so they can be cited.

1. Intent: the goal and the defined terms. [layers/01-intent.md](layers/01-intent.md)
2. Context: the input is the only source; an optional design-token file. [layers/02-context.md](layers/02-context.md)
3. Inputs: code or a flow description is required; a measurement sheet or screenshot description is optional; ask when the screen is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: inventory, check each rule, write findings, set severity, order. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: nothing to review, fix request, new design, out-of-scope checks, no findings. [layers/06-states.md](layers/06-states.md)
7. Checks: evidence search, counts, format, reviewer answers. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact reply format and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the reader receives. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

How to check each rule, the severity scale, the familiar-pattern table and the reviewer checklist are in [references/README.md](references/README.md).

## Rules

Usability rules (a finding cites the one it breaks):

- R-ux-review-1 Affordance: Every control that can be clicked MUST look clickable (a button shape with a border or fill, an underline, or a standard control form); an element that cannot be clicked MUST NOT look like one.
- R-ux-review-2 Feedback: Every action MUST be followed by a visible response; an action that can take more than 1 second MUST show a loading or progress state; a completed save, send, payment or delete MUST be confirmed on screen.
- R-ux-review-3 System status: The screen MUST show the current state without an action: the current step and the number of steps in a flow of 3 or more steps, what is selected, which filter or mode is on, and whether changes are saved.
- R-ux-review-4 Mapping: Every control MUST sit inside or next to the thing it changes, and a set of controls MUST follow the same order as the things they control.
- R-ux-review-5 Error prevention: An action that deletes, pays, sends or overwrites MUST have a confirmation step or an undo; a field with a required format or limit MUST state it before the user submits.
- R-ux-review-6 Error recovery: An error message MUST appear next to the field or control that caused it, MUST say what to do next, and the screen MUST keep everything the user entered.
- R-ux-review-7 Choices: One step MUST offer at most 7 choices at one level; a longer list MUST have groups, a search or a preselected default.
- R-ux-review-8 Reach: A control the main goal needs MUST be easy enough to hit that the user does not miss it or hit its neighbour; a hit problem is a finding about what the user does wrong, never a measurement, and its recommendation ends with "; the sizes are for ui-polish."
- R-ux-review-9 Grouping: Targets used one after the other in the same step MUST be in the same visible group, and neighbouring targets with opposite effects (for example Save and Delete) MUST be visibly separated; the review states no pixel gap, and when the cause is a gap or a size the recommendation ends with "; the sizes are for ui-polish."
- R-ux-review-10 Memory load: The user MUST have 0 things to remember between steps: every value needed later is shown where it is needed, and nothing already entered is asked again.
- R-ux-review-11 Consistency: The same action MUST have the same label and the same position on every screen of the input, and one label MUST NOT name two different actions.
- R-ux-review-12 Familiar patterns: A control MUST behave as its row in the familiar-pattern table says.
- R-ux-review-13 Steps: The main goal MUST be reachable in at most 5 steps, and every step MUST collect or show something the main goal needs.

Shape rules (checked on a measurement sheet or screenshot description, or on what the code shows; without one, one open question):

- R-ux-review-26 First screen: The first screen MUST say what the product or screen is and who it is for, and the heading MUST be the first thing seen, not a cover or a sample answer.
- R-ux-review-27 Section order: Sections MUST follow the order of the task; the main action MUST start within the first 3 screens; a lead-in sentence MUST NOT sit above its heading.
- R-ux-review-28 Page length: A page MUST be at most 6 screens tall and no section taller than 2 screens, unless the extra part is behind a control.
- R-ux-review-29 Duplicated blocks: The same content of 20 words or more MUST NOT be shown twice on a page.
- R-ux-review-30 Calls to action: A view MUST hold at most 1 primary action, and the first screen at most 7 controls that compete in its content (hero actions, cards); persistent navigation (a header, rail or sidebar that repeats on every screen) is counted apart, is judged by R-ux-review-7, and is never added to that count.

Conduct rules:

- R-ux-review-14: Every finding MUST quote evidence that is present in the input; what the input does not show MUST go under Open questions and is NEVER guessed.
- R-ux-review-15: Every finding MUST carry exactly one severity: S1 Blocker, S2 Major, S3 Minor or S4 Note, chosen with the ordered questions in layer 04.
- R-ux-review-16: Every finding MUST have exactly one recommendation, one sentence in words; NEVER code, replacement wording or a new layout.
- R-ux-review-17: NEVER fix, rewrite or produce code; a request to fix the code MUST get the exact sentence "This skill reviews usability; it does not change code. To fix the code, use ui-polish.".
- R-ux-review-18: NEVER report contrast ratios, focus styles, spacing or type scales, semantics, ARIA or screen-reader output, and NEVER rewrite text; a request for one MUST get the exact sentence of layer 06.
- R-ux-review-19: With no screen or flow in the message, the reply MUST be exactly "Paste the screen's code or describe the flow step by step." and nothing else.
- R-ux-review-20: A request to design a new screen MUST get the exact sentence "This skill reviews an existing screen or flow; it does not design new screens. To design a screen, use ui-craft." and no design.
- R-ux-review-21: The reply MUST follow the format in layer 08; findings are numbered 1 to N, most severe first, one place and one rule per finding.
- R-ux-review-22: The skill MUST have the ten core layers, each linked from SKILL.md.
- R-ux-review-23: The skill MUST be self-contained; NEVER name a repository path in SKILL.md, layers or references.
- R-ux-review-24: SKILL.md MUST stay within 150 lines, with frontmatter name, description and semver version.
- R-ux-review-25: Every relative link MUST point to a file inside the skill folder.
- R-ux-review-31: A break that depends on a script or run-time content the input does not contain MUST NOT be S1 or S2; S3 at most, or an open question.
- R-ux-review-32: One template on many pages MUST give one finding that lists the pages.
- R-ux-review-33: NEVER report a design token's name, value or absence as a finding, and never review tokens (that is design-system) or contrast (that is a11y-audit); a token is only resolved to a number as evidence for a finding about the task.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Search the input for each finding's evidence quote, ignoring case; a quote that is not found removes the finding or moves it to Open questions.
- Numbers run 1 to N; the counts in the "Findings:" line add up to N; severities never rise further down the list.
- The reply has no code block and no replacement wording.
- Answer the reviewer items in [references/README.md](references/README.md); any "no" blocks the reply.

## Review

A designer, analyst or QA lead who knows the screen compares each finding with the input: the evidence is really there, the rule fits, and the severity follows the scale.

## Output

One Markdown reply: a heading, four summary lines (Reviewed, Main goal, Steps to main goal, Findings), the numbered findings, the fixed "Not reviewed" section, "Open questions" and the severity scale. The exact shape is in [layers/08-output.md](layers/08-output.md).
