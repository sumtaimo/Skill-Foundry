# Layer 08 — Output

Deliver complete, immediately runnable code plus a tight technical summary.

1. Start with `## SVG Mechanism: <Mechanism Name>` followed by a 1–2 sentence summary of the 2D flow, token source (`design/tokens.css` or self-contained semantic fallback tokens), and target format (standalone HTML or React/JSX).
2. Include a compact **Stages & Token Map** list naming each node/branch from the user's prompt and the exact CSS custom properties bound to surfaces, tracks, signals, and semantic accents.
3. Paste the **complete, runnable code** inside fenced code blocks (`html`, `jsx`/`tsx`, `css`) from first line to last line — never ellipses, never truncated snippets, never external placeholder URLs.
4. Add a short **Interactive & Reduced-Motion Contract** note documenting the Play/Pause button (`aria-pressed` / `data-paused`), keyboard stage focus (`aria-live="polite"`), and `@media (prefers-reduced-motion: reduce)` static behavior.
5. Finish with **Verification & Handoff**: report which checks ran (`engine/lint-svg.mjs`, browser viewports) or clearly note `not run` if no runner was available, and mention any next-step handoff (e.g., `ui-craft` if embedding into a full product page).
6. For out-of-scope requests (Layer 01) or vague requests lacking a mechanism (Layer 03), skip sections 1–5 and output ONLY the concise redirect sentence or 1–2 clarifying questions.
