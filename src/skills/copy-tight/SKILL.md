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

1. Read the copy and list every number, name, product term and legal phrase in it.
2. Copy each listed item exactly, keeping its spelling and capital letters ("Checkout" stays "Checkout").
3. If the copy is legal text, return it unchanged, write the fixed note `Legal text is returned unchanged.` and stop.
4. Cut filler words, passive voice and repeats; prefer common words and active verbs.
5. Keep each string at its UI job: buttons start with a verb, errors say what happened and what to do.
6. Compare the rewrite to the original: same meaning, same numbers, same names with the same capitals.
7. If a cut would change meaning, keep the original wording for that part.
8. Write the change list: name the kind of change only, and never quote the words you removed.
9. Return the rewritten copy, then the change list.

## Rules

- R-copy-tight-3: The rewrite MUST NEVER change the meaning of the copy.
- R-copy-tight-4: The rewrite MUST NEVER change numbers, names or their capital letters.
- R-copy-tight-5: Legal text MUST NEVER be rewritten; it is returned with the fixed note.
- R-copy-tight-6: The output MUST contain the rewritten copy and the change list.
- R-copy-tight-7: The change list MUST NEVER quote removed words.

See `RULES.json` for the check or checklist item behind each rule.

## Checks

- `node src/factory/lint-skills.mjs copy-tight` prints no problems.
- `node src/factory/live-evals.mjs copy-tight` prints 0 failed on real-agent recordings.

## Review

Use `docs/factory/REVIEW.md`; the filled checklist is in `docs/skills/copy-tight/CHECKLIST.md`.

## Output

1. `Rewritten copy:` the new strings, one per line, in the original order.
2. `What changed:` at most 5 short bullets naming the kind of change (for example "cut filler", "active voice", "kept the amount").
3. For legal text: the original text unchanged, then `What changed:` followed by `Legal text is returned unchanged.`
