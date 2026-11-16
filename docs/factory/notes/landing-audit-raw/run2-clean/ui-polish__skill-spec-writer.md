<!-- skill: ui-polish | input: skill-spec-writer | turns: 12 | cost_usd: 0.652 | permission_denials: 0 | is_error: False -->

## UI polish: spec-writer skill page

16 fixes across hierarchy, contrast, typography, spacing, layout, states and tokens. Text and brand hue kept. Tokens from tokens.css and tokens.supplement.css.

### Fixes
1. **Hierarchy**: the view has two filled primary actions, "Copy install command" and "Download spec-writer…". The download link is now `class="btn"`, which is the secondary style. (R-ui-polish-5)
2. **Hierarchy**: the primary button was `--fg` on `--bg`, a near-black fill. Now `--color-brand` with `--color-neutral-50` text, hover `--color-primary-800`, pressed `--color-primary-900`. The token file has no `action` tokens, so these are its brand and primary tokens, and the ratios are in the table. (R-ui-polish-21, R-ui-polish-20)
3. **Contrast**: `--faint` is 2.62:1 on the page background in light and 3.94:1 in dark. It sets the footer text and the step numbers. Both now use `--muted`, 4.79:1 light and 7.21:1 dark. (R-ui-polish-4)
4. **Typography**: body line-height is `1.6`. Now `var(--line-height-body)`, with `var(--font-size-md)` and `var(--font-weight-regular)` in the same shorthand. (R-ui-polish-3, R-ui-polish-20)
5. **Typography**: h1 line-height `1.12` is now `var(--line-height-display)`. h2, h3 and h4 had none and inherited 1.5; they now use `var(--line-height-heading)`. `.takeaway` goes from `1.45` to `var(--line-height-body)`. (R-ui-polish-3)
6. **Typography**: the section column is `680px`, about 85 characters per line. Paragraphs in `main` now get `max-width: var(--measure)`. (R-ui-polish-3)
7. **Typography**: off-scale sizes now snap to the nearest token:
   - h1 `clamp(1.9rem…2.8rem)` becomes `clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl))`.
   - h2 `1.25rem` becomes `--font-size-lg`.
   - h4 `.95rem` becomes `--font-size-md`.
   - `.takeaway` `1.15rem` becomes `--font-size-lg`.
   - `.stats dd` `1.4rem` becomes `--font-size-xl`.
   - `.tools a`, `.btn`, `.meta`, `.roles`, `.live`, `.qbar-tabs a`, `.foot`, `.proof` and `.proof-ask` go from `.85rem`, `.875rem` or `.9rem` to `--font-size-sm`.
   - `.ver`, `.tags li`, `dt`, `.sha`, `.meter-text` and `.proof-label` go from `.72rem`, `.75rem` or `.8rem` to `--font-size-xs`.
   - `.cover-tag` goes from `.72rem` (11.5 px) to `--font-size-xs`, so nothing is under 12 px. (R-ui-polish-2, R-ui-polish-20)
8. **Typography**: the agent answer is the main content of the page and was 13.6 px. `.proof-answer` is now `var(--font-size-md)` with `var(--line-height-body)`. (R-ui-polish-2)
9. **Spacing**: off-scale values now use the nearest space token, rounding up on a tie:
   - `14px`→`--space-16`, `10px`→`--space-12`, `9px`→`--space-8`, `6px`→`--space-8`, `3px`→`--space-4`, `2px` (padding)→`--space-4`
   - `40px`→`--space-48`, `20px`→`--space-24`, `14px` (proof padding)→`--space-16`
   - Values already on the scale are written as tokens too. (R-ui-polish-1, R-ui-polish-20)
10. **Layout**: the brand link, nav links, back link, checksums link, tab links and buttons were about 22–36 px tall. They now have `min-height` and `min-width` of `var(--size-target-min)`. (R-ui-polish-7)
11. **States**: the focus outline offset is `3px`. Now `2px`, with width `var(--border-width-focus)` and radius `var(--radius-sm)`. (R-ui-polish-6)
12. **States**: nav links and tab links had no hover. Both now go to `--fg` on hover. (R-ui-polish-6)
13. **States**: link underlines were `--line-strong`, about 1.5:1, so links were hard to spot. They are now `--muted`, 4.79:1, and go to `--fg` on hover. (R-ui-polish-6)
14. **States**: `.btn` had no disabled style. Now `opacity: .5; cursor: not-allowed`. (R-ui-polish-6)
15. **Tokens**: radii now use tokens:
    - `999px`→`--radius-full`
    - `6px` and `4px`→`--radius-sm`
    - `10px`, `12px` and `8px`→`--radius-md`
    - `--radius` (14px) is kept. (R-ui-polish-20)
16. **Tokens**: `.2s` is now `var(--duration-base)` on `.btn`. `--ease` is kept, because its curve differs from `--ease-standard`. The existing `prefers-reduced-motion` block already covers this. (R-ui-polish-20, R-ui-polish-9)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Footer text and step numbers, light | `--faint` (#9c9c97) on `--bg` (#f9f9f8), 2.62:1 | `--muted` (#6f6f6b) on `--bg` (#f9f9f8), 4.79:1 |
| Footer text and step numbers, dark | `--faint` (#75746f) on `--bg` (#141413), 3.94:1 | `--muted` (#a3a29d) on `--bg` (#141413), 7.21:1 |
| Primary button | `--bg` (#f9f9f8) on `--fg` (#1d1d1b), 16.03:1 | `--color-neutral-50` (#f4f9f6) on `--color-brand` (#2f7a4b), 4.92:1 |
| Primary button hover | `--bg` (#f9f9f8) on `--muted` (#6f6f6b), 4.79:1 | `--color-neutral-50` (#f4f9f6) on `--color-primary-800` (#235636), 8.03:1 |
| Primary button pressed (new) | none | `--color-neutral-50` (#f4f9f6) on `--color-primary-900` (#183824), 12.10:1 |
| Focus ring, light | n/a | `--ok` (#2f7a4b) on `--bg` (#f9f9f8), 4.98:1 |
| Focus ring, dark | n/a | `--ok` (#6cc28f) on `--bg` (#141413), 8.56:1 |

Ratios computed with the contrast script.

### Polished code
The CSS rules below replace the rules with the same selectors in `site.css`. Every other rule is unchanged.

```css
body { margin: 0; background: var(--bg); color: var(--fg); font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans); overflow-wrap: anywhere; overflow-x: hidden; }
a { color: var(--fg); text-decoration-color: var(--muted); text-underline-offset: 3px; }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: .1em .35em; }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; border-radius: var(--radius-sm); }

.skip:focus { left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10; }
.top { display: flex; flex-wrap: wrap; gap: var(--space-12); align-items: center; justify-content: space-between; padding: var(--space-16) var(--gutter); border-bottom: 1px solid var(--line); }
.brand { font-weight: 500; text-decoration: none; font-size: var(--font-size-md); }
.tools { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.tools a { color: var(--muted); font-size: var(--font-size-sm); }
.tools a:hover, .qbar-tabs a:hover { color: var(--fg); }
.brand, .tools a, .back a, .meta a, .qbar-tabs a, .skip:focus {
  display: inline-flex; align-items: center;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
}

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font: 500 var(--font-size-sm)/var(--line-height-display) var(--sans); color: var(--fg);
  background: var(--surface); border: 1px solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);
}
.btn.primary { background: var(--color-brand); color: var(--color-neutral-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }
.btn.primary:active { background: var(--color-primary-900); border-color: var(--color-primary-900); }
.btn:disabled, .btn[aria-disabled="true"] { opacity: .5; cursor: not-allowed; }

main { padding: var(--space-48) 0 var(--space-64); }
main p { max-width: var(--measure); }

h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); letter-spacing: -.02em; margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-lg); line-height: var(--line-height-heading); margin: var(--space-16) 0 var(--space-12); letter-spacing: -.01em; scroll-margin-top: 80px; }
h3 { font-size: var(--font-size-md); line-height: var(--line-height-heading); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); line-height: var(--line-height-heading); margin: var(--space-12) 0 var(--space-4); }
.meta { color: var(--muted); font-size: var(--font-size-sm); }
.ver, .plate-index { font-family: var(--mono); font-size: var(--font-size-xs); }

.tags { list-style: none; padding: 0; margin: var(--space-8) 0 0; display: flex; flex-wrap: wrap; gap: var(--space-8); }
.tags li { font-size: var(--font-size-xs); color: var(--muted); border: 1px solid var(--line); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }
.roles { margin: 0; color: var(--muted); font-size: var(--font-size-sm); display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.role { padding: var(--space-4) var(--space-8); border: 1px solid var(--line); border-radius: var(--radius-full); color: var(--fg); }
.live { margin: 0; font-size: var(--font-size-sm); }
.head-actions { margin: var(--space-16) 0 0; }

.cover { border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--line); color: var(--fg); line-height: 0; }
.cover-lg { margin-bottom: var(--space-24); border-radius: var(--radius); }
.get-cover { margin-bottom: var(--space-16); }
.cover-tag { position: absolute; left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: 1.2; padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); background: var(--surface); border: 1px solid var(--line); color: var(--muted); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--fg); margin-right: var(--space-8); vertical-align: middle; }

.meter { margin: var(--space-4) 0; }
.meter-bar { height: 4px; border-radius: var(--radius-sm); background: var(--line); overflow: hidden; }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); color: var(--muted); }

.qbar { position: sticky; top: 0; z-index: 5; background: var(--bg); border-bottom: 1px solid var(--line); margin: 0 0 var(--space-24); }
.qbar-tabs { display: flex; gap: var(--space-4); overflow-x: auto; scrollbar-width: none; }
.qbar-tabs a { flex: none; padding: var(--space-12); font-size: var(--font-size-sm); color: var(--muted); text-decoration: none; border-bottom: 2px solid transparent; }
main > section[id] { padding-top: var(--space-24); scroll-margin-top: 64px; }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }

.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.steps li::marker { font-family: var(--mono); color: var(--muted); }
.outputs { padding-left: var(--space-16); }

.codebox { display: flex; gap: var(--space-8); align-items: flex-start; min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
.codebox pre { flex: 1; min-width: 0; padding: var(--space-4) 0; }

.stats, .kv { display: grid; gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); min-width: 0; }
dt { color: var(--muted); font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: 500; }
.stats dd { font-size: var(--font-size-xl); font-family: var(--mono); }
.sha { font-size: var(--font-size-xs); word-break: break-all; }
.files li { padding: var(--space-8) 0; border-bottom: 1px solid var(--line); }

.foot { border-top: 1px solid var(--line); padding: var(--space-24) var(--gutter); color: var(--muted); font-size: var(--font-size-sm); }

.proof { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); color: var(--muted); }
.proof-ask code { font-size: var(--font-size-sm); white-space: normal; overflow-wrap: anywhere; }
.proof-label { font-size: var(--font-size-xs); letter-spacing: .06em; text-transform: uppercase; margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: 3px solid var(--line-strong); background: var(--surface2); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--font-size-md); line-height: var(--line-height-body); max-height: 28rem; overflow: auto; }

.banner { margin: 0 0 var(--space-8); }
.banner img { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: var(--radius-md); }
```

Changed HTML, line 166. Only the class changes; the text and attributes are identical.

```html
<p><a class="btn" href="../../downloads/spec-writer-1.0.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;spec-writer&quot;,&quot;version&quot;:&quot;1.0.0&quot;,&quot;size&quot;:&quot;21 KB&quot;}">Download spec-writer 1.0.0 (.zip, 21 KB)</a></p>
```

### Not changed
- All visible text, word for word.
- Brand hue kept: #2f7a4b (`--color-brand`, and `--ok` in light).
- Token file: not edited.
- The existing `prefers-reduced-motion` block, which already switches off every transition and animation.

### Open questions
- `page.html` links only `../../assets/site.css`, so `tokens.css` and `tokens.supplement.css` are not loaded. The `var(--space-…)`, `var(--font-size-…)` and `var(--color-brand)` rules above need both files loaded before `site.css`. I added no link, to keep to R-ui-polish-12.
- The token file has no surface, text or border role tokens. Colours therefore stay on the site's own `--bg`, `--fg`, `--muted`, `--line` and `--ok`. Focus keeps `--ok`, because it has a lighter dark-theme value.
- Font weight 500 has no token, since the file has only 400 and 600. The page loads Inter at 400 and 500 only, so 600 could render as a faux bold. I left 500 as it is.
- Which action is primary? I chose "Copy install command", because it sits above the fold and `data-install-zip` ties it to the install flow. If "Download" should be primary, swap the `primary` class between the two.
- These values have no matching token and stay plain:
  - meter bar height `4px`
  - progress bar `2px`
  - tab underline `2px`
  - cover-tag dot `6px`
  - answer border `3px`
  - `scroll-margin-top` `64px` and `80px`
- `--sans` and `--mono` (Inter, JetBrains Mono) are kept instead of `--font-family-sans` and `--font-family-mono`, to keep the site's typeface. The page already loads Google Fonts, and I added nothing external.
