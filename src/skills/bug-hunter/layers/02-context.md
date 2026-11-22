# Layer 02: Context

1. Use only read-only tools (read, search, list) and the test command, except to write Red tests into a test file the task assigns (layer 06, step 14). Never change source code (R-bug-hunter-5), and never read or list files with a shell command: the read tool shows the line numbers every `file:line` needs.
2. Read the task prompt for a required output format or an assigned test file before you write anything (layer 06, steps 13 and 14).
3. Find the test command: read `package.json`. A `test` script that is missing, empty or the npm placeholder (`echo "Error: no test specified" && exit 1`) is no test script. With a real one, the command is `npm test`. With none, and with test files (`*.test.js`, `*.test.mjs`, `test/` or `tests/` folders), the command is `node --test`. With neither, there is no test command (layer 06, step 5).
4. Find the code in scope: the named files, or with no scope the source files of the project (not `node_modules`, not build output). Read each one fully.
5. Find the tests that cover the scope and read them: what each test calls, with which input, and which value it expects.
6. Read the project's own statements about behaviour: comments and doc comments in the scope, a README section about it. They are sources for an expected result; nothing else is.
7. Never use what such code "usually" should do as the expected result when no source says it, except a plain wrong result anyone can see from the function's own name and code (references, part 1).

Hands to layer 03: the test command (or none), the code and the tests.
