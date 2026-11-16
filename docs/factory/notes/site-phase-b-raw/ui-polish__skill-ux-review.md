## UI polish: ux-review skill page

30 fixes across Spacing, Typography, Hierarchy, States, Layout and Tokens. Text and brand hue kept. Tokens from tokens.css and tokens.supplement.css.

### Fixes
1. **Spacing**: `.btn` `gap: 6px; padding: 8px 18px` is off the scale. Now `gap: var(--space-8); padding: var(--space-8) var(--space-16)`. (R-ui-polish-1, R-ui-polish-20)
2. **Spacing**: `main > section[id]` `padding-top: 40px` is off the scale. Now `padding-top: var(--space-48)`. (R-ui-polish-1, R-ui-polish-20)
3. **Spacing**: `h3` `margin: 20px 0 8px` is off the scale. Now `margin: var(--space-24) 0 var(--space-8)`. (R-ui-polish-1, R-ui-polish-20)
4. **Spacing**: `.facts` `margin: 0 0 20px` and `.facts li` `padding: 4px 14px` are off the scale. Now `margin: 0 0 var(--space-24)` and `padding: var(--space-4) var(--space-16)`. (R-ui-polish-1, R-ui-polish-20)
5. **Spacing**: `.codebox` `padding: 8px 8px 8px 14px` is off the scale. Now `padding: var(--space-8) var(--space-8) var(--space-8) var(--space-16)`. (R-ui-polish-1, R-ui-polish-20)
6. **Spacing**: `figure.proof` `margin: 12px 0 20px; padding: 14px` is off the scale. Now `margin: var(--space-12) 0 var(--space-24); padding: var(--space-16)`. (R-ui-polish-1, R-ui-polish-20)
7. **Spacing**: `.proof-ask` and `.proof-answer` `margin: 0 0 10px` is off the scale. Now `margin: 0 0 var(--space-12)`. (R-ui-polish-1, R-ui-polish-20)
8. **Spacing**: `.cover-tag` `padding: 2px 10px`, its dot `margin-right: 6px` and `.proof-label` `margin-right: 6px` are off the scale. Now `padding: var(--space-4) var(--space-12)` and `margin-right: var(--space-8)`. (R-ui-polish-1, R-ui-polish-20)
9. **Spacing**: `6px` on `.steps li` and `.limits li` (margin), `.files li` (padding) and `.meter-text` (margin-top) is off the scale. Now `var(--space-8)`. (R-ui-polish-1, R-ui-polish-20)
10. **Spacing**: `dd` `margin: 2px 0 0` is off the scale. Now `margin: var(--space-4) 0 0`. (R-ui-polish-1, R-ui-polish-20)
11. **Spacing**: inline `code` `padding: .1em .35em` (1.6px 5.6px) is off the scale. Now `padding: 0 var(--space-4)`. (R-ui-polish-1, R-ui-polish-20)
12. **Spacing**: list and accordion indents are off the scale: `.steps, .outputs` `padding-left: 1.5em`, `.limits` `padding-left: 1.2em` (19.2px), and `.acc > :not(summary)` `margin-left: 1.6rem` (25.6px). Now `var(--space-24)`, `var(--space-16)` and `var(--space-24)`. The `+`/`−` marker width also goes from `1.6rem` to `var(--space-24)`, so the indent still lines up. (R-ui-polish-1, R-ui-polish-20)
13. **Typography**: `body` line-height `1.6` is not the body line-height. Now `var(--line-height-body)` (1.5). (R-ui-polish-3, R-ui-polish-20)
14. **Typography**: `h1` `font-size: clamp(2rem, 5vw, 2.75rem)` (32–44px) is off the scale and `line-height: 1.15` is below 1.2. Now `clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl))` (30–36px) and `var(--line-height-display)`. (R-ui-polish-2, R-ui-polish-3, R-ui-polish-20)
15. **Typography**: `h3` and `.real-result h2` `font-size: 1.125rem` (18px) has no token on this scale. Now `var(--font-size-lg)` (20px). `h3` `line-height: 1.3` is now `var(--line-height-heading)`. (R-ui-polish-2, R-ui-polish-20)
16. **Typography**: `h4` had no line-height of its own, so it took the body's `1.6`. Now `var(--line-height-heading)`. (R-ui-polish-3, R-ui-polish-20)
17. **Typography**: weight `500` on `h1–h4`, `.brand`, `.btn`, `.acc > summary` and `dd` is not a token weight. Now `var(--font-weight-strong)`, so the page uses the two token weights, regular and strong. (R-ui-polish-8, R-ui-polish-20)
18. **Typography**: `.lead` and `.note` `max-width: 62ch` is now `var(--measure)` (65ch). (R-ui-polish-3, R-ui-polish-20)
19. **Hierarchy**: the primary action "Install this skill" (`.btn.primary`) was `var(--bg)` text on `var(--fg)` (#1d1d1b), with hover on `var(--muted)`. The token file has no action tokens, so it now uses the brand token: `var(--color-primary-50)` on `var(--color-brand)` (4.93:1), hover `var(--color-primary-800)` (8.05:1), pressed `var(--color-primary-900)` (12.13:1). The near-black colour is replaced by the project's brand token. (R-ui-polish-5, R-ui-polish-21)
20. **States**: `.btn` had no disabled style. Now `.btn:disabled, .btn[aria-disabled="true"]` get `opacity: .5; cursor: not-allowed`. (R-ui-polish-6)
21. **States**: `.brand` had no visible hover, because its underline is turned off. Now the underline shows on hover, in the same colour as other links on hover. (R-ui-polish-6)
22. **States**: `.acc > summary` had no hover. Now it shows an underline and the marker turns `var(--fg)`. (R-ui-polish-6)
23. **States**: `:focus-visible` `outline: 2px solid var(--ok)` is now `outline: var(--border-width-focus) solid var(--ok)`. (R-ui-polish-6, R-ui-polish-20)
24. **Layout**: links and buttons had `min-height` but no `min-width`. Now `.btn`, `.brand`, `.skip`, the shared target-link rule and `.meta a` all have `min-height` and `min-width: var(--size-target-min)`. (R-ui-polish-7, R-ui-polish-20)
25. **Tokens**: the site's own variables now point to tokens: `--gutter: 16px` → `var(--space-16)`, `--target: 44px` → `var(--size-target-min)`, `--radius: 14px` → `var(--radius-lg)` (16px), and light-theme `--ok: #2f7a4b` → `var(--color-brand)`. (R-ui-polish-20)
26. **Tokens**: spacing values already on the scale are now written as `var(--space-*)`: `.top`, `.tools`, `.tools a`, `.skip`, `.skip:focus`, `main`, `h1`, `h2`, the h2 counter, `.hero-actions`, `.live`, `.real-result`, `.qbar`, `.qbar-tabs`, `.codebox pre`, `.stats/.kv`, `.meter`, `.rule-list li`, `.banner`, `.meta a + a`, `.foot`, and the 480px media query. (R-ui-polish-20)
27. **Tokens**: font sizes, line-heights and weight 400 that are already on the scale are now written as tokens: `body`, `.btn` (`1rem/1.25`), `code, pre`, `h2`, `h4`, `.lead` (`1.25rem/1.5`), `.stats dd` (`1.5rem`), `.proof-label` and `.cover-tag` (`.875rem`; the tag's `1.3` becomes `var(--line-height-heading)`), `.proof-answer` (`1.5`), and the h2 counter (`400 1rem/1` → regular, md, heading). (R-ui-polish-2, R-ui-polish-20)
28. **Tokens**: radii `999px` → `var(--radius-full)`, `6px` → `var(--radius-sm)`, `10px` and `12px` → `var(--radius-md)`, `4px` → `var(--radius-sm)`. (R-ui-polish-20)
29. **Tokens**: border widths `1px` → `var(--border-width-hairline)`, and `2px` and `3px` (`.qbar-tabs a`, `.proof-answer`) → `var(--border-width-thick)`. (R-ui-polish-20)
30. **Tokens**: `.btn` `transition: … .2s var(--ease)` is now `var(--duration-base) var(--ease-standard)`. The existing reduced-motion block still turns it off. (R-ui-polish-9, R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Body text | `--fg` (#1d1d1b) on `--bg` (#f9f9f8), 16.03:1 | unchanged, 16.03:1 |
| Code, answer, facts | `--fg` (#1d1d1b) on `--surface2` (#f2f2f0), 15.06:1 | unchanged, 15.06:1 |
| Muted text (meta, notes, labels) | `--muted` (#62625e) on `--surface2` (#f2f2f0), 5.47:1; on `--bg`, 5.81:1; on `--surface`, 6.13:1 | unchanged |
| Faint text (section numbers) | `--faint` (#6a6a66) on `--surface2` (#f2f2f0), 4.85:1; on `--bg`, 5.16:1 | unchanged |
| Primary button | `--bg` (#f9f9f8) on `--fg` (#1d1d1b), 16.03:1 | `--color-primary-50` (#f2faf5) on `--color-brand` (#2f7a4b), 4.93:1 |
| Primary button, hover | `--bg` (#f9f9f8) on `--muted` (#62625e), 5.81:1 | `--color-primary-50` (#f2faf5) on `--color-primary-800` (#235636), 8.05:1 |
| Primary button, pressed | none | `--color-primary-50` (#f2faf5) on `--color-primary-900` (#183824), 12.13:1 |
| Focus ring | `--ok` (#2f7a4b) on `--bg` (#f9f9f8), 4.98:1 | `--color-brand` (#2f7a4b) on `--bg`, 4.98:1 |
| Dark: body text | `--fg` (#ecebe7) on `--surface2` (#222220), 13.36:1 | unchanged |
| Dark: muted and faint | #a3a29d on #222220, 6.23:1; #9a9994 on #222220, 5.58:1 | unchanged |
| Dark: focus ring | `--ok` (#6cc28f) on `--bg` (#141413), 8.56:1 | unchanged |

Ratios computed with the contrast script.

### Polished code
```css
/* Changed rules only. Every rule not shown here is unchanged. */
:root {
  --bg: #f9f9f8;
  --surface: #ffffff;
  --surface2: #f2f2f0;
  --line: #e8e8e5;
  --line-strong: #d4d4d0;
  --fg: #1d1d1b;
  --muted: #62625e;
  --faint: #6a6a66;
  --ok: var(--color-brand);
  --warn: #8f6200;
  --cover-bg: var(--surface2);
  --cover-accent: var(--line-strong);
  color-scheme: light;
}

:root {
  --sans: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Khmer", sans-serif;
  --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --radius: var(--radius-lg);
  --gutter: var(--space-16);
  --target: var(--size-target-min);
  --ease: cubic-bezier(.2, .7, .2, 1);
  --iso-x: 26px;
  --iso-y: 15px;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans);
  overflow-wrap: anywhere;
  overflow-x: hidden;
}
h1, h2, h3, h4 { font-family: var(--sans); font-weight: var(--font-weight-strong); font-style: normal; }
code, pre { font-family: var(--mono); font-size: var(--font-size-md); }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: 0 var(--space-4); }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; }

.skip { position: absolute; left: -9999px; top: var(--space-8); min-height: var(--size-target-min); min-width: var(--size-target-min); align-items: center; }
.skip:focus { left: var(--gutter); display: inline-flex; background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10; }

.top {
  display: flex; flex-wrap: wrap; gap: var(--space-4) var(--space-12); align-items: center; justify-content: space-between;
  padding: var(--space-8) var(--gutter); border-bottom: var(--border-width-hairline) solid var(--line);
}
.brand { display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min); font-weight: var(--font-weight-strong); text-decoration: none; }
.brand:hover { text-decoration: underline; text-decoration-color: var(--fg); }
.tools { display: flex; flex-wrap: wrap; gap: var(--space-4) var(--space-8); align-items: center; }
.tools a, .toc a, .back a, .qbar-tabs a, .plate h3 a, .proof th a, .example-open, .agent-files a, .dl-all {
  display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min);
}
.tools a { color: var(--muted); padding: 0 var(--space-8); text-decoration: none; }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font: var(--font-weight-strong) var(--font-size-md)/var(--line-height-heading) var(--sans); color: var(--fg);
  background: var(--surface); border: var(--border-width-hairline) solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard);
}
.btn.primary { background: var(--color-brand); color: var(--color-primary-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }
.btn.primary:active { background: var(--color-primary-900); border-color: var(--color-primary-900); }
.btn:disabled, .btn[aria-disabled="true"] { opacity: .5; cursor: not-allowed; }

main { padding: var(--space-24) 0 var(--space-64); counter-reset: sec; }

h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); letter-spacing: -.02em; margin: var(--space-8) 0 var(--space-16); }
h2 { font-size: var(--font-size-xl); line-height: var(--line-height-heading); margin: 0 0 var(--space-16); letter-spacing: -.01em; scroll-margin-top: 72px; }
h3 { font-size: var(--font-size-lg); line-height: var(--line-height-heading); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); line-height: var(--line-height-heading); margin: var(--space-12) 0 var(--space-4); }
.lead { font-size: var(--font-size-lg); line-height: var(--line-height-body); color: var(--fg); margin: 0 0 var(--space-12); max-width: var(--measure); }
.note { color: var(--muted); max-width: var(--measure); }

main > section[id] { padding-top: var(--space-48); scroll-margin-top: 72px; }
section.numbered > h2::before {
  counter-increment: sec; content: counter(sec);
  display: inline-block; min-width: 2.2rem; margin-right: var(--space-8);
  font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-heading) var(--mono); color: var(--faint);
}

.facts { list-style: none; display: flex; flex-wrap: wrap; gap: var(--space-8); padding: 0; margin: 0 0 var(--space-24); }
.facts li { background: var(--surface2); border-radius: var(--radius-full); padding: var(--space-4) var(--space-16); color: var(--fg); }
.hero-actions { margin: 0 0 var(--space-8); }

.real-result { padding-top: var(--space-24); }
.real-result h2 { font-size: var(--font-size-lg); margin-bottom: var(--space-12); }
.real-result .proof-ask { margin: var(--space-12) 0; }
@media (min-width: 900px) {
  main > section.real-result { max-width: none; display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 0 var(--space-32); align-items: start; grid-template-rows: auto auto 1fr; }
  .real-result h2 { grid-column: 1 / -1; }
  .real-result .cover-lg { grid-column: 1; grid-row: 2 / span 2; }
  .real-result .proof-ask, .real-result p:last-child { grid-column: 2; }
  .real-result .proof-ask { margin-top: 0; }
}

.toc a, .qbar-tabs a { gap: var(--space-8); color: var(--muted); text-decoration: none; }

.cover { border-radius: var(--radius-md); overflow: hidden; border: var(--border-width-hairline) solid var(--line); color: var(--fg); line-height: 0; position: relative; background: var(--surface); }

.live { margin: 0 0 var(--space-12); }

.acc { border-top: var(--border-width-hairline) solid var(--line); margin: 0; }
.acc:last-of-type { border-bottom: var(--border-width-hairline) solid var(--line); }
.acc > summary {
  display: flex; align-items: center; min-height: var(--size-target-min); cursor: pointer; font-weight: var(--font-weight-strong); list-style: none;
}
.acc > summary:hover { text-decoration: underline; text-decoration-color: var(--line-strong); text-underline-offset: 3px; }
.acc > summary:hover::before { color: var(--fg); }
.acc > summary::before { content: "+"; font-family: var(--mono); width: var(--space-24); color: var(--muted); flex: none; }
.acc > :not(summary) { margin-left: var(--space-24); }

.codebox {
  display: flex; gap: var(--space-8); align-items: center; min-width: 0;
  background: var(--surface); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md);
  padding: var(--space-8) var(--space-8) var(--space-8) var(--space-16);
}
.codebox pre { flex: 1; min-width: 0; padding: var(--space-4) 0; white-space: pre-wrap; word-break: break-word; }
.install-block { padding-bottom: var(--space-8); }
.limits { padding-left: var(--space-16); }
.limits li { margin: var(--space-8) 0; }

.qbar { position: sticky; top: 0; z-index: 5; background: var(--bg); border-bottom: var(--border-width-hairline) solid var(--line); margin: var(--space-16) 0 0; max-width: none; }
.qbar-tabs { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; gap: var(--space-4) var(--space-16); }
.qbar-tabs a { flex: none; border-bottom: var(--border-width-thick) solid transparent; }
.steps, .outputs { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.rule-list li { margin: var(--space-8) 0; }
.stats, .kv { display: grid; gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { background: var(--surface); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); min-width: 0; }
dd { margin: var(--space-4) 0 0; font-weight: var(--font-weight-strong); }
.stats dd { font-size: var(--font-size-xl); font-family: var(--mono); }
.files li { padding: var(--space-8) 0; border-bottom: var(--border-width-hairline) solid var(--line); }

.meter { margin: var(--space-4) 0; }
.meter-bar { height: 4px; border-radius: var(--radius-sm); background: var(--line); overflow: hidden; }
.meter-text { margin: var(--space-8) 0 0; color: var(--muted); }

.foot { border-top: var(--border-width-hairline) solid var(--line); padding: var(--space-24) var(--gutter); color: var(--muted); }

.cover-tag { position: absolute; left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-sm); line-height: var(--line-height-heading); padding: var(--space-4) var(--space-12); border-radius: var(--radius-full); background: var(--surface); border: var(--border-width-hairline) solid var(--line); color: var(--muted); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: var(--radius-full); background: var(--fg); margin-right: var(--space-8); vertical-align: middle; }
.proof-figure, figure.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius); background: var(--surface); }
.proof-ask { margin: 0 0 var(--space-12); color: var(--muted); }
.proof-label { font-size: var(--font-size-sm); letter-spacing: .06em; text-transform: uppercase; margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: var(--border-width-thick) solid var(--line-strong); background: var(--surface2); white-space: pre-wrap; overflow-wrap: anywhere; line-height: var(--line-height-body); max-height: 26rem; overflow: auto; }
.banner { margin: 0 0 var(--space-8); }
.banner img { display: block; width: 100%; height: auto; border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); }
.meta a { display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min); }
.meta a + a { margin-left: var(--space-12); }

@media (max-width: 480px) {
  main { padding-top: var(--space-8); }
  .codebox { flex-direction: column; align-items: stretch; padding: var(--space-12); }
  .hero-actions .btn { width: 100%; }
}
```

### Not changed
- All visible text, word for word. No HTML changed; only site.css rules.
- Brand hue kept: `--ok` / `--color-brand` #2f7a4b (dark #6cc28f), `--warn` #8f6200 / #e0b45c, and every neutral in the light and dark colour blocks.
- Font families `--sans` (Inter) and `--mono` (JetBrains Mono). The token font families do not include Inter.
- Existing `prefers-reduced-motion` block. It already turns off every transition, including the one in fix 30.
- Rules this page does not use (`.hero`, `.toc`, `.plate`, `.grid`, `.finder`, `.rolechip`, `.chip`, `.recipe`, `.tokens-*`, `.example`, `.layers`, `table.proof`).
- Token file: not edited.

### Open questions
- The page only links `site.css`. Until it also links `tokens.css` and `tokens.supplement.css` before `site.css`, every `var(--space-*)`, `var(--font-size-*)`, `var(--color-brand)` and the other token names will not resolve. I did not add the links (rule 12).
- The token file has no role colour tokens (surface, text, muted, border, focus, action) and no dark colour values. So `--bg`, `--surface`, `--surface2`, `--line`, `--line-strong`, `--fg`, `--muted`, `--faint` and `--warn`, plus the whole dark block, stay as plain hex. Add role tokens to the token file, or confirm these stay.
- `--font-weight-strong` is 600, but the Google Fonts link loads Inter at 400 and 500 only. Add 600 to that link, or the browser will draw a substitute weight.
- `h1–h4` and `.btn` are shared rules, so the 600 weight also reaches pages this pass did not cover. Those pages still have `font-weight: 500` in rules such as `.rolechip[aria-pressed]`, `.find-label`, `.cmd-label` and `.proof thead th`, which would give them three weights. Run this polish on the pages that use those rules.
- `--ease` (`cubic-bezier(.2, .7, .2, 1)`) has no matching token and is no longer used on this page. Confirm whether to remove it.