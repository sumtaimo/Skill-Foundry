# Design status

- step_completed: component specs (tabs, toast, menu)
- components_specified: tabs, toast, menu
- components_built: none
- components_pending: none
- variables_to_add: --tabs-indicator-bg (nearest --color-border-focus), --toast-bg (nearest --color-info-bg-subtle), --z-toast (nearest --shadow-3), --menu-bg (nearest --color-surface-raised), --z-dropdown (nearest --shadow-2)
- verified: 43 contrast pairs pass in light and dark; 180 variables, 0 broken aliases
- files: variables.json, tokens.css, design-tokens.json, CHANGES.md, STATUS.md, design-system-report.md
- next_skill: component-kit
- continue_with: "Build tabs, toast and menu in plain HTML and CSS"
- note: variables change only with the variables engine (set); tokens.css and design-tokens.json are generated.
