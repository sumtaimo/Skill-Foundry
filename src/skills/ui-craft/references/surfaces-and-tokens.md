# Surfaces, Glass, Gradients, Typography & Z-Index

## 1. Semantic Light & Dark Surface Tokens

Neutral-first surfaces adapt seamlessly to light-first showcases and high-craft dark workspaces. If the project already loads `tokens.css`, keep existing variable names and map or supplement missing glass/radius/z-index tokens:

```css
:root {
  color-scheme: light dark;
  --bg: #ffffff;
  --surface: #fafafa;
  --surface-2: #f4f4f5;
  --glass-bg: color-mix(in srgb, var(--surface) 74%, transparent);
  --fg: #09090b;
  --muted: #52525b; /* >= 7.0:1 on #ffffff */
  --line: #e4e4e7;
  --line-strong: #a1a1aa;
  --accent: #18181b;
  --fg-on-accent: #ffffff;
  --focus: #2563eb;
  --danger: #b91c1c;
  --danger-bg: #fef2f2;
  --dot: rgba(9, 9, 11, 0.08);
  --glow: radial-gradient(640px 320px at 50% 0%, rgba(24, 24, 27, 0.06), transparent 70%);
  --btn-gloss: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0) 60%);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 8px 24px -8px rgba(0, 0, 0, 0.12);
  --r-xs: 4px;
  --r-sm: 6px;
  --r-md: 10px;
  --r-lg: 14px;
  --r-xl: 16px;
  --z-base: 1;
  --z-sticky: 20;
  --z-dropdown: 40;
  --z-command: 60;
  --z-modal: 80;
  --z-toast: 100;
}

:root[data-theme="dark"] {
  --bg: #09090b;
  --surface: #121216;
  --surface-2: #1c1c22;
  --glass-bg: color-mix(in srgb, var(--surface) 78%, transparent);
  --fg: #fafafa;
  --muted: #a1a1aa; /* >= 7.5:1 on #09090b */
  --line: #27272a;
  --line-strong: #52525b;
  --accent: #fafafa;
  --fg-on-accent: #09090b;
  --focus: #60a5fa;
  --danger: #f87171;
  --danger-bg: rgba(185, 28, 28, 0.16);
  --dot: rgba(250, 250, 250, 0.07);
  --glow: radial-gradient(640px 320px at 50% 0%, rgba(250, 250, 250, 0.08), transparent 70%);
  --btn-gloss: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 60%);
  --shadow-md: 0 10px 28px -8px rgba(0, 0, 0, 0.55);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #09090b;
    --surface: #121216;
    --surface-2: #1c1c22;
    --glass-bg: color-mix(in srgb, var(--surface) 78%, transparent);
    --fg: #fafafa;
    --muted: #a1a1aa;
    --line: #27272a;
    --line-strong: #52525b;
    --accent: #fafafa;
    --fg-on-accent: #09090b;
    --focus: #60a5fa;
    --dot: rgba(250, 250, 250, 0.07);
    --glow: radial-gradient(640px 320px at 50% 0%, rgba(250, 250, 250, 0.08), transparent 70%);
  }
}
```

## 2. Glass Contrast Safety Rule

Never place light/dark text onto a transparent element without BOTH a solid-tinted `--glass-bg` backdrop (>= 72% opacity) AND a fallback when `backdrop-filter` is unsupported:

```css
.glass-bar {
  background: var(--surface);
  border: 1px solid var(--line);
}
@supports (backdrop-filter: blur(20px)) {
  .glass-bar {
    background: var(--glass-bg);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
  }
}
```

## 3. Modern Buttons, Restrained Gradients & Specular Edges

- Primary CTA (max 1 per viewport): `min-height: 44px`, padding `0 20px`, `border-radius: var(--r-md)`, `15px` `font-weight: 500`, layered `background-image: var(--btn-gloss)` over `var(--accent)`, `1px` top inset highlight `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), var(--shadow-md)`.
- Secondary / Ghost button: `min-height: 44px`, `background: var(--surface)`, `1px solid var(--line)`, hover swaps border to `var(--line-strong)` and subtle elevation.
- Ambient dot grid behind hero stages: mask edges radially (`mask-image: radial-gradient(ellipse at 50% 35%, black 30%, transparent 80%)`) so grid lines never bleed through dense footer/form text.

## 4. Typography Scale & Bento Spatial Rhythm

- Body size >= `16px`, `line-height: 1.5` (use `1.65` for Khmer / complex multi-mark scripts), prose `max-width: 65ch`.
- Display headings: `font-size: clamp(1.875rem, 4vw, 3rem)`, `line-height: 1.12`, `letter-spacing: -0.025em`, `font-weight: 600` or `700`.
- Counters, shortcut keys (`<kbd>`), timestamps, prices: `font-variant-numeric: tabular-nums`.
- Bento cards: `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 16px;` with `border-radius: var(--r-lg)`, `1px solid var(--line)`, generous `24px` card padding (`16px` on `< 640px`).
