---
name: component-kit
description: Turns the variables of a project's design folder (design/tokens.css from design-system) into component specs and then into component code. Step one writes design/components/<name>.md for 3 to 4 of button, input, select, checkbox, card, dialog, table, nav, tabs, toast, menu and badge (anatomy, variants, the eight lifecycle states, exact variable names, keyboard and ARIA contract, Khmer text note); step two builds the named components from their specs in the project's own stack (HTML/CSS, React, Tailwind, Vue) using only variables that exist. Use when asked for "component specs", "write the spec for the button", "build the button, input and card from our design variables" or "a component library from our tokens". Do not use to design a whole screen or page (use ui-craft), to build the variables or tokens (use design-system), or to polish, review or audit finished UI (use ui-polish, ux-review or a11y-audit).
version: 1.0.0
---

# component-kit

Turns design variables into components in two separate steps that hand off through files. The numbers and names
come from `design/tokens.css`; a checker in this folder proves every variable a spec or a piece of code names exists.
One step per turn: a spec turn ends with `design/STATUS.md` updated and the exact words to continue, and the code
turn only starts when the user says so.

## When to use

- Use when the project has a `design` folder from design-system and someone asks for component specs, or for components built from them.
- Use for button, input, select, checkbox, card, dialog, table, nav, tabs, toast, menu and badge (3 to 4 per turn).
- Use to build named components from their specs in the stack the project already uses.
- Do not use to design or build a screen, page or flow; that is ui-craft.
- Do not use to create or change variables or tokens; that is design-system (`set` changes a variable, and this skill only lists the ones it wants under "Variables to add").
- Do not use to polish, review or audit finished UI code (ui-polish, ux-review, a11y-audit).
- With no `design/tokens.css`, reply with the one sentence of layer 06, step 1, and write no file.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: pick the step (spec or code) and the components; never both in one turn. [layers/01-intent.md](layers/01-intent.md)
2. Context: find `design/`, the existing specs and the project's stack. [layers/02-context.md](layers/02-context.md)
3. Inputs: the component names, the step, the stack; what to do when one is missing. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: write the specs, or build the code, then run the checker. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST / NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: no design folder, no spec, too many components, missing variable. [layers/06-states.md](layers/06-states.md)
7. Checks: the checker command and the reviewer items. [layers/07-checks.md](layers/07-checks.md)
8. Output: the files, the reply and the quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: STATUS.md and the exact words to continue. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what to keep as proof. [layers/10-evidence.md](layers/10-evidence.md)

The spec template, the per-component anatomy, keyboard and ARIA contracts, the variable names to look for and the
code patterns per stack are in [references/README.md](references/README.md).
The checker is `engine/spec-check.mjs` in this folder (Node.js, no dependencies). Run it as in layer 07.

## Rules

- R-component-kit-1: Without `design/tokens.css` the reply MUST be the one fixed sentence of layer 06, step 1, and NEVER any file.
- R-component-kit-2: Each turn MUST do one step only, spec or code; it MUST end with `design/STATUS.md` updated and the exact words to continue, and NEVER do both steps in one turn.
- R-component-kit-3: A spec turn MUST cover 3 to 4 components of the set; when more are asked, only the first four in set order are written and the rest go to STATUS.md.
- R-component-kit-4: Every spec MUST have the ten sections of references/README.md and the eight states (default, hover, focus-visible, active, disabled, loading with locked dimensions, empty, error with retry).
- R-component-kit-5: A spec and the code MUST name variables by their exact CSS names from `design/tokens.css`, component variables first (`--button-primary-bg`, `--input-border`, `--card-radius`), else semantic variables; NEVER a raw value or a palette step such as `--color-neutral-200`.
- R-component-kit-6: When a component needs a variable that does not exist, use the nearest semantic variable and list the wanted one under "Variables to add" in the spec and in STATUS.md; NEVER edit `variables.json` or `tokens.css` and NEVER use the missing name in code.
- R-component-kit-7: The code step MUST start from an existing spec; with none, the reply is the fixed sentence of layer 06, step 2, and NEVER code.
- R-component-kit-8: Code MUST be written in the project's own stack, found from its files (plain HTML and CSS when there is none), and NEVER contain a raw hex, a colour function or a px size where a variable holds it.
- R-component-kit-9: The checker MUST be run as ONE plain command with the path of the script and its result line quoted in the reply; NEVER report "passed" unless it printed PASSED.
- R-component-kit-10: Code MUST follow the keyboard and ARIA contract of its spec, with native elements first.
- R-component-kit-11: Text-bearing components MUST handle Khmer: `--line-height-khmer` under `:lang(km)`, `letter-spacing: 0`, and no fixed heights that clip.
- R-component-kit-12: Code MUST implement every state of its spec: focus-visible ring, locked loading size, error with retry, and a `prefers-reduced-motion` rule when it moves.
- R-component-kit-13: The skill MUST NOT build a screen or page, and NEVER write outside the files of its step (`design/components/`, the component files, `design/STATUS.md`).
- R-component-kit-14: The skill MUST have the ten core layers, each linked from SKILL.md.
- R-component-kit-15: The skill MUST be self-contained; NEVER name a repository path in SKILL.md, layers or references.
- R-component-kit-16: SKILL.md MUST stay within 150 lines with frontmatter name, description and semver version.
- R-component-kit-17: Every relative link MUST point to a file inside the skill folder.

Each rule's check or reviewer item is in `RULES.json`.

## Checks

- Run `node <skill folder>/engine/spec-check.mjs status` first: it prints the fixed sentence and stops when there is no design folder.
- After a spec turn: `node <skill folder>/engine/spec-check.mjs spec <name> <name> <name>`; it exits 0 only on SPEC CHECK PASSED.
- After a code turn: `node <skill folder>/engine/spec-check.mjs code <folder or files>`; it exits 0 only on CODE CHECK PASSED.
- Answer the reviewer items in [references/README.md](references/README.md); any "no" blocks the reply.

## Review

A designer reads each spec against the component's purpose and the project's brief; a developer loads the built
components in a page, tabs through them, and switches light and dark and `lang="km"`.

## Output

Spec turn: `design/components/<name>.md` for 3 to 4 components and an updated `design/STATUS.md`.
Code turn: the component files in the project's stack and an updated `design/STATUS.md`.
The reply has the shape of [layers/08-output.md](layers/08-output.md): files, the checker's result quoted, variables to add, and the words to continue.
