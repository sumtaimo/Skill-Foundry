# Snapshot of the Agentic Harness, do not edit by hand

- Source repository: https://github.com/sumtaimo/Agentic-Harness
- Branch: lab
- Version: package 1.0.15 (commit hashes are not recorded: the harness history was rewritten, so detect capabilities by flag, never by name or hash)
- Taken: 2026-11-16, read-only, by the Skill Foundry orchestrator session (rule L23: Skill Foundry never edits the harness).
- Contents: .harness/ without runtime folders (inbox, completed, failed, staging, releases, worktrees, visible, memory/sessions), .claude/ and AGENTS.md as the installer leaves them.
- Used by: tests/factory-foundry-gate.test.mjs and tests/factory-foundry-ownership.test.mjs through tests/helpers/harness-project.mjs.
- To refresh: take a new snapshot from the harness repository and replace this whole folder; never patch files in it.
