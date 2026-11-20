# Layer 08: Output

Files:
- SPEC: `design/components/<name>.md` for each component (3 to 4), and `design/STATUS.md` updated.
- CODE: the component files in the project's stack, an optional demo when asked, and `design/STATUS.md` updated.

The reply is this report and nothing before or after it. The first line is the heading.

SPEC turn:

```
## Component specs: button, input, card

### Files
- design/components/button.md
- design/components/input.md
- design/components/card.md

### Check
<the checker's output, word for word, ending with its SPEC CHECK PASSED line>

### Variables to add
- --tabs-indicator-bg: nearest --color-border-focus (tabs underline)
(or "None.")

### Next
Step done: component specs (button, input, card). Next: this skill writes the next specs, or builds the code for these.
Say "Write the specs for select, checkbox, dialog and table" or "Build button, input and card in <stack>".
Reply yes, change, or stop.
```

CODE turn:

```
## Component code: button, card

### Files
- components/button.css
- ...

### Check
<the checker's output, word for word, ending with its CODE CHECK PASSED line>

### Stack
<React with Tailwind v3 | plain HTML and CSS (no stack found) | ...>, and how to use the files (one or two lines).

### Variables to add
<carried over from the specs, or "None.">

### Next
Step done: component code (button, card). Next: ...
```

Quality bar:
1. Every sentence in a spec is specific to that component: a spec that could describe any component is not done.
2. A spec says what to do in each state with a variable, never with a value.
3. Code files contain no raw colour, no raw px above 2 px where a variable holds it, and no variable that is not in `tokens.css`.
4. Labels and text in examples use the product's own words from `BRIEF.md`, not lorem ipsum.
