# a11y-audit review (2026-11-15)

Review against `docs/factory/REVIEW.md`. Status: ready. Version 1.0.0.

Honest record: the author (an AI agent) ticked this list; the owner (TAIMO) is the final reviewer. Live answers (13 cases), the portable check and the routing answers came from fresh real agents (`claude -p`, one per case). The worked examples in `examples/README.md` are hand-written and are not proof. The 38 checks are run by `engine/audit.mjs`, not by the agent's eyes (lesson L2).

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-a11y-audit-<n>` (16 rules)
- [x] No step relies on unstated knowledge: defined terms in layer 01, the 38 checks and manual tests in references, fixed sentences in layers 03 and 06
- [x] SKILL.md is at most 150 lines (about 80)
- [x] Ten core layers with numbered clauses, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no repository paths in SKILL.md, layers or references (`chk-portable`)

## Triggers
- [x] Description says when to use (audit, a11y check, screen reader check, ARIA review of pasted code) and when not (contrast, focus style, spacing, target size: ui-polish; usability; rewriting text: copy-tight; certifying)
- [x] Routing cases ay1 to ay10 pass (45 of 45 overall): three positives, a ui-polish neighbour, a copy-tight neighbour, four "none" cases (accessibility statement, flow review, CI test setup, new design)

## Coverage
- [x] Full page, JSX fragment, clean page, forms and errors, content and media, ARIA misuse, zoom, keyboard trap
- [x] Missing input: no code (one exact sentence)
- [x] Boundary: contrast and focus ring, usability, rewriting text, certificate request (one exact sentence each, then the audit)
- [x] Every finding names an element present in the input: tested over every recording (`tests/a11y-audit.test.mjs`)
- [x] Every rule in RULES.json has a check or checklist item

## Examples
- [x] Three hand-written examples (sign-in form, no code, certificate request); they follow the skill's own rules

## Evals
- [x] 13 cases with strict expectations (rule ids, criterion numbers, exact sentences, kept words, `notContains` for ratios, colours and conformance words, `maxLines`)
- [x] Pass with `runEvals` on answers built from the script; bad answers fail (same test file)
- [x] Live evals 13 of 13 on fresh real-agent recordings; every answer read by hand; each criterion number and level compared with the script table by the test
- [x] The reply reports exactly the findings the script finds, no more and no fewer (test over all recordings)
- [x] First recordings were re-recorded after two engine changes made while reading them (alt-text manual test only when the input has images; the focus-trap fix quotes the real Tab line). No case was weakened.

## Visual items
- [x] The skill produces text, not a page; no `checkPage` item applies. The site cover is the real recorded answer drawn as a document (`tests/site-real-output.test.mjs` passes); screenshots in this folder.

## Portable check
- [x] `evals/portable.json`: skill used, no repository rules leaked, repository not touched. Answer read: all 7 findings correct, order and criteria match the script.

## Preview quality
- [x] Tagline under 90 characters, 5 tags; cover uses only `--cover-bg`, `--cover-accent` and `currentColor`

## Known limits (stated, not hidden)
- The script reads markup only: it cannot see CSS, scripts outside inline `script` elements, or what components render. It says so in "Needs a manual test".
- `status-message`, `link-purpose` and `native-element` are heuristics from names and attributes; `link-purpose` is marked advisory when the sentence around the link may give the purpose.
- No assistive-technology test was run. The skill never claims conformance.
