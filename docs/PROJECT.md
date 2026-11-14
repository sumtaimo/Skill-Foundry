# Skill Foundry: project goal (read this first)

Owner: TAIMO (Product Owner / UX Engineer). Every agent working in this repository reads this
file before planning or changing anything. Status markers: **[built]** exists and is tested,
**[planned]** approved direction, not built yet. Never describe a planned item as built.

## 1. The goal in one sentence

Skill Foundry is a **factory that builds many AI agent skills**, each written as the same
step-by-step layers, and showcases **the real output each skill produces**, never a mock.

## 2. The four ideas

| Idea | Meaning | Status |
|---|---|---|
| Factory | One standard and one toolchain (lint, evals, pack, install, site) produce many skills, not one | [built] for lint, evals, pack, install, site |
| Layers | Every skill uses the same layer template (10 core layers, more allowed); each layer is a detailed chapter of what the agent does at that step, like a book | [built] standard, template, lint `chk-layers`; both shipped skills use layers |
| Composition | Skills are atoms that combine into larger workflows (for example BA + UX + QA on one feature) | [planned] |
| Real output | The showcase shows only files a skill really produced from a real input, captured with its check results | [built] run recorder; the site shows the newest passing run of the current version, and falls back to the skill's own demo when there is none |

## 3. Kinds of skills and their output

- **UI / product design skills**: produce real UI output (SVG, HTML, components) with micro detail: spacing, states, breakpoints, light and dark.
- **Analysis skills (BA, system analysis, QA)**: written with legal precision: defined terms, numbered clauses, no ambiguity. Their output is drawn as the real working objects: documents, forms, folders, flow diagrams.
- `figure-craft` is the existing drawing engine (isometric SVG, tokens, geometry lint L1-L8); output skills reuse it instead of drawing by hand.

## 4. Showcase rules (real output, low token cost)

1. The site shows a skill's newest recorded real run that passed and matches the current version: its figure as the cover, its prompt, and its page in a frame. [built] A skill with no such run (today: `skill-smith`) still appears with its own cover; requiring a run for every skill is [planned].
2. A recorded run is: the input, the files produced, the skill version, the check results and the token cost, saved under `runs/<skill>/<run-id>/` with a manifest. [built] `src/factory/run-skill.mjs`; `maxLines` expectations are not applied to recorded files; text checks skip Markdown reports. First real runs: `runs/figure-craft/` (screenshots in `screens/`).
3. A run is made by a real agent following the skill, once. It is cached by input hash and skill version and repeated only when one of them changes. Deterministic steps (render, lint, pack) run as scripts, not as agent work.
4. A failed or incomplete output is shown as it is. Nobody polishes it by hand.
5. Hand-drawn images may only appear labelled as "concept".

## 5. Where things are

| Path | What |
|---|---|
| `docs/factory/STANDARD.md` | The skill standard, including the layer template (section 12) |
| `src/skills/_template/` | Starting folder for a new skill, with all layer files |
| `src/skills/<name>/` | Shipped skills: `skill-smith` (builds skills), `figure-craft` (isometric figures) |
| `src/factory/` | lint, evals, pack, install, `registry.json` |
| `src/site/` | Showcase site generator (`npm run dev`) |
| `tests/` | `npm test` (node --test) |
| `.harness/` | Agent harness; locked unless TAIMO approves in chat |

## 6. Roadmap

1. Layer standard and template. **[built]**
2. Run recorder with cache: `node src/factory/run-skill.mjs <skill> (--case <id> | --input <file>)`. **[built]**
3. Pilot: figure-craft showcase comes from a recorded real run (refrigerator). **[built]**
4. Migrate `skill-smith` and `figure-craft` to the layer files; skills portable (`chk-portable`). **[built]**
5. Recipes for combining skills. [planned]
6. New skills from `docs/factory/ROADMAP.md`, BA and UI skills first. [planned]

## 7. Rules for every agent

- Skill versions stay at 1.0.0 until TAIMO calls a version final. Record changes under the current version; never bump it yourself.
- figure-craft showcases one object only, the refrigerator, at the detail level of TAIMO's reference figure. The registry field `showcase` pins that case for the site.
- Quality and detail come from the skill (rules, lint, references). When output is weak, fix the skill and run again; never touch up the output.
- Every skill is for other people too: it starts from the goal its user states and is self-contained in its folder.
- Investigate code, docs and tests yourself; ask TAIMO only for business rules, scope, UX decisions or approvals.
- Cite `file:line`; separate confirmed facts from assumptions.
- A task is done only when `npm test` and `node src/factory/lint-skills.mjs` pass and the real output was checked, not when the code looks right.
- Never change this file's goal, the standard or the charter without TAIMO's approval.
