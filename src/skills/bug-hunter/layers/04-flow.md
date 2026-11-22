# Layer 04: Flow

Run the tests:

1. Run the test command once (twice only after adding Red tests to an assigned file, layer 06, step 14), from the project folder, exactly as found in layer 02 (`npm test` or `node --test`). Never add other commands to it (no pipes, no `cd`, no `&&`).
2. Count the passed and failed tests from its output. When it cannot run (permission denied, the tool is missing, it never finishes), it did not run: go to layer 06, step 5.
3. For each failing test, copy the failing line of the output word for word (the assertion message with the actual and expected values, or the error and its first stack line in the project).

Read the code:

4. For each failing test, find the code it calls and the line that gives the wrong value or throws. That line is the cause. A failing test with a cause in scope is a confirmed finding.
5. Read every function in scope for bugs the tests do not show (references, part 1): a wrong result, a throw or crash, lost or corrupted data, or a broken rule a test, the request or a project comment states.
6. A suspect needs all four: the `file:line`; a concrete input of the kind the project already uses (the types and shapes its tests, callers, doc comments or the request show); the wrong result it gives, worked out from the code; and an expected result a source states. Without all four it is no finding: leave it out.
   An input of another kind (`NaN`, `null`, `undefined`, a number where text is used) is a finding only when a caller in the project passes it or a source mentions it. Never ask the project to decide an expected value; then it is no finding.
7. Never run any other code to check a suspect (R-bug-hunter-4). It stays a suspect; its Red test is how it gets confirmed.
8. List at most 10 findings: confirmed first, then suspect, each in order of harm (data loss and crashes first).

Write each finding:

9. Name the expected result and its source (never a value you chose): the failing test (`file:line`), the request, or the project comment or doc (`file:line`). When the only source is the function's own name and plain code, write "source: the name and code of <function>".
10. Red: a confirmed bug whose test already fails gets "the failing test <name> in `<file>`". Any other finding gets a new test to add first: the test file, the call with its input, and the expected value; it must fail before the fix.
11. Green: the smallest change at the cited line that makes Red pass, in one sentence; then run the test command and see every test pass. Never rewrite more than the bug needs.
12. When a failing test and the code disagree and no source says which is right, write the finding as confirmed with "Expected: unclear: which is right, the test at `<file:line>` or the code?" and make Red "decide which is right first".

Hands to layer 05: the draft report.
