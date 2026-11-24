# Layer 01 — Intent

Decide whether this request belongs to `svg-mechanism` before designing any diagram.

1. Confirm the user wants a **2D animated technical SVG** showing how a system, pipeline, data flow, protocol handshake, cache hierarchy, state machine, or agent loop works.
2. Check negative boundaries immediately — if the request belongs elsewhere, reply with ONE concise redirect sentence and write NO `<svg>` or code:
   - 3D isometric cutaway or physical object illustration (machine, appliance, engine, isometric building) -> redirect to `figure-craft`.
   - Full-page scroll-choreographed showcase, pinned fullscreen scenes, GSAP ScrollTrigger / Lenis / WebGL storytelling page -> redirect to `motion-craft`.
   - Product UI screen, dashboard, navbar, sidebar, command palette, or form layout -> redirect to `ui-craft`.
   - Standalone design tokens, brand palette, `tokens.css`, or `design-tokens.json` -> redirect to `design-system`.
   - Pixel/spacing/contrast cleanup on existing UI code -> redirect to `ui-polish`.
3. Confirm whether the request actually names a system, mechanism, or set of stages. If it is vague (e.g., "draw a nice animated SVG diagram for my app" with no mechanism named), stop at Layer 03 and ask 1–2 short clarifying questions.
4. State the exact technical mechanism and audience in one crisp sentence before moving to Layer 02.
