# Joint test plan: Skill Foundry + Agentic Harness together

For TAIMO to run next. Nothing here has been run with real agents yet; the offline tests it builds on already pass
(`tests/factory-foundry-gate.test.mjs`, `tests/factory-foundry-ownership.test.mjs`). Real agents cost money: run one flow at a time and agree the cap first.

## The rule being tested

Two separate projects, one owner. Skill Foundry writes only `.claude/skills/<name>/`, `.harness/skills/<name>/SKILL.md` (and `.orig`),
the managed block in `AGENTS.md`, and the Edit deny rules in `.claude/settings.json`. The harness must not be able to edit those skills
(the deny rules protect them), and its install or update must keep our deny rules, folders and pointers (marker `installed-by: skill-foundry`).
Whoever finds a problem in the other project **reports it and never edits it**.

## 0. Before anything (offline, free)

| Step | Command | Expected |
|---|---|---|
| 0.1 Vendor the harness snapshots | **Done 2026-11-16** by the orchestrator: `tests/fixtures/agentic-harness/release-v1.0.6-15bd31e/` and `lab-v1.0.15-0f39c98/` (read-only copies; refresh by replacing the whole folder from the harness repository). | Both folders have a README naming source, branch and commit; `node --test tests/factory-foundry-gate.test.mjs` passes. |
| 0.2 Run the gate on everything | `npm test` | every gate and ownership test runs once per snapshot plus once for this repository's copy; the skipped test "vendored snapshots of both versions are present" now passes |
| 0.3 Replace the install simulation | in `tests/helpers/harness-project.mjs` `installHarness()` run the snapshot's real `install.mjs` in the temp folder | same results as 0.2 (finding AH-A5) |

## 1. Matrix

Situations (S) x install order x harness version (V) x roles (R). Everything below runs in a **new empty git folder** each time.

| Id | Situation | Install order | Harness version |
|---|---|---|---|
| S1 | Skill Foundry only | `npx github:sumtaimo/Skill-Foundry#lab add --all` | none |
| S2 | Harness only, then Skill Foundry | harness first, then Skill Foundry | V1 `release` 1.0.6, V2 `lab` 1.0.9 |
| S3 | Skill Foundry first, then the harness | Skill Foundry first, then harness install, then harness update | V1, V2 |
| S4 | Harness only (no Skill Foundry) | harness only | V1, V2 (control: it must work as before) |

Roles checked in S2 and S3 (all 8 known): `PO_ARCHITECT`, `BA_ANALYST`, `DEV_ENGINEER`, `QA_AUDITOR`, `UX_DESIGNER`, `REVIEWER`, `SECURITY`, `COORDINATOR`
(a role the harness version does not define is "n/a", not a failure).

## 2. Commands and expected results per situation

Run each block in a fresh folder: `mkdir /tmp/jt-<id> && cd /tmp/jt-<id> && git init -q`.

### S1 Skill Foundry only

```
npx github:sumtaimo/Skill-Foundry#lab add --all
npx github:sumtaimo/Skill-Foundry#lab doctor
npx github:sumtaimo/Skill-Foundry#lab check
ls -A
```
Expected: files are only `.claude/`, `AGENTS.md` (managed block); no `.harness/`; `doctor` exit 0, "project without an agentic harness", harness named only as advice; `check` exit 0.
Real-agent flow (1 run): `claude -p "Shorten this button label: 'Click here to submit your application now'"` with `copy-tight`; expected: a short label from the skill's table, no mention of internal skills, layers or protection.

### S2 Harness first, then Skill Foundry (repeat for V1, V2)

```
npx github:sumtaimo/Agentic-Harness#<release|lab> .
npx github:sumtaimo/Skill-Foundry#lab add --all
node .harness/doctor.mjs
npx github:sumtaimo/Skill-Foundry#lab doctor
npx github:sumtaimo/Skill-Foundry#lab check
git status --short
```
Expected: our deny rules and the harness permissions are both in `.claude/settings.json`; `AGENTS.md` has one harness block and one Skill Foundry block; every portable skill has a pointer in `.harness/skills/` (the harness 15-line `spec-writer` starter is replaced, original kept as `SKILL.md.orig`); Skill Foundry `doctor` 0 problems (warnings only for things the project owner decides: node for some roles, `team.json` skills lists, dropped engines); `node .harness/doctor.mjs` exits as before our install.
Real-agent flow (1 run): `/harness:run Add a test for <small function> and shorten the button copy in <file>` (Claude Code). Expected: the DEV and QA leads each read their skill pointer, the controller says PASSED, `Bash(npm test:*)` still ran for QA, no file under `.claude/skills/` or `.harness/skills/` changed (`git diff --stat -- .claude/skills .harness/skills` empty).

### S3 Skill Foundry first, then the harness (repeat for V1, V2)

```
npx github:sumtaimo/Skill-Foundry#lab add --all
npx github:sumtaimo/Agentic-Harness#<release|lab> .           # harness install on top
npx github:sumtaimo/Skill-Foundry#lab add --all               # wires the pointers
npx github:sumtaimo/Agentic-Harness#<release|lab> .           # harness update on top, never --reset
npx github:sumtaimo/Skill-Foundry#lab check
npx github:sumtaimo/Skill-Foundry#lab doctor
```
Expected after the harness install and after the update: all 4 Edit/Bash deny rules still in `.claude/settings.json`; `.claude/skills/**` byte-identical (`git diff --stat -- .claude/skills` empty); `.harness/skills/<name>/SKILL.md` pointers intact; one block of each in `AGENTS.md`; `check` exit 0; `doctor` 0 problems and no warning about skills, `AGENTS.md`, settings or pointers.
If the harness overwrote `.claude/settings.json`: `doctor` must say "not protected" and `doctor --fix` must restore only our rules.
Real-agent flow: same as S2.

### S4 Harness only (control)

```
npx github:sumtaimo/Agentic-Harness#<release|lab> .
node .harness/doctor.mjs
npm test
```
Expected: unchanged from before this work; Skill Foundry files absent.

### Roles (S2 and S3, one dispatch per role, cheap model, one at a time)

For each role R that a ready skill lists in `src/factory/registry.json`:
`node .harness/dispatch.mjs --goal "<a one-file task that the role's skill covers>" --role <R> --files "<one file>" --check "npm test" --wait`
Expected: the session note shows the skill was injected (`autoApply`), the role kept its own tool rules (`Bash(npm test:*)` for QA, `Edit`/`Write` limited to its files), out-of-scope edits were reverted.
Known limits to expect, not failures: `QA_AUDITOR` and `BA_ANALYST` cannot run `node` engine scripts (finding AH-A2); a `team.json` member with a `skills` list does not get our skills (AH-A1).

## 3. Pass criteria

All of: S1 to S4 expected results met for V1 and V2; the ownership line held (`git diff --stat` shows only the owned paths between steps); no problem item in `doctor`; one real-agent flow per situation recorded (command, answer, `git diff --stat`).

## 4. Who reports to whom

| Found in | By a session of | Action |
|---|---|---|
| The harness (Agentic-Harness) | Skill Foundry | Do not edit it. Write file, line, what happens, proposed fix in `docs/factory/notes/harness-findings-<date>.md` and tell TAIMO in chat; TAIMO takes it to the Agentic-Harness project. |
| Skill Foundry | the Agentic-Harness project | Do not edit it. Report to TAIMO in chat with the exact command and output; TAIMO opens it in a Skill Foundry session (`claude/...` branch, then `lab`). |
| Both (the interface: pointer format, deny rules, marker) | either | Report to TAIMO first; change both sides in two sessions, one after the other, then re-run section 2. |

After each joint run, the Skill Foundry session adds one row to `docs/factory/STATUS.md` (date, versions, result) and keeps every weakness as one backlog line.
