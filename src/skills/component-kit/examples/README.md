# Examples

Hand-written examples that follow the skill's own rules. They show the shape; they are not proof.
`sample-design/` is a real design folder written by design-system for a small invoicing app
(`BRIEF.md`, `tokens.css`, `STATUS.md`) plus two model specs, `components/button.md` and `components/card.md`.
`install-sample.mjs` copies it into `./design` so the skill can be tried without running design-system first
(`--no-specs` leaves the two specs out).

## Example 1: specs for three components

Input: "Write the component specs for button, input and card."

Command (from the project root, after the status check):

```
node <skill folder>/engine/spec-check.mjs spec button input card
```

Reply:

```
## Component specs: button, input, card

### Files
- design/components/button.md
- design/components/input.md
- design/components/card.md

### Check
PASS design/components/button.md (30 variables)
PASS design/components/input.md (27 variables)
PASS design/components/card.md (25 variables)
SPEC CHECK PASSED (3 specs, 0 problems)

### Variables to add
None.

### Next
Step done: component specs (button, input, card). Next: this skill writes the next specs, or builds the code for these.
Say "Write the specs for select, checkbox, dialog and table" or "Build button, input and card in <stack>".
Reply yes, change, or stop.
```

## Example 2: a missing variable

Tabs need an underline colour for the current tab. `tokens.css` has no `--tabs-indicator-bg`, so the spec uses the
nearest semantic variable in "Variables used" (`--color-border-focus`) and asks for the new one:

```
## Variables to add
- --tabs-indicator-bg: nearest --color-border-focus (underline of the current tab)
```

The checker requires two names on each such line: the new variable (which must not exist yet) and the nearest
existing one. The code step uses `--color-border-focus` until design-system adds the new variable.

## Example 3: no design folder

Input: "Write the component specs for button."  (no `design/tokens.css`)

Reply, whole:

```
There is no design folder with tokens.css in this project, so run design-system first to build the variables, then ask me for the component specs again.
```

## Example 4: code with no spec

Input: "Build the dialog component in React."  (no `design/components/dialog.md`)

Reply, whole:

```
There is no spec for dialog yet, so I write the spec first: ask me to "write the spec for dialog", and then to build it.
```
