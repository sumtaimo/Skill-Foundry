<!-- skill: ui-polish | input: skill-copy-tight | turns: 11 | cost_usd: 0.664 | permission_denials: 0 | is_error: False -->

## UI polish: Copy Tight skill page

14 fixes across hierarchy, tokens, contrast, typography, spacing, layout and states. Text and brand hue kept. Tokens from tokens.css and tokens.supplement.css.

I ran the contrast script for every pair. The colour fix keeps the text-colour hex values from site.css. Only rules this page uses are polished. Classes the page doesn't use (`.hero`, `.plate`, `.chip`, `.rolechip`, `.find`, `.recipe`) are untouched.

### Fixes
1. **Hierarchy**: the page had two `.btn.primary` actions ("Copy install command" and the Download link). The Download link is now a secondary button. (R-ui-polish-5)
2. **Tokens**: the one primary now uses the file's brand tokens, because the file has no `--color-action-*` tokens. Before: `--fg` fill with `--bg` text, hover `--muted`. Now `--color-brand` fill with `--color-neutral-50` text, hover `--color-primary-800`, pressed `--color-primary-900`. Ratios are in the table. (R-ui-polish-21, R-ui-polish-20)
3. **Contrast**: `--faint` text fails, on the footer and the list-number markers. Both now use `--muted`, a lightness change within the same neutral. (R-ui-polish-4)
4. **Typography**: off-scale font sizes moved to the token scale. The table below gives each value. (R-ui-polish-2, R-ui-polish-20)

   | Element | Before | Now |
   |---|---|---|
   | `.tools a`, `.btn` | 14.4px, 14px | `--font-size-sm` |
   | h4 | 15.2px | `--font-size-md` |
   | `.ver`, dt, `.meter-text` | 12.8px | `--font-size-xs` |
   | `.cover-tag`, `.proof-label` | 11.5px | `--font-size-xs` |
   | `.roles`, `.live`, `.proof-answer`, `.foot` | 13.6px | `--font-size-sm` |
   | `.takeaway` | 18.4px | `--font-size-lg` |
   | `.stats dd` | 22.4px | `--font-size-xl` |
   | h1 clamp | 30.4–44.8px | `--font-size-2xl` to `--font-size-3xl` |
   | h2 | 20px | `--font-size-xl` |

   The h2 change is a judgment call. At 20px it would match the new `.takeaway` size and the heading would lose its rank.
5. **Typography**: line-heights moved to the tokens. Body 1.6 is now `--line-height-body` (1.5). `.takeaway` 1.45 and `.btn` 1.2 are now 1.5. h1 1.12 is now `--line-height-display` (1.2). h2 to h4 had none and now take `--line-height-heading` (1.25). (R-ui-polish-3, R-ui-polish-20)
6. **Spacing**: off-scale values moved to `--space-*`. (R-ui-polish-1, R-ui-polish-20)
   - 6px and 10px are now 8px or 12px.
   - 14px and 20px are now 16px or 24px.
   - 40px is now 48px.
   - 80px is now 64px.
   - `.takeaway` 4px is now `--space-4`.
   - `1.5em` and `1.2em` list indents are now `--space-24`. `.outputs` takes 24px rather than the nearest 16px, to match `.steps`.
7. **Layout**: the 680px section width is now `--measure` (65ch). (R-ui-polish-3)
8. **Layout**: targets under 44px now have `min-height` and `min-width` of `--size-target-min`. This covers `.btn` (it was about 37px tall), the brand link, the nav links, the "All skills" link, the "checksums.json" and "Download SVG" links, the qbar tabs and the skip link. (R-ui-polish-7)
9. **States**: `.btn` had no disabled style. Added `opacity: .5` and `cursor: not-allowed`. (R-ui-polish-6)
10. **States**: qbar tabs had no hover. Hover now turns the text to `--fg`. (R-ui-polish-6)
11. **States**: the focus ring is now `--border-width-focus` wide with a 2px offset (was 3px). On the qbar tabs the offset is -2px, because the scrolling strip clips an outside ring. (R-ui-polish-6, R-ui-polish-20)
12. **Tokens**: every `1px`, `2px` and `3px` border width is now `--border-width-hairline` or `--border-width-thick`. The meter's `-1px` overlap is `calc(var(--border-width-hairline) * -1)`. (R-ui-polish-20)
13. **Tokens**: radii moved to tokens. `999px` is now `--radius-full`. `10px` is now `--radius-md`. `12px` is now `--radius-md`. `6px` and the meter bar's `4px` are now `--radius-sm`. (R-ui-polish-20)
14. **Tokens**: `.2s` transitions are now `--duration-base`. The body shorthand uses `--font-weight-regular` and `--font-size-md`. (R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Footer, list markers (light) | `--faint` (#9c9c97) on `--bg` (#f9f9f8), 2.62:1, fails | `--muted` (#6f6f6b) on `--bg` (#f9f9f8), 4.79:1 |
| Footer, list markers (dark) | `--faint` (#75746f) on `--bg` (#141413), 3.94:1, fails | `--muted` (#a3a29d) on `--bg` (#141413), 7.21:1 |
| Primary button | `--bg` (#f9f9f8) on `--fg` (#1d1d1b), 16.03:1 | `--color-neutral-50` (#f4f9f6) on `--color-brand` (#2f7a4b), 4.92:1 |
| Primary button, hover | `--bg` (#f9f9f8) on `--muted` (#6f6f6b), 4.79:1 | `--color-neutral-50` (#f4f9f6) on `--color-primary-800` (#235636), 8.03:1 |
| `.proof-ask` code (unchanged) | `--muted` (#6f6f6b) on `--surface2` (#f2f2f0), 4.50:1 | same, passes at the limit |

Ratios computed with the contrast script.

### Polished code
Only the changed rules are shown, as you asked. Every other rule in site.css stays as it is.

```css
body { margin: 0; background: var(--bg); color: var(--fg);
  font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans);
  overflow-wrap: anywhere; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: var(--sans); font-weight: 500; font-style: normal; line-height: var(--line-height-heading); }
code, pre { font-family: var(--mono); font-size: var(--font-size-sm); }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: 0 var(--space-4); }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; border-radius: var(--radius-sm); }

.skip { position: absolute; left: -9999px; top: var(--space-8); }
.skip:focus { left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10;
  display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min); }

.top { display: flex; flex-wrap: wrap; gap: var(--space-12); align-items: center; justify-content: space-between;
  padding: var(--space-16) var(--gutter); border-bottom: var(--border-width-hairline) solid var(--line); }
.brand { font-weight: 500; text-decoration: none; font-size: var(--font-size-md); }
.brand, .tools a, .back a, .meta a { display: inline-flex; align-items: center;
  min-height: var(--size-target-min); min-width: var(--size-target-min); }
.tools { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.tools a { color: var(--muted); font-size: var(--font-size-sm); }

.btn {
  display: inline-flex; align-items: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font: 500 var(--font-size-sm)/var(--line-height-body) var(--sans); color: var(--fg);
  background: var(--surface); border: var(--border-width-hairline) solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);
}
.btn:disabled, .btn[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; }
.btn.primary { background: var(--color-brand); color: var(--color-neutral-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }
.btn.primary:active { background: var(--color-primary-900); border-color: var(--color-primary-900); }

main { padding: var(--space-48) 0 var(--space-64); }
main > section, .skill-head, .back { max-width: var(--measure); }
h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display);
  letter-spacing: -.02em; margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-xl); margin: var(--space-16) 0 var(--space-12); letter-spacing: -.01em; scroll-margin-top: var(--space-64); }
h3 { font-size: var(--font-size-md); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); margin: var(--space-12) 0 var(--space-4); }
.meta { color: var(--muted); font-size: var(--font-size-sm); }
.meta a + a { margin-left: var(--space-12); }
.ver, .plate-index { font-family: var(--mono); font-size: var(--font-size-xs); }

.tags { list-style: none; padding: 0; margin: var(--space-8) 0 0; display: flex; flex-wrap: wrap; gap: var(--space-8); }
.tags li { font-size: var(--font-size-xs); color: var(--muted); border: var(--border-width-hairline) solid var(--line);
  border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }
.roles { margin: 0; color: var(--muted); font-size: var(--font-size-sm); display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.role { padding: var(--space-4) var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); color: var(--fg); }
.live { margin: 0; font-size: var(--font-size-sm); }
.head-actions { margin: var(--space-16) 0 0; }

.cover { border-radius: var(--radius-md); overflow: hidden; border: var(--border-width-hairline) solid var(--line); color: var(--fg); line-height: 0; }
.cover-lg { margin-bottom: var(--space-24); border-radius: var(--radius); }
.cover-tag { position: absolute; left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: var(--line-height-body);
  padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); background: var(--surface);
  border: var(--border-width-hairline) solid var(--line); color: var(--muted); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { content: ""; display: inline-block; width: 6px; height: 6px;
  border-radius: 50%; background: var(--fg); margin-right: var(--space-8); vertical-align: middle; }

.meter { margin: var(--space-4) 0; }
.meter-bar { height: 4px; border-radius: var(--radius-sm); background: var(--line); overflow: hidden; }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); color: var(--muted); }

.qbar { position: sticky; top: 0; z-index: 5; background: var(--bg);
  border-bottom: var(--border-width-hairline) solid var(--line); margin: 0 0 var(--space-24); }
.qbar-tabs { display: flex; gap: var(--space-4); overflow-x: auto; scrollbar-width: none; }
.qbar-tabs a { flex: none; display: flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min);
  padding: var(--space-12); font-size: var(--font-size-sm); color: var(--muted); text-decoration: none;
  border-bottom: var(--border-width-thick) solid transparent; }
.qbar-tabs a:hover { color: var(--fg); }
.qbar-tabs a:focus-visible { outline-offset: -2px; } /* the strip scrolls and would clip an outside ring */
.qbar-progress { height: 2px; width: 0; background: var(--ok); margin-bottom: calc(var(--border-width-hairline) * -1); }

main > section[id] { padding-top: var(--space-24); scroll-margin-top: var(--space-64); }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }
.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.steps li::marker { font-family: var(--mono); color: var(--muted); }
.outputs { padding-left: var(--space-24); }

.codebox { display: flex; gap: var(--space-8); align-items: flex-start; min-width: 0; background: var(--surface);
  border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
.codebox pre { flex: 1; min-width: 0; padding: var(--space-4) 0; }
.stats, .kv { display: grid; gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { background: var(--surface); border: var(--border-width-hairline) solid var(--line);
  border-radius: var(--radius-md); padding: var(--space-12); min-width: 0; }
dt { color: var(--muted); font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: 500; }
.stats dd { font-size: var(--font-size-xl); font-family: var(--mono); }
.sha { font-size: var(--font-size-xs); word-break: break-all; }
.files li { padding: var(--space-8) 0; border-bottom: var(--border-width-hairline) solid var(--line); }

.foot { border-top: var(--border-width-hairline) solid var(--line); padding: var(--space-24) var(--gutter);
  color: var(--muted); font-size: var(--font-size-sm); }

.proof { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: var(--border-width-hairline) solid var(--line);
  border-radius: var(--radius); background: var(--surface); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); color: var(--muted); }
.proof-label { font-size: var(--font-size-xs); letter-spacing: .06em; text-transform: uppercase; margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: var(--border-width-thick) solid var(--line-strong);
  background: var(--surface2); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--font-size-sm);
  line-height: var(--line-height-body); max-height: 28rem; overflow: auto; }

@media (max-width: 480px) {
  main { padding-top: var(--space-24); }
}
```

```html
<p><a class="btn" href="../../downloads/copy-tight-0.2.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;copy-tight&quot;,&quot;version&quot;:&quot;0.2.0&quot;,&quot;size&quot;:&quot;12 KB&quot;}">Download copy-tight 0.2.0 (.zip, 12 KB)</a></p>
```

### Not changed
- All visible text, word for word.
- Brand hue kept: `--ok` #2f7a4b, which is the same value as `--color-brand`.
- Token file: not edited.
- The `prefers-reduced-motion: reduce` block already turns off every transition and animation, including the ones changed here.
- The Google Fonts links in the page `<head>` and the `<script>` element were already in the input and are untouched.

### Open questions
- **The page doesn't load the token files.** page.html links only `../../assets/site.css`. `tokens.css` and `tokens.supplement.css` must load before it, or every `var(--space-*)`, `--font-size-*` and `--color-brand` here resolves to nothing. I added no link (R-ui-polish-12), so add it by hand.
- **The token file has no role tokens.** It has no surface, text, muted, border or action tokens. Colours therefore stay on site.css's own variables (`--fg`, `--muted`, `--line` and so on), apart from the primary fill. Add role tokens to the file, then run this again.
- **Which action is primary?** I kept the header "Copy install command" and demoted the Download link, because it is first and above the fold. Say if Download should be the primary one.
- **The primary button is now green, not near-black.** This follows the brand-token rule. It changes how every `.btn.primary` looks on the site.
- **Weight 500 has no token.** The file has 400 and 600, and Inter is loaded in 400 and 500 only, so I left 500 as a plain value. Moving to 600 means loading that weight.
- **The font stacks `--sans` and `--mono` stay.** They use Inter and JetBrains Mono, while the tokens define system stacks.
- **`--radius` (14px), `--gutter` and `--ease` stay**, as the supplement says.
- **Some changes are site-wide.** The stylesheet is shared, so the changes to h1–h4, `.btn`, `.tags` and `.proof` also hit the index page. I did not polish the other classes there. `--faint` itself is untouched; `.plate-index` and `.find::placeholder` still use it at 2.62:1.
- **`--muted` on `--surface2` is 4.50:1, right at the limit.** Don't lighten `--muted`.
- **This skill does not edit tokens.** Change the token file with a design-token skill or by hand.
