<!-- skill: ui-polish | input: skill-design-system | turns: 13 | cost_usd: 0.691 | permission_denials: 0 | is_error: False -->

## UI polish: design-system skill page

13 fixes across spacing, typography, contrast, hierarchy, states, layout and tokens. Text and brand hue kept. Tokens from tokens.css.

### Fixes
1. **Spacing**: off-scale margin, padding and gap values (14, 9, 10, 7, 6, 3, 2, 20, 40 px and similar) are snapped to the token scale. Examples: `.top` `14px` is now `var(--space-16)`, `.btn` `9px 14px` is now `var(--space-8) var(--space-16)`, `main` `40px` is now `var(--space-48)`, `h3` `20px` is now `var(--space-24)`. Ties go to the larger step. Every on-scale spacing value is written as its `--space-*` token. (R-ui-polish-1, R-ui-polish-20)
2. **Typography**: fractional sizes (`.72rem` to `1.4rem`, about 11.5 to 22.4 px) are now token sizes. `.72`, `.75`, `.8` rem become `--font-size-xs`, and `.85`, `.875`, `.9` rem become `--font-size-sm`. The `.takeaway` (`1.15rem`) becomes `--font-size-lg`, and `.stats dd` (`1.4rem`) becomes `--font-size-xl`. The body `font: 400 16px/1.6` becomes `var(--font-weight-regular) var(--font-size-md)/var(--line-height-body)`. The token scale has no 18 px step. (R-ui-polish-2, R-ui-polish-20)
3. **Typography**: line-height. Body goes from `1.6` to `var(--line-height-body)` (1.5). h2 to h4 had no line-height and inherited 1.6, so they now get `var(--line-height-heading)` (1.25). h1 goes from `1.12` to `var(--line-height-display)` (1.2). `.takeaway` and `.proof-answer` use `--line-height-body`. (R-ui-polish-3, R-ui-polish-20)
4. **Typography**: the heading ladder had ties. h2 (20) matched the 18.4 px takeaway above it, and h3 (16) matched h4 (15.2) and the body. Now h1 is 30–36 px, h2 is 24, the takeaway is 20, h3 is 20 and h4 is 16. The h1 clamp is now `clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl))`, because the token scale stops at 36 px. (R-ui-polish-2, R-ui-polish-20)
5. **Typography**: paragraph width. Paragraphs and lists were capped at 680px, which is wider than 65ch. Now `max-width: var(--measure)` on `main p`, `.steps`, `.outputs` and `.changelog`. The code boxes and the proof figure keep the 680px column. (R-ui-polish-3, R-ui-polish-20)
6. **Contrast**: `--faint` fails 4.5:1. It colours `.foot`, `.plate-index` and the `.steps` markers. Light goes from `#9c9c97` to `#73736e`, and dark from `#75746f` to `#85847e`. Same hue, lightness only. (R-ui-polish-4, R-ui-polish-11)
7. **Hierarchy**: the page had two filled primary buttons, "Copy install command" at the top and the Download link. Download is now a default `.btn`, so "Copy install command" is the one primary. (R-ui-polish-5)
8. **Tokens**: the primary fill was near-black, which is not the project brand. It is now `--color-primary-700` with `--color-primary-50` text. Hover is `--color-primary-800`. tokens.css has no `--color-action-*` tokens, so these are the brand scale. The raw colour was replaced by the project's token. (R-ui-polish-21, R-ui-polish-20)
9. **States**: nav links and the "What it does / What you type / …" tabs only changed their underline colour on hover. They now go to `var(--fg)`. (R-ui-polish-6)
10. **States**: the focus ring is now `var(--border-width-focus) solid var(--ok)` with a 2px offset (was 3px). On the tabs the offset is `-2px`, because their `overflow-x: auto` container clipped the ring. (R-ui-polish-6, R-ui-polish-20)
11. **States**: `.btn` had no disabled style. Added `opacity: 0.5; cursor: not-allowed`. (R-ui-polish-6)
12. **Layout**: targets were about 37px (`.btn`) and about 22px (header links, back link, `.meta` links, brand). They now have `min-height` and `min-width: var(--size-target-min)`, laid out with `inline-flex`. The skip link gets the same when focused. (R-ui-polish-7, R-ui-polish-20)
13. **Tokens**: remaining matches, one swap per kind of value.
    - Radii: `999px` is now `--radius-full`, `10px` is `--radius-md`, and `6px` is `--radius-sm`.
    - Transitions: `.2s var(--ease)` is now `var(--duration-base) var(--ease-standard)`.
    - Brand: light `--ok: #2f7a4b` is now `var(--color-brand)`, the same value. (R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Faint text on page, light | #9c9c97 on #f9f9f8, 2.62:1, fails | #73736e on #f9f9f8, 4.52:1 |
| Faint text on card, light | #9c9c97 on #ffffff, 2.76:1, fails | #73736e on #ffffff, 4.77:1 |
| Faint text on page, dark | #75746f on #141413, 3.94:1, fails | #85847e on #141413, 4.91:1 |
| Faint text on card, dark | #75746f on #1b1b1a, 3.68:1, fails | #85847e on #1b1b1a, 4.60:1 |
| Primary button | #f9f9f8 on #1d1d1b, 16.03:1 | `--color-primary-50` (#f2faf5) on `--color-primary-700` (#2f7a4b), 4.93:1 |
| Primary button, hover | #f9f9f8 on #6f6f6b, 4.79:1 | `--color-primary-50` (#f2faf5) on `--color-primary-800` (#235636), 8.05:1 |

Ratios computed with the contrast script.

### Polished code
You asked for changed rules only, so this is not the full page. Each rule replaces the rule with the same selector in `site.css`. The colour lines edit the values inside the existing token blocks. I checked every `var(--…)` name against tokens.css, tokens.supplement.css and site.css, and none is missing. The full block is saved at `/tmp/claude-0/-tmp-claude-0--home-user-Skill-Foundry-349ad422-624c-5f35-8ca6-0680314406bf-scratchpad-skillcopy-ui-polish/8742cfb4-22c2-4eb4-a636-730b98cf2d67/scratchpad/changed-rules.css`.

```css
/* Colour blocks: only these values change */
:root { --faint: #73736e; --ok: var(--color-brand); }
[data-theme=dark] { --faint: #85847e; }
@media (prefers-color-scheme: dark) { :root:not([data-theme=light]) { --faint: #85847e; } }

body { font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans); }
h1, h2, h3, h4 { font-family: var(--sans); font-weight: 500; font-style: normal; line-height: var(--line-height-heading); }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: .1em .35em; }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; border-radius: 4px; }

.skip { position: absolute; left: -9999px; top: var(--space-8); }
.skip:focus { left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10; display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min); }

.top { display: flex; flex-wrap: wrap; gap: var(--space-12); align-items: center; justify-content: space-between; padding: var(--space-16) var(--gutter); border-bottom: 1px solid var(--line); }
.brand { font-weight: 500; text-decoration: none; font-size: var(--font-size-md); }
.brand, .tools a, .back a, .meta a, .qbar-tabs a { display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min); }
.tools { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.tools a { color: var(--muted); font-size: var(--font-size-sm); }
.tools a:hover, .qbar-tabs a:hover { color: var(--fg); }

.btn {
  display: inline-flex; align-items: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font: 500 var(--font-size-sm)/1.2 var(--sans); color: var(--fg);
  background: var(--surface); border: 1px solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard);
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.primary { background: var(--color-primary-700); color: var(--color-primary-50); border-color: var(--color-primary-700); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }

main { padding: var(--space-48) 0 var(--space-64); }
main p, .steps, .outputs, .changelog { max-width: var(--measure); }

h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); letter-spacing: -.02em; margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-xl); margin: var(--space-16) 0 var(--space-12); letter-spacing: -.01em; scroll-margin-top: 80px; }
h3 { font-size: var(--font-size-lg); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); margin: var(--space-12) 0 var(--space-4); }
.meta { color: var(--muted); font-size: var(--font-size-sm); }
.meta a + a { margin-left: var(--space-12); }
.ver, .plate-index { font-family: var(--mono); font-size: var(--font-size-xs); }

.cover { border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--line); color: var(--fg); line-height: 0; }
.cover-lg { margin-bottom: var(--space-24); border-radius: var(--radius); }
.tags { list-style: none; padding: 0; margin: var(--space-8) 0 0; display: flex; flex-wrap: wrap; gap: var(--space-8); }
.tags li { font-size: var(--font-size-xs); color: var(--muted); border: 1px solid var(--line); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }

.meter { margin: var(--space-4) 0; }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); color: var(--muted); }

.qbar { position: sticky; top: 0; z-index: 5; background: var(--bg); border-bottom: 1px solid var(--line); margin: 0 0 var(--space-24); }
.qbar-tabs { display: flex; gap: var(--space-4); overflow-x: auto; scrollbar-width: none; }
.qbar-tabs a { flex: none; padding: var(--space-12); font-size: var(--font-size-sm); color: var(--muted); text-decoration: none; border-bottom: 2px solid transparent; }
.qbar-tabs a:focus-visible { outline-offset: -2px; }

main > section[id] { padding-top: var(--space-24); scroll-margin-top: 64px; }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }
.steps li { margin: var(--space-8) 0; }

.codebox { display: flex; gap: var(--space-8); align-items: flex-start; min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: var(--space-12); }
.codebox pre { flex: 1; min-width: 0; padding: var(--space-4) 0; }

.stats, .kv { display: grid; gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: var(--space-12); min-width: 0; }
dt { color: var(--muted); font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: 500; }
.stats dd { font-size: var(--font-size-xl); font-family: var(--mono); }
.sha { font-size: var(--font-size-xs); word-break: break-all; }
.files li { padding: var(--space-8) 0; border-bottom: 1px solid var(--line); }
.get-cover { margin-bottom: var(--space-16); }
.foot { border-top: 1px solid var(--line); padding: var(--space-24) var(--gutter); color: var(--faint); font-size: var(--font-size-sm); }

.head-actions { margin: var(--space-16) 0 0; }
.roles { margin: 0; color: var(--muted); font-size: var(--font-size-sm); display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.role { padding: var(--space-4) var(--space-8); border: 1px solid var(--line); border-radius: var(--radius-full); color: var(--fg); }
.live { margin: 0; font-size: var(--font-size-sm); }

@media (max-width: 480px) { main { padding-top: var(--space-24); } .codebox { flex-direction: column; } }

.cover-tag { position: absolute; left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: 1.2; padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); background: var(--surface); border: 1px solid var(--line); color: var(--muted); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--fg); margin-right: var(--space-8); vertical-align: middle; }
.tokens-proof { margin: 0 0 var(--space-24); }
.tokens-figure { max-width: 560px; border: 1px solid var(--line); border-radius: 8px; padding: var(--space-8); background: var(--surface); }
.tokens-proof figcaption { margin-top: var(--space-8); font-size: var(--font-size-sm); color: var(--muted); overflow-wrap: anywhere; }
.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); color: var(--muted); }
.proof-label { font-size: var(--font-size-xs); letter-spacing: .06em; text-transform: uppercase; margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: 3px solid var(--line-strong); background: var(--surface2); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--font-size-sm); line-height: var(--line-height-body); max-height: 28rem; overflow: auto; }
.banner { margin: 0 0 var(--space-8); }
```

Changed HTML, in `#download` (fix 7). Only the class changes:

```html
<p><a class="btn" href="../../downloads/design-system-1.0.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;design-system&quot;,&quot;version&quot;:&quot;1.0.0&quot;,&quot;size&quot;:&quot;38 KB&quot;}">Download design-system 1.0.0 (.zip, 38 KB)</a></p>
```

### Not changed
- All visible text, word for word. No element added or removed.
- Brand hue kept: #2f7a4b (`--color-brand`), the warm greys of the page, and `--warn` (#8f6200 light, #e0b45c dark).
- Token file: not edited.
- The `prefers-reduced-motion` block already turns off every transition and animation. The token durations also go to 0ms.
- Border widths and the 12px, 8px and 4px radii.
- Rules for pages other than this one (hero, plate, finder, recipe).

### Open questions
- The page loads only site.css. tokens.css and tokens.supplement.css must be loaded before it, or every `var(--space-*)`, `--font-size-*`, `--radius-*` and `--color-primary-*` above is undefined. I did not add the `<link>`.
- tokens.css has no surface, text, border or action roles. The site colours `--bg`, `--fg`, `--muted`, `--faint`, `--warn`, `--line*` and all dark values have no matching token and stay plain values. The new `--faint` values are plain too.
- The page uses weight 500, but the token file only has 400 and 600. Inter is loaded at 400 and 500 only, so 600 would be synthesised bold. Weight 500 therefore stays plain. Add a 500 token or load Inter 600?
- The radii 12px (`.codebox`, `.stats`), 8px (`.tokens-figure`), 4px (focus ring, meter) and the site's `--radius` 14px have no matching token.
- `--sans` and `--mono` keep Inter and JetBrains Mono. The token font stacks are system fonts and would drop the fonts the page already loads.
- Fix 7 keeps "Copy install command" as the primary. Confirm that Download should not be.
- The fixes to `.btn`, the headings and the shared rules apply to every page that uses site.css, so check them on the landing page.
