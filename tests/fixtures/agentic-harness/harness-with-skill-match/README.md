# Snapshot of the Agentic Harness, do not edit by hand

- Source repository: https://github.com/sumtaimo/Agentic-Harness, branch `lab` (package 1.0.16), taken 2026-11-17, read-only (rule L23).
- Capability: exports SKILL_COMPOSITION = 'additive-union' and SKILL_MATCH = 'keywords-with-explicit' in .harness/lib/governance.mjs; the default install runs `add --default`; the session start runs `check --json`.
- No commit hash is recorded (the harness history was rewritten). Detect capabilities by flag, never by name, version or hash.
- Contents: .harness/ without runtime folders, .claude/ and AGENTS.md as the installer leaves them.
- Used by: tests/factory-foundry-gate.test.mjs and tests/factory-foundry-ownership.test.mjs through tests/helpers/harness-project.mjs.
- To refresh: take a new snapshot and replace this whole folder; never patch files in it.
