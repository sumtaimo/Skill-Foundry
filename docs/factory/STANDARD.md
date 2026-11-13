# Skill Standard

Every skill lives in `src/skills/<name>/`. `src/skills/_template/` is the starting point and is skipped by lint and pack.

## 1. Required files

| File | Purpose |
|------|---------|
| `SKILL.md` | Frontmatter plus the core instructions (max 150 lines) |
| `references/README.md` | Long-form details moved out of SKILL.md |
| `examples/README.md` | Worked examples of input and output |
| `evals/cases.json` | Eval cases run by `src/factory/evals.mjs` |
| `RULES.json` | Rules, each mapped to a check id or a checklist item |
| `CHANGELOG.md` | Version history |
| `preview.json` | Card metadata for the preview |
| `preview/cover.svg` | Cover image |
| `layers/01-intent.md` ... `layers/10-evidence.md` | The ten core layers (section 12) |

Missing files are reported as `chk-required-files`.

## 2. Frontmatter

SKILL.md starts with a block between `---` lines containing:

```
---
name: <folder name>
description: <when to use, and when not to>
version: <semver, e.g. 1.0.0>
---
```

- `name` MUST equal the folder name (`chk-name-match`).
- `name`, `description` and `version` MUST be present; `version` MUST be semver (`chk-frontmatter`).
- Optional `scope: factory` marks a skill that only runs inside this repository (for example `skill-smith`). Every other skill is portable: other people install it in their own project and start it by stating their goal.

## 3. Writing a description that triggers correctly

The description is what an agent reads to decide whether to load the skill.

1. State the task in the first sentence, using words a user would actually type.
2. Name concrete triggers: file types, commands, phrases ("Use when ...").
3. Name exclusions: neighbouring tasks this skill does not cover ("Do not use for ...; use <other-skill> instead").
4. Keep it to one or two sentences; no marketing language.

Example: `Writes Given-When-Then acceptance criteria for a feature or bug. Use when asked for acceptance criteria, test scenarios or a spec. Do not use for UI copy or code review.`

## 4. SKILL.md sections

Required sections, in order: `## When to use`, `## Procedure`, `## Rules`, `## Checks`, `## Review`, `## Output`.

## 5. Procedure style

- Numbered list.
- Imperative mood ("Read the file", not "The file should be read").
- One action per step.
- No step depends on information that is not stated earlier or in references/.

## 6. Rules

- Each rule is written with MUST or NEVER.
- Each rule has an id `R-<skill>-<n>` (n starting at 1).
- Rules are listed in SKILL.md and stored in `RULES.json`:

```json
[{ "id": "R-spec-writer-1", "text": "Every criterion MUST use Given-When-Then.", "checklist": "Each criterion has Given, When and Then" }]
```

- Every rule MUST have `check` (a check id) or `checklist` (a reviewer item), otherwise `chk-rules-mapped` is reported.
- Every `check` id MUST appear as text in some file in the tests folder, otherwise `chk-check-tested` is reported.

## 7. Check ids

These are the lint problem codes from `src/factory/lint-skills.mjs`:

| Id | Verifies |
|----|----------|
| `chk-required-files` | All required files exist |
| `chk-frontmatter` | Frontmatter present with name, description, semver version |
| `chk-name-match` | Frontmatter name equals folder name |
| `chk-size` | SKILL.md is at most 150 lines |
| `chk-rules-mapped` | Every rule in RULES.json has a check or checklist |
| `chk-check-tested` | Every rule check id appears in a file in the tests folder |
| `chk-links` | Relative links in the skill point to existing files |
| `chk-preview-json` | preview.json has the required fields within limits |
| `chk-cover-svg` | cover.svg meets the safety and size limits |
| `chk-layers` | The ten core layer files exist, have numbered steps and are linked from SKILL.md |
| `chk-portable` | SKILL.md, layers and references name no `src/`, `docs/` or `tests/` repository path (unless `scope: factory`) |

Lint output format: `<file>:<line> <code> <message>`. Exit code 0 means no problems.

## 8. Size and references

SKILL.md MUST be at most 150 lines (`chk-size`). SKILL.md is the index of the skill, not the whole book: the step-by-step detail lives in the layer files (section 12), and background, long tables and edge cases live in `references/`. Link to both with relative links.

## 9. Evals

`evals/cases.json`: `[{ "id", "prompt", "expect": [{ "type", "value" }] }]`, where type is one of:

- `contains` - output text contains value
- `notContains` - output text does not contain value
- `maxLines` - `text.split("\n").length <= value`
- `fileExists` - produced files include value

## 10. Versioning and CHANGELOG

- Use semver: MAJOR for changes that break existing use, MINOR for new behaviour, PATCH for fixes and wording.
- Every version bump MUST have a CHANGELOG.md entry: `## <version> - <YYYY-MM-DD>` followed by bullet points.
- The version in frontmatter, CHANGELOG and `src/factory/registry.json` MUST match.

## 11. Preview

`preview.json`:

| Field | Rule |
|-------|------|
| `title` | Required |
| `tagline` | Required, at most 90 characters |
| `prompt` | Required, an example prompt |
| `outputs` | Required, what the skill produces |
| `tags` | Required array, at most 5 items |

`preview/cover.svg`:

- Root element is `<svg>` with a `viewBox`.
- At most 40 KB.
- NEVER contains `<script` or `<foreignObject`.
- NEVER has `href` or `xlink:href` starting with `http`, `https` or `//`.
- Every `fill`, `stroke`, `stop-color` and `color` attribute value is `var(--...)`, `currentColor` or `none`.

## 12. Layers (one workflow for every skill)

Every skill follows the same layer template, so an agent learns the structure once. Each layer is a file in `layers/`, written as a detailed chapter: what the agent does at that step, in numbered imperative steps, with the inputs it needs and what it hands to the next layer. The `## Procedure` in SKILL.md lists one step per layer and links to it.

| # | File | The agent answers |
|---|------|-------------------|
| 01 | `layers/01-intent.md` | What is asked, for whom, and the one outcome that proves success |
| 02 | `layers/02-context.md` | What already exists (code, docs, prior output) and must be preserved |
| 03 | `layers/03-inputs.md` | Which inputs are required, which are optional, and what to do when one is missing |
| 04 | `layers/04-flow.md` | The ordered work, one action per step |
| 05 | `layers/05-rules.md` | The MUST / NEVER rules that apply, by id from RULES.json |
| 06 | `layers/06-states.md` | States, edge cases, errors, empty and loading cases, responsive behaviour |
| 07 | `layers/07-checks.md` | The checks to run, machine first, then the checklist |
| 08 | `layers/08-output.md` | The exact files and format produced, and quality bar down to micro detail |
| 09 | `layers/09-handoff.md` | What the next person or skill receives, and open items |
| 10 | `layers/10-evidence.md` | The proof recorded: input, output files, check results, assumptions |

- The ten core layers keep these numbers and names in every skill.
- A skill MAY add layers after 10 (`layers/11-<name>.md`, ...) when it needs more steps; it NEVER removes or renumbers a core layer.
- Analysis skills (BA, system analysis, QA) write layers as numbered clauses with defined terms, so each clause can be cited.
- Output skills (UI, figures) state in layer 08 the real files produced; the showcase shows only real recorded output (see `docs/PROJECT.md` section 4).
- Layer 01 MUST start from the goal the user states and ask when it is missing.
- Quality and detail MUST come from the skill's own rules, lint and references, NEVER from editing its output by hand.
- Enforced by `chk-layers` and `chk-portable`. `skill-smith` and `figure-craft` follow this section.
