# Layer 09: Handoff

1. Update `design/STATUS.md` by editing only these lines (add one when missing, keep every other line, never touch another file of the design folder):
   - `step_completed: component specs (button, input, card)` or `step_completed: component code (button, card) in <stack>`
   - `components_specified: button, input, card` (everything with a passing spec, so far)
   - `components_built: button` (everything with passing code, so far, or `none`)
   - `components_pending: select, checkbox, dialog, table` (asked or planned but not yet specified, or `none`)
   - `variables_to_add: --tabs-indicator-bg (nearest --color-border-focus)` (the union over all specs, or `none`)
   - `next_skill: component-kit` while specs or code remain; `ui-craft` when the user's components are all built
   - `continue_with: "<the exact words>"`, for example `"Write the specs for select, checkbox, dialog and table"` or `"Build button, input and card in React"`; for ui-craft, `"Build the <screen> from the design folder using the components"`
2. The reply's "Next" repeats the same words and the line "Reply yes, change, or stop." The next step starts only after the user's answer.
3. Say once, under "Variables to add", that design-system adds component variables (`set` and a later command) and that the specs keep using the nearest variable until then.
4. Give the checker's result line to layer 10 and hand over nothing else in chat: the next turn starts from `design/STATUS.md` and `design/components/`.
