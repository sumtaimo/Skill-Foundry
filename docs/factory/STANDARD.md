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

Lint output format: `<file>:<line> <code> <message>`. Exit code 0 means no problems.

## 8. Size and references

SKILL.md MUST be at most 150 lines (`chk-size`). Move background, long tables and edge cases into `references/` and link to them with relative links.

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

## 12. Live evals (real agent)

Evals that pass only on hand-written answers prove nothing about the skill. Before `ready`:

- Each case in `evals/cases.json` MUST have a recording `evals/live/<case-id>.json` with `prompt`, `agent`, `recordedAt`, `output` and `files`, made by a fresh agent that was given only the skill folder and the case prompt.
- `node src/factory/live-evals.mjs <name>` MUST print 0 failed. A recording whose prompt differs from the case is stale and fails.
- Files the agent produced (pages, SVGs) are kept in `evals/live/files/` and UI output is run through `checkPage`.
- Record new runs with `node src/factory/live-evals.mjs <name> --run` (costs tokens) or by any agent harness that saves the same JSON shape.
- `tests/factory-live-evals.test.mjs` fails for any `ready` skill without passing recordings.
