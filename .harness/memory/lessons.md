# Lessons the user taught

Rules here are injected into every harness worker prompt and should be read by any
editor AI before it starts work. Add with:  node .harness/memory.mjs remember "..."
Remove with:  node .harness/memory.mjs forget L3
- [L1] (2026-11-14) When the user asks for explanations, talk to them in Khmer; keep code, file names and technical terms in English.
- [L2] (2026-11-14) Every new skill MUST follow the skill-smith procedure: template copy, RULES.json, examples, evals, cover, lint, review checklist in docs/skills/<name>/, pack, registry entry and a test.
- [L3] (2026-11-14) Project purpose: Skill Foundry is a growing library of reusable, tested AI agent skills; plan future work from docs/factory/ROADMAP.md.
