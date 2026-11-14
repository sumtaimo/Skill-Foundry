# Changelog

## 0.2.0 - 2026-11-14

- Fix: two fresh agents rewrote the same error differently, one adding "Try again." the source never gave. New rule R-copy-tight-8: a rewrite adds no new action, promise or fact. Layers 04, 05, 07, 08, SKILL.md and the checklist now say so; the old wording "errors say what to do" (layers 04, 08, checklist) invited the added next step and is replaced. New eval case `error-no-new-step`.
- Migrate to the ten-layer standard: layers/01-intent.md to layers/10-evidence.md, linked from SKILL.md; behaviour and description unchanged.
- Four new eval cases for the layer 06 edge cases: mixed legal copy, placeholders, already tight copy, unreachable length limit.
- Fix: a real agent quoted removed words in the change list ("currently", "for you"); layer 04 now shows a wrong and a right bullet and layer 07 searches each bullet for removed words.
- Fix: fixed bullet `- Length limit was not met; meaning kept.` so the unmet limit is always stated the same way.
- Self-contained: the review checklist moved into references/checklist.md; no repository paths left in SKILL.md, layers or references.
- Fix: keep names with their exact capital letters (a real agent wrote "checkout" for "Checkout").
- Add a fixed note for legal text and a rule that the change list never quotes removed words.
- Add exclusions to the description and list the rules in SKILL.md.

## 0.1.0 - 2026-11-14

- First version, built by a real agent with skill-smith: rewrite UI copy short and plain.
