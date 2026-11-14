# Layer 07: Checks

1. Run `node src/factory/lint-skills.mjs <name>` and fix every problem.
2. Run `npm test`.
3. Run live evals: give each case prompt to a fresh agent that has only the skill folder, save each answer to `evals/live/<case-id>.json`, and run `node src/factory/live-evals.mjs <name>`; fix the skill, not the case, until 0 failed. Re-run `node src/factory/routing-evals.mjs` after any description change.
4. For a skill that produces files, record a real run for each eval case: `node src/factory/run-skill.mjs <name> --case <id>`. Each must end with status `pass`.
5. Run the portable check: `node src/factory/portable-check.mjs <name> --prompt "<a realistic request>" --record`. It installs the skill into an empty project outside this repository and has a real agent use it. Read the recorded answer yourself: the skill must have been used, no rule of this repository may appear in the answer, and the result must be what a stranger needs. Fix the skill and record again until it is right. Skills with `scope: factory` are exempt.
6. Open the recorded output and compare it with the quality bar in layer 08 of the new skill. If it falls short, strengthen the skill's rules and run again.
7. Complete `docs/factory/REVIEW.md` and record the result.
