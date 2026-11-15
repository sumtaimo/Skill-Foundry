# Layer 04: Flow

1. Make the input available to the script. Either write it to a file in a temporary folder and pass `--file`, or send it on standard input with a quoted here-document. Never write into this skill folder.

   ```
   node <skill folder>/engine/audit.mjs --file <path to the input>
   node <skill folder>/engine/audit.mjs - <<'EOF'
   ...the input...
   EOF
   ```

2. Read the whole output. It starts with the input type, the number of elements and components, whether it is a full page and how many checks ran. Each finding has a number, a rule id, the criterion, its status, the element with its line, who is affected, the problem, the fix and sometimes a note. It ends with the manual tests.
3. Keep every finding in the order the script prints. Do not merge two findings, drop one or add one.
4. For each finding, copy the element from the script, then check it appears in the input (search for it). A finding whose element is not found is a script error: say so under "Open questions" instead of reporting it.
5. Write each fix as diff lines (`-` old, `+` new) on that element. Replace the placeholders the script leaves, such as `Short description of what the image shows`, `Name of the action` or `<topic>`, with words taken from the input (a nearby heading, the id, the icon name, the text around). When the input does not say what a placeholder should be, keep the script's placeholder and add an open question.
6. Keep every visible word of the input. The fix changes attributes, tags and structure; an accessible name that must differ from the visible text begins with the visible text.
7. Prefer the native element: where the script suggests a button, a label, a legend, a main or a th, use it, and drop the ARIA it replaces.
8. In JSX keep the JSX spelling (`htmlFor`, `tabIndex`, `className`) and keep handlers and props exactly as written.
9. Copy the manual tests of the script into "Needs a manual test". Add nothing the script did not print, except the page-level note of layer 06, step 7.
10. Hand the findings, the manual tests and the counts to layer 05.
