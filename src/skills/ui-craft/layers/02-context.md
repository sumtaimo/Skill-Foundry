# Layer 02: Context

1. Inspect the workspace (when files are accessible) before writing code:
   - Check `package.json`, framework config, and stylesheet entry points to detect whether the project uses vanilla HTML/CSS, Tailwind CSS, React/JSX/TSX, or another component system.
   - Check for existing token files (`tokens.css`, `design-tokens.json`, `:root` variables, `theme.css`) and neighboring components so naming, border radii, and colour tokens integrate cleanly instead of fighting existing code.
2. Check the active role boundary:
   - If the executing agent role is restricted to stylesheet files (`*.css`, `*.scss`, `*.less` — such as a `UX_DESIGNER` harness worker), set **Stack mode** to `css-handoff`: implement all visual tokens, layout grids, surfaces, glassmorphism, animations, and state styles in CSS, and prepare a crisp `Markup Handoff Contract` for `DEV_ENGINEER`.
   - If the executing agent can write HTML/JSX/TSX/JS alongside CSS (`DEV_ENGINEER` or standalone session), deliver complete, runnable components + styles + keyboard/state behavior.
3. Preserve all existing brand hues, domain copy provided by the user, IDs/data attributes required by existing tests, and project conventions.
4. If existing design tokens cover some groups (for example colours exist, but glass surface, gradient highlight, and `--z-*` tokens are missing), consume the existing tokens untouched and define only the missing UI-layer custom properties scoped cleanly without overriding existing variables.
5. Hand the detected **Stack mode**, **Role mode**, and **Token source** to Layer 03.
