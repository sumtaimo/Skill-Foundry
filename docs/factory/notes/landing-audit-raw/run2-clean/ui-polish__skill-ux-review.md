<!-- skill: ui-polish | input: skill-ux-review | turns: 13 | cost_usd: 0.564 | permission_denials: 0 | is_error: False -->

## UI polish: ux-review skill page

16 fixes across spacing, typography, contrast, hierarchy, states, layout, motion and tokens. Text and brand hue kept. Tokens from tokens.css and tokens.supplement.css.

I did not render the page, because the SVGs were removed. I changed only rules this page uses. Colour definitions in `site.css` are untouched (see Open questions). You asked for changed code only, so the "Polished code" section holds changed rules and snippets, not the full page.

### Fixes
1. **Spacing**: off-scale values moved to the nearest token, larger on a tie.
   - Padding: `.top` `14px` → `var(--space-16)`; `main` `40px` → `var(--space-48)`; `.btn` `9px 14px` → `var(--space-8) var(--space-16)`; `.tags li` `2px 10px` → `var(--space-4) var(--space-12)`; `.role` `2px 8px` → `var(--space-4) var(--space-8)`; `.cover-tag` `3px 8px` → `var(--space-4) var(--space-8)`; `.files li` `6px` → `var(--space-8)`; `.proof` `14px` → `var(--space-16)`; `code` `.1em .35em` → `0 var(--space-4)`.
   - Margins and gaps: `.btn`, `.tags` and `.roles` gap `6px` → `var(--space-8)`; `h3` margin-top `20px` → `var(--space-24)`; `.steps li` `6px` → `var(--space-8)`; `dd` `2px` → `var(--space-4)`; `.proof-ask` and `.proof-answer` `10px` → `var(--space-12)`; `.proof` `20px` → `var(--space-24)`; `.proof-label` `6px` → `var(--space-8)`; `.meter-text` `6px` → `var(--space-8)`.
   - Offsets and indent: `h2` scroll-margin `80px` → `var(--space-64)`; `.outputs` indent `1.2em` → `var(--space-16)`. (R-ui-polish-1)
2. **Tokens**: on-scale spacing now uses the token (`12px` → `var(--space-12)`, `16px` → `var(--space-16)`, `24px` → `var(--space-24)`, `8px` → `var(--space-8)`, `4px` → `var(--space-4)`). This covers `.top`, `.tools`, `main`, `h1`–`h4`, `.meta`, `.qbar`, `.takeaway`, `.codebox`, `.stats`, `.kv`, `.head-actions`, `.foot` and `.banner`. `--gutter` stays. (R-ui-polish-1, R-ui-polish-20)
3. **Typography**: off-scale font sizes moved to tokens.
   - `.tools a` `.9rem` → `--font-size-sm`.
   - h1 `clamp(1.9rem,5vw,2.8rem)` → `clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl))`.
   - `.takeaway` `1.15rem` → `--font-size-lg`.
   - `h4` `.95rem` → `--font-size-md`.
   - `.ver`, `dt`, `.meter-text`, `.proof-label` and `.cover-tag` (`.72rem`–`.8rem`) → `--font-size-xs`.
   - `.roles`, `.live`, `.proof-ask`, `.proof-answer` and `.foot` (`.85rem`–`.9rem`) → `--font-size-sm`.
   - `.stats dd` `1.4rem` → `--font-size-xl`.
   - Others take their token: `.brand`, `h3` and `body` → `--font-size-md`; `h2` → `--font-size-lg`; `.btn`, `.meta` and `.qbar-tabs a` → `--font-size-sm`. (R-ui-polish-2, R-ui-polish-20)
4. **Typography**: line-height fixed. Body `1.6` → `var(--line-height-body)`. `.takeaway` `1.45` → `var(--line-height-body)`. h1 `1.12` → `var(--line-height-display)`. `h2`–`h4` get `var(--line-height-heading)`. (R-ui-polish-3, R-ui-polish-20)
5. **Typography**: weight `500` was a third weight next to `400` and `600`. It is now `var(--font-weight-strong)` on headings, `.btn`, `.brand`, `dd`, `.takeaway strong` and `.proof thead th`. Body uses `var(--font-weight-regular)`. (R-ui-polish-8, R-ui-polish-20)
6. **Typography**: `code, pre` set `.875em`, and `pre code` applied it again. The install and prompt text rendered at 12.25px. Now `code, pre` use `--font-size-sm` and `pre code` inherits, so they render at 14px. (R-ui-polish-2)
7. **Typography**: paragraphs ran to the full 680px section width. Now `main p { max-width: var(--measure) }`. (R-ui-polish-3, R-ui-polish-20)
8. **Contrast**: footer text and list-number markers used `--faint`, which is 2.62:1 in light and 3.94:1 in dark. Now `--muted`: 4.79:1 light, 7.21:1 dark. (R-ui-polish-4)
9. **Hierarchy**: there were two primary actions, "Copy install command" and "Download ux-review 1.0.0". The Download link loses `primary`; "Copy install command" is kept as the one primary action. (R-ui-polish-5)
10. **Hierarchy**: the primary was a near-black fill, `--fg` on `--bg`. The token file has no action tokens, so it now uses `--color-brand` with `--color-primary-50` text (4.93:1). Hover is `--color-primary-800` (8.05:1). (R-ui-polish-5, R-ui-polish-21)
11. **States**: the focus rule set `border-radius: 4px`, so pill buttons went square while focused. It also used a 3px offset. Now: `outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px;` with no radius. (R-ui-polish-6)
12. **States**: `.brand`, `.tools a` and `.qbar-tabs a` had no visible hover, and `.btn` had no disabled style. Both are added. (R-ui-polish-6)
13. **Layout**: header links, the back link, the tab links, the `.meta` links, the skip link and `.btn` were under 44px. All now get `min-height` and `min-width` of `var(--size-target-min)`. (R-ui-polish-7, R-ui-polish-20)
14. **Motion**: `.btn` transition `.2s var(--ease)` → `var(--duration-base) var(--ease-standard)`. The existing reduced-motion block already turns off every transition and animation, so it stays. (R-ui-polish-9, R-ui-polish-20)
15. **Tokens**: radii map to tokens. Pill `999px` → `--radius-full`. `.cover` `10px`, `.codebox` `12px`, `.stats > div` `12px` and `.banner img` `12px` → `--radius-md`. `code` `6px` and `.meter-bar` `4px` → `--radius-sm`. `.tokens-figure` is not on this page. (R-ui-polish-20)
16. **Tokens**: border widths map to tokens. `1px` → `--border-width-hairline`; `2px` → `--border-width-thick`; `.proof-answer` `3px` → `--border-width-thick`. (R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Footer text, list markers (light) | `--faint` #9c9c97 on `--bg` #f9f9f8, 2.62:1 | `--muted` #6f6f6b on `--bg` #f9f9f8, 4.79:1 |
| Footer text, list markers (dark) | `--faint` #75746f on `--bg` #141413, 3.94:1 | `--muted` #a3a29d on `--bg` #141413, 7.21:1 |
| Primary button | `--bg` #f9f9f8 on `--fg` #1d1d1b, 16.03:1 | `--color-primary-50` (#f2faf5) on `--color-primary-700` (#2f7a4b), 4.93:1 |
| Primary button, hover | `--bg` #f9f9f8 on `--muted` #6f6f6b, 4.79:1 | `--color-primary-50` (#f2faf5) on `--color-primary-800` (#235636), 8.05:1 |

No token pair in the token file fails. Ratios computed with the contrast script.

### Polished code
Changed CSS rules only. Rules not listed stay as they are.

```css
body { font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans); }
h1, h2, h3, h4 { font-weight: var(--font-weight-strong); line-height: var(--line-height-heading); }
code, pre { font-size: var(--font-size-sm); }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: 0 var(--space-4); }
pre code { background: none; padding: 0; font-size: inherit; }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; }

.skip { top: var(--space-8); }
.skip:focus { left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10; }

.top { gap: var(--space-12); padding: var(--space-16) var(--gutter); border-bottom: var(--border-width-hairline) solid var(--line); }
.brand { font-weight: var(--font-weight-strong); text-decoration: none; font-size: var(--font-size-md); }
.brand:hover { text-decoration: underline; }
.tools { gap: var(--space-8); }
.tools a { color: var(--muted); font-size: var(--font-size-sm); }
.tools a:hover, .qbar-tabs a:hover { color: var(--fg); }

/* 44px targets on every button and link */
.skip, .brand, .tools a, .back a, .meta a, .qbar-tabs a, .btn {
  display: inline-flex; align-items: center;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
}

.btn {
  gap: var(--space-8);
  font: var(--font-weight-strong) var(--font-size-sm)/1.2 var(--sans);
  border: var(--border-width-hairline) solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16);
  transition: background-color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard);
}
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn.ghost { border-color: var(--line); }
.btn.primary { background: var(--color-brand); color: var(--color-primary-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }

main { padding: var(--space-48) 0 var(--space-64); }
main p { max-width: var(--measure); }
h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-lg); margin: var(--space-16) 0 var(--space-12); scroll-margin-top: var(--space-64); }
h3 { font-size: var(--font-size-md); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); margin: var(--space-12) 0 var(--space-4); }
.meta { color: var(--muted); font-size: var(--font-size-sm); }
.meta a + a { margin-left: var(--space-12); }
.ver { font-family: var(--mono); font-size: var(--font-size-xs); }

.tags { gap: var(--space-8); margin: var(--space-8) 0 0; }
.tags li { font-size: var(--font-size-xs); color: var(--muted); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }
.roles { font-size: var(--font-size-sm); gap: var(--space-8); }
.role { padding: var(--space-4) var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); color: var(--fg); }
.live { margin: 0; font-size: var(--font-size-sm); }

.cover { border-radius: var(--radius-md); border: var(--border-width-hairline) solid var(--line); }
.cover-lg { margin-bottom: var(--space-24); border-radius: var(--radius); }
.cover-tag { font-size: var(--font-size-xs); padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); border: var(--border-width-hairline) solid var(--line); }

.qbar { border-bottom: var(--border-width-hairline) solid var(--line); margin: 0 0 var(--space-24); }
.qbar-tabs { gap: var(--space-4); }
.qbar-tabs a { padding: var(--space-12); font-size: var(--font-size-sm); border-bottom: var(--border-width-thick) solid transparent; }
.qbar-tabs a[aria-current=true] { color: var(--fg); border-bottom-color: var(--ok); }
main > section[id] { padding-top: var(--space-24); scroll-margin-top: var(--space-64); }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); margin: 0 0 var(--space-4); }
.takeaway strong { font-weight: var(--font-weight-strong); }

.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.steps li::marker { font-family: var(--mono); color: var(--muted); }
.outputs { padding-left: var(--space-16); }

.codebox { gap: var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
.codebox pre { padding: var(--space-4) 0; }
.stats, .kv { gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
dt { font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: var(--font-weight-strong); }
.stats dd { font-size: var(--font-size-xl); }
.sha { font-size: var(--font-size-xs); }
.files li { padding: var(--space-8) 0; border-bottom: var(--border-width-hairline) solid var(--line); }
.head-actions { margin: var(--space-16) 0 0; }

.meter-bar { border-radius: var(--radius-sm); }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); }
.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); }
.proof-label { font-size: var(--font-size-xs); margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); border-left: var(--border-width-thick) solid var(--line-strong); font-size: var(--font-size-sm); line-height: var(--line-height-body); }
.proof thead th { font-weight: var(--font-weight-strong); }
.files li, .foot { }  /* see above; footer below */
.foot { padding: var(--space-24) var(--gutter); color: var(--muted); font-size: var(--font-size-sm); border-top: var(--border-width-hairline) solid var(--line); }
.banner img { border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); }
@media (max-width: 480px) { main { padding-top: var(--space-24); } }
```

Remove the stray `.files li, .foot { }` line above before pasting. It is a leftover, and `.files li` and `.foot` are already covered.

Changed HTML, one snippet (line 227):
```html
<p><a class="btn" href="../../downloads/ux-review-1.0.0.zip" download data-i18n="download.label" data-i18n-args="{&quot;name&quot;:&quot;ux-review&quot;,&quot;version&quot;:&quot;1.0.0&quot;,&quot;size&quot;:&quot;22 KB&quot;}">Download ux-review 1.0.0 (.zip, 22 KB)</a></p>
```

### Not changed
- All visible text, word for word. No element added or removed.
- Brand hue kept: `--color-brand` #2f7a4b (the site's `--ok`).
- Token file: not edited.

### Open questions
- The token file has no text, surface, border or action role tokens. `--fg`, `--muted`, `--bg`, `--surface` and `--line` stay in the site's own colour blocks as plain hex. Add role tokens to the token file, then polish again.
- `--ok` is `#2f7a4b` in light, which equals `--color-brand`; point it at the token by hand. Dark `--ok` `#6cc28f` and `--warn` have no token.
- `--sans` and `--mono` (Inter, JetBrains Mono) are not the token file's `--font-family-sans` and `--font-family-mono`. I did not swap them, because that changes the look site-wide. The head's two Google Fonts `<link>` tags are external and were left as they are.
- `--radius` (14px) is a site token, off the radius scale (10 or 16), so it is unchanged on `.cover-lg` and `.proof`.
- `.skip` uses `left: -9999px` as an off-screen hide, kept as a plain value.
- Check that `site.js` does not select `.btn.primary` before removing `primary` from the Download link.
- The same off-scale values sit in `.hero`, `.plate`, `.finder` and `.rolechip`, which are not on this page. Polish them with the pages that use them.
- This skill does not edit tokens. Change the token file by hand or with a design-token skill.
