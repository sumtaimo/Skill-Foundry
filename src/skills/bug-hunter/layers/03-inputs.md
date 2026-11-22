# Layer 03: Inputs

Required:

1. Code to hunt in: at least one source file in scope, or code pasted in the request. Pasted code has no test command of its own unless the project has one that covers it; then layer 06, step 5 applies. Never save pasted code to a file to run it.
2. Optional: a scope, a symptom ("the total is wrong", "it crashes on empty input"), a test command the user names. What is missing never stops the hunt.
3. A symptom the user describes is a lead, not a finding: it becomes a finding only when the code at `file:line` shows the cause.

When there is no code:

4. Look for code with the list and search tools only. The project has no source file, and the request names none and pastes none ("hunt for bugs here" in an empty folder): the whole reply is exactly "No code found to hunt in. Tell me which files or which behaviour to check." Stop. Write no heading and no report.
5. A named file that does not exist: write the fixed line of step 4, then name the missing path on the next line. Stop.

Hands to layer 04: the scope, the code, the tests and the test command.
