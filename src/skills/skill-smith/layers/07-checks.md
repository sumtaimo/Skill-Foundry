# Layer 07: Checks

1. Run `node src/factory/lint-skills.mjs <name>` and fix every problem.
2. Run `npm test`.
3. Run live evals: give each case prompt to a fresh agent that has only the skill folder, save each answer to `evals/live/<case-id>.json`, and run `node src/factory/live-evals.mjs <name>`; fix the skill, not the case, until 0 failed. Re-run `node src/factory/routing-evals.mjs` after any description change.
4. For a skill that produces files, record a real run for each eval case: `node src/factory/run-skill.mjs <name> --case <id>`. Each must end with status `pass`.
5. Open the recorded output and compare it with the quality bar in layer 08 of the new skill. If it falls short, strengthen the skill's rules and run again.
6. Complete `docs/factory/REVIEW.md` and record the result.
