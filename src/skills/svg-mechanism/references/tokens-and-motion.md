# Token Sync, Play/Pause Contract & Reduced Motion

## 1. Light & Dark Token Mapping (`design/tokens.css` Compatible)

Always prefer existing `--color-*` tokens from `design/tokens.css` and map mechanism aliases via fallbacks. Never place raw `#hex` or `rgb()` inside `<svg>` element attributes (`fill`, `stroke`, `stop-color`).

```css
:root {
  color-scheme: light dark;
  --color-surface-default: #f8fafc;
  --color-surface-raised: #ffffff;
  --color-surface-subtle: #f1f5f9;
  --color-text-default: #0f172a;
  --color-text-muted: #475569;
  --color-border-default: #cbd5e1;
  --color-border-strong: #64748b;
  --color-border-focus: #2563eb;
  --color-action-primary-bg: #1d4ed8;
  --color-action-primary-text: #ffffff;
  --color-warning-text: #b45309;
  --color-success-text: #047857;
  --color-danger-text: #b91c1c;

  --mech-canvas: var(--color-surface-default);
  --mech-node-top: var(--color-surface-raised);
  --mech-node-bottom: var(--color-surface-subtle);
  --mech-grid-dot: var(--color-border-default);
  --mech-track: var(--color-border-strong);
  --mech-accent: var(--color-action-primary-bg);
  --mech-warn: var(--color-warning-text);
  --mech-ok: var(--color-success-text);
  --mech-text: var(--color-text-default);
  --mech-muted: var(--color-text-muted);
}

:root[data-theme="dark"] {
  --color-surface-default: #0b1120;
  --color-surface-raised: #162033;
  --color-surface-subtle: #111827;
  --color-text-default: #f8fafc;
  --color-text-muted: #cbd5e1;
  --color-border-default: #334155;
  --color-border-strong: #64748b;
  --color-border-focus: #60a5fa;
  --color-action-primary-bg: #38bdf8;
  --color-action-primary-text: #082f49;
  --color-warning-text: #fbbf24;
  --color-success-text: #34d399;
  --color-danger-text: #f87171;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface-default: #0b1120;
    --color-surface-raised: #162033;
    --color-surface-subtle: #111827;
    --color-text-default: #f8fafc;
    --color-text-muted: #cbd5e1;
    --color-border-default: #334155;
    --color-border-strong: #64748b;
    --color-border-focus: #60a5fa;
    --color-action-primary-bg: #38bdf8;
    --color-action-primary-text: #082f49;
    --color-warning-text: #fbbf24;
    --color-success-text: #34d399;
    --color-danger-text: #f87171;
  }
}
```

## 2. GPU-Friendly Signal Animation & Play/Pause Contract

```css
@keyframes mech-flow {
  from { stroke-dashoffset: 64; }
  to { stroke-dashoffset: 0; }
}

@keyframes mech-pulse {
  0%, 100% { opacity: 0.45; transform: scale(0.96); }
  50% { opacity: 1; transform: scale(1.04); }
}

.signal-stream {
  stroke-dasharray: 14 18;
  stroke-linecap: round;
  animation: mech-flow 2.4s linear infinite;
}

.signal-node-pulse {
  transform-box: fill-box;
  transform-origin: center;
  animation: mech-pulse 2.4s ease-in-out infinite;
}

/* Pause state toggled by accessible Play/Pause button */
.mech-figure[data-paused="true"] .signal-stream,
.mech-figure[data-paused="true"] .signal-node-pulse {
  animation-play-state: paused;
}

/* Reduced-motion static clarity fallback */
@media (prefers-reduced-motion: reduce) {
  .signal-stream,
  .signal-node-pulse {
    animation: none !important;
    animation-play-state: paused !important;
    opacity: 0.9 !important;
  }
}
```

## 3. Accessible Play/Pause & Stage Inspector Script

```js
const fig = document.querySelector('.mech-figure');
const svg = fig.querySelector('svg');
const toggleBtn = fig.querySelector('[data-mech-toggle]');
const statusEl = fig.querySelector('[data-mech-status]');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) {
  fig.dataset.paused = 'true';
  toggleBtn.setAttribute('aria-pressed', 'true');
  toggleBtn.textContent = 'Play animation';
}

toggleBtn.addEventListener('click', () => {
  const paused = fig.dataset.paused === 'true';
  const nextPaused = !paused;
  fig.dataset.paused = String(nextPaused);
  toggleBtn.setAttribute('aria-pressed', String(nextPaused));
  toggleBtn.textContent = nextPaused ? 'Play animation' : 'Pause animation';
  if (typeof svg.pauseAnimations === 'function') {
    nextPaused ? svg.pauseAnimations() : svg.unpauseAnimations();
  }
  if (statusEl) {
    statusEl.textContent = nextPaused ? 'Animation paused. Static directional arrows remain visible.' : 'Animation playing.';
  }
});
```
