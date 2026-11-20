# Surfaces, Glass, Gradients, Typography & Z-Index

## 0. Foundation first (read before section 1)

If the project has `design/tokens.css` (written by `design-system`), do not write the block of section 1. Read `design/STATUS.md`, `design/BRIEF.md` and `design/tokens.css` (and `design/components/*.md` when present), link `design/tokens.css`, and use only variables that exist there, in this order: component variables (`--button-*`, `--input-*`, `--card-*`), then semantic `--color-*`, `--radius-*`, `--space-*`, `--font-*`, `--shadow-*`, `--duration-*`, then the modern group (`--glass-bg`, `--glass-blur`, `--r-xs` .. `--r-xl`, `--z-*`, `--glow`, `--btn-gloss`). Never write a raw hex, colour or radius where one of them holds it. Never edit a file in `design/`: if a variable is missing, say so and name the `design-system` step that adds it.

Section 1 is the default for a prototype with no foundation (the user chose defaults). It uses the same names as `design-system`, so the code keeps working when `design/tokens.css` arrives later: delete the block and link the file.

## 1. Semantic Light & Dark Surface Tokens (default names = design-system names)

Neutral-first surfaces adapt seamlessly to light-first showcases and high-craft dark workspaces. If the project already loads its own tokens, keep the existing variable names and map or supplement only the missing glass/radius/z-index tokens:

```css
:root {
  color-scheme: light dark;
  --color-surface-default: #ffffff;
  --color-surface-raised: #fafafa;
  --color-surface-subtle: #f4f4f5;
  --glass-blur: 20px;
  --glass-bg: color-mix(in srgb, var(--color-surface-raised) 74%, transparent);
  --color-text-default: #09090b;
  --color-text-muted: #52525b; /* >= 7.0:1 on #ffffff */
  --color-border-default: #e4e4e7;
  --color-border-strong: #a1a1aa;
  --color-action-primary-bg: #18181b;
  --color-action-primary-text: #ffffff;
  --color-border-focus: #2563eb;
  --color-danger-text: #b91c1c;
  --color-danger-bg-subtle: #fef2f2;
  --glow: radial-gradient(640px 320px at 50% 0%, rgba(24, 24, 27, 0.06), transparent 70%);
  --btn-gloss: linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0) 60%);
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-2: 0 8px 24px -8px rgba(0, 0, 0, 0.12);
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
  --line-height-khmer: 1.6;
}

:lang(km) {
  line-height: var(--line-height-khmer);
  letter-spacing: 0;
}

:root[data-theme="dark"] {
  --color-surface-default: #09090b;
  --color-surface-raised: #121216;
  --color-surface-subtle: #1c1c22;
  --glass-bg: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
  --color-text-default: #fafafa;
  --color-text-muted: #a1a1aa; /* >= 7.5:1 on #09090b */
  --color-border-default: #27272a;
  --color-border-strong: #52525b;
  --color-action-primary-bg: #fafafa;
  --color-action-primary-text: #09090b;
  --color-border-focus: #60a5fa;
  --color-danger-text: #f87171;
  --color-danger-bg-subtle: rgba(185, 28, 28, 0.16);
  --glow: radial-gradient(640px 320px at 50% 0%, rgba(250, 250, 250, 0.08), transparent 70%);
  --btn-gloss: linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0) 60%);
  --shadow-2: 0 10px 28px -8px rgba(0, 0, 0, 0.55);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-surface-default: #09090b;
    --color-surface-raised: #121216;
    --color-surface-subtle: #1c1c22;
    --glass-bg: color-mix(in srgb, var(--color-surface-raised) 78%, transparent);
    --color-text-default: #fafafa;
    --color-text-muted: #a1a1aa;
    --color-border-default: #27272a;
    --color-border-strong: #52525b;
    --color-action-primary-bg: #fafafa;
    --color-action-primary-text: #09090b;
    --color-border-focus: #60a5fa;
  --glow: radial-gradient(640px 320px at 50% 0%, rgba(250, 250, 250, 0.08), transparent 70%);
  }
}
```

## 2. Glass Contrast Safety Rule

Never place light/dark text onto a transparent element without BOTH a solid-tinted `--glass-bg` backdrop (>= 72% opacity) AND a fallback when `backdrop-filter` is unsupported:

```css
.glass-bar {
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-default);
}
@supports (backdrop-filter: blur(20px)) {
  .glass-bar {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
  }
}
```

## 3. Modern Buttons, Restrained Gradients & Specular Edges

- Primary CTA (max 1 per viewport): `min-height: 44px`, padding `0 20px`, `border-radius: var(--r-md)`, `15px` `font-weight: 500`, layered `background-image: var(--btn-gloss)` over `var(--color-action-primary-bg)`, `1px` top inset highlight `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), var(--shadow-2)`.
- Secondary / Ghost button: `min-height: 44px`, `background: var(--color-surface-raised)`, `1px solid var(--color-border-default)`, hover swaps border to `var(--color-border-strong)` and subtle elevation.
- Ambient dot grid behind hero stages (dots: `color-mix(in srgb, var(--color-text-default) 8%, transparent)`): mask edges radially (`mask-image: radial-gradient(ellipse at 50% 35%, black 30%, transparent 80%)`) so grid lines never bleed through dense footer/form text.

## 4. Typography Scale & Bento Spatial Rhythm

- Body size >= `16px`, `line-height: 1.5` for Latin, prose `max-width: 65ch`.
- Khmer (and other multi-mark scripts): ONE body line-height, `1.6`, everywhere. Use `var(--line-height-khmer)` when `design/tokens.css` has it, else `--line-height-khmer: 1.6` in the default block. Add `:lang(km) { line-height: var(--line-height-khmer); letter-spacing: 0; }` and make sure the heading tracking rule below never reaches Khmer: write it as `h1:not(:lang(km))` or override it under `:lang(km)` with `letter-spacing: 0`.
- Display headings: `font-size: clamp(1.875rem, 4vw, 3rem)`, `line-height: 1.12` (Latin), `letter-spacing: -0.025em` (Latin only, never under `:lang(km)`), `font-weight: 600` or `700`.
- Counters, shortcut keys (`<kbd>`), timestamps, prices: `font-variant-numeric: tabular-nums`.
- Bento cards: `display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 16px;` with `border-radius: var(--r-lg)`, `1px solid var(--color-border-default)`, generous `24px` card padding (`16px` on `< 640px`).
