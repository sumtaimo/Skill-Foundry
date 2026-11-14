# Layer 06: States and edge cases

1. The intent overlaps an existing skill: stop and propose extending that skill.
2. The user cannot name the output: go back to layer 01; do not write layers yet.
3. SKILL.md grows past 150 lines: move the detail into the layer files and `references/`.
4. A rule no machine can check: give it a `checklist` line a reviewer can answer yes or no.
5. The skill needs a tool the user's project may not have (a browser, a CLI): write the step as "when available", and say what to report when it is not.
6. The recorded run fails: fix the skill, then run again. Never edit the recorded output.
