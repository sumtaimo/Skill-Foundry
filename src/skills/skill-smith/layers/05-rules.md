# Layer 05: Rules

1. Apply every rule in `RULES.json` of this skill (R-skill-smith-1 to R-skill-smith-13).
2. The new skill MUST have the ten core layers, each with numbered steps, each linked from its SKILL.md (`chk-layers`).
3. The new skill MUST be self-contained: no `src/`, `docs/` or `tests/` paths in its SKILL.md, layers or references (`chk-portable`).
4. Quality and detail MUST come from the new skill's own rules, lint and references, NEVER from hand edits to its output.
5. The showcase MUST show only a recorded real run; NEVER a mock.
6. A skill is done only when a fresh agent passes its live evals; a hand-written answer NEVER counts as proof.
7. Change one skill per session, never a skill listed in `src/factory/locks.json`, and run `npm run guard` before every commit.
