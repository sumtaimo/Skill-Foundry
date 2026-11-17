# Snapshot of the Agentic Harness, do not edit by hand

- Source repository: https://github.com/sumtaimo/Agentic-Harness, branch `release` (package 1.0.16), taken 2026-11-17, read-only (rule L23).
- Capability: exports neither SKILL_COMPOSITION nor SKILL_MATCH. It is what users get from `npx …#release` until the harness lab is released.
- No commit hash is recorded (the harness history was rewritten). Detect capabilities by flag, never by name, version or hash.
- Used by: tests/factory-foundry-gate.test.mjs and tests/factory-foundry-ownership.test.mjs through tests/helpers/harness-project.mjs.
- To refresh: take a new snapshot and replace this whole folder; never patch files in it.
