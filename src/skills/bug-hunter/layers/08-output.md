# Layer 08: Output

The reply is one Markdown document with this shape. A fixed sentence from layer 06, when one applies, is the first line, before the heading.

````
## Bug hunt: <scope in a few words>

Scope: `<file>`, `<folder>` | pasted code
Test command: `npm test` | `node --test` | none found
Test run: <n> passed, <n> failed | did not run: <reason>
Result: <n> confirmed, <n> suspect

### Confirmed
1. `<file>:<line>` <what goes wrong, in one sentence>
   - Evidence: `<failing line of the test output, word for word>`
   - Expected: <value> (source: <test file:line | the request | comment at file:line>)
   - Red: the failing test "<name>" in `<test file>`. | Red: add a test in `<test file>`: <call with input> expects <value>; it fails now.
   - Green: <smallest change at file:line>; then run `<test command>` and see every test pass.

### Suspect
1. `<file>:<line>` <what goes wrong, in one sentence>
   - Reading: <input> gives <wrong result>, because <what the code at that line does>.
   - Expected: <value> (source: <...>)
   - Red: add a test in `<test file>`: <call with input> expects <value>. It must fail first; if it passes, drop this finding.
   - Green: <smallest change at file:line>, only after Red fails.

### Not in this hunt
- Code style, naming and formatting; UI style (ui-polish) and accessibility (a11y-audit).
- What to retest after a change: test-planner.
- Files outside the scope.

Evidence: `<test command>` (<n> passed, <n> failed) | the test command did not run. Files read: `<file>`, `<file>`.
````

Every finding starts with its place in backticks: `<file>:<line>` for a file, `pasted:<line>` for code pasted in the request (its first pasted line is line 1). An empty section is the single line "None.". With no finding, the line "No bug found in this scope; this does not prove there are none." comes right after the Result line.

Quality bar:

1. The header has its four lines; the Result counts match the findings.
2. Each finding starts with `file:line` (or `pasted:line`) in backticks and one plain sentence.
3. Each confirmed finding has Evidence, Expected, Red and Green, in that order; each suspect has Reading, Expected, Red and Green.
4. Red always comes before Green and names a test file and an expected value.
5. "Not in this hunt" always has its three bullets, plus a "Not found:" bullet for a symptom the code does not explain.
6. The last line names the test command result and the files read.
7. No style finding, no checklist of what to retest, no rewritten file and no full patch appears.
8. Nothing else is written: no paragraph about functions with no finding, no notes between the sections. A function checked and found fine is named only in "Files read".

Hands to layer 09: the reply.
