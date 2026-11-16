# Findings about the Agentic Harness (for TAIMO to take to the Agentic-Harness project)

Written by the platform A2 session, 2026-11-16. Rule L23: Skill Foundry never edits the harness; these are reports only.

**Evidence limit (read this first).** The session could not read the `sumtaimo/Agentic-Harness` repository (`add_repo` was denied
by the permission classifier), so every finding below comes from **this repository's own `.harness/` copy** (version unknown, no
`MANIFEST.json`) and from running the real `foundry.mjs` against it. None was checked against `release` `15bd31e` or `lab`
`bf8b43c`. Each item needs a re-check there before anyone fixes it. When the snapshots are vendored (see `docs/factory/JOINT-TEST-PLAN.md`
step 0) the gate tests re-check items 1 to 3 automatically.

| # | File and line (this repository's copy) | What happens | Proposed fix (in the Agentic-Harness project) |
|---|---|---|---|
| AH-A1 | `.harness/team.json:49` and `:68` (`lead-dev`, `lead-qa` list `"skills": ["code-craft"]`); `.harness/lib/governance.mjs:230-241` (`matchSkills`: an explicit `skills` list wins, `autoApply` is not used) | Skill Foundry pointers use `autoApply: true`. A team member that lists `skills` never gets them, so in `--hierarchy` / `/harness:run` the leads work without any installed Skill Foundry skill. Found by `doctor` on a default harness. | Ship `team.json` leads without a `skills` list, or make `matchSkills` add `autoApply` skills to an explicit list. |
| AH-A2 | `.harness/roles/qa-auditor.json:5` and `.harness/roles/ba-analyst.json:5` (`allowedTools` has no `Bash(node:*)`) | Roles `QA_AUDITOR` and `BA_ANALYST` cannot run `node`, so skills with an `engine/` folder (a11y-audit, ui-polish for QA; design-system, figure-craft for BA) cannot run their scripts there. `doctor` warns for each pair. | Add `Bash(node:*)` (or the narrower script paths) to those roles, or document that engine skills belong to `DEV_ENGINEER`. Known since the first handoff. |
| AH-A3 | `.harness/team.json:19`, `:34`; `.harness/config.json:10`, `:129`, `:147` | `gemini` and `orca` engines are still referenced; `doctor` of Skill Foundry reports them as dropped by the current harness. | Remove them from the template defaults, or from the Skill Foundry warning if they are still supported. TAIMO to decide which is true. |
| AH-A4 | (missing) `.harness/MANIFEST.json` | This copy has no manifest, so the Skill Foundry `doctor` cannot tell which harness version it is looking at. | Phase C was dropped (L24); the Agentic-Harness project updates this copy when TAIMO orders. |
| AH-A5 | `tests/helpers/harness-project.mjs` `installHarness()` (our simulation, not the real installer) | We could not read `install.mjs`, so the "harness install or update on top of Skill Foundry" tests simulate it from the documented contract (own files written, project-owned files kept, `settings.json` permissions merged, `AGENTS.md` marker appended once). Real behaviour is unproven. | Vendor the real snapshots, and replace the simulation with the real `install.mjs` run in a temp folder (offline). |

Nothing was found where Skill Foundry has to change: in every scenario run here the ownership line held (see the ownership tests).
