<!-- skill: ui-polish | input: skill-test-planner | turns: 10 | cost_usd: 0.481 | permission_denials: 0 | is_error: False -->

## UI polish: test-planner skill page

11 fixes across contrast, hierarchy, states, layout, typography, spacing, motion and tokens. Text and brand hue kept. Tokens from tokens.css.

### Fixes
1. **Contrast**: `--faint` (#9c9c97) is used as text colour for the footer and the numbers on the "What it does" and "Install" lists. It is 2.62:1 on `--bg` in light theme and 3.94:1 in dark. Now `var(--muted)`, 4.79:1 light and 7.21:1 dark. (R-ui-polish-4)
2. **Hierarchy**: the page has two `.btn.primary` buttons, "Copy install command" and the Download link. Now only "Copy install command" is primary, and Download becomes a plain `.btn` (HTML change below). The primary uses the brand token, `background: var(--color-brand)` with `#ffffff` text. This replaces the near-black fill. `--color-brand` is the same #2f7a4b as `--ok`. The token file has no action tokens, so the brand token is used. (R-ui-polish-5, R-ui-polish-11, R-ui-polish-21)
3. **States**: `.tools a` and `.qbar-tabs a` had no hover. Now they go to `var(--fg)`. `.btn:disabled` is added with `opacity: 0.5; cursor: not-allowed`. Focus outline offset is `3px`, now `2px`. Inside `.qbar-tabs`, which has `overflow-x: auto`, the outline was clipped, so it is now drawn inside at `-2px`. (R-ui-polish-6)
4. **Layout**: header, back, tab and meta links are shorter than 44 px. Now `min-height: var(--size-target-min); min-width: var(--size-target-min)`. `.btn` gets the same. (R-ui-polish-7)
5. **Layout**: paragraphs run to 680 px, about 75ch. Now `max-width: var(--measure)`. (R-ui-polish-3)
6. **Typography**: off-scale sizes now sit on the token scale:
   - `.9rem` → `var(--font-size-sm)`, `.85rem` → `sm`, `.8rem` and `.72rem` → `var(--font-size-xs)`, `.95rem` → `var(--font-size-md)`.
   - `1.15rem` → `var(--font-size-lg)`. The file has no 18 px token, so 20 px is nearest.
   - `1.4rem` → `var(--font-size-xl)`.
   - The h1 clamp is now `clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl))`.
   (R-ui-polish-2, R-ui-polish-20)
7. **Typography**: body line-height 1.6 is now `var(--line-height-body)`, which is 1.5. The `.takeaway` lead was 1.45 and is now the same token. The h1 line-height 1.12 is now `var(--line-height-display)`, 1.2. h2 to h4 inherited 1.6 and are now `var(--line-height-heading)`. (R-ui-polish-3, R-ui-polish-20)
8. **Spacing**: off-scale values, with ties going to the larger step:
   - `.top` padding 14px → `var(--space-16)`.
   - `.btn` padding 9px 14px → 8 and 16.
   - `.tags` gap 6px → 8. The tag pill padding 2px 10px → 4 and 12.
   - `.roles` gap 6px → 8. `.role` padding 2px → 4.
   - `main` padding-top 40px → 48.
   - h3 margin-top 20px → 24.
   - `.steps li` margin 6px → 8. `.files li` padding 6px → 8.
   - `.qbar-tabs a` padding 10px → 12.
   - `dd` margin 2px → 4.
   - `.proof` padding 14px → 16 and margin-bottom 20px → 24. `.proof-ask` and `.proof-answer` margin 10px → 12.
   - `.meter-text` margin 6px → 8.
   - `.cover-tag` padding 3px → 4.
   - h2 `scroll-margin-top` 80px → 64.
   (R-ui-polish-1, R-ui-polish-20)
9. **Layout**: `.steps` indents 1.5em and `.outputs` 1.2em. Both are now `var(--space-24)`. (R-ui-polish-1)
10. **Motion**: `.btn` transition `.2s` is now `var(--duration-base)`, keeping the site's `--ease`. (R-ui-polish-20)
11. **Tokens**: every other raw value with an exact token match is swapped:
    - `6px` radius → `var(--radius-sm)`, `10px` → `var(--radius-md)`, `999px` → `var(--radius-full)`.
    - `14px` and `16px` font sizes → `var(--font-size-sm)` and `var(--font-size-md)`.
    - `2px` focus width → `var(--border-width-focus)`.
    - Plain `4/8/12/16/24/48/64px` gaps, paddings and margins → `var(--space-*)`, including those in the block at the end of the CSS.
    (R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Footer, light | `--faint` (#9c9c97) on `--bg` (#f9f9f8), 2.62:1 | `--muted` (#6f6f6b) on `--bg` (#f9f9f8), 4.79:1 |
| List numbers, light | `--faint` (#9c9c97) on `--bg` (#f9f9f8), 2.62:1 | `--muted` (#6f6f6b) on `--bg` (#f9f9f8), 4.79:1 |
| Footer and numbers, dark | `--faint` (#75746f) on `--bg` (#141413), 3.94:1 | `--muted` (#a3a29d) on `--bg` (#141413), 7.21:1 |
| Primary button | `--bg` (#f9f9f8) on `--fg` (#1d1d1b), 16.03:1 | #ffffff on `--color-brand` (#2f7a4b), 5.24:1 |
| Primary button, hover | `--bg` (#f9f9f8) on `--muted` (#6f6f6b), 4.79:1 | #ffffff on `--color-primary-800` (#235636), 8.55:1 |

Ratios computed with the contrast script.

### Polished code

HTML, one changed element in the Download section:
```html
<p><a class="btn" href="../../downloads/test-planner-1.0.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;test-planner&quot;,&quot;version&quot;:&quot;1.0.0&quot;,&quot;size&quot;:&quot;15 KB&quot;}">Download test-planner 1.0.0 (.zip, 15 KB)</a></p>
```

CSS, changed rules only. Each replaces the rule of the same selector in `site.css`. The new rules at the end are appended.
```css
body { font: 400 var(--font-size-md)/var(--line-height-body) var(--sans); overflow-wrap: anywhere; overflow-x: hidden; margin: 0; background: var(--bg); color: var(--fg); }
h1, h2, h3, h4 { font-family: var(--sans); font-weight: 500; font-style: normal; line-height: var(--line-height-heading); }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: .1em .35em; }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; border-radius: 4px; }
.skip:focus { left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10; }

.top { display: flex; flex-wrap: wrap; gap: var(--space-12); align-items: center; justify-content: space-between; padding: var(--space-16) var(--gutter); border-bottom: 1px solid var(--line); }
.brand { font-weight: 500; text-decoration: none; font-size: var(--font-size-md); }
.tools { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.tools a { color: var(--muted); font-size: var(--font-size-sm); }

.btn {
  display: inline-flex; align-items: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font: 500 var(--font-size-sm)/1.2 var(--sans); color: var(--fg);
  background: var(--surface); border: 1px solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.primary { background: var(--color-brand); color: #ffffff; border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }

main { padding: var(--space-48) 0 var(--space-64); }
main p { max-width: var(--measure); }

h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); letter-spacing: -.02em; margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-lg); margin: var(--space-16) 0 var(--space-12); letter-spacing: -.01em; scroll-margin-top: var(--space-64); }
h3 { font-size: var(--font-size-md); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); margin: var(--space-12) 0 var(--space-4); }
.meta { color: var(--muted); font-size: var(--font-size-sm); }
.meta a + a { margin-left: var(--space-12); }
.ver { font-family: var(--mono); font-size: var(--font-size-xs); }

.cover { border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--line); color: var(--fg); line-height: 0; }
.cover-lg { margin-bottom: var(--space-24); border-radius: var(--radius); }
.cover-tag { position: absolute; left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: 1.2; padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); background: var(--surface); border: 1px solid var(--line); color: var(--muted); }

.tags { list-style: none; padding: 0; margin: var(--space-8) 0 0; display: flex; flex-wrap: wrap; gap: var(--space-8); }
.tags li { font-size: var(--font-size-xs); color: var(--muted); border: 1px solid var(--line); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }
.roles { margin: 0; color: var(--muted); font-size: var(--font-size-sm); display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.role { padding: var(--space-4) var(--space-8); border: 1px solid var(--line); border-radius: var(--radius-full); color: var(--fg); }
.live { margin: 0; font-size: var(--font-size-sm); }
.head-actions { margin: var(--space-16) 0 0; }

.meter { margin: var(--space-4) 0; }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); color: var(--muted); }

.qbar { position: sticky; top: 0; z-index: 5; background: var(--bg); border-bottom: 1px solid var(--line); margin: 0 0 var(--space-24); }
.qbar-tabs { display: flex; gap: var(--space-4); overflow-x: auto; scrollbar-width: none; }
.qbar-tabs a { flex: none; padding: var(--space-12); font-size: var(--font-size-sm); color: var(--muted); text-decoration: none; border-bottom: 2px solid transparent; }
.qbar-tabs a:focus-visible { outline-offset: -2px; }
main > section[id] { padding-top: var(--space-24); scroll-margin-top: var(--space-64); }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }

.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.steps li::marker { font-family: var(--mono); color: var(--muted); }
.outputs { padding-left: var(--space-24); }

.codebox { display: flex; gap: var(--space-8); align-items: flex-start; min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: var(--space-12); }
.codebox pre { flex: 1; min-width: 0; padding: var(--space-4) 0; }

.stats, .kv { display: grid; gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: var(--space-12); min-width: 0; }
dt { color: var(--muted); font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: 500; }
.stats dd { font-size: var(--font-size-xl); font-family: var(--mono); }
.sha { font-size: var(--font-size-xs); word-break: break-all; }
.files li { padding: var(--space-8) 0; border-bottom: 1px solid var(--line); }

.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); color: var(--muted); }
.proof-label { font-size: var(--font-size-xs); letter-spacing: .06em; text-transform: uppercase; margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: 3px solid var(--line-strong); background: var(--surface2); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--font-size-sm); line-height: var(--line-height-body); max-height: 28rem; overflow: auto; }
.banner { margin: 0 0 var(--space-8); }
.foot { border-top: 1px solid var(--line); padding: var(--space-24) var(--gutter); color: var(--muted); font-size: var(--font-size-sm); }

/* appended */
.top a, .back a, .qbar-tabs a, main .meta a { display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min); }
.tools a:hover, .qbar-tabs a:hover { color: var(--fg); }
```
These rules are shared with the other skill pages. Fixes 2, 4, 6, 7 and 8 change `.btn`, `.tags`, h1 to h4 and the footer everywhere. Check the landing page and the other skill pages after you merge.

### Not changed
- All visible text, word for word. No element added or removed. The only HTML edit is one class on the Download link.
- Brand hue kept: `--color-brand` #2f7a4b, which is the site's `--ok`.
- Token file: not edited.
- The existing `prefers-reduced-motion: reduce` block already turns off every transition and animation on the page, so it stays as is.
- The Google Fonts links and the script tag from the input are untouched. Nothing external was added.
- The light and dark `--muted`, `--warn` and `--ok` pairs already pass 4.5:1. The lowest is `--muted` on `--surface2`, 4.50:1.

### Open questions
- The token file has no role tokens (text, surface, border, action). Page colours therefore stay as the site's own `--fg`, `--muted`, `--bg` and so on. Should `--ok` become an alias of `--color-brand`?
- The `#ffffff` text on the primary button has no token and stays a plain value.
- Font weight 500 has no token, because the file only has 400 and 600. It stays plain. The Inter link loads only 400 and 500, and a 600 weight would be faux-bolded.
- Radii 4px, 8px, 12px and 14px (`--radius`) have no matching token and stay plain.
- `--faint` is now unused on this page. It still fails as text at 2.62:1 on `--bg` and 2.76:1 on `--surface`, and the token owner should darken it or restrict it to non-text use. This skill does not edit tokens.
- The Install section's copy button and the head button do the same job. Confirm that "Copy install command" in the head is the single primary action, not the Download link.
