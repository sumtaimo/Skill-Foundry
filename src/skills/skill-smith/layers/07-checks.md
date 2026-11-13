# Layer 07: Checks

1. Run `node src/factory/lint-skills.mjs <name>` and fix every problem.
2. Run `npm test`.
3. Record a real run for each eval case: `node src/factory/run-skill.mjs <name> --case <id>`. Each must end with status `pass`.
4. Open the recorded output and compare it with the quality bar in layer 08 of the new skill. If it falls short, strengthen the skill's rules and run again.
5. Complete `docs/factory/REVIEW.md` and record the result.
