# Layer 04: Flow

1. Make the input available to the script, then run the script as ONE plain command with the path of the script (R-a11y-audit-17): `node`, the full path of the script (the folder that holds this SKILL.md plus `engine/audit.mjs`), then the flags. No `cd` before it, no shell variable (`VAR=...`), no pipe, no `;`, no `&&`, no `2>&1`, no `$(...)`: sandboxes refuse chained commands, and the agent then falls back to hand work. Never write into this skill folder.
   - The input is a file in the project: pass its full path with `--file`.
   - The input is pasted in the message: write it to a file in a temporary folder with your file-writing tool, then pass the full path of that file with `--file`.
   - You have no file-writing tool: send the input on standard input with a quoted here-document in the same command (this is the only extra shape allowed, and the command stays one command).

   ```
   node <skill folder>/engine/audit.mjs --file <full path of the input>
   node <skill folder>/engine/audit.mjs - <<'EOF'
   ...the input...
   EOF
   ```

   If the command is refused or fails for a reason other than bad input, run the same single command once more with only the path fixed. Never chain it, and never wrap it in a script. When it still cannot run, follow layer 06, step 11.

2. Read the whole output. It starts with the input type, the number of elements and components, whether it is a full page and how many checks ran, then two header lines to copy into the reply (step 2a). Each finding has a number, a rule id, the criterion, its status, the element with its line, who is affected, the problem, the fix and sometimes a note. It ends with the manual tests.
2a. The two header lines under "reply header" go into the reply word for word (layer 08): the counts line and the fixed sentence about the checks skipped by rule. Never shorten or reword the second line, and keep it also when the count is 0.
3. Keep every finding in the order the script prints. Do not merge two findings, drop one or add one.
4. For each finding, copy the element from the script, then check it appears in the input (search for it). A finding whose element is not found is a script error: say so under "Open questions" instead of reporting it.
5. Write each fix as diff lines (`-` old, `+` new) on that element. Replace the placeholders the script leaves, such as `Short description of what the image shows`, `Name of the action` or `<topic>`, with words taken from the input (a nearby heading, the id, the icon name, the text around). When the input does not say what a placeholder should be, keep the script's placeholder and add an open question.
6. Keep every visible word of the input. The fix changes attributes, tags and structure; an accessible name that must differ from the visible text begins with the visible text.
7. Prefer the native element: where the script suggests a button, a label, a legend, a main or a th, use it, and drop the ARIA it replaces.
8. In JSX keep the JSX spelling (`htmlFor`, `tabIndex`, `className`) and keep handlers and props exactly as written. `lang` is spelled `lang` in JSX too.
8a. A `lang-parts` finding (SC 3.1.2) is fixed by `lang` on the element that holds only the foreign text, or by a `span` with `lang` around the foreign words when the element also holds text in the page language. Keep every word; use the language code of the text as the script suggests, and when you are not sure it is the right language, keep the script's code and add an open question.
9. Copy the manual tests of the script into "Needs a manual test". Add nothing the script did not print, except the page-level note of layer 06, step 7.
10. Hand the findings, the manual tests and the counts to layer 05.
