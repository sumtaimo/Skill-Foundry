---
name: copy-tight
description: Rewrites UI copy (buttons, labels, errors, empty states, tooltips) to be short and plain without changing meaning. Use when asked to "shorten this copy", "make this plain", "tighten this text" or when a UI string is too wordy. Do not use for long-form docs, blog posts, translation or changelog entries; use changelog-writer for those.
version: 0.2.0
---

# copy-tight

Rewrites UI copy for product designers and frontend engineers so it is short and plain,
while numbers, names, product terms and legal text stay exactly as they were.

## When to use

- Use when someone asks to shorten, simplify or tighten UI strings.
- Do not use for long-form docs, marketing articles or translation.
- Do not rewrite legal text (terms, consent, disclaimers); return it unchanged with the fixed note below.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: find the goal and the copy to rewrite. [layers/01-intent.md](layers/01-intent.md)
2. Context: list every number, name, product term and legal phrase. [layers/02-context.md](layers/02-context.md)
3. Inputs: what is required and what to do when it is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: cut, plain words, fit the UI job, compare. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States: legal, mixed, already tight, placeholders. [layers/06-states.md](layers/06-states.md)
7. Checks: numbers, names, filler, legal, change list. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact answer format. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the user receives and open items. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

## Rules

- R-copy-tight-3: The rewrite MUST NEVER change the meaning of the copy.
- R-copy-tight-4: The rewrite MUST NEVER change numbers, names or their capital letters.
- R-copy-tight-5: Legal text MUST NEVER be rewritten; it is returned with the fixed note.
- R-copy-tight-6: The output MUST contain the rewritten copy and the change list.
- R-copy-tight-7: The change list MUST NEVER quote removed words.

See `RULES.json` for the check or checklist item behind each rule.

## Checks

- Every number and name in the input appears unchanged in the output, with the same capital letters.
- Every item in [references/checklist.md](references/checklist.md) is answered yes; any no blocks the answer.

## Review

Use [references/checklist.md](references/checklist.md). A second reader confirms the rewrite means the same as the original.

## Output

1. `Rewritten copy:` the new strings, one per line, in the original order.
2. `What changed:` at most 5 short bullets naming the kind of change (for example "cut filler", "active voice", "kept the amount").
3. For legal text: the original text unchanged, then `What changed:` followed by `Legal text is returned unchanged.`
