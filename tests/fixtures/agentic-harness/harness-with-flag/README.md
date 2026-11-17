# Snapshot of the Agentic Harness, do not edit by hand

- Source repository: https://github.com/sumtaimo/Agentic-Harness
- Branch: lab
- Commit: the harness lab commit that first exported the flag (package version 1.0.16; hashes changed when the harness history was rewritten, so detect the capability by the flag, never by this name)
- Taken: 2026-11-17, read-only, by the Skill Foundry orchestrator session (rule L23: Skill Foundry never edits the harness).
- Contents: .harness/ without runtime folders (inbox, completed, failed, staging, releases, worktrees, visible, memory/sessions), .claude/ and AGENTS.md as the installer leaves them.
- Capability: exports `SKILL_COMPOSITION = 'additive-union'` in .harness/lib/governance.mjs (the older snapshots do not).
- Used by: tests/factory-foundry-gate.test.mjs and tests/factory-foundry-ownership.test.mjs through tests/helpers/harness-project.mjs.
- To refresh: take a new snapshot from the harness repository and replace this whole folder; never patch files in it.
