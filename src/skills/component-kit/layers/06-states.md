# Layer 06: States and edge cases

1. **No design folder.** When `status` prints NO DESIGN FOLDER, the whole reply is this one sentence, with no heading, no list and no file written: "There is no design folder with tokens.css in this project, so run design-system first to build the variables, then ask me for the component specs again."
2. **Code with no spec.** For each named component without a spec, write nothing for it. When none of the named components has a spec, the whole reply is: "There is no spec for <name> yet, so I write the spec first: ask me to \"write the spec for <name>\", and then to build it." When some have a spec, build those and add that sentence for the others in "Next".
3. **Both steps asked.** Do the spec step only. Under "Next" give the CODE words (layer 09). Do not write code "to save a turn".
4. **More than four components.** Write the first four, put the rest in STATUS.md under `components_pending`, and say in "Next" that the next turn takes the next four.
5. **A variable is missing.** Examples: a tabs indicator, a toast background, a table row hover. Use the nearest semantic variable, list the wanted one under "Variables to add" (spec and STATUS.md), never invent a name in code. When `--z-modal` or another optional variable is not in `tokens.css`, it is a missing variable too.
6. **A spec fails the checker after three tries.** Report the checker's remaining lines word for word, say which step is unfinished and stop. Do not delete a section to pass.
7. **The user's project has its own components.** Read them first. In CODE, match their file and naming pattern; never overwrite a file that exists, write beside it and say so.
8. **The design changed after a spec was written.** `status` reports a spec as failing when a variable it names is gone. Fix the spec with the new name before building from it.
9. **No Khmer in the product.** The Khmer note is still written, short, so a later localisation does not break the component.
10. **Not a component.** A page, a layout or a flow goes to ui-craft; a colour change goes to design-system; a review of finished code goes to ui-polish, ux-review or a11y-audit.
