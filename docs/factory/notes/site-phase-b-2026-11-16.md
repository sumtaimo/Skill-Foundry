# Site Phase B + landing rebuild, 2026-11-16

Branch `claude/site-phase-b`. Scope: `src/site/**`, `tests/**`, `src/factory/registry.json` (roles only). No skill folder, `locks.json` or `.harness/**` changed (`npm run guard`: "ok (no skill changed)").

## What changed
- **Landing**: hero (one plain sentence about what a skill is and who it is for, three fact chips computed from real data, one primary "Install a skill" button) → one real recorded result big (figure-craft refrigerator, with its exact request) → numbered contents → 1 Ready skills (search and role filter moved here, small named cards with one quiet "Copy install command" each) → 2 Proof (table, seven checks and the three recipes collapsed) → 3 Install (7 npx commands in workflow order, each with a copy button; zip fallback in a closed "No Node.js?" box) → 4 For agents → 5 Limits → 6 Questions.
- **Skill page**: hero (name, one sentence, version, roles, real-agent line, one primary Install) → real result big with the exact request beside it → Install (npx + copy; zip fallback closed; factory-only skills zip only) → 7 numbered sections (what it does and never does, how to ask, how it is proven with counts, rules and layers in 3 closed accordions, examples with the word-for-word answer, limits, questions). The top-bar Install and Proof links stay on the page.
- **D2**: card and header "Copy install command" copy `npx github:sumtaimo/Skill-Foundry add <name>`; `skills.json` has `npxInstallCommand` / `installCommand` (npx, null for factory-only) plus `zipInstallCommand` and an `npx` map; `llms.txt` and the agent prompt give npx first and the zip as `zip-fallback`.
- **D3**: all 8 roles in `content.mjs`, `render.mjs`, `i18n.mjs` (EN and KM); the filter shows only roles a ready skill has (now 5); `UX_DESIGNER` added to `design-system` and `ux-review` in the registry only.
- **Audit top-10**: no lead-in before a heading; hero preview no longer clipped or animated (CLS 0); text 16 px except 3 caption rules; every control 44 px; muted/faint 4.5:1 or better in both themes (tested); no raw `{site}`/`{base}` visible without JavaScript; `lang="km"` on the Khmer button; the "Skills working together" section is a closed accordion inside Proof.
- Structure reference (skills.wheresryan.sh/anatomy) was opened; only its structure was used (small nav, numbered sections, hero sentence + facts + Install, real example under the hero, Limits, Questions). No text, name, art or code copied.

## Before / after (Playwright, light; dark gives the same counts, 0 contrast failures)
| Page | Height px (screens) | Controls above fold | Targets <44 px | Elements <16 px | Contrast fails | CLS | h1 top px | Primary buttons |
|---|---|---|---|---|---|---|---|---|
| landing 1440 | 9822 (10.9) → 6190 (6.9) | 24 → 10 | 77 → 0 | 263 → 21 | 11 → 0 | 0.0645 → 0 | 143 → 117 | 10 → 1 |
| landing 390 | 17169 (20.3) → 10401 (12.3) | 14 → 9 | 73 → 0 | 263 → 21 | 11 → 0 | 0.195 → 0 | 158 → 245 | 10 → 1 |
| ux-review 1440 | 7168 (8.0) → 4026 (4.5) | 9 → 19 | 17 → 0 | 76 → 3 | 1 → 0 | 0 → 0 | 866 → 137 | 2 → 1 |
| ux-review 390 | 7926 (9.4) → 5481 (6.5) | 14 → 18 | 17 → 0 | 76 → 3 | 1 → 0 | 0 → 0 | 597 → 265 | 2 → 1 |

Raw: `site-phase-b-raw/measure-before.json`, `measure-after.json`, `tools/measure.mjs`. The "elements <16 px" left are the three caption rules (cover tag, request label, token figure caption, 14 px). SVG text inside recorded figures (171 nodes on the landing) is the skill's own real output and was not changed.
Screenshots (`site-phase-b-shots/`, slices ≤ 2400 px): `after-landing-{light,dark}-{1440,390}-N.png` and `after-skills_ux-review-{light,dark}-{1440,390}-N.png`, next to the `before-*` ones.

**Honest misses**
- Skill page is 4.5 screens at 1440 (target "about 3"), 6.5 at 390. ux-review has the longest request and answer; shorter skills are shorter.
- "Controls above the fold" on a skill page rose (9 → 19) because the sticky contents bar now lists 8 links; the primary action count fell 2 → 1 and the bar is secondary text links.
- 390 h1 sits lower (158 → 245 px) because the nav wraps to two lines at that width.

## Real agents (5 runs, cap 6; fresh `claude -p`, cwd outside the repo, only a copy of the skill folder)
| Run | Skill | Input | Cost | Raw answer |
|---|---|---|---|---|
| 1 | ui-polish (token mode) | landing page + site.css + audit tokens | $1.19 | `site-phase-b-raw/ui-polish__landing.md` |
| 2 | ui-polish (token mode) | ux-review skill page | $1.18 | `ui-polish__skill-ux-review.md` |
| 3 | a11y-audit | landing page HTML | $0.29 | `a11y-audit__landing.md` |
| 4 | a11y-audit | ux-review skill page HTML | $0.27 | `a11y-audit__skill-ux-review.md` |
| 5 | copy-tight | 90 landing + 64 skill-page UI strings | $0.28 | `copy-tight__ui-strings.md` |

Failures applied: a11y-audit heading-order (recipe titles and changelog headings were h4 under h2 → h3); ui-polish missing states (hover on chips, accordion summaries, search field, brand; disabled and pressed states); copy-tight rewrote 12 strings (English only; Khmer kept, meaning unchanged). The tokens used for ui-polish are the design-system tokens recorded in the audit.

## Skill weaknesses (skills not changed)
- **ui-polish** replaced the near-black primary button (16:1) with the brand green (4.9:1) on both pages. That lowers contrast and breaks this site's rule that green is only for progress, meter and focus; it is not applied. It also rewrote ~25 px values to `var(--space-*)` from a token file the site does not load, and moved weights and line heights to the preset's values, which would change the site look; not applied (the site keeps its own token block, which `site-links` tests).
- **ui-polish** cannot see layout order, page length or overlap (it never saw a render); those were fixed from measurements.
- **a11y-audit** found only heading order (1 advisory per page) and listed manual tests; it could not check the removed illustrations and run-time text, as it said itself. The landing had 0 failures.
- **copy-tight**: all edits kept meaning; it shortened `agents.p` by dropping "instead of this page", a small loss that was accepted. It left the long `install.npx` note unchanged.

## Gates
`node src/site/build.mjs --check`: ok. `checkPage` (src/factory/visual.mjs): 0 problems on all 11 pages, light and dark, 1440 and 390. `npm test`: 293 pass, 0 fail. `npm run guard`: ok. `npm run release:check`: READY (output in the final message).

## Tests changed with the change (none weakened)
`site-finder` (skills.json, llms.txt, landing order, install panel, role filter, agent prompt, skill-page install), `site-own-style` (cards, numbered sections, reduced motion, real result, `lang="km"`, 16 px / 44 px / contrast rules), `site-visual` (hero then result, one primary action, 0 targets under 44 px, no raw placeholders), `ux-review` roles. `factory-foundry-cli` and `site-i18n` pass unchanged.

## Open items
- Skill page length target (about 3 screens) not reached; needs a PO choice: drop section 2 "How to ask" (the request already sits beside the result) or collapse the word-for-word answer. Not done because it removes content TAIMO asked for.
- Khmer strings added in this phase are drafts and still need native review (as in the dictionary header).
- Release to master is TAIMO's decision after approval in chat.
