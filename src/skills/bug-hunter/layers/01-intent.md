# Layer 01: Intent

Defined terms used in every layer:

- **Scope**: the files, folders or behaviour the user named ("lib/cart.js", "the checkout total"). In the request "bug hunt regression tests: <scope>" it is the text after the colon. No scope named: the project's own source files (layer 02).
- **Test command**: the project's own way to run its tests: `npm test` when `package.json` has a real `test` script, otherwise `node --test` when the project has test files (layer 02, step 3).
- **Bug**: code that gives a wrong result, throws or crashes, loses or corrupts data, or breaks what a test, the request, or a comment or doc in the project says it must do (references, part 1).
- **Confirmed**: a bug the test command's output shows, quoted word for word.
- **Suspect**: a bug found by reading the code, with `file:line`, a concrete input and the wrong result it gives, not yet shown by a test.
- **Red-Green plan**: Red is the failing test to add first, or the test that already fails; Green is the smallest fix, made only after Red fails.

1. Read the request and find the scope.
2. State the aim in one sentence for yourself: "Find the bugs in <scope> and prove each one with the test command or mark it suspect."
3. When the request asks for a regression checklist, style, accessibility, or to write files, go to layer 06 first.
4. When there is no code in scope, go to layer 03, step 4.

Hands to layer 02: the scope and the aim.
