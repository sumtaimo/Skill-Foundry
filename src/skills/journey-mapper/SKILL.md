---
name: journey-mapper
description: Grows a short feature goal into the whole user journey, without changing any project file: numbered steps from entry to done, and for each step its loading, empty, error and success states, validation, reload and back, and who may do it; every fact is quoted from the goal and everything the goal does not say becomes an open business question. Use when asked to "map the user journey", "map the user flow", "walk through the whole workflow of this feature" or "which states and edge cases does this onboarding, sign-up or checkout need". Do not use for Given-When-Then acceptance criteria (use spec-writer), a regression checklist for a change or diff (use test-planner), a usability review of an existing screen (use ux-review), screen design, or clicking through a running app (use browser-check).
version: 0.1.0
---

# journey-mapper

Turns a one- or two-sentence feature goal into the full workflow a business analyst needs before specs, design or tests.
Every step and every state either quotes the goal or points to an open question, so no business rule is ever invented.
It changes nothing in the project: the map is the reply, or the one file a task assigns.

## The task's own format and file come first (read first)

- When the task prompt requires a specific output format (for example "Reply with ONLY this JSON"), follow that format exactly and print no Markdown map. Do the map's thinking (layer 04) and put it into the format's fields: steps into the steps list, the seven slots into the matching state, validation, reload and permission fields, blocking questions into the field for decisions. Never add a key the format does not have; a fact with no field goes into the closest text field. When the task asks for steps beyond the goal's words, add them, but give each such step its question in the decision field, so it stays a proposal, never a rule. Fields the map does not own (acceptance criteria, workers, files, size) follow the task's own rules and the other skills it names (layer 06, step 14).
- When the task assigns you a file to write (an agent harness worker with an assigned file) and you have a tool to write it, put the map in that file, not only in your reply; write no other file (layer 06, step 15).
- Without a write tool, or when no file is assigned by the task, write no file (layer 06, step 6).

## When to use

- Use when someone gives a short feature goal and asks for the user journey, user flow or workflow, or for the states, validation, reload and permission cases a flow needs.
- Use when an agent plans a feature and needs the whole workflow and the open business questions before acceptance criteria are written.
- Do not use for Given-When-Then acceptance criteria; say the fixed sentence of layer 06, step 3, then map the goal.
- Do not use for a regression checklist for a change or a diff; the whole reply is the fixed sentence of layer 06, step 4.
- Do not use to review, design or click through screens; say the fixed sentence of layer 06, step 5, then map the goal.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: the goal, the defined terms, the goal sentence. [layers/01-intent.md](layers/01-intent.md)
2. Context: the goal text first, the project's files read-only. [layers/02-context.md](layers/02-context.md)
3. Inputs: a goal is required; the one question when it is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: actors, entry, steps, the seven slots, cross-step checks, questions. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: boundaries, file requests, conflicts, languages. [layers/06-states.md](layers/06-states.md)
7. Checks: every fact quoted, every gap a question. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact reply format and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what spec-writer, test-planner and the team receive. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what proves the map. [layers/10-evidence.md](layers/10-evidence.md)

The seven slots, how to word a question and worked slot lines are in [references/README.md](references/README.md).

## Rules

- R-journey-mapper-1: Every step, actor and slot value MUST quote the goal text (or a project file the user named, with its path and line); NEVER state a business rule, message, limit, role or step the source does not state.
- R-journey-mapper-2: Everything the source does not state MUST become an open business question with an id (Q1, Q2 ...) and the steps it affects; NEVER fill a gap with a usual default.
- R-journey-mapper-3: Every step MUST list all seven slots in order: Loading, Empty, Error, Success, Validation, Reload and back, Permissions; each slot is a quote, a question id, or "Not applicable" with a reason.
- R-journey-mapper-4: A question MUST ask, never suggest: no answer options, no examples, no "for example", no named product or provider the goal does not name.
- R-journey-mapper-5: A question that stops the journey from being finished MUST be marked [blocking]; the others MUST be [minor], merged by topic into one line each.
- R-journey-mapper-6: NEVER write a file the task did not assign, NEVER edit or delete any other file and NEVER run a command; the map is the reply or the assigned file.
- R-journey-mapper-7: A request with no feature goal MUST get only the fixed question of layer 03, step 3.
- R-journey-mapper-8: A request for acceptance criteria MUST start with the fixed sentence of layer 06, step 3, and the reply MUST contain no Given-When-Then clause.
- R-journey-mapper-9: A request for a regression checklist or what to retest after a change or a diff MUST get only the fixed sentence of layer 06, step 4.
- R-journey-mapper-10: The reply MUST follow the format of layer 08 (header, Steps, Cross-step checks, Open business questions, Not in this map), unless the task prompt requires another format (R-journey-mapper-14).
- R-journey-mapper-11: Two statements of the goal that disagree MUST become one blocking question starting "Conflict:" that quotes both; NEVER choose one.
- R-journey-mapper-12: The skill MUST have the ten core layers, each linked from SKILL.md, and stay self-contained with no repository paths.
- R-journey-mapper-13: SKILL.md MUST stay within 150 lines, with frontmatter name, description and semver version.
- R-journey-mapper-14: When the task prompt requires an output format (for example JSON only), the reply MUST be exactly that format, valid and complete, with the map's steps, slots and blocking questions in its fields; NEVER print the Markdown map then.
- R-journey-mapper-15: When the task assigns a file and a write tool is available, the map MUST be written to that file and to no other file.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Every quoted phrase in the map appears word for word in the goal or in a named file.
- Every step has the seven slot lines in order, and every question id used in a slot exists under "Open business questions".
- Search the questions for "for example", "e.g." and "such as": none appears.
- No Given-When-Then clause and no regression checklist appears.
- No tool call wrote a file the task did not assign, edited or deleted any other file, or ran a command.
- When the task required a format, the reply is only that format and parses (JSON parses as JSON).

## Review

A business analyst reads each quote next to the goal and confirms nothing was added; a product owner confirms every
blocking question is a real business decision and answers it.

## Output

One Markdown reply: a heading, a four-line header (Goal, Actors, Entry, Done when), numbered Steps with seven slot
lines each, "Cross-step checks", "Open business questions" and "Not in this map".
The exact shape is in [layers/08-output.md](layers/08-output.md).
