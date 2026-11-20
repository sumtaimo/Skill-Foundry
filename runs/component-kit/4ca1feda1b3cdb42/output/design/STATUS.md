# Design status

- step_completed: component specs (button, input, select, checkbox)
- components_specified: button, input, select, checkbox
- components_built: none
- components_pending: card, dialog, table, nav, tabs, toast, menu, badge
- variables_to_add: --button-danger-bg (nearest --color-danger-bg), --button-ghost-bg-hover (nearest --color-surface-subtle), --input-border-error (nearest --color-danger-border), --input-placeholder (nearest --color-text-muted), --select-list-bg (nearest --color-surface-raised), --select-option-bg-hover (nearest --color-surface-subtle), --checkbox-bg-checked (nearest --color-action-primary-bg), --checkbox-border (nearest --input-border)
- verified: 43 contrast pairs pass in light and dark; 180 variables, 0 broken aliases
- files: variables.json, tokens.css, design-tokens.json, CHANGES.md, STATUS.md, design-system-report.md
- next_skill: component-kit
- continue_with: "Write the specs for card, dialog, table and nav"
- note: variables change only with the variables engine (set); tokens.css and design-tokens.json are generated.
