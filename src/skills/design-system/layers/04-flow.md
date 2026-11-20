# Layer 04: Flow

1. Write down the inputs from layer 03: each hex with its role, the archetype and the one-line reason for it, the font, the product name, the output folder, the existing files.
2. Run the engine with `--out` set to the output folder (layer 03, step 6). Never write into this skill folder; the engine refuses to. Run it as ONE plain command (R-design-system-19): `node`, the full path of the script (the folder that holds this SKILL.md plus `engine/tokens.mjs`), then the flags. No `cd` before it, no shell variable (`VAR=...`), no pipe, no `;`, no `&&`, no `2>&1`, no `$(...)`: sandboxes refuse chained commands, and the agent then falls back to hand work. Give `--out` and every `--existing` file as full paths so no `cd` is needed.

   ```
   node <skill folder>/engine/tokens.mjs --out <output folder> --primary "#0f766e" --archetype precise-fintech --name "Invoicing app" --why "An invoicing product calls for precise, trustworthy numbers."
   ```

   Add `--accent`, `--neutral`, `--success`, `--warning`, `--danger` or `--info` with a hex for each colour the user gave that role. Add `--font "<name>"` when the user named a font. Add `--modern` (no value) when layer 03, step 4a, found the modern ask; never add it otherwise. On path b, leave out `--primary`: the archetype's default colour is used and the report marks it "archetype default". On path c, add `--existing <file>` once per existing file; `--primary` is then the existing brand colour unless the user gave a new one. Add `--open "<question>"` once per open question of your own (for example a third hex with no role). The engine adds the questions it can see itself and the report already says that font files are not added, so never repeat those; and write an open question in plain words, never with the strings layer 07 searches for (an import rule, a font-face rule, a link, a url).
   If the command is refused or fails for a reason other than bad input, run the same single command once more with only the path fixed. Never chain it, and never wrap it in a script.
2a. Path c (R-design-system-20 and R-design-system-21). The engine does this itself; read its report and do not redo it by hand. A family (see references/README.md, "Existing systems") is present only when at least 3 of the user's tokens match it. With 1 or 2 matches it is partly present: its missing tokens go to the gap files by name, and a name the user already has is never written, in the light root, the dark blocks, the reduced-motion block or the density blocks. The neutral scale keeps the project's own greys (colour tokens of low chroma, found by their value, not their name) at their value and interpolates the missing steps; the report names each grey and its step, or says why the default scale was used.
2b. Path d, a new foundation (R-design-system-23). Save design/BRIEF.md (layer 03, step 7a), then run ONE plain command with full paths, with the project's folder as `--dir`:

   ```
   node <skill folder>/engine/variables.mjs init --dir <project>/design --brief <project>/design/BRIEF.md --name "<product>" --why "<one line: why this archetype>"
   ```

   Add `--primary`, `--archetype`, `--font` or `--modern` only to override the brief (layer 03, steps 3, 4 and 4a). The engine refuses when design/variables.json exists; never pass `--force` without a yes. It writes variables.json, tokens.css, design-tokens.json, CHANGES.md, STATUS.md and the report; never write or edit these by hand. It adds the component tier (button, input, card), the Khmer line height and `:lang(km)` itself. Then stop (R-design-system-27): the reply is the report, and STATUS.md names the next step.
2c. Path d, a change, a check or a question (R-design-system-24, R-design-system-25). One plain command each, with `--dir <project>/design`:

   ```
   node <skill folder>/engine/variables.mjs set color/border/default "#c9d3d2" --dir <project>/design
   node <skill folder>/engine/variables.mjs check --dir <project>/design --code <project>/src
   node <skill folder>/engine/variables.mjs explain color/brand --dir <project>/design --code <project>/src
   ```

   A variable is named by its key (`color/border/default`) or its CSS name (`--color-border-default`). A colour role changes in light mode only unless `--mode dark` or `--mode both` is given: say so in the reply when the printout says it. `color/brand` (also `color/accent`, `color/success`, `color/warning`, `color/danger`, `color/info`) rebuilds that colour's whole scale and the text on its fill. Add `--dry-run` when the user asks what would change. When `set` prints REFUSED, nothing was written: give the printout as the reply, with its nearest passing value, and never retry with another value or edit a file by hand. `check` reports and never edits code. Never type a colour or size into a project file when a variable holds it.
3. The engine writes the files of layer 08, prints the report, and ends with a line that says how to reply. Do not run it a second time just to try it; every run writes files. It exits 1 when a text pair is below its minimum and 2 on bad input; read its message, fix the input, and run it again. Never edit the files it wrote.
4. When the engine cannot run (no Node.js, or running commands is not allowed, even after the retry of step 2): build the same token set by hand from references/README.md: lightness targets, role choices, scales, formulas. Write every ratio you compute, and add the open question "The engine could not run (<say plainly why>), so the tokens were built by hand; run the engine to confirm the numbers." Put the same sentence as the first line right after the report heading as well, so the reader sees it before the numbers. Say plainly in it what was refused or missing (for example "the command was refused by the sandbox" or "Node.js is not installed"); never hide that the numbers are not the engine's.
5. Read the printed report: every row says pass, the given hex appears at its step, and the archetype is the one you chose.
6. Hand the files and the report to layer 05.
