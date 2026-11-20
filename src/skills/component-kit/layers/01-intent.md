# Layer 01: Intent

Terms used in every layer:
- **Design folder**: the `design` folder of the project, written by design-system. It holds `tokens.css` (the names of every variable), `variables.json`, `BRIEF.md` and `STATUS.md`.
- **Variable**: a CSS custom property defined in `design/tokens.css`, written with its exact name (`--button-primary-bg`).
- **Spec**: `design/components/<name>.md`, the stack-neutral description of one component.
- **Set**: button, input, select, checkbox, card, dialog, table, nav, tabs, toast, menu, badge, in that order.
- **Step**: SPEC (write specs) or CODE (build components from specs). One step per turn.

1. Start from the goal the user states. When there is none, ask one question: "Which components, and do you want the specs first or the code?" Write nothing until it is answered.
2. Decide the step from the request. "Spec", "describe", "document", "define" or a bare list of components with no stack is SPEC. "Build", "code", "implement", "make it in React" for components that have a spec is CODE.
3. A request that asks for both ("write the spec and build the button") is SPEC now. Say in the report that the code step comes next and give the words for it (R-component-kit-2).
4. A request for a whole screen, page or flow is not this skill: say it belongs to ui-craft and write nothing.
5. A request to change a colour, radius, size or font everywhere is not this skill: say design-system changes variables with `set`.
6. The one outcome that proves success: every spec or file passes the checker, and the user can continue with the words in `design/STATUS.md`.
