---
name: test-planner
description: Derives a numbered regression checklist, grouped by area, from a change description or a diff, so the team knows what to retest and nothing outside the change is added. Use when asked "what should we retest after this change?" or "give me a regression checklist for this diff". Do not use to write test code, to review a diff for bugs, or to plan tests for features the change does not describe; answer those in the chat instead.
version: 1.0.0
---

# test-planner

Turns a change description or a diff into a regression checklist for QA leads and developers.
Every item traces to words in the change, so the checklist never includes a feature the change does not mention.

## When to use

- Use when someone asks what to retest after a change, or asks for a regression checklist for a change description or a diff.
- Use when the user pastes a diff, a pull request description or a release note that describes changed behaviour.
- Do not use to write test code, automation scripts or test data, or to judge whether a diff has bugs; say so in the fixed sentence (layer 06, step 11), then give the checklist if a change text exists.
- Do not use without a change to plan from; ask for it first with the exact sentences in layer 03, step 4 (nothing given) or step 5 (a title only).

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: confirm the goal and the outcome that proves success. [layers/01-intent.md](layers/01-intent.md)
2. Context: the change text is the only source of areas and behaviour. [layers/02-context.md](layers/02-context.md)
3. Inputs: the change text is required; ask when it is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: areas, behaviour changes, items with source phrases, numbering. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: empty, vague, diff only, conflicting input. [layers/06-states.md](layers/06-states.md)
7. Checks: source phrase match, numbering, format, reviewer answers. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact checklist format and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the reader receives and the open items. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

## Rules

- R-test-planner-1: Every item MUST come from the change text; NEVER add a feature, screen, field or area the change text does not name.
- R-test-planner-2: Every item MUST end with an italic source phrase copied from the change text.
- R-test-planner-3: The output MUST be one numbered Markdown checklist with `[ ]` boxes, numbered 1 to N across all areas.
- R-test-planner-4: The output MUST group items under area headings that use the change text's own names; for a diff, the name the changed lines share (for example `cart`), never one heading per identifier.
- R-test-planner-5: NEVER write test code, scripts or test data.
- R-test-planner-6: Adjacent areas the change text does not name MUST go under "Possible impact, not stated" as questions, NEVER as items.
- R-test-planner-7: With no change text, the skill MUST ask for it and NEVER produce a checklist.
- R-test-planner-8: The skill MUST have the ten core layers, each linked from SKILL.md.
- R-test-planner-9: The skill MUST be self-contained; NEVER name a repository path in SKILL.md, layers or references.
- R-test-planner-10: SKILL.md MUST stay within 150 lines.
- R-test-planner-11: SKILL.md MUST have frontmatter with name, description and semver version.
- R-test-planner-12: Every relative link MUST point to a file inside the skill folder.
- R-test-planner-13: A request for test code or a bug review MUST be declined with the exact sentence "This skill does not write test code or review code for bugs."; the checklist follows only when a change text is present.
- R-test-planner-14: An item about removed behaviour MUST say what no longer happens, using the words "no longer".

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Search the change text for each item's source phrase, ignoring case; a missing phrase removes the item.
- Numbers run 1 to N with no gap or restart; every area heading has at least one item.
- Answer the reviewer items in [references/README.md](references/README.md); any "no" blocks the reply.

## Review

The person who wrote the change (or a second QA lead) compares each item with the change text: every item traces to a phrase, and no named area is missing.
The reviewer answers the checklist in [references/README.md](references/README.md).

## Output

One Markdown reply: a heading, a one-sentence restatement of the change, the area sections with numbered `[ ]` items, then "Possible impact, not stated" and "Open questions". The exact shape is in [layers/08-output.md](layers/08-output.md).
