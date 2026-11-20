# Skill Foundry: project goal (read this first)

Owner: the product owner. Every agent working in this repository reads this
file before planning or changing anything. Status markers: **[built]** exists and is tested,
**[planned]** approved direction, not built yet. Never describe a planned item as built.

## 1. The goal in one sentence

Skill Foundry is a **factory that builds many AI agent skills**, each written as the same
step-by-step layers, and showcases **the real output each skill produces**, never a mock.

## 2. The four ideas

| Idea | Meaning | Status |
|---|---|---|
| Factory | One standard and one toolchain (lint, evals, pack, install, site) produce many skills, not one | [built] for lint, evals, pack, install, site |
| Layers | Every skill uses the same layer template (10 core layers, more allowed); each layer is a detailed chapter of what the agent does at that step, like a book | [built] standard, template, lint `chk-layers`; all 10 ready skills use layers |
| Composition | Skills are atoms that combine into larger workflows (for example BA + UX + QA on one feature) | **[built]** recipes: `src/factory/recipes.json` lists a request that needs several skills; `node src/factory/recipe-run.mjs <id> --record` installs them all in one empty project and records which skills a real agent used, in order, and its answer; `tests/factory-recipes.test.mjs` requires a passing, current recording; the site shows it under "Skills working together" |
| Real output | The showcase shows only files a skill really produced from a real input, captured with its check results | [built] run recorder; the site shows the newest passing run of the current version, and falls back to the skill's own demo when there is none |

## 3. Kinds of skills and their output

- **UI / product design skills**: produce real UI output (SVG, HTML, components) with micro detail: spacing, states, breakpoints, light and dark.
- **Analysis skills (BA, system analysis, QA)**: written with legal precision: defined terms, numbered clauses, no ambiguity. Their output is drawn as the real working objects: documents, forms, folders, flow diagrams.
- `figure-craft` is the existing drawing engine (isometric SVG, tokens, geometry lint L1-L20); output skills reuse it instead of drawing by hand.

## 3a. Each skill: goal and purpose

Read the row of the skill you work on before you change it. The owner set these goals.

| Skill | Goal | What "done" means | Notes for agents |
|---|---|---|---|
| `skill-smith` | Build a new skill the factory way | The new skill has the ten layers, is self-contained, passes lint, has live evals recorded by a fresh agent and a routing case | `scope: factory`. Version stays 1.0.0 until the owner calls it final |
| `figure-craft` | Draw any object the user describes as a full, lit isometric figure that the reader can open, turn and hover | 0 lint errors in every state and view (L1-L20); the object looks like the real thing from outside, shows its real inside, and carries micro detail | Showcases ONE object, the refrigerator (`examples/build-demo.mjs`). Quality comes from the engine and rules, never from editing output. A reuse check on a second object lives in `docs/skills/figure-craft/verify/`, outside the showcase |
| `changelog-writer` | Turn merged changes into one CHANGELOG entry with the correct semver bump | Live evals 8 of 8, routing and portable check pass with fresh agents | Layers built; version 1.0.0 |
| `copy-tight` | Rewrite UI copy short and plain without changing meaning, numbers, names or legal text | Live evals 12 of 12, routing and portable check pass with fresh agents | Layers built; version 1.0.0 |
| `test-planner` | Give QA leads and developers a numbered regression checklist from a change description or diff | Live evals 9 of 9 and routing pass with fresh agents; every item traces to a source phrase from the change; refuses test code and bug review with one fixed sentence | Layers built; version 1.0.0 |
| `ui-polish` | Give developers and QA a final polish pass on finished UI code, using the project's design tokens when it has them | Live evals 16 of 16, routing, portable check and the recipe `tokens-then-polish` pass with fresh agents; every fix cites a rule; no word of text and no brand hue changes; with a token file no raw value is left where a token matches, no token name is invented and the file is never edited; every ratio comes from `engine/contrast.mjs` (or the table, said so); polished HTML passes `checkPage` | Layers built; version 1.0.0. Rules are numeric scales (or the token scales), not taste. Source books are not named in the skill. Reads the token file format only; does not need `design-system` installed |
| `design-system` | Turn a hex colour, a style description or a project's existing tokens into one complete, consistent design-token set any agent can read | Live evals 21 of 21, routing and portable check pass with fresh agents; every text pair has a numeric ratio of 4.5:1 or more in light and dark; the given hex is unchanged; existing tokens are never overwritten; `set` writes nothing when a pair would fall below its minimum | Layers built; version 1.2.0 on branch `plan/design-foundation` (path d: a product foundation in a design folder with variables in three tiers, `set`, `check`, `explain` in `engine/variables.mjs`, a once-only brief for a cold start; 1.1.0 modern group: glass, `--r-*`, `--z-*`, glow, gloss, weight 500, only when asked). Numbers come from the engines in the skill folder, not the agent. Five archetypes as numbers; compared brands are never named |
| `spec-writer` | Give business analysts and product owners testable acceptance criteria from a feature request, user story or requirement | Live evals 12 of 12, routing and portable check pass with fresh agents; every clause is one Given-When-Then line with an id (AC-n) and a source phrase copied from the requirement; nothing the text does not state is written as a clause, it is an open question for the Product Owner | Layers built as numbered clauses with defined terms; version 1.0.0. Six fixed headings, shown only when the text supports them. Fixed sentences for missing text, a title only, test code, and a regression checklist (points to `test-planner`) |
| `a11y-audit` | Give QA leads and developers an accessibility audit of pasted HTML or JSX: what keyboard, screen reader, voice control and zoom users cannot do | Live evals 16 of 16, routing and portable check pass with fresh agents; every finding names an element that is in the input, a rule id, a WCAG 2.2 criterion (A or AA), who is affected and a diff fix; never contrast, focus style, spacing, target size, flow, visible words or a conformance claim, each with one fixed sentence | Layers built as numbered clauses with defined terms; version 1.0.0. The 39 checks run in `engine/audit.mjs` (Node.js, no dependencies), so results do not depend on the agent's eyes. Lists what needs a manual test with assistive technology |
| `ux-review` | Give BA and QA a numbered list of usability findings for an existing screen or flow, from its code or a step-by-step description | Live evals 14 of 14, routing and portable check pass with fresh agents; every finding quotes evidence from the input, cites one of 18 numeric or yes/no rules and one severity S1 to S4; what the input does not show is an open question; fixed sentences for nothing to review, fix requests and new designs | Layers built as numbered clauses; version 1.0.0. Never fixes code (ui-polish), never contrast, ARIA or text (ui-polish, a11y-audit, copy-tight). Source books are not named in the skill |

Rules that apply to every skill (the full text is in `AGENTS.md`, SKILL QUALITY LAW, and `.harness/memory/lessons.md`):

- A skill is accepted only when a fresh real agent, given only the skill folder, does the work: live evals (`node src/factory/live-evals.mjs <name>`), routing evals (`node src/factory/routing-evals.mjs`), and for a skill that produces files a recorded run (`node src/factory/run-skill.mjs <name> --case <id>`).
- One skill per session; never a locked skill; `npm run guard` before every commit.
- Every skill follows the ten layers (`docs/factory/STANDARD.md` section 12) and `docs/factory/QUALITY-LAYERS.md`.

## 4. Showcase rules (real output, low token cost)

1. Every ready skill's cover is real output: a recorded figure run (`runs/`), or else the real answer of a fresh agent drawn as the object it stands for (`src/site/lib/objects.mjs`: copy-tight a message before and after, changelog-writer a release tag, test-planner a clipboard, skill-smith a skill folder; every drawn word cut from the recording), falling back to a document (`src/site/lib/proof.mjs`), taken word for word from its portable-check recording or, for `scope: factory`, its live recording. The skill page shows that answer in full, with the request it was given and a copy button. Each cover says "Real output from an agent". **[built]**, enforced by `tests/site-real-output.test.mjs`.
2. A recorded run is: the input, the files produced, the skill version, the check results and the token cost, saved under `runs/<skill>/<run-id>/` with a manifest. [built] `src/factory/run-skill.mjs`; `maxLines` expectations are not applied to recorded files; text checks skip Markdown reports. First real runs: `runs/figure-craft/` (screenshots in `screens/`).
3. A run is made by a real agent following the skill, once. It is cached by input hash and skill version and repeated only when one of them changes. Deterministic steps (render, lint, pack) run as scripts, not as agent work.
4. A failed or incomplete output is shown as it is. Nobody polishes it by hand.
5. Hand-drawn images may only appear with the visible label "Concept drawing, not real output", and never for a ready skill. **[built]**, enforced by `tests/site-real-output.test.mjs`.

## 5. Where things are

| Path | What |
|---|---|
| `docs/factory/STANDARD.md` | The skill standard, including the layer template (section 12) |
| `src/skills/_template/` | Starting folder for a new skill, with all layer files |
| `src/skills/<name>/` | 10 ready skills: `skill-smith` (factory), `a11y-audit`, `changelog-writer`, `copy-tight`, `design-system`, `figure-craft`, `spec-writer`, `test-planner`, `ui-polish`, `ux-review` |
| `src/factory/` | lint, evals, live evals, routing evals, run recorder, skill guard, pack, install, `registry.json`, `locks.json`, `migration.json` |
| `src/site/` | Showcase site generator (`npm run dev`, `docs/site/LANDING-SPEC.md`, real-agent outputs) |
| `tests/` | `npm test` (node --test) |
| `.harness/` | Agentic-Harness 1.0.18; locked unless the owner approves in chat |

## 6. Roadmap

1. Layer standard and template. **[built]**
2. Run recorder with cache: `node src/factory/run-skill.mjs <skill> (--case <id> | --input <file>)`. **[built]**
3. Pilot: figure-craft showcase comes from a recorded real run (refrigerator). **[built]**
4. Migrate skills to the layer files; all portable ready skills checked with `chk-portable`. **[built]**
5. Recipes for combining skills. **[built]** (3 recipes in `src/factory/recipes.json`: `ship-a-change`, `tokens-then-polish`, `spec-then-retest`)
6. Additional domain skills added one skill per session under `docs/factory/STANDARD.md` with fresh real-agent proof: **[in progress on `lab`]**
   - `ui-craft` draft `0.1.0` (`[built]` on `lab` `@f82dd71`, pending fresh-agent live/portable/routing recordings -> `1.0.0` `ready` and Skill Foundry `1.1.0`).
   - Ordered continuation tasks (`UI-2026-01` .. `UI-2026-05`: `ui-craft` `ready` -> `design-system` `1.1.0` -> `ui-polish` `1.1.0` -> `ux-review` `1.0.1` -> `svg-mechanism` `1.0.0`) are tracked in `.harness/backlog.json` (`status: BACKLOG`) and documented end-to-end in `docs/factory/notes/2026-ui-upgrade-handoff.md`.

## 7. Rules for every agent

- **One release path**: lab branch → real-agent proof → `npm run release:check` READY → the owner approves in chat → `master` → Pages → users `npx … update`. **[built]**

- Skills reach other projects with one command: `npx github:sumtaimo/Skill-Foundry add <skill>` (or `add --role <ROLE>`, `check`, `update`). An update keeps files the user changed; a project with an agentic harness gets each skill registered for its roles. **[built]** `src/factory/foundry.mjs`, `tests/factory-foundry-cli.test.mjs`. The site is published on GitHub Pages from `master` (`.github/workflows/pages.yml`).

- A skill is also checked for someone outside this repo: `node src/factory/portable-check.mjs <name> --prompt "<request>" --record`. It is required before `ready` and goes stale when the skill changes (not for `scope: factory`).
- Never leave work half done: finish the gaps your own report lists (AGENTS.md, SKILL QUALITY LAW, rule 11).
- **Two separate versions (Project vs. Skill)**:
  - **Skill Foundry project version (`package.json`, `CHANGELOG.md`, currently `1.0.1`)** versions the `skill-foundry` CLI (`--version`), showcase site, `skills.json`, and `llms.txt`, and is displayed in the footer as `Skill Foundry version <x.y.z>`.
  - **Each skill's version (`src/skills/<name>/SKILL.md`, `src/skills/<name>/CHANGELOG.md`, `src/factory/registry.json`, e.g. `1.0.0`, `0.2.0`)** versions that skill's folder independently and is displayed on its card and detail page as `Skill version <x.y.z>`.
  - Both move slowly: record smaller changes under the current version and never bump either version without the owner's approval in chat.
- figure-craft showcases one object only, the refrigerator, at the detail level of the owner's reference figure. The registry field `showcase` pins that case for the site.
- Quality and detail come from the skill (rules, lint, references). When output is weak, fix the skill and run again; never touch up the output.
- Every skill is for other people too: it starts from the goal its user states and is self-contained in its folder.
- Investigate code, docs and tests yourself; ask the owner only for business rules, scope, UX decisions or approvals.
- Cite `file:line`; separate confirmed facts from assumptions.
- A task is done only when `npm test` and `node src/factory/lint-skills.mjs` pass and the real output was checked, not when the code looks right.
- Never change this file's goal, the standard or the charter without the owner's approval.
