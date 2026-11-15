# Layer 04: Flow

1. Write down the inputs from layer 03: each hex with its role, the archetype and the one-line reason for it, the font, the product name, the output folder, the existing files.
2. Run the engine with `--out` set to the output folder (layer 03, step 6). Never write into this skill folder; the engine refuses to.

   ```
   node <skill folder>/engine/tokens.mjs --out <output folder> --primary "#0f766e" --archetype precise-fintech --name "Invoicing app" --why "An invoicing product calls for precise, trustworthy numbers."
   ```

   Add `--accent`, `--neutral`, `--success`, `--warning`, `--danger` or `--info` with a hex for each colour the user gave that role. Add `--font "<name>"` when the user named a font. On path b, leave out `--primary`: the archetype's default colour is used and the report marks it "archetype default". On path c, add `--existing <file>` once per existing file; `--primary` is then the existing brand colour unless the user gave a new one. Add `--open "<question>"` once per open question of your own (for example a third hex with no role). The engine adds the questions it can see itself.
3. The engine writes the files of layer 08, prints the report, and ends with a line that says how to reply. Do not run it a second time just to try it; every run writes files. It exits 1 when a text pair is below its minimum and 2 on bad input; read its message, fix the input, and run it again. Never edit the files it wrote.
4. When the engine cannot run (no Node.js, or running commands is not allowed): build the same token set by hand from references/README.md: lightness targets, role choices, scales, formulas. Write every ratio you compute, and add the open question "The tokens were built by hand; run the engine to confirm the numbers."
5. Read the printed report: every row says pass, the given hex appears at its step, and the archetype is the one you chose.
6. Hand the files and the report to layer 05.
