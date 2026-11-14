# Lessons the user taught

Rules here are injected into every harness worker prompt and should be read by any
editor AI before it starts work. Add with:  node .harness/memory.mjs remember "..."
Remove with:  node .harness/memory.mjs forget L3
- [L1] (2026-11-14) When the user asks for explanations, talk to them in Khmer; keep code, file names and technical terms in English.
- [L2] (2026-11-14) Every new skill MUST follow the skill-smith procedure: template copy, RULES.json, examples, evals, cover, lint, review checklist in docs/skills/<name>/, pack, registry entry and a test.
- [L3] (2026-11-14) Project purpose: Skill Foundry is a growing library of reusable, tested AI agent skills; plan future work from docs/factory/ROADMAP.md.
- [L4] (2026-11-14) A skill is done only when a fresh real agent, given only the skill folder, passes its live evals (node src/factory/live-evals.mjs <name>) and routing evals; hand-written answers never count as proof.
- [L5] (2026-11-14) When a real agent fails a skill eval, fix the skill, not the eval case, and re-record with a new agent.
