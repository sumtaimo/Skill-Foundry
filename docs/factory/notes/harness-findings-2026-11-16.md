# Findings about the Agentic Harness (for TAIMO to take to the Agentic-Harness project)

Written by the platform A2 session, 2026-11-16. Rule L23: Skill Foundry never edits the harness; these are reports only.

**Evidence (updated by the orchestrator session, 2026-11-16).** The A2 session could not read the `sumtaimo/Agentic-Harness` repository
(`add_repo` was denied for it), so its first version of this list came from this repository's own old `.harness/` copy. The orchestrator
then read the public repository read-only (rule L23: reading is allowed, editing is not) and vendored two snapshots as test fixtures:
`tests/fixtures/agentic-harness/release-v1.0.6-15bd31e/` and `lab-v1.0.15-0f39c98/` (`lab` had already moved past the `bf8b43c` named in the
briefs). The gate and ownership tests now run against both. The table below is re-checked against them; corrections are marked.

| # | File and line (this repository's copy) | What happens | Proposed fix (in the Agentic-Harness project) |
|---|---|---|---|
| AH-A1 | `.harness/team.json:49` and `:68` (`lead-dev`, `lead-qa` list `"skills": ["code-craft"]`); `.harness/lib/governance.mjs:230-241` (`matchSkills`: an explicit `skills` list wins, `autoApply` is not used) | Skill Foundry pointers use `autoApply: true`. A team member that lists `skills` never gets them, so in `--hierarchy` / `/harness:run` the leads work without any installed Skill Foundry skill. Found by `doctor` on a default harness. | Ship `team.json` leads without a `skills` list, or make `matchSkills` add `autoApply` skills to an explicit list. |
| AH-A2 | `.harness/roles/qa-auditor.json:5` and `.harness/roles/ba-analyst.json:5` (`allowedTools` has no `Bash(node:*)`) | Roles `QA_AUDITOR` and `BA_ANALYST` cannot run `node`, so skills with an `engine/` folder (a11y-audit, ui-polish for QA; design-system, figure-craft for BA) cannot run their scripts there. `doctor` warns for each pair. | Add `Bash(node:*)` (or the narrower script paths) to those roles, or document that engine skills belong to `DEV_ENGINEER`. Known since the first handoff. |
| AH-A3 (corrected) | `.harness/team.json:19`, `:34`; `.harness/config.json:10`, `:129`, `:147` | `gemini` and `orca` engines are still referenced; `doctor` of Skill Foundry reports them as dropped by the current harness. | Remove them from the template defaults, or from the Skill Foundry warning if they are still supported. TAIMO to decide which is true. |
| AH-A4 (corrected) | (missing) `.harness/MANIFEST.json` | This copy has no manifest, so the Skill Foundry `doctor` cannot tell which harness version it is looking at. | Phase C was dropped (L24); the Agentic-Harness project updates this copy when TAIMO orders. |
| AH-A5 | `tests/helpers/harness-project.mjs` `installHarness()` (our simulation, not the real installer) | We could not read `install.mjs`, so the "harness install or update on top of Skill Foundry" tests simulate it from the documented contract (own files written, project-owned files kept, `settings.json` permissions merged, `AGENTS.md` marker appended once). Real behaviour is unproven. | Vendor the real snapshots, and replace the simulation with the real `install.mjs` run in a temp folder (offline). |

Already known in the handoff brief: AH-A1 is AH-1, AH-A2 is AH-3, AH-A3 and AH-A4 are in section 6 (stale `gemini`/`orca`, manifest). They are repeated here because this session saw them in a real run, with line numbers.

Nothing was found where Skill Foundry has to change: in every scenario run here the ownership line held (see the ownership tests).

## Re-check against the real versions (2026-11-16)

| Item | release `15bd31e` (v1.0.6) | lab `0f39c98` (v1.0.15) | Result |
|---|---|---|---|
| AH-A1 explicit `skills` on leads, `matchSkills` explicit branch | `team.json:47,67`; `governance.mjs:247` | `team.json:48,68,87`; `governance.mjs:249` | **Confirmed in both.** Real harness behaviour; Skill Foundry pointers use `autoApply`, so a lead with an explicit list does not get them. |
| AH-A2 roles without `Bash(node...)` | `qa-auditor`, `ba-analyst` have none; only `dev-engineer` has | same, and `ux-designer` has none | **Confirmed in both.** Skills with an `engine/` folder cannot run their script in those roles. |
| AH-A3 `gemini` / `orca` | `team.json` has none; `config.json` has 8 mentions | same | **Corrected.** The stale entries are in this repository's old copy; the real `team.json` is clean. The 8 mentions in `config.json` were not analysed (they may be the removed-profile list); check in the harness project. |
| AH-A4 missing `MANIFEST.json` | not in the repository tree | not in the repository tree | **Corrected.** The installer creates it at install time; this repository's copy simply predates it. Not a harness bug. |
| AH-A5 install simulated | `install.mjs` is not run by the tests; the install is simulated from its documented contract | same | **Still open.** Run the real installer in the joint test (`JOINT-TEST-PLAN.md`). |

Gate result: every scenario (Skill Foundry only; harness then Skill Foundry; Skill Foundry then harness) and the ownership line pass against both snapshots.
