<!-- skill: ui-polish | input: skill-figure-craft | turns: 11 | cost_usd: 0.613 | permission_denials: 0 | is_error: False -->

## UI polish: figure-craft skill page

12 fixes across Contrast, Hierarchy, Typography, Layout, States and Tokens. Text and brand hue kept. Tokens from tokens.css and tokens.supplement.css.

Only the changed rules and snippets are below, not the whole page. Each CSS block replaces the rule with the same selector in `site.css`. Only rules this page uses were touched.

### Fixes
1. **Contrast**: `--faint` (footer, list numbers) was `#9c9c97` on `#f9f9f8`, 2.62:1. It is now `#73736e`, 4.52:1. In dark mode it was `#75746f` on `#141413`, 3.94:1; it is now `#85847e`, 4.91:1. The hue is kept. (R-ui-polish-4)
2. **Hierarchy**: the page had two primary buttons, "Copy install command" and "Download figure-craft". The Download link is now secondary, so there is one primary action. (R-ui-polish-5)
3. **Tokens**: the primary fill was near-black (`--fg`). It now uses `--color-brand` with `--color-primary-50` text, 4.93:1. Hover is `--color-primary-800` and pressed is `--color-primary-900`. The token file has no `action` tokens, so I used its brand and primary tokens. (R-ui-polish-21)
4. **Spacing**: off-scale values moved to the nearest token, with ties going to the larger one. The values were 14, 9, 6, 10, 20, 40, 2, 3 and 1.2em, and the 14px default paragraph margins. Every spacing value is now a `--space-*` token. (R-ui-polish-1, R-ui-polish-20)
5. **Typography**: font sizes moved to the token scale. The values were .75 to 1.4rem, `code` at .875em and the 1.15rem takeaway, and they are now `--font-size-*`. The h1 clamp now tops out at 36px instead of 44.8px, because the token file has no 48px size. The long recorded answer is now 16px. (R-ui-polish-2, R-ui-polish-20)
6. **Typography**: body line-height was 1.6 and is now 1.5. Headings had no line-height and inherited 1.6; they now take 1.25, and the h1 takes 1.2 (it was 1.12). The takeaway paragraph was 1.45 and is now 1.5. (R-ui-polish-3, R-ui-polish-20)
7. **Typography**: paragraphs, list items and the recorded answer are capped at `max-width: var(--measure)` (65ch). The column was 680px, roughly 75 characters. (R-ui-polish-3)
8. **Typography**: weight 500 becomes `--font-weight-strong`. The page now uses two weights, 400 and 600, both as tokens. (R-ui-polish-8, R-ui-polish-20)
9. **Layout**: every link and button now has `min-height` and `min-width` of `--size-target-min`. The buttons were about 37px tall, and the nav, back, checksums and SVG-download links were about 23px. (R-ui-polish-7)
10. **States**: the focus-ring offset was 3px and is now 2px. The qbar tab links sit in an `overflow-x: auto` strip that clipped the ring, so they get an inset ring. Hover is added to the brand link, the nav links and the qbar tabs, which had none. A disabled style is added for buttons. (R-ui-polish-6)
11. **Motion**: the `.btn` transition `.2s` is now `var(--duration-base)`. The existing `prefers-reduced-motion` block is kept. (R-ui-polish-9, R-ui-polish-20)
12. **Tokens**: radii use `--radius-*` (999px becomes `--radius-full`, 12px becomes `--radius-md`). `1px` borders use `--border-width-hairline`, `2px` borders use `--border-width-thick`, and the focus width uses `--border-width-focus`. `--gutter` now points at `--space-16`. (R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| `--faint` on `--bg`, light | #9c9c97 on #f9f9f8, 2.62:1, fails | #73736e on #f9f9f8, 4.52:1 |
| `--faint` on `--surface`, light | #9c9c97 on #ffffff, 2.76:1, fails | #73736e on #ffffff, 4.77:1 |
| `--faint` on `--bg`, dark | #75746f on #141413, 3.94:1, fails | #85847e on #141413, 4.91:1 |
| `--faint` on `--surface`, dark | #75746f on #1b1b1a, 3.68:1, fails | #85847e on #1b1b1a, 4.60:1 |
| Primary button text | #1d1d1b-on-#f9f9f8 style (`--bg` on `--fg`), 16.03:1 | `--color-primary-50` (#f2faf5) on `--color-brand` (#2f7a4b), 4.93:1 |
| Primary button, hover | `--bg` on `--muted` | `--color-primary-50` (#f2faf5) on `--color-primary-800` (#235636), 8.05:1 |
| Primary button, pressed | none | `--color-primary-50` (#f2faf5) on `--color-primary-900` (#183824), 12.13:1 |

The other site pairs already pass and were not changed. In light mode, `--muted` on `--bg` is 4.79:1, on `--surface` 5.05:1 and on `--surface2` 4.50:1. In dark mode, `--muted` is 7.21:1, 6.74:1 and 6.23:1 on the same three. `--warn` on `--surface` is 5.36:1 in light and 8.91:1 in dark.

Ratios computed with the contrast script.

### Polished code

HTML: one changed snippet in the Download section.
```html
<p><a class="btn" href="../../downloads/figure-craft-1.0.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;figure-craft&quot;,&quot;version&quot;:&quot;1.0.0&quot;,&quot;size&quot;:&quot;330 KB&quot;}">Download figure-craft 1.0.0 (.zip, 330 KB)</a></p>
```

CSS: changed declarations in the existing token blocks (fix 1, fix 12).
```css
:root { --gutter: var(--space-16); --faint: #73736e; }
[data-theme=dark] { --faint: #85847e; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme=light]) { --faint: #85847e; }
}
```

CSS: changed rules.
```css
body { font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans); }
h1, h2, h3, h4 { font-weight: var(--font-weight-strong); line-height: var(--line-height-heading); }
a { min-height: var(--size-target-min); min-width: var(--size-target-min); display: inline-flex; align-items: center; }
code, pre { font-size: var(--font-size-sm); }
code { padding: 0 var(--space-4); border-radius: var(--radius-sm); }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; border-radius: var(--radius-sm); }

.skip { top: var(--space-8); }
.skip:focus { left: var(--gutter); padding: var(--space-8) var(--space-12); }

.top { gap: var(--space-12); padding: var(--space-16) var(--gutter); border-bottom: var(--border-width-hairline) solid var(--line); }
.brand { font-weight: var(--font-weight-strong); font-size: var(--font-size-md); }
.brand:hover { text-decoration: underline; text-decoration-color: var(--fg); }
.tools { gap: var(--space-8); }
.tools a { font-size: var(--font-size-sm); }
.tools a:hover { color: var(--fg); }

.btn {
  display: inline-flex; align-items: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font: var(--font-weight-strong) var(--font-size-sm)/var(--line-height-body) var(--sans); color: var(--fg);
  background: var(--surface); border: var(--border-width-hairline) solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);
}
.btn:disabled, .btn[aria-disabled=true] { opacity: 0.5; cursor: not-allowed; }
.btn.primary { background: var(--color-brand); color: var(--color-primary-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }
.btn.primary:active { background: var(--color-primary-900); border-color: var(--color-primary-900); }

main { padding: var(--space-48) 0 var(--space-64); }
main p, main li { max-width: var(--measure); }
h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-lg); margin: var(--space-16) 0 var(--space-12); }
h3 { font-size: var(--font-size-md); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); margin: var(--space-12) 0 var(--space-4); }
.meta { font-size: var(--font-size-sm); margin: var(--space-16) 0; }
.meta a + a { margin-left: var(--space-12); }
.ver, .plate-index { font-size: var(--font-size-xs); }

.cover { border-radius: var(--radius-md); border: var(--border-width-hairline) solid var(--line); }
.cover-lg { margin-bottom: var(--space-24); }
.tags { gap: var(--space-8); margin: var(--space-8) 0 0; }
.tags li { font-size: var(--font-size-xs); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }
.meter-bar { border-radius: var(--radius-sm); }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); }

.qbar { border-bottom: var(--border-width-hairline) solid var(--line); margin: 0 0 var(--space-24); }
.qbar-tabs { gap: var(--space-4); }
.qbar-tabs a { padding: var(--space-12); font-size: var(--font-size-sm); border-bottom: var(--border-width-thick) solid transparent; }
.qbar-tabs a:hover { color: var(--fg); }
.qbar-tabs a:focus-visible { outline-offset: -2px; }
.qbar-progress { height: var(--border-width-thick); }

main > section[id] { padding-top: var(--space-24); }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }
.takeaway strong { font-weight: var(--font-weight-strong); }
.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.outputs { padding-left: var(--space-24); }

.codebox { gap: var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
.codebox pre { padding: var(--space-4) 0; }
.stats, .kv { gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
dt { font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: var(--font-weight-strong); }
.stats dd { font-size: var(--font-size-xl); }
.sha { font-size: var(--font-size-xs); }
.files li { padding: var(--space-8) 0; border-bottom: var(--border-width-hairline) solid var(--line); }
.example { border: var(--border-width-hairline) solid var(--line); }
.example-open { margin-top: var(--space-8); }
.run-facts { gap: var(--space-8); font-size: var(--font-size-sm); margin: var(--space-16) 0; }
.foot { border-top: var(--border-width-hairline) solid var(--line); padding: var(--space-24) var(--gutter); font-size: var(--font-size-sm); }

.roles { gap: var(--space-8); font-size: var(--font-size-sm); }
.role { padding: var(--space-4) var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); }
.live { font-size: var(--font-size-sm); }

.proof { font-size: var(--font-size-sm); }
.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); }
.proof-label { font-size: var(--font-size-xs); margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: var(--border-width-thick) solid var(--line-strong); font-size: var(--font-size-md); line-height: var(--line-height-body); max-width: var(--measure); }

.cover-tag { left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: var(--line-height-body); padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); border: var(--border-width-hairline) solid var(--line); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { width: var(--space-8); height: var(--space-8); border-radius: var(--radius-full); margin-right: var(--space-8); }
.banner { margin: 0 0 var(--space-8); }
.banner img { border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); }
```

### Not changed
- All visible text, word for word.
- No elements added or removed. The only HTML edit is the Download link's class.
- Brand hue kept: `--color-brand` (#2f7a4b), the same green as the site's `--ok`.
- Token files: not edited.
- The existing `prefers-reduced-motion` block and `--radius` (14px) and `--ease`.

### Open questions
- Which action is the primary one? I chose "Copy install command" because it comes first and fits the install flow. Swap the `primary` class if the Download link should lead.
- The token file has no role tokens (`--color-text-*`, `--color-surface-*`, `--color-border-focus`). The site's own `--fg`, `--muted`, `--surface`, `--line`, `--ok`, `--warn` and `--bg` stay as plain values, and the focus ring stays `--ok`.
- `--sans` and `--mono` stay. The token font families lack Inter and the Noto Sans Khmer fallback the language switch needs.
- The font link loads Inter at 400 and 500 only. Weight 600 will render as 500 in Inter until a 600 face is loaded, and I did not add one.
- `margin-bottom: -1px` on `.qbar-progress` and `scroll-margin-top` values stay plain, since they are an overlap trick and an anchor offset, not spacing.
- `--radius: 14px` has no matching token, and the supplement keeps it.
