---
name: svg-mechanism
description: Builds animated 2D technical architecture, data-flow, pipeline, protocol and mechanism explainer SVGs synced to CSS design tokens, with <defs> gradients/markers, interactive Play/Pause controls, screen-reader title/desc, and prefers-reduced-motion static fallback in standalone HTML or React/JSX. Use when asked to "draw an animated 2D architecture diagram", "build an animated SVG data flow or pipeline", "visualize how an API, queue, cache, webhook or handshake mechanism works", or "create a token-synced animated technical SVG". Do not use for 3D isometric cutaway illustrations of physical objects (use figure-craft), full-page scroll choreography or GSAP/Lenis/WebGL showcases (use motion-craft), product UI screens, navbars or command palettes (use ui-craft), building standalone design token files (use design-system), or polishing finished CSS (use ui-polish).
version: 0.1.0
---

# SVG Mechanism

Create crisp, token-synced, animated 2D technical architecture and mechanism SVGs (pipelines, queues, caches, handshakes, state machines, and agent loops) that explain how a system works in light and dark themes, pause cleanly on demand, and degrade gracefully under `prefers-reduced-motion: reduce`.

## Delivery rule (read first)

Your reply MUST contain the complete, runnable code as fenced code blocks: every file, start to end, never an excerpt. A file path, a summary or a published page is not a delivery. Do not call any publish, artifact, page-hosting or upload tool unless the user asked for one, even if your environment suggests it; if you also write files, paste their full contents in the reply.

## When to use

- Use when: drawing an animated 2D architecture diagram, request/response flow, queue/worker pipeline, protocol handshake, cache hierarchy, state machine, or agent execution loop as an inline `<svg>` in standalone HTML/CSS/JS or React/JSX.
- Do not use when: illustrating a 3D isometric physical object or cutaway (use `figure-craft`), choreographing a full-page scroll showcase with GSAP/Lenis/WebGL (use `motion-craft`), designing product UI screens, navbars, dashboards or command palettes (use `ui-craft`), building standalone `tokens.css` / `design-tokens.json` palettes (use `design-system`), or polishing existing UI CSS (use `ui-polish`).

## Procedure

Follow the ten layers in order. Each layer holds the detailed steps for that phase.

1. Intent: [layers/01-intent.md](layers/01-intent.md)
2. Context: [layers/02-context.md](layers/02-context.md)
3. Inputs: [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: [layers/04-flow.md](layers/04-flow.md)
5. Rules: [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: [layers/06-states.md](layers/06-states.md)
7. Checks: [layers/07-checks.md](layers/07-checks.md)
8. Output: [layers/08-output.md](layers/08-output.md)
9. Handoff: [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: [layers/10-evidence.md](layers/10-evidence.md)

References (read as needed for copy-ready patterns):
- Overview and token map: [references/README.md](references/README.md)
- 2D SVG layer structure, safe viewBox & `<defs>` patterns: [references/svg-architecture.md](references/svg-architecture.md)
- Token sync, Play/Pause contract & reduced-motion patterns: [references/tokens-and-motion.md](references/tokens-and-motion.md)
- Optional zero-dependency SVG verifier: `engine/lint-svg.mjs`
- Worked examples: [examples/README.md](examples/README.md)

## Rules

- `R-svg-mechanism-1`: Detect the project's existing design tokens (`design/tokens.css`, `tokens.css`, CSS variables) and stack (standalone HTML/CSS/JS or React/JSX) before writing code; NEVER edit `design/` files or import unrequested external libraries.
- `R-svg-mechanism-2`: Every mechanism `<svg>` MUST declare an explicit numeric `viewBox="0 0 W H"` with `width="100%"` and `preserveAspectRatio="xMidYMid meet"`, keeping all nodes and `<text>` labels inside a >= `24px` inner safe margin so nothing clips at `390px` or `1440px`.
- `R-svg-mechanism-3`: Every mechanism `<svg>` MUST organize markup into explicit `<defs>` (gradients, markers, or filters) and semantic layer `<g>` groups (`layer-backdrop`, `layer-tracks`, `layer-signals`, `layer-nodes`, `layer-labels`) so motion and styling stay clean.
- `R-svg-mechanism-4`: Bind ALL SVG colors (`fill`, `stroke`, `stop-color`) to CSS custom properties (`var(--color-...)`, `var(--mech-...)`), `url(#...)`, `currentColor`, or `none`; NEVER put raw `#hex` or `rgb(...)` literals inside SVG attributes.
- `R-svg-mechanism-5`: Support both light and dark modes (`:root`, `:root[data-theme="dark"]`, and `@media (prefers-color-scheme: dark)`) with >= `4.5:1` label text contrast and >= `3:1` node/track contrast in both themes.
- `R-svg-mechanism-6`: Animate signals cleanly along tracks using `stroke-dashoffset` or GPU `transform`/`opacity` keyframes; NEVER animate layout geometry (`width`, `height`, `x`, `y` reflows) or unthrottled heavy filters.
- `R-svg-mechanism-7`: Provide an accessible Play/Pause control (`<button type="button" aria-pressed="...">`, >= `44x44px` hit target, visible `:focus-visible` outline) that freezes/resumes all animations (`data-paused="true"` + `animation-play-state: paused`, plus `pauseAnimations()` if SMIL is used).
- `R-svg-mechanism-8`: Honor `@media (prefers-reduced-motion: reduce)` by disabling continuous signal travel and keeping clear directional arrows and stage numbering so the full mechanism remains understandable without motion.
- `R-svg-mechanism-9`: Every mechanism `<svg>` MUST carry `role="img"` and `aria-labelledby` pointing to `<title>` and `<desc>` elements that explain the system and flow for screen-reader users.
- `R-svg-mechanism-10`: Keep every `<text>` label readable (`>= 12px` in viewBox units), uncluttered, and never overlapping tracks or node borders; under Khmer (`:lang(km)` or Khmer script), set `letter-spacing: 0` and generous vertical node padding so subscripts never clip.
- `R-svg-mechanism-11`: When the mechanism has discrete stages or branches, support keyboard-accessible stage focus or step-through with an `aria-live="polite"` status summary describing the active stage.
- `R-svg-mechanism-12`: NEVER invent system components, metrics, endpoints, or protocol steps the user did not ask for; if the request gives no subject or mechanism, ask 1–2 concise clarifying questions and write no `<svg>` until answered.
- `R-svg-mechanism-13`: Refuse requests meant for 3D isometric physical cutaways (`figure-craft`), full-page scroll showcases (`motion-craft`), product UI screens (`ui-craft`), standalone token systems (`design-system`), or CSS polish (`ui-polish`) in one concise redirect sentence with no code.
- `R-svg-mechanism-14`: Verify rendered output with `engine/lint-svg.mjs` (when Node is available) and in a real browser at `1440px` and `390px` (light, dark, reduced-motion, zero console errors, zero horizontal scroll) before claiming verified.

## Checks

- Machine checks: run `node engine/lint-svg.mjs <file>` when Node is available to verify `M1`–`M8` (`viewBox`, `<defs>`, `<title>`/`<desc>`, Play/Pause, `prefers-reduced-motion`, zero raw hex attributes, safe `<text>` margins, light/dark tokens); verify `1440px` and `390px` viewports in light/dark/reduced-motion with zero overflow and zero console errors.
- Reviewer checklist: verify clean 2D flow hierarchy, legible labels without overlap, accurate technical stages with zero invented architecture, smooth Play/Pause toggle, and honest scope boundary redirects.

## Review

Compare the delivered SVG and wrapper against `RULES.json` and [references/svg-architecture.md](references/svg-architecture.md). Confirm every requested stage and arrow is accurate, no raw hex attributes remain inside `<svg>`, Play/Pause freezes motion cleanly, and reduced motion preserves full static clarity.

## Output

Produce the **Mechanism summary**, **Stages & Token map**, complete runnable **Code** (standalone HTML/CSS/JS or React/JSX), **Interactive & Reduced-Motion behavior**, and **Verification & Handoff notes**. See [layers/08-output.md](layers/08-output.md).
