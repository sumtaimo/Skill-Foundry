<!-- skill: ui-polish | input: skill-a11y-audit | turns: 11 | cost_usd: 0.641 | permission_denials: 0 | is_error: False -->

## UI polish: a11y-audit skill page

17 fixes across 8 areas. Text and brand hue kept. Tokens from tokens.css and tokens.supplement.css.

### Fixes
1. **Spacing**: Off-scale values moved to the token scale. A tie goes to the larger value. (R-ui-polish-1, R-ui-polish-20)
   - Header `padding: 14px` is now `var(--space-16)`.
   - `.btn` `padding: 9px 14px` is now `var(--space-8) var(--space-16)`, and its `gap: 6px` is now `var(--space-8)`.
   - `main` `padding: 40px` is now `var(--space-48)`.
   - h3 `margin-top: 20px` is now `var(--space-24)`, and `.proof` `margin-bottom: 20px` is now `var(--space-24)`.
   - `padding: 14px` on `.proof` is now `var(--space-16)`.
   - `10px` margins and padding are now `var(--space-12)`.
   - `6px` is now `var(--space-8)`.
   - `2px` is now `var(--space-4)`.
   - `.outputs` `1.2em` is now `var(--space-16)`, and `.steps` `1.5em` is now `var(--space-24)`.
   - `code` `padding: .1em .35em` is now `0 var(--space-4)`.
2. **Typography**: Off-scale sizes moved to the token scale. The token file has no 18 px, so 18.4 px goes to 20 px. (R-ui-polish-2, R-ui-polish-20)
   - `.9rem`, `.85rem` and `.875rem` are now `var(--font-size-sm)`.
   - `.8rem`, `.75rem` and `.72rem` are now `var(--font-size-xs)`.
   - `.95rem` and `1.1rem` are now `var(--font-size-md)`.
   - `1.15rem` is now `var(--font-size-lg)`.
   - `1.4rem` is now `var(--font-size-xl)`.
   - The h1 `clamp(1.9rem, 5vw, 2.8rem)` is now `clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl))`.
   - `code, pre` `.875em` is now `var(--font-size-sm)`.
3. **Typography**: Line-heights moved onto the scale. (R-ui-polish-3, R-ui-polish-20)
   - Body `1.6` is now `var(--line-height-body)`.
   - h1 `1.12` is now `var(--line-height-display)`.
   - h2 to h4 had `1.6` inherited. They now get `var(--line-height-heading)`.
   - `.takeaway` `1.45`, `.proof-answer` `1.5` and the `.btn` and `.cover-tag` `1.2` are now `var(--line-height-body)`.
4. **Typography**: The page used 400 and 500 only. The token weights are 400 and 600, and 500 sits exactly between them, so it moves up to 600. (R-ui-polish-8, R-ui-polish-20)
   - Headings, `.btn`, `.brand`, `dd`, `.takeaway strong` and `.qbar` tabs now use `var(--font-weight-strong)`.
   - The body weight of 400 is now `var(--font-weight-regular)`.
5. **Typography**: Text width capped. Paragraphs and list items inside `main` were up to 680 px (about 75 to 80 characters). They now use `max-width: var(--measure)` (65ch). (R-ui-polish-3, R-ui-polish-20)
6. **Contrast**: `--faint` text fails on both themes. It was used for the footer text and the list numbers (`.steps li::marker`). The text colour is now `var(--muted)`. This keeps the hue and leaves the `--faint` definition alone. Light goes from 2.62:1 to 4.79:1 and dark from 3.94:1 to 7.21:1. (R-ui-polish-4)
7. **Hierarchy**: The page had two filled primary buttons, "Copy install command" and "Download". "Download a11y-audit 1.0.0" is now secondary: `class="btn primary"` becomes `class="btn"`. The install copy stays primary because the page is about installing. (R-ui-polish-5)
8. **Hierarchy**: The primary fill was near-black `--fg`. It now uses the token file's brand green.
   - The file has no `--color-action-*` tokens, so the fill is `--color-brand` with `--color-neutral-50` text.
   - Hover is `--color-primary-800`.
   - The pair is 4.92:1, and the hover pair is 8.03:1. Both are static, so they hold in dark mode. (R-ui-polish-21)
9. **Hierarchy**: After fix 2 the lead line (`.takeaway`) is 20 px, the same as h2. h2 is now `var(--font-size-xl)` (24 px, from 20 px) so each section heading stays larger than its lead line. (R-ui-polish-2)
10. **States**: The `:focus-visible` rule is now `outline: var(--border-width-focus) solid var(--ok)`, with offset 2 px (was 3 px). The rule also set `border-radius: 4px`, which squared the pill buttons when focused. That line is removed. (R-ui-polish-6, R-ui-polish-20)
11. **States**: `.tools a` and `.qbar-tabs a` had no hover style. They now turn `var(--fg)` on hover. (R-ui-polish-6)
12. **States**: `.btn` had no disabled style. It now gets `opacity: 0.5; cursor: not-allowed`. (R-ui-polish-6)
13. **Layout**: Header links, the "All skills" link, section tabs, the `checksums.json` and "Download SVG" links, and every `.btn` get `min-height` and `min-width` of `var(--size-target-min)`. The tab links were about 47 px tall but had no floor. The header nav links and the `.meta` links were about 25 px tall. (R-ui-polish-7, R-ui-polish-20)
14. **Motion**: `.btn` transitions of `.2s` now use `var(--duration-base)`. The existing reduced-motion block already turns them off, so it stays as it is. (R-ui-polish-9, R-ui-polish-20)
15. **Tokens**: On-scale spacing values (4, 8, 12, 16, 24, 32, 48, 64 px) are now `--space-*`. Examples are `gap: 8px` and `padding: 12px`. (R-ui-polish-20)
16. **Tokens**: Radii moved to the radius tokens. `999px` is now `var(--radius-full)`, and `12px` and `10px` are now `var(--radius-md)`. `6px` and `4px` are now `var(--radius-sm)`. The card radius `var(--radius)` is kept (see Open questions). (R-ui-polish-20)
17. **Tokens**: Border widths moved to tokens. `1px` is now `var(--border-width-hairline)`, and `2px` and `3px` are now `var(--border-width-thick)`. (R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Footer text and list numbers, light | `--faint` (#9c9c97) on `--bg` (#f9f9f8), 2.62:1, fails | `--muted` (#6f6f6b) on `--bg` (#f9f9f8), 4.79:1 |
| Footer text and list numbers, dark | `--faint` (#75746f) on `--bg` (#141413), 3.94:1, fails | `--muted` (#a3a29d) on `--bg` (#141413), 7.21:1 |
| Primary button text | `--bg` (#f9f9f8) on `--fg` (#1d1d1b), 16.03:1 | `--color-neutral-50` (#f4f9f6) on `--color-brand` (#2f7a4b), 4.92:1 |
| Primary button text, hover | `--bg` (#f9f9f8) on `--muted` (#6f6f6b), 4.79:1 | `--color-neutral-50` (#f4f9f6) on `--color-primary-800` (#235636), 8.03:1 |

Ratios computed with the contrast script.

### Polished code
Changed rules only, in source order. Every other rule in `site.css` stays as it is. Selectors are the page's own.

```css
body { font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans); }
h1, h2, h3, h4 { font-family: var(--sans); font-weight: var(--font-weight-strong); font-style: normal; line-height: var(--line-height-heading); }
code, pre { font-family: var(--mono); font-size: var(--font-size-sm); }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: 0 var(--space-4); }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; }

.skip:focus { left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10; }

.top {
  display: flex; flex-wrap: wrap; gap: var(--space-12); align-items: center; justify-content: space-between;
  padding: var(--space-16) var(--gutter); border-bottom: var(--border-width-hairline) solid var(--line);
}
.brand { font-weight: var(--font-weight-strong); text-decoration: none; font-size: var(--font-size-md); }
.tools { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.tools a { color: var(--muted); font-size: var(--font-size-sm); }
.tools a:hover, .qbar-tabs a:hover { color: var(--fg); }

/* 44 px targets for every link */
.brand, .tools a, .back a, .qbar-tabs a, .meta a, .skip:focus {
  display: inline-flex; align-items: center;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
}

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font: var(--font-weight-strong) var(--font-size-sm)/var(--line-height-body) var(--sans); color: var(--fg);
  background: transparent; border: var(--border-width-hairline) solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);
}
.btn:hover { background: var(--surface2); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.primary { background: var(--color-brand); color: var(--color-neutral-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }

main { padding: var(--space-48) 0 var(--space-64); }
main p, main li { max-width: var(--measure); }

h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); letter-spacing: -.02em; margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-xl); margin: var(--space-16) 0 var(--space-12); letter-spacing: -.01em; scroll-margin-top: 80px; }
h3 { font-size: var(--font-size-md); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); margin: var(--space-12) 0 var(--space-4); }
.meta { color: var(--muted); font-size: var(--font-size-sm); }
.meta a + a { margin-left: var(--space-12); }
.ver, .plate-index { font-family: var(--mono); font-size: var(--font-size-xs); }

.cover { border-radius: var(--radius-md); overflow: hidden; border: var(--border-width-hairline) solid var(--line); color: var(--fg); line-height: 0; }
.cover-lg { margin-bottom: var(--space-24); border-radius: var(--radius); }

.tags { list-style: none; padding: 0; margin: var(--space-8) 0 0; display: flex; flex-wrap: wrap; gap: var(--space-8); }
.tags li { font-size: var(--font-size-xs); color: var(--muted); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }

.meter { margin: var(--space-4) 0; }
.meter-bar { height: 4px; border-radius: var(--radius-sm); background: var(--line); overflow: hidden; }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); color: var(--muted); }

.qbar { position: sticky; top: 0; z-index: 5; background: var(--bg); border-bottom: var(--border-width-hairline) solid var(--line); margin: 0 0 var(--space-24); }
.qbar-tabs { display: flex; gap: var(--space-4); overflow-x: auto; scrollbar-width: none; }
.qbar-tabs a { flex: none; padding: var(--space-12); font-size: var(--font-size-sm); color: var(--muted); text-decoration: none; border-bottom: var(--border-width-thick) solid transparent; }
.qbar-tabs a[aria-current=true] { color: var(--fg); border-bottom-color: var(--ok); }
.qbar-progress { height: 2px; width: 0; background: var(--ok); margin-bottom: calc(var(--border-width-hairline) * -1); }

main > section[id] { padding-top: var(--space-24); scroll-margin-top: 64px; }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }
.takeaway strong { font-weight: var(--font-weight-strong); }

.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.steps li::marker { font-family: var(--mono); color: var(--muted); }
.outputs { padding-left: var(--space-16); }

.codebox { display: flex; gap: var(--space-8); align-items: flex-start; min-width: 0; background: var(--surface); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
.codebox pre { flex: 1; min-width: 0; padding: var(--space-4) 0; }

.stats, .kv { display: grid; gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { background: var(--surface); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); min-width: 0; }
dt { color: var(--muted); font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: var(--font-weight-strong); }
.stats dd { font-size: var(--font-size-xl); font-family: var(--mono); }
.sha { font-size: var(--font-size-xs); word-break: break-all; }
.files li { padding: var(--space-8) 0; border-bottom: var(--border-width-hairline) solid var(--line); }
.get-cover { margin-bottom: var(--space-16); }

.foot { border-top: var(--border-width-hairline) solid var(--line); padding: var(--space-24) var(--gutter); color: var(--muted); font-size: var(--font-size-sm); }

.roles { margin: 0; color: var(--muted); font-size: var(--font-size-sm); display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.role { padding: var(--space-4) var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); color: var(--fg); }
.live { margin: 0; font-size: var(--font-size-sm); }
.head-actions { margin: var(--space-16) 0 0; }

.cover-tag { position: absolute; left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: var(--line-height-body); padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); background: var(--surface); border: var(--border-width-hairline) solid var(--line); color: var(--muted); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--fg); margin-right: var(--space-8); vertical-align: middle; }

.proof { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius); background: var(--surface); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); color: var(--muted); }
.proof-label { font-size: var(--font-size-xs); letter-spacing: .06em; text-transform: uppercase; margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: var(--border-width-thick) solid var(--line-strong); background: var(--surface2); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--font-size-sm); line-height: var(--line-height-body); max-height: 28rem; overflow: auto; }

.banner img { display: block; width: 100%; height: auto; border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); }
```

```html
<!-- Download section: one primary action per view, so this button becomes secondary -->
<p><a class="btn" href="../../downloads/a11y-audit-1.0.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;a11y-audit&quot;,&quot;version&quot;:&quot;1.0.0&quot;,&quot;size&quot;:&quot;34 KB&quot;}">Download a11y-audit 1.0.0 (.zip, 34 KB)</a></p>
```

### Not changed
- All visible text, word for word. No element was added or removed.
- Brand hue kept: `--color-brand` (#2f7a4b), the same green as the site's `--ok`. The near-black primary fill is now that token (fix 8).
- Token file: not edited.
- Every other text pair passes 4.5:1 in light and dark. The lowest is `--muted` on `--surface2`, 4.50:1.
- The reduced-motion block, the Google Fonts `<link>` lines and the colour variables `--fg`, `--muted`, `--bg`, `--surface`, `--surface2`, `--line`, `--line-strong`, `--ok` and `--warn`, with their dark values.

### Open questions
- **The page does not load the tokens.** `site.css` doesn't define `--space-*`, `--font-size-*` and the other token names the fixes use. The page links only `site.css`, and I can't add a link. Load `tokens.css` and `tokens.supplement.css` before `site.css`, or the new `var()` values will not resolve.
- **The token file has no colour role tokens** (text, surface, border, focus, action). The site's own `--fg`, `--muted` and the rest stay. They carry the dark theme, and the token file has no dark colour values. The focus ring stays `var(--ok)` for the same reason. Add role tokens to the token file, then run this pass again.
- **The brand colour of the primary button changes from near-black to green.** Confirm that is intended.
- **Values with no matching token stay as they are:** `--radius` (14px), `--ease`, `--sans` and `--mono`, `scroll-margin-top: 80px` and `64px`, the meter bar `height: 4px`, the progress bar `height: 2px`, the status dot `width: 6px`, and `max-height: 28rem`. The token `--font-family-sans` has no Inter, so it was not used.
- **There is no 48 px size token.** The h1 maximum went from 44.8 px to 36 px (`--font-size-3xl`).
- **The Google Fonts link loads Inter 400 and 500 only.** Weight 600 is served from the 500 file until the font link is updated. I can't change it here.
- **`--faint` still fails** at 2.62:1 (light) and 3.94:1 (dark). It is still used by `.plate-index` and `.find::placeholder` on other pages. `--faint` is not in the token file, so it is not edited here.
- **Only rules this page uses were polished.** `site.css` is shared. The landing-only rules (`.hero`, `.plate`, `.chip`, `.rolechip`, `.recipe`) need their own pass.
