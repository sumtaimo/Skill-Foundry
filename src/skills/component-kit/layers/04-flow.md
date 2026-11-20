# Layer 04: Flow

## SPEC step

1. Run `status` (layer 02, step 1). Pick the components (layer 03, step 2).
2. For each component, search `design/tokens.css` for the variables of references "Variables to look for": the component's own prefix first (`--button-`), then the semantic names.
3. Write `design/components/<name>.md` with the template in references "Spec template": ten sections, in order, one component per file.
4. In "States" write all eight `###` subheadings with the variables that change in each. Loading says the dimensions are locked. Error says how the user retries.
5. In "Variables used" list each variable by its exact name in backticks. When a component needs a variable that does not exist, use the nearest semantic one and list the wanted name under "Variables to add" as `- --tabs-indicator-bg: nearest --color-border-focus (why)`; write "None." when nothing is missing.
6. In "Keyboard and ARIA" use the contract of references "Keyboard and ARIA contracts". In "Khmer text" name `--line-height-khmer`.
7. Run the checker as in layer 07, step 1. Fix every problem it lists, then run it again, up to three times. After three failures, report the remaining problems and stop.
8. Update `design/STATUS.md` (layer 09) and reply (layer 08).

## CODE step

1. Run `status`. Every named component must have a spec that passes; otherwise layer 06, step 2.
2. Read each spec fully. The spec is the contract: its variables, states, ARIA and Khmer note are all built.
3. Write the component in the stack of layer 03, step 3, one file or folder per component, with the patterns of references "Code per stack". Use native elements first.
4. Every colour, size, radius, shadow, duration and font comes from `var(--name)` with a name in the spec. Use only variables the spec lists under "Variables used". Where the spec lists a missing variable under "Variables to add", use the nearest variable the spec names. When the code needs one more variable that exists in `tokens.css`, add it to the spec's "Variables used" first, then run the spec check again, so the spec stays the contract.
5. Build every state: the focus-visible ring, locked loading size, error with retry, disabled, and a `prefers-reduced-motion` rule when it moves. Add a `:lang(km)` rule for any `line-height` you set.
6. Add one small demo only when the user asks for it. It links `design/tokens.css` and shows each component in each state, so the code can be seen.
7. Run the checker (layer 07, step 2). Fix every problem and run again, up to three times.
8. Update `design/STATUS.md` (layer 09) and reply (layer 08).
