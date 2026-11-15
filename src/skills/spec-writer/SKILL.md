---
name: spec-writer
description: Writes testable acceptance criteria as numbered Given-When-Then clauses (AC-1, AC-2 ...) from a feature request, user story or requirement text, each traced to a phrase of that text; what the text does not state becomes open questions for the Product Owner. Use when asked to "write acceptance criteria", "turn this user story into Given-When-Then" or "spec this requirement". Do not use for a regression checklist for a change or diff (use test-planner), test code, UI design, copy rewriting (use copy-tight), estimates or priorities.
version: 1.0.0
---

# spec-writer

Turns a feature request, user story or requirement into acceptance criteria for business analysts and product owners.
Every clause traces to words in the requirement, so nothing the requirement does not state is ever written as a criterion.

## When to use

- Use when someone asks for acceptance criteria, Given-When-Then scenarios or a testable spec for a feature request, user story or requirement they give.
- Do not use for a regression checklist for a change or a diff; reply with the fixed sentence in layer 06, clause 4, which points to test-planner.
- Do not use to write test code, design a screen, rewrite copy, estimate or prioritise; reply with the fixed sentence in layer 06, clause 5 or 6, then give the criteria if a requirement text exists.
- Do not use without a requirement text; ask for it with the exact sentence in layer 03, clause 4 (nothing given) or 5 (a title only).

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: the goal, the defined terms and the outcome that proves success. [layers/01-intent.md](layers/01-intent.md)
2. Context: the requirement text is the only source. [layers/02-context.md](layers/02-context.md)
3. Inputs: the requirement text is required; the exact sentences when it is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: statements, headings, clauses, source phrases, open questions, out of scope. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: vague words, conflicts, requests outside the boundary. [layers/06-states.md](layers/06-states.md)
7. Checks: source phrase search, numbering, form, reviewer answers. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact document shape and its quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the reader receives and who answers the open questions. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

## Rules

- R-spec-writer-1: Every clause MUST come from the requirement text; NEVER invent a behaviour, value, role, message, state or limit the text does not state.
- R-spec-writer-2: Every clause MUST be one line in the form "AC-n. Given ..., when ..., then ..." with one behaviour and one observable result.
- R-spec-writer-3: Every clause MUST end with an italic source phrase copied word for word from the requirement text.
- R-spec-writer-4: Clause ids MUST run AC-1 to AC-N in one run across all headings.
- R-spec-writer-5: A heading (Main path, Validation and errors, Permissions and roles, Empty, loading and disabled states, Persistence after reload, Limits) MUST appear only when the text supports at least one clause under it.
- R-spec-writer-6: Anything the text does not state MUST go under "Open questions" as a question to the Product Owner that starts with its heading name; a question NEVER suggests an answer, an example or a value.
- R-spec-writer-7: A vague word in the text (such as "fast", "easy", "secure") MUST become the open question `What measurable value defines "<word>" for <thing>?`; NEVER a clause and NEVER a made-up number or unit.
- R-spec-writer-8: "Out of scope" MUST list only what the text itself excludes, each with its source phrase; otherwise it reads "None stated."
- R-spec-writer-9: With no requirement text, or a title only, the skill MUST reply with the exact sentence of layer 03 and NEVER write a clause.
- R-spec-writer-10: NEVER write test code, a regression checklist, a screen design, rewritten copy, an estimate or a priority; the exact sentences of layer 06 MUST be used.
- R-spec-writer-11: The skill MUST have the ten core layers, each linked from SKILL.md.
- R-spec-writer-12: The skill MUST be self-contained; NEVER name a repository path in SKILL.md, layers or references.
- R-spec-writer-13: SKILL.md MUST stay within 150 lines and have frontmatter with name, description and semver version.
- R-spec-writer-14: Every relative link MUST point to a file inside the skill folder.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Search the requirement text for each clause's source phrase, ignoring case; a phrase that is not found removes the clause.
- Ids run AC-1 to AC-N with no gap or restart; every clause has "Given", "when" and "then" once each.
- Answer the reviewer items in [references/README.md](references/README.md); any "no" blocks the reply.

## Review

The Product Owner (or the person who wrote the requirement) compares each clause with the requirement text: every clause traces to a phrase, nothing is invented, and every gap is an open question.
The reviewer answers the checklist in [references/README.md](references/README.md).

## Output

One Markdown reply: a heading, a one-sentence restatement of the requirement, the supported headings with clauses AC-1 to AC-N, then "Open questions" and "Out of scope". The exact shape is in [layers/08-output.md](layers/08-output.md).
