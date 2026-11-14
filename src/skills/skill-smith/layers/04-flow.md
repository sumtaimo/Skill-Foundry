# Layer 04: Flow

1. Copy `src/skills/_template/` to `src/skills/<name>/` and set `name` and `version: 0.1.0` in the frontmatter.
2. Write the description: the task, the triggers, the exclusions (STANDARD.md section 3).
3. Write `layers/01-intent.md` so the skill starts from the goal its user states and asks when the goal is missing.
4. Write layers 02 to 10 in order. Each layer is numbered imperative steps, one action per step, and ends with what it hands to the next layer.
5. Add layers 11 and later only when the work has more steps than the ten core layers hold.
6. For an analysis skill (BA, system analysis, QA), write the layers as numbered clauses with defined terms, so each clause can be cited.
7. For an output skill (UI, figures), put the quality bar in layer 08 and put the detail rules in the skill's own rules, lint or references, so quality never depends on the agent adding it afterwards.
8. Write each rule in `RULES.json` with id `R-<name>-<n>` and map it to a `check` id or a `checklist` line.
9. Write `examples/README.md` and `evals/cases.json` from the realistic requests.
10. Write `preview.json` and `preview/cover.svg` (token colours only, no scripts, no external links). When you report on the cover, describe these checks in words and never quote the forbidden tags.
11. Keep every path inside the skill folder, so the skill works after it is installed elsewhere.
