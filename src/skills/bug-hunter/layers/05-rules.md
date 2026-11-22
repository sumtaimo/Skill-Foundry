# Layer 05: Rules

1. Apply every rule in `RULES.json` (R-bug-hunter-1 to R-bug-hunter-15).
2. Confirmed needs the test output, quoted; code reading alone gives a suspect (R-bug-hunter-1).
3. Every finding has `file:line`, an input and an expected result with its source; nothing is invented (R-bug-hunter-2).
4. Every finding has Red then Green (R-bug-hunter-3).
5. Only the test command runs and nothing is written (R-bug-hunter-4 and R-bug-hunter-5); a worker task with files to write follows its own task (R-bug-hunter-15).
6. Style is never a finding (R-bug-hunter-6). Boundaries keep their fixed sentences (R-bug-hunter-7 to R-bug-hunter-10).
7. The task's required format replaces layer 08 (R-bug-hunter-14).

Hands to layer 06: any request or situation the rules do not cover.
