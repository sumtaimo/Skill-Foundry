# a11y-audit review (2026-11-15, S1+S6 WIP 2026-11-17)

Review against `docs/factory/REVIEW.md`. Status: ready (S1+S6 changes in progress on branch `claude/a11y-audit-s1-s6`; held for Claude weekly quota reset before final recording). Version 1.0.0.

Honest record: the author (an AI agent) ticked this list, updated 2026-11-17 after checking every recording on `claude/a11y-audit-s1-s6`; the owner (TAIMO) is the final reviewer. Live answers (`13 of 16` passing on `2026-11-17`) and routing (`56 of 56`) came from fresh real agents (`claude -p`); `certificate-request` and `no-code` hit Claude's 5-hour limit (`4:20am UTC`) during recording, `contrast-request` failed echoing `#aaa` under `Not checked here` (layers 06/07/08 tightened to fix), and `evals/portable.json` is still from `2026-11-15` (pending re-recording after quota reset). The worked examples in `examples/README.md` are hand-written and are not proof. The 39 checks (38 plus `lang-parts`, S6) are run by `engine/audit.mjs`, not by the agent's eyes (lesson L2).

## Clarity
- [x] Procedure is numbered, imperative, one action per step
- [x] Every rule uses MUST or NEVER and has an id `R-a11y-audit-<n>` (19 rules)
- [x] No step relies on unstated knowledge: defined terms in layer 01, the 39 checks and manual tests in references, fixed sentences in layers 03 and 06
- [x] SKILL.md is at most 150 lines (about 80)
- [x] Ten core layers with numbered clauses, linked from SKILL.md (`chk-layers`)
- [x] Self-contained: no repository paths in SKILL.md, layers or references (`chk-portable`)

## Triggers
- [x] Description says when to use (audit, a11y check, screen reader check, ARIA review of pasted code) and when not (contrast, focus style, spacing, target size: ui-polish; usability; rewriting text: copy-tight; certifying)
- [x] Routing cases ay1 to ay10 pass (`56 of 56` overall): three positives, a ui-polish neighbour, a copy-tight neighbour, four "none" cases (accessibility statement, flow review, CI test setup, new design)

## Coverage
- [x] Full page, JSX fragment, clean page, forms and errors, content and media, ARIA misuse, zoom, keyboard trap
- [x] Missing input: no code (one exact sentence)
- [x] Boundary: contrast and focus ring, usability, rewriting text, certificate request (one exact sentence each, then the audit)
- [ ] Every finding names an element present in the input: tested over every recording (`tests/a11y-audit.test.mjs`) — fails on `certificate-request` until re-recorded (saved Claude 5h-limit message)
- [x] Every rule in RULES.json has a check or checklist item

## Examples
- [x] Three hand-written examples (sign-in form, no code, certificate request); they follow the skill's own rules

## Evals
- [x] 16 cases with strict expectations (rule ids, criterion numbers, exact sentences, kept words, `notContains` for ratios, colours and conformance words, `maxLines`)
- [x] Pass with `runEvals` on answers built from the script; bad answers fail (same test file)
- [ ] Live evals on fresh real-agent recordings (`13 of 16` passing on `2026-11-17`): `certificate-request` and `no-code` hit the 5-hour limit; `contrast-request` failed on `#aaa` in `Not checked here` (layers 06/07/08 fixed, pending re-record)
- [ ] The reply reports exactly the findings the script finds, no more and no fewer (`14 of 15` checked pass, `no-code` skipped; `certificate-request` pending re-record)
- [x] Earlier recordings were re-recorded after two engine changes made while reading them (alt-text manual test only when the input has images; the focus-trap fix quotes the real Tab line). No case was weakened.

## Visual items
- [x] The skill produces text, not a page; no `checkPage` item applies. The site cover is the real recorded answer drawn as a document (`tests/site-real-output.test.mjs` passes); screenshots in this folder.

## Portable check
- [ ] `evals/portable.json`: still from `2026-11-15` (stale `skillSha` after S1+S6 and layer 06/08 fixes); re-run `portable-check.mjs a11y-audit --prompt ... --record` after Claude quota resets

## Preview quality
- [x] Tagline under 90 characters, 5 tags; cover uses only `--cover-bg`, `--cover-accent` and `currentColor`

## S1 and S6 (2026-11-17)
- [x] S1: one plain command with the script path (R-a11y-audit-17); the script's own output tells the agent how to reply; when it cannot run, the first line of the reply says so. Cases `engine-one-command`, `engine-unavailable`; the Bash commands of the fresh agents were logged while recording and each ran the script as one `node <path>/engine/audit.mjs --file <path>` command (the agents' separate `cd ... && cat` calls only read the layers).
- [x] S6a: `lang-parts` (SC 3.1.2, AA, number and level checked against WCAG 2.2); unit tests for the trigger, the quiet case, JSX spelling and a page whose parts have lang; case `lang-parts-khmer`.
- [x] S6b: the skipped-by-rule sentence is in every header, also at 0 findings; expected by every live case except no-code.
- [ ] Re-record remaining live cases (`contrast-request`, `certificate-request`, `no-code` — or all 16 fresh per L18 before `release:check`) and `portable-check.mjs` after Claude quota resets; routing does not need re-recording (description unchanged).

## Known limits (stated, not hidden)
- The script reads markup only: it cannot see CSS, scripts outside inline `script` elements, or what components render. It says so in "Needs a manual test".
- `status-message`, `link-purpose` and `native-element` are heuristics from names and attributes; `link-purpose` is marked advisory when the sentence around the link may give the purpose.
- No assistive-technology test was run. The skill never claims conformance.
