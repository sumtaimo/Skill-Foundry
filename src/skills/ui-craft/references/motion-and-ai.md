# Motion Physics & Inline AI Action Bars

## 1. Motion Physics (GPU-Only + Safe Reduced Motion)

- Animate ONLY compositor-friendly properties: `transform` and `opacity` (never animate `width`, `height`, `top`, `left` on hot hover loops).
- Durations & curves:
  - Tactile button/control micro-response: `140ms cubic-bezier(0.2, 0, 0, 1)`.
  - Panel/popover/tab pill transition: `200ms cubic-bezier(0.22, 1, 0.36, 1)` (or modern CSS `linear()` spring curve where supported, falling back to `cubic-bezier(0.22, 1, 0.36, 1)`).
  - View transitions / staggered card reveal: keep total stagger under `240ms` so UI feels instantaneous, never sluggish.
- **Reduced Motion Fallback (`R-ui-craft-9`)**:
  Disable translations, scales, bounces, and shimmer sweeps under `@media (prefers-reduced-motion: reduce)`, while KEEPING clean opacity/color state transitions or instant active feedback so keyboard/screen users still see what happened:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-property: opacity, background-color, border-color, color !important;
    transition-duration: 120ms !important;
  }
  .btn:hover, .card:hover { transform: none !important; }
}
```

## 2. Inline AI / Contextual Agent Action Bar

When designing AI prompts, copilots, or contextual floating toolbars, include all five building blocks cleanly:

1. **Compact Prompt Input**: single rounded container (`--r-lg`, `1px solid var(--color-border-default)`, `--glass-bg` + focus ring on `:focus-within`), leading context icon (`aria-hidden="true"`), text input/textarea (`min-height: 44px`), and keyboard submit (`Enter` / `Cmd+Enter` badge).
2. **Quick-Action Chips**: 2–4 concise suggestion pills (`--r-sm`, `min-height: 36px` with `44px` expanded hit area or `>= 44px` tall on touch screens) that prefill/run common actions.
3. **Live Streaming / Thinking Feedback**: live status container (`role="status" aria-live="polite"`) showing active step indicator (subtle pulsing dot disabled under `reduced-motion`), current stage text, and streaming token output.
4. **Stop / Cancel Control**: prominent secondary button (`Stop generating`, `Escape` shortcut) immediately visible while streaming.
5. **Diff Review & Undo / Revert Bar**: once output applies or proposes changes, show `Apply` / `Accept` alongside a clear `Undo` / `Revert` button so the user is always in control.
