# Layer 07: Checks

Machine checks first. Run each as ONE plain command with the path of the script: no `cd`, no shell variable, no pipe, no `;` or `&&`. Run it from the project root. When your shell cannot be in the project root, add one flag, `--dir <path of the design folder>`, and give the files by absolute path; nothing else is added to the command.

1. After a SPEC turn: `node <skill folder>/engine/spec-check.mjs spec button input card` (the names of the specs you wrote). It prints PASS or FAIL for each file, then one result line: `SPEC CHECK PASSED (n specs, 0 problems)` or `SPEC CHECK FAILED (n specs, k problems)`. It checks the ten sections, the eight states (loading says locked, error says retry), every variable against `design/tokens.css`, no raw colour and no raw px in "Variables used", no palette step, the component's own prefix used when `tokens.css` has one, `--line-height-khmer` in the Khmer note, and "Variables to add" lines that name a new variable and an existing nearest one.
2. After a CODE turn: `node <skill folder>/engine/spec-check.mjs code <the component folder or files>`. It prints one result line `CODE CHECK PASSED (n files, v variables, 0 problems)` or `CODE CHECK FAILED`. It checks every `var(--name)` exists in `tokens.css`, no raw colour or colour function, no raw px size above 2 px in radius, padding, margin, gap, font size or height, no palette step, `:focus-visible` when there is a hover or active rule, `prefers-reduced-motion` when there is motion, and a Khmer line-height when `line-height` is set.
3. When the checker cannot run, say so on the first line of "Check" and do the search by hand: every `--name` in your files, searched in `design/tokens.css`. Say "not run by the checker" for each file. Never write PASSED yourself.
4. Fix every line the checker lists, then run it again. Three tries at most (layer 04).

Reviewer checklist (a person or a second agent answers each yes or no; any "no" blocks the reply):

- [ ] Each spec has all ten sections and the eight states; the Variables used names the component's own variables where they exist.
- [ ] Each variable name was found in `tokens.css`, not remembered.
- [ ] "Variables to add" in the spec and in STATUS.md match.
- [ ] The keyboard and ARIA contract matches the component (references).
- [ ] The Khmer note names `--line-height-khmer` and the code has a `:lang(km)` rule where it sets a line height.
- [ ] Code was built from the spec, in the project's stack, with native elements first.
- [ ] No `variables.json`, `tokens.css` or other skill's file was edited; STATUS.md names the next step.
