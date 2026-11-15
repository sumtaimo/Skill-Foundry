# Layer 02: Context

1. Treat the input as the only source of screens, steps, controls, labels, sizes and behaviour.
2. For code, read what it contains: elements, visible labels, styles with their numbers, handlers and what each handler does on screen.
3. For a description, read what it states: the steps in order, what the user does at each, and what the user sees after each action.
4. When code and description are both given, use both; where they disagree, do not pick one: write an open question that starts with "Conflict:" and names both.
5. Keep the input's own names for screens, steps, controls and messages exactly as written, including capital letters.
6. Design tokens are optional. When the input or the project contains a design-token file (for example a tokens stylesheet or a token JSON file) and a size or gap in the code is given as a token, resolve the token to its value and cite the token name in the evidence (for example "`--size-6` = 24px"). When there is no token file, review without one and do not ask for one.
7. A token whose value is not shown is not shown (layer 01): its size goes to Open questions.
8. Do not look up the product, its other screens or its users. The skill runs in any project, and only the input is known.
9. Preserve everything: the review changes no file, no code and no text of the user's project.
10. Hand the list of screens, steps, controls and stated sizes to layer 03.
