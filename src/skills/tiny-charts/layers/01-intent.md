# Layer 01 — Intent

Determine whether the request belongs to `tiny-charts` before selecting a template or generating HTML.

1. Confirm the user wants a **playable, single-file interactive HTML diagram** (`Statechart`, `Sequence`, `Flowchart`, `Timeline`, or `Sankey`) with auto-selection, real state transitions, and a `"Show the logic"` (Rules + Flowchart) toggle.
2. Check negative boundaries immediately and refuse in ONE concise sentence with zero HTML when the request belongs elsewhere:
   - Static pie, bar, or line charts of raw spreadsheet numbers -> refuse as out of scope (data charting).
   - Solid 3D isometric physical object cutaways -> redirect to `figure-craft`.
   - Token-synced 2D technical architecture/pipeline SVGs (`design/tokens.css`, `<defs>` gradients, Play/Pause without a `"Show the logic"` statechart drawer) -> redirect to `svg-mechanism`.
   - Full-page scroll choreography, pinned fullscreen scenes, or GSAP/Lenis/WebGL storytelling -> redirect to `motion-craft`.
   - Full product UI screens, navbars, command palettes, or dashboards -> redirect to `ui-craft`.
3. Confirm the prompt names a real process, policy, actor exchange, timeline, or proportional split. If the request is vague (e.g., "make me a cool interactive chart"), stop at Layer 03 and ask 1–2 concise clarifying questions.
4. State the core user goal in one sentence before reading context.
