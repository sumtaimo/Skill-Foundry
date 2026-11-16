<!-- skill: ui-polish | input: skill-skill-smith | turns: 11 | cost_usd: 0.549 | permission_denials: 0 | is_error: False -->

## UI polish: skill-smith detail page

13 fixes across typography, spacing, contrast, hierarchy, states, layout, motion and tokens. Text and brand hue kept. Tokens from tokens.css, tokens.supplement.css.

I read the stylesheet and the markup only; I did not render the page. I also left alone the rules this page doesn't use (hero, plate, finder, chip, rolechip), because site.css is shared with other pages.

### Fixes
1. **Typography**: Body line-height `1.6` is off the scale. Now `var(--line-height-body)`, and body is `font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans)`. (R-ui-polish-3, R-ui-polish-20)
2. **Typography**: The page uses weights 400 and 500, and the token file has 400 and 600. All `500` is now `var(--font-weight-strong)` on h1–h4, `.brand`, `.btn`, `.takeaway strong`, `dd` and the active role chip. The page now has exactly two weights. (R-ui-polish-8, R-ui-polish-20)
3. **Typography**: h1 `clamp(1.9rem, 5vw, 2.8rem)` is 30.4–44.8px, off the scale. Now `clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl))`, 30–36px, with line-height `1.12` → `var(--line-height-display)`. The h2/h3/h4 sizes (item 4) and line-heights are tokenised: `1.25rem` → `var(--font-size-lg)`, `1rem` → `var(--font-size-md)`, `.95rem` → `var(--font-size-md)`, `var(--line-height-heading)`. (R-ui-polish-2, R-ui-polish-3, R-ui-polish-20)
4. **Hierarchy**: The `.takeaway` line (18.4px) sat directly above an h2 of the same visual size. h2 is now `var(--font-size-xl)` (24px) and the takeaway is `var(--font-size-lg)` (20px) with `var(--line-height-body)`. h3 and h4 are both 16px, so they differ only by margin. (R-ui-polish-2, R-ui-polish-8)
5. **Typography**: Other off-scale rem sizes moved to the nearest token:
   - `.9rem` (nav, `.meta`, `.roles`, `.live`, `.proof`, `.proof-ask`, `.run-facts`, `.foot`) → `var(--font-size-sm)`.
   - `.85rem` and `.875em` → `var(--font-size-sm)`.
   - `.8rem`, `.75rem` and `.72rem` → `var(--font-size-xs)`.
   - `1.4rem` → `var(--font-size-xl)`.
   - `code, pre` use `var(--font-size-sm)` instead of `.875em`, so inline code no longer shrinks inside smaller text.
   (R-ui-polish-2, R-ui-polish-20)
6. **Layout**: Paragraphs were capped at `680px`, which is wider than 65ch. Now `main p { max-width: var(--measure); }`. (R-ui-polish-3)
7. **Spacing**: Off-scale values moved to the nearest token, with ties going to the larger value:
   - Header padding `14px` → `var(--space-16)`.
   - `main` padding `40px` → `var(--space-48)`.
   - `.btn` padding `9px 14px` → `var(--space-8) var(--space-16)`, and its gap `6px` → `var(--space-8)`.
   - Tabs `10px` → `var(--space-12)`.
   - `.steps li` `6px` → `var(--space-8)`; `.files li` `6px` → `var(--space-8)`.
   - `h3` margin `20px` → `var(--space-24)`.
   - `.proof` padding `14px` → `var(--space-16)` and margin `20px` → `var(--space-24)`.
   - `.proof-ask` and `.proof-answer` margin `10px` → `var(--space-12)`.
   - `dd` margin `2px` → `var(--space-4)`.
   - `.tags li` `2px 10px` → `var(--space-4) var(--space-12)`, `.role` `2px 8px` → `var(--space-4) var(--space-8)`, and `.cover-tag` `3px` → `var(--space-4)`.
   - List indents `1.2em`, `1.4em` and `1.5em` → `var(--space-24)`.
   - Remaining 4/8/12/16/24px values became `--space-*` tokens.
   (R-ui-polish-1, R-ui-polish-20)
8. **Contrast**: `--faint` is used as text colour in the footer and the numbered-list markers. It is 2.62:1 on `--bg` in light, and 3.94:1 in dark, below 4.5:1. Both now use `var(--muted)`: 4.79:1 light, 7.21:1 dark. The `--faint` variable itself is untouched. (R-ui-polish-4)
9. **Hierarchy**: There were two `.btn.primary` actions, "Copy install command" and the Download link. "Copy install command" is the one primary action and now uses the token file's brand fill. Its old near-black fill was not the project's brand hue, so it is replaced by `--color-brand`. The Download link drops the `primary` class and becomes a secondary button. (R-ui-polish-5, R-ui-polish-11, R-ui-polish-21)
10. **States**: Targets were under 44px: nav links, `.brand`, "All skills", the `.meta` links, the skip link, the tabs, and buttons at about 37px. All now have `min-height` and `min-width` of `var(--size-target-min)`. (R-ui-polish-7)
11. **States**: Hover and disabled styles were missing.
    - Added hover for `.tools a`, `.brand` and the tabs.
    - Added `.btn:disabled` with `opacity: .5; cursor: not-allowed`.
    - The focus ring was `outline: 2px … offset 3px`. It is now `var(--border-width-focus)` with offset 2px.
    - The tab links sit in an `overflow-x: auto` strip, which clipped the ring. Tab focus now uses `outline-offset: -2px`.
    (R-ui-polish-6, R-ui-polish-20)
12. **Motion**: Transition times `.2s` and `.15s` → `var(--duration-base)` and `var(--duration-fast)`, easing unchanged. The existing `prefers-reduced-motion: reduce` block already disables them. (R-ui-polish-9, R-ui-polish-20)
13. **Tokens**: Radii now use tokens: `12px` and `10px` → `var(--radius-md)`, `6px` and `4px` → `var(--radius-sm)`, `999px` → `var(--radius-full)`. `--radius` (14px) and `--gutter` stay as they are. `--ok` is now `var(--color-brand)`; the value is the same, `#2f7a4b`. (R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Footer and list markers, light | `--faint` (#9c9c97) on `--bg` (#f9f9f8), 2.62:1, fails | `--muted` (#6f6f6b) on `--bg` (#f9f9f8), 4.79:1 |
| Footer and list markers, dark | `--faint` (#75746f) on `--bg` (#141413), 3.94:1, fails | `--muted` (#a3a29d) on `--bg` (#141413), 7.21:1 |
| Primary button, light | `--bg` (#f9f9f8) on `--fg` (#1d1d1b), 16.03:1 | `--color-neutral-50` (#f4f9f6) on `--color-brand` (#2f7a4b), 4.92:1 |
| Primary button hover | `--bg` on `--muted`, not computed | `--color-neutral-50` (#f4f9f6) on `--color-primary-800` (#235636), 8.03:1 |
| Primary button, dark | `--bg` (#141413) on `--fg` (#ecebe7), 15.45:1 | Same pair as light, 4.92:1. The fill against the dark page is 3.52:1, above 3:1. |
| Muted text on `--surface2` (code, tags) | `--muted` (#6f6f6b) on `--surface2` (#f2f2f0), 4.50:1 | Unchanged, passes |
| Focus ring | `--ok` (#2f7a4b) on `--bg` (#f9f9f8), 4.98:1 | Unchanged, passes |

Ratios computed with the contrast script.

### Polished code
Changed rules only; everything not listed stays as written. The only HTML change is the Download link's class.

```css
/* in the first :root block */
--ok: var(--color-brand);

body { font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans); }
h1, h2, h3, h4 { font-family: var(--sans); font-weight: var(--font-weight-strong); font-style: normal; }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: .1em .35em; }
code, pre { font-family: var(--mono); font-size: var(--font-size-sm); }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; border-radius: var(--radius-sm); }

.skip { position: absolute; left: -9999px; top: var(--space-8); }
.skip:focus {
  left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10;
  display: inline-flex; align-items: center; min-height: var(--size-target-min);
}

.top { display: flex; flex-wrap: wrap; gap: var(--space-12); align-items: center; justify-content: space-between; padding: var(--space-16) var(--gutter); border-bottom: 1px solid var(--line); }
.brand {
  font-weight: var(--font-weight-strong); text-decoration: none; font-size: var(--font-size-md);
  display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min);
}
.brand:hover { text-decoration: underline; text-decoration-color: var(--fg); }
.tools { display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.tools a {
  color: var(--muted); font-size: var(--font-size-sm);
  display: inline-flex; align-items: center; padding: 0 var(--space-8);
  min-height: var(--size-target-min); min-width: var(--size-target-min);
}
.tools a:hover { color: var(--fg); }

.btn {
  display: inline-flex; align-items: center; gap: var(--space-8); max-width: 100%;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font: var(--font-weight-strong) var(--font-size-sm)/var(--line-height-display) var(--sans); color: var(--fg);
  background: var(--surface); border: 1px solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);
}
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn.primary { background: var(--color-brand); color: var(--color-neutral-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }

main { padding: var(--space-48) 0 var(--space-64); }
main p { max-width: var(--measure); }
.back a, .meta a { display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min); }

h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); letter-spacing: -.02em; margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-xl); line-height: var(--line-height-heading); margin: var(--space-16) 0 var(--space-12); letter-spacing: -.01em; scroll-margin-top: 80px; }
h3 { font-size: var(--font-size-md); line-height: var(--line-height-heading); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); line-height: var(--line-height-heading); margin: var(--space-12) 0 var(--space-4); }
.meta { color: var(--muted); font-size: var(--font-size-sm); }
.meta a + a { margin-left: var(--space-12); }
.ver, .plate-index { font-family: var(--mono); font-size: var(--font-size-xs); }

.cover { border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--line); color: var(--fg); line-height: 0; }
.tags { list-style: none; padding: 0; margin: var(--space-8) 0 0; display: flex; flex-wrap: wrap; gap: var(--space-8); }
.tags li { font-size: var(--font-size-xs); color: var(--muted); border: 1px solid var(--line); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }
.meter-bar { height: 4px; border-radius: var(--radius-sm); background: var(--line); overflow: hidden; }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); color: var(--muted); }

.qbar-tabs { display: flex; gap: var(--space-4); overflow-x: auto; scrollbar-width: none; }
.qbar-tabs a {
  flex: none; display: inline-flex; align-items: center; padding: var(--space-12);
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  font-size: var(--font-size-sm); color: var(--muted); text-decoration: none; border-bottom: 2px solid transparent;
}
.qbar-tabs a:hover { color: var(--fg); }
.qbar-tabs a:focus-visible { outline-offset: -2px; }

.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }
.takeaway strong { font-weight: var(--font-weight-strong); }
.steps, .outputs, .layers, .agent-files { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.steps li::marker { font-family: var(--mono); color: var(--muted); }

.codebox { display: flex; gap: var(--space-8); align-items: flex-start; min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
.codebox pre { flex: 1; min-width: 0; padding: var(--space-4) 0; }
.stats, .kv { display: grid; gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); min-width: 0; }
dt { color: var(--muted); font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: var(--font-weight-strong); }
.stats dd { font-size: var(--font-size-xl); font-family: var(--mono); }
.sha { font-size: var(--font-size-xs); word-break: break-all; }
.files li { padding: var(--space-8) 0; border-bottom: 1px solid var(--line); }
.run-facts { display: flex; flex-wrap: wrap; gap: var(--space-8); font-size: var(--font-size-sm); color: var(--muted); }
.foot { border-top: 1px solid var(--line); padding: var(--space-24) var(--gutter); color: var(--muted); font-size: var(--font-size-sm); }

.roles { margin: 0; color: var(--muted); font-size: var(--font-size-sm); display: flex; flex-wrap: wrap; gap: var(--space-8); align-items: center; }
.role { padding: var(--space-4) var(--space-8); border: 1px solid var(--line); border-radius: var(--radius-full); color: var(--fg); }
.live { margin: 0; font-size: var(--font-size-sm); }

.cover-tag { position: absolute; left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: 1.2; padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); background: var(--surface); border: 1px solid var(--line); color: var(--muted); }
.proof { width: 100%; border-collapse: collapse; font-size: var(--font-size-sm); margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: 1px solid var(--line); border-radius: var(--radius); background: var(--surface); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); color: var(--muted); }
.proof-label { font-size: var(--font-size-xs); letter-spacing: .06em; text-transform: uppercase; margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: 3px solid var(--line-strong); background: var(--surface2); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--font-size-sm); line-height: var(--line-height-body); max-height: 28rem; overflow: auto; }
.banner img { display: block; width: 100%; height: auto; border: 1px solid var(--line); border-radius: var(--radius-md); }
```

```html
<!-- Download section: one primary action per view; the Download link becomes secondary -->
<p><a class="btn" href="../../downloads/skill-smith-1.0.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;skill-smith&quot;,&quot;version&quot;:&quot;1.0.0&quot;,&quot;size&quot;:&quot;9 KB&quot;}">Download skill-smith 1.0.0 (.zip, 9 KB)</a></p>
```

### Not changed
- All visible text, word for word. No element was added or removed.
- Brand hue kept: `#2f7a4b` (`--color-brand`, which `--ok` now points to), and the dark-theme `--ok` `#6cc28f`.
- Token file: not edited. Both token files were read only.
- The Google Fonts links in `<head>` are as they were, and none were added.

### Open questions
- The token file has no surface, text or border role tokens and no action tokens. The page's own `--bg`, `--fg`, `--surface`, `--muted`, `--line` and `--warn` therefore stay as they are. The primary button uses `--color-brand`, with `--color-neutral-50` for its text and `--color-primary-800` for hover. There is no pressed-state token, so the button has no pressed style.
- The dark `--ok` (`#6cc28f`), `--warn` (`#8f6200`, dark `#e0b45c`) and `--faint` have no matching token. The `3px` `.proof-answer` border and `--radius` (14px) also have none.
- `--sans` puts "Inter" first, while `--font-family-sans` is the system stack. Is Inter intended? I kept it.
- The font link loads Inter at weights 400 and 500 only. Because of fix 2, 600 will be synthesised from 500 unless the link's `wght@400;500` is changed to `400;600`. I did not touch the link.
- Which action is primary: "Copy install command" in the header, or Download? I chose the copy button because it is first in the flow and repeats in the Install section.
- h3 and h4 are both 16px on the token scale, so they differ only by margin. Do you want h4 in `--muted`?
- This page's `.proof-answer` scrolls (`max-height: 28rem; overflow: auto`) but can't be focused by keyboard. That belongs to a full accessibility audit, which this pass doesn't cover.
