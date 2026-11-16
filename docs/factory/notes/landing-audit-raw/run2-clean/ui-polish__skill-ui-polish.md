<!-- skill: ui-polish | input: skill-ui-polish | turns: 12 | cost_usd: 0.676 | permission_denials: 0 | is_error: False -->

## UI polish: ui-polish skill page

19 fixes across spacing, typography, contrast, hierarchy, states, layout, motion and tokens. Text and brand hue kept. Tokens from tokens.css and tokens.supplement.css.

I polished the selectors this page uses, plus the shared token blocks. Nothing was run in a browser; the contrast ratios below come from the script.

### Fixes
1. **Spacing**: Off-scale spacing now sits on the token scale. (R-ui-polish-1, R-ui-polish-20)
   - `.top` padding `14px` is now `var(--space-16)`.
   - `.btn` padding `9px 14px` is now `var(--space-8) var(--space-16)`, and its gap `6px` is now `var(--space-8)`.
   - `main` padding `40px` is now `var(--space-48)`.
   - h3 margin-top `20px` is now `var(--space-24)`.
   - `.tags` gap `6px` is now `var(--space-8)`, and `.tags li` padding `2px 10px` is now `var(--space-4) var(--space-12)`.
   - `.qbar-tabs a` padding `12px 10px` is now `var(--space-12)`.
   - `dd` margin-top `2px` is now `var(--space-4)`.
   - `.steps li` margin `6px` is now `var(--space-8)`.
   - `.meter-text` margin-top `6px` is now `var(--space-8)`.
   - `.proof` padding `14px` is now `var(--space-16)`, and its margin `20px` is now `var(--space-24)`.
   - `.proof-ask` and `.proof-answer` margin-bottom `10px` is now `var(--space-12)`.
   - `.proof-label` margin-right `6px` is now `var(--space-8)`.
   - `.cover-tag` padding `3px 8px` is now `var(--space-4) var(--space-8)`.
   - List indents `1.5em` and `1.2em` are now `var(--space-24)` and `var(--space-16)`.
   - `code` padding `.1em .35em` is now `0 var(--space-4)`.
2. **Spacing**: Every other raw spacing value is now its token, with the number unchanged (`8px` to `var(--space-8)`, `12px` to `var(--space-12)`, `16px` to `var(--space-16)`, `24px` to `var(--space-24)`, `4px` to `var(--space-4)`). (R-ui-polish-20)
3. **Typography**: Every font size is now a token. (R-ui-polish-2, R-ui-polish-20)
   - Body `16px` is now `--font-size-md`, and `code` and `pre` `.875em` is now `--font-size-sm`.
   - h1 `clamp(1.9rem, 5vw, 2.8rem)` is now `clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl))`.
   - h2 `1.25rem` is now `--font-size-lg`, and h3 `1rem` and h4 `.95rem` are now `--font-size-md`.
   - `.takeaway` `1.15rem` is now `--font-size-lg`, and `.stats dd` `1.4rem` is now `--font-size-xl`.
   - `.tools a`, `.meta`, `.btn`, `.qbar-tabs a`, `.roles`, `.live`, `.foot`, `.proof` and `.proof-ask` `.85–.9rem` are now `--font-size-sm`.
   - `.ver`, `dt`, `.sha`, `.meter-text`, `.cover-tag`, `.tags li` and `.proof-label` `.72–.8rem` are now `--font-size-xs`.
   - There is no 18px token, so `.takeaway` goes to 20px.
4. **Typography**: Line-heights are now on the scale. (R-ui-polish-3, R-ui-polish-20)
   - Body `1.6` is now `var(--line-height-body)`.
   - h1 `1.12` is now `var(--line-height-display)`.
   - h2 to h4 had none, so they inherited `1.6`. They now use `var(--line-height-heading)`.
   - `.takeaway` `1.45` is now body.
   - `.btn` `1.2` is now body.
   - `.proof-answer` `1.5` is now `var(--line-height-body)`.
5. **Typography**: Paragraphs and list items had `max-width: 680px`. A new rule caps them at `var(--measure)` (65ch). (R-ui-polish-3, R-ui-polish-20)
6. **Typography**: Weight `500` becomes `var(--font-weight-strong)` (600) and `400` becomes `var(--font-weight-regular)`. The page now uses two weights, 400 and 600. (R-ui-polish-8, R-ui-polish-20)
7. **Contrast**: `--faint` is `#9c9c97` on `#f9f9f8`, 2.62:1. It colours the footer and the step numbers. It is now `#6e6e69`, 4.87:1, same hue. In dark mode `#75746f` on `#141413` was 3.94:1. It is now `#8a8983`, 5.26:1. (R-ui-polish-4, R-ui-polish-11)
8. **Hierarchy**: The page had two primary buttons, "Copy install command" and the Download link. The Download link is now secondary (`class="btn"`), so "Copy install command" is the one primary action. (R-ui-polish-5)
9. **Hierarchy**: The primary button was filled with `--fg` and its hover with grey `--muted`. It now uses the token file's brand fill, because the file has no `--color-action-primary-*` tokens. Text is `--color-primary-50` on `--color-brand`, 4.93:1. Hover is `--color-primary-800` and pressed is `--color-primary-900`. (R-ui-polish-21, R-ui-polish-20)
10. **Hierarchy**: Secondary buttons had a `--surface` fill. They are now `transparent` with an outline, and hover still uses `--surface2`. (R-ui-polish-5)
11. **States**: The focus ring was `2px solid` with `outline-offset: 3px`. It is now `var(--border-width-focus) solid var(--ok)` with offset `2px`. (R-ui-polish-6, R-ui-polish-20)
12. **States**: `.tools a` and `.qbar-tabs a` had no hover style. They now go from `--muted` to `--fg` on hover. (R-ui-polish-6)
13. **States**: `.btn` had no disabled style. It now gets `opacity: .5; cursor: not-allowed`, and the hover rules skip disabled buttons. (R-ui-polish-6)
14. **Layout**: Buttons had no 44px minimum, and the footer, nav and tab links were about 21–45px tall. `a` and `.btn` now set `min-height` and `min-width` to `var(--size-target-min)`. Links become `inline-flex` with centred content. (R-ui-polish-7, R-ui-polish-20)
15. **Motion**: The `.btn` transition `.2s var(--ease)` is now `var(--duration-base) var(--ease-standard)`. The existing `prefers-reduced-motion: reduce` block already turns it off, so I left that block alone. (R-ui-polish-9, R-ui-polish-20)
16. **Tokens**: Radii are now tokens. (R-ui-polish-20)
    - `4px` and `6px` are now `--radius-sm`.
    - `8px`, `10px` and `12px` are now `--radius-md`.
    - `999px` and `50%` are now `--radius-full`.
17. **Tokens**: Every `1px` border is now `var(--border-width-hairline)`, and the tab underline `2px` is now `var(--border-width-thick)`. (R-ui-polish-20)
18. **Tokens**: `--ok: #2f7a4b` is now `var(--color-brand)`, the same value from the token file. (R-ui-polish-20)
19. **Tokens**: The weights, line-heights and measure in fixes 4 to 6 are also tokens, as are the size tokens in fix 14.

### Contrast
| Text | Before | After |
|------|--------|-------|
| Footer and step numbers, light | `--faint` (#9c9c97) on `--bg` (#f9f9f8), 2.62:1 | #6e6e69 on #f9f9f8, 4.87:1 |
| Footer and step numbers, dark | #75746f on #141413, 3.94:1 | #8a8983 on #141413, 5.26:1 |
| Primary button | `--bg` (#f9f9f8) on `--fg` (#1d1d1b), 16.03:1 | `--color-primary-50` (#f2faf5) on `--color-brand` (#2f7a4b), 4.93:1 |
| Primary button hover | `--bg` on `--muted` (#6f6f6b), 4.79:1 | `--color-primary-50` on `--color-primary-800` (#235636), 8.05:1 |
| Muted text on code and proof panels | `--muted` (#6f6f6b) on `--surface2` (#f2f2f0), 4.50:1 | Unchanged, passes. |

Ratios computed with the contrast script.

### Polished code
Only the changed CSS rules and HTML snippets are shown. Every other rule stays as it was.

```css
/* token blocks: only the changed lines */
:root { --ok: var(--color-brand); --faint: #6e6e69; }
[data-theme=dark] { --faint: #8a8983; }
@media (prefers-color-scheme: dark) { :root:not([data-theme=light]) { --faint: #8a8983; } }

body { margin: 0; background: var(--bg); color: var(--fg); font-family: var(--sans); font-size: var(--font-size-md); font-weight: var(--font-weight-regular); line-height: var(--line-height-body); overflow-wrap: anywhere; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: var(--sans); font-weight: var(--font-weight-strong); font-style: normal; line-height: var(--line-height-heading); }
a { color: var(--fg); text-decoration-color: var(--line-strong); text-underline-offset: 3px; display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min); }
code, pre { font-family: var(--mono); font-size: var(--font-size-sm); }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: 0 var(--space-4); }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; border-radius: var(--radius-sm); }

.skip { position: absolute; left: -9999px; top: var(--space-8); }
.skip:focus { left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10; }

.top { display: flex; flex-wrap: wrap; gap: var(--space-12); align-items: center; justify-content: space-between; padding: var(--space-16) var(--gutter); border-bottom: var(--border-width-hairline) solid var(--line); }
.brand { font-weight: var(--font-weight-strong); text-decoration: none; font-size: var(--font-size-md); }
.tools { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.tools a { color: var(--muted); font-size: var(--font-size-sm); }
.tools a:hover, .qbar-tabs a:hover { color: var(--fg); }

.btn {
  display: inline-flex; align-items: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font-family: var(--sans); font-size: var(--font-size-sm); font-weight: var(--font-weight-strong); line-height: var(--line-height-body);
  color: var(--fg); background: transparent; border: var(--border-width-hairline) solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard);
}
.btn:hover:not(:disabled) { background: var(--surface2); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.primary { background: var(--color-brand); color: var(--color-primary-50); border-color: var(--color-brand); }
.btn.primary:hover:not(:disabled) { background: var(--color-primary-800); border-color: var(--color-primary-800); }
.btn.primary:active:not(:disabled) { background: var(--color-primary-900); border-color: var(--color-primary-900); }

main { padding: var(--space-48) 0 var(--space-64); }
main p, main li { max-width: var(--measure); }

h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); letter-spacing: -.02em; margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-lg); margin: var(--space-16) 0 var(--space-12); letter-spacing: -.01em; scroll-margin-top: var(--space-64); }
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

main > section[id] { padding-top: var(--space-24); scroll-margin-top: var(--space-64); }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }
.takeaway strong { font-weight: var(--font-weight-strong); }
.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
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
.foot { border-top: var(--border-width-hairline) solid var(--line); padding: var(--space-24) var(--gutter); color: var(--faint); font-size: var(--font-size-sm); }

.head-actions { margin: var(--space-16) 0 0; }
.roles { margin: 0; color: var(--muted); font-size: var(--font-size-sm); display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.role { padding: var(--space-4) var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); color: var(--fg); }
.live { margin: 0; font-size: var(--font-size-sm); }

.cover-tag { position: absolute; left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: var(--line-height-body); padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); background: var(--surface); border: var(--border-width-hairline) solid var(--line); color: var(--muted); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: var(--radius-full); background: var(--fg); margin-right: var(--space-8); vertical-align: middle; }

.proof { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius); background: var(--surface); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); color: var(--muted); }
.proof-label { font-size: var(--font-size-xs); letter-spacing: .06em; text-transform: uppercase; margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: 3px solid var(--line-strong); background: var(--surface2); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--font-size-sm); line-height: var(--line-height-body); max-height: 28rem; overflow: auto; }

.banner { margin: 0 0 var(--space-8); }
.banner img { display: block; width: 100%; height: auto; border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); }
```

```html
<!-- Download section: one primary action per page, so this link drops "primary" -->
<p><a class="btn" href="../../downloads/ui-polish-1.0.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;ui-polish&quot;,&quot;version&quot;:&quot;1.0.0&quot;,&quot;size&quot;:&quot;31 KB&quot;}">Download ui-polish 1.0.0 (.zip, 31 KB)</a></p>
```

### Not changed
- All visible text, word for word. No element was added or removed.
- Brand hue kept: `--color-brand` #2f7a4b. This is the same colour as the old `--ok`, and the dark-theme `--ok` #6cc28f is untouched.
- Token file: not edited.
- The existing `prefers-reduced-motion: reduce` block.
- Selectors this page doesn't use: hero, plate and grid, finder, recipe, example, tokens-figure and `.proof` table cells.

### Open questions
- The token file has no role tokens (`--color-text-*`, `--color-surface-*`, `--color-action-*`, `--color-border-focus`). The site's own `--bg`, `--fg`, `--muted`, `--line`, `--surface`, `--warn` and `#6cc28f` therefore stay plain values in the token blocks. Should the project add role tokens?
- `site.css` must be served after `tokens.css` and `tokens.supplement.css`. The page links only `site.css` and I added no link, so please confirm how the tokens reach it.
- `--radius` (14px) stays as the supplement says, but it sits between `--radius-md` and `--radius-lg`. The `--radius` rules (`.cover-lg`, `.proof`) therefore stay as they are.
- Values with no matching token stay plain: `border-left: 3px` on `.proof-answer`, the 4px meter bar height, the 6px proof dot, `.qbar-progress` height `2px` and margin `-1px`, the `.skip` offset `-9999px`, `max-height: 28rem`, `min-width: 150px`, `.wrap` `max-width: 1120px`, and `main > section` `max-width: 680px`. The `--sans` stack (Inter and Noto Sans Khmer) also stays, because `--font-family-sans` has neither font.
- The h1 now tops out at 36px instead of about 45px, because the type scale has no step between 36 and 48. Confirm that is acceptable.
- The cap at `--measure` (65ch) makes paragraphs and list items narrower than the old 680px.
