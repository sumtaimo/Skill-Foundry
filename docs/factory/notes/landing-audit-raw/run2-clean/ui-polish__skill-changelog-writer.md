<!-- skill: ui-polish | input: skill-changelog-writer | turns: 12 | cost_usd: 0.577 | permission_denials: 0 | is_error: False -->

## UI polish: changelog-writer

12 fixes across Spacing, Typography, Contrast, Hierarchy, States, Layout and Tokens. Text and brand hue kept. Tokens from tokens.css.

### Fixes
1. **Spacing**: Off-scale values are now on the scale. Padding `14px` is now `var(--space-16)`, `10px` is `var(--space-12)`, `9px 14px` is `var(--space-8) var(--space-16)`, and `3px` is `var(--space-4)`. Margins `20px`, `6px` and `2px` are now `var(--space-24)`, `var(--space-8)` and `var(--space-4)`. `main` top padding `40px` is now `var(--space-48)`, the 1px overlap `margin-bottom: -1px` is now `0`, and `scroll-margin-top: 80px` is now `var(--space-64)`. Every spacing value that was already on the scale is now its token. (R-ui-polish-1, R-ui-polish-20)
2. **Typography**: Font sizes are off the type scale. `.9rem` (14.4px) is now `var(--font-size-sm)` and `.95rem` is `var(--font-size-md)`. `.8rem`, `.72rem` and `.75rem` are `var(--font-size-xs)`. `.85rem` is `var(--font-size-sm)`. `1.15rem` is `var(--font-size-lg)`, and `1.4rem` is `var(--font-size-xl)`. The h1 `clamp(1.9rem, 5vw, 2.8rem)` (30–45px) is now `var(--font-size-3xl)`, or `var(--font-size-2xl)` at 480px and below. (R-ui-polish-2, R-ui-polish-20)
3. **Typography**: Line-heights are corrected. Body `1.6` is now `var(--line-height-body)`. The h1 `1.12` is now `var(--line-height-display)`. h2, h3 and h4 had none and inherited `1.6`, so they now get `var(--line-height-heading)`. The takeaway `1.45` is now `var(--line-height-body)`. (R-ui-polish-3, R-ui-polish-20)
4. **Typography**: Font weight `500` is now `var(--font-weight-strong)`. The page then uses only 400 and 600. (R-ui-polish-8, R-ui-polish-20)
5. **Typography**: Paragraphs were about 680px, roughly 80 characters wide. They are now capped at `var(--measure)` (65ch). (R-ui-polish-3)
6. **Contrast**: The footer text and the step-number markers used `--faint` (`#9c9c97`), which was 2.62:1 on the page background. They now use `var(--muted)`, 4.79:1. In dark theme the same colour was 3.94:1 and is now 7.21:1. (R-ui-polish-4)
7. **Hierarchy**: The page had two primary buttons, "Copy install command" and "Download". "Download changelog-writer 1.0.0" is the one whose label names the skill, so it stays primary. "Copy install command" becomes secondary, which is an HTML class change. The primary fill was near-black and is now the token brand fill: `--color-brand`, with hover `--color-primary-800` and text `--color-primary-50`. The file has no action tokens, so I used its brand and primary tokens. (R-ui-polish-5, R-ui-polish-21)
8. **States**: `.brand`, `.tools a` and `.qbar-tabs a` had no hover. `.brand` and `.qbar-tabs a` have no underline, so they had no hover feedback at all. `.brand` now underlines on hover, and the other two go to `var(--fg)`. (R-ui-polish-6)
9. **States**: The focus ring is rebuilt: width is `var(--border-width-focus)` and the offset is now `2px` (was `3px`). I removed the `border-radius: 4px` that `:focus-visible` set, because it squared off the pill buttons whenever they were focused. (R-ui-polish-6, R-ui-polish-20)
10. **States**: `.btn` can be a disabled `<button>` but had no disabled style. It now gets `opacity: .5; cursor: not-allowed`. (R-ui-polish-6)
11. **Layout**: These links and buttons had no 44px target: brand, nav links, "All skills", the question tabs, the two `.meta` links, the skip link and `.btn`. They are now `min-height` and `min-width` `var(--size-target-min)`, laid out with `inline-flex`. (R-ui-polish-7, R-ui-polish-20)
12. **Tokens**: Raw values with a matching token now use it:
    - Radius: `999px` is now `var(--radius-full)`, and `6px` is now `var(--radius-sm)`. `10px` is now `var(--radius-md)`, and so is `12px` as the nearest value. The meter bar's `4px` radius is now `var(--radius-sm)`.
    - Borders: `1px` is now `var(--border-width-hairline)`, and `2px` on the tabs is `var(--border-width-thick)`.
    - Motion: `.2s` is now `var(--duration-base)`.
    - Accent: `--ok: #2f7a4b` is now `var(--color-brand)`, the same colour.
    (R-ui-polish-20)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Footer text and step markers (light) | `--faint` #9c9c97 on `--bg` #f9f9f8, 2.62:1 | `--muted` #6f6f6b on `--bg` #f9f9f8, 4.79:1 |
| Footer text and step markers (dark) | `--faint` #75746f on `--bg` #141413, 3.94:1 | `--muted` #a3a29d on `--bg` #141413, 7.21:1 |
| Primary button label | #f9f9f8 on #1d1d1b, 16.03:1 | `--color-primary-50` (#f2faf5) on `--color-brand` (#2f7a4b), 4.93:1 |
| Primary button label on hover | #f9f9f8 on #6f6f6b, 4.79:1 | `--color-primary-50` (#f2faf5) on `--color-primary-800` (#235636), 8.05:1 |

Ratios computed with the contrast script.

### Polished code
Changed rules and snippets only, as you asked. Rules not listed are unchanged.

HTML, in the `.head-actions` paragraph: drop `primary` from the button's class.
```html
<p class="head-actions"><button type="button" class="btn copy" data-copy="unzip changelog-writer-1.0.0.zip -d .claude/skills/" data-install-zip="downloads/changelog-writer-1.0.0.zip" data-install-name="changelog-writer-1.0.0.zip" data-sha256-install="2a01d9bc03eda56a39cbff2bfbbb674ef21f05dcd667470d095ad2fb328b3b5c"><span data-i18n="install.copy">Copy install command</span></button></p>
```

CSS:
```css
/* first :root block: only this line changes */
  --ok: var(--color-brand);

body { font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans); }
code, pre { font-size: var(--font-size-sm); }
code { border-radius: var(--radius-sm); padding: 0 var(--space-4); }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; }

.skip { top: var(--space-8); min-height: var(--size-target-min); min-width: var(--size-target-min); }
.skip:focus { left: var(--gutter); background: var(--surface); padding: var(--space-8) var(--space-12); z-index: 10; }

.brand, .tools a, .back a, .meta a, .qbar-tabs a, .skip {
  display: inline-flex; align-items: center;
  min-height: var(--size-target-min); min-width: var(--size-target-min);
}

.top { gap: var(--space-12); padding: var(--space-16) var(--gutter); border-bottom: var(--border-width-hairline) solid var(--line); }
.brand { font-weight: var(--font-weight-strong); font-size: var(--font-size-md); }
.brand:hover { text-decoration: underline; }
.tools { gap: var(--space-8); }
.tools a { font-size: var(--font-size-sm); }
.tools a:hover, .qbar-tabs a:hover { color: var(--fg); }

.btn {
  gap: var(--space-8);
  font: var(--font-weight-strong) var(--font-size-sm)/var(--line-height-display) var(--sans);
  border: var(--border-width-hairline) solid var(--line-strong); border-radius: var(--radius-full);
  padding: var(--space-8) var(--space-16);
  min-height: var(--size-target-min); min-width: var(--size-target-min);
  transition: background-color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);
}
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn.ghost { border-color: var(--line); }
.btn.primary { background: var(--color-brand); color: var(--color-primary-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }

main { padding: var(--space-48) 0 var(--space-64); }
main p { max-width: var(--measure); }

h1, h2, h3, h4 { font-weight: var(--font-weight-strong); line-height: var(--line-height-heading); }
h1 { font-size: var(--font-size-3xl); line-height: var(--line-height-display); margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-lg); margin: var(--space-16) 0 var(--space-12); scroll-margin-top: var(--space-64); }
h3 { font-size: var(--font-size-md); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); margin: var(--space-12) 0 var(--space-4); }
.meta { font-size: var(--font-size-sm); }
.meta a + a { margin-left: var(--space-12); }
.ver { font-size: var(--font-size-xs); }

.cover { border-radius: var(--radius-md); border: var(--border-width-hairline) solid var(--line); }
.cover-lg { margin-bottom: var(--space-24); }
.tags { margin: var(--space-8) 0 0; gap: var(--space-8); }
.tags li { font-size: var(--font-size-xs); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }

.meter { margin: var(--space-4) 0; }
.meter-bar { height: var(--space-4); border-radius: var(--radius-sm); }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); }

.qbar { margin: 0 0 var(--space-24); border-bottom: var(--border-width-hairline) solid var(--line); }
.qbar-tabs { gap: var(--space-4); }
.qbar-tabs a { padding: var(--space-12); font-size: var(--font-size-sm); border-bottom: var(--border-width-thick) solid transparent; }
.qbar-progress { margin-bottom: 0; }

main > section[id] { padding-top: var(--space-24); scroll-margin-top: var(--space-64); }
.takeaway { font-size: var(--font-size-lg); line-height: var(--line-height-body); }
.takeaway strong { font-weight: var(--font-weight-strong); }

.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.steps li::marker { color: var(--muted); }
.outputs { padding-left: var(--space-16); }

.codebox { gap: var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
.codebox pre { padding: var(--space-4) 0; }

.stats, .kv { gap: var(--space-8); margin: var(--space-12) 0 0; }
.stats > div, .kv > div { border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); padding: var(--space-12); }
dt { font-size: var(--font-size-xs); }
dd { margin: var(--space-4) 0 0; font-weight: var(--font-weight-strong); }
.stats dd { font-size: var(--font-size-xl); line-height: var(--line-height-heading); }
.sha { font-size: var(--font-size-xs); }
.files li { padding: var(--space-8) 0; border-bottom: var(--border-width-hairline) solid var(--line); }
.get-cover { margin-bottom: var(--space-16); }
.head-actions { margin: var(--space-16) 0 0; }

.roles { font-size: var(--font-size-sm); gap: var(--space-8); }
.role { padding: var(--space-4) var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); }
.live { font-size: var(--font-size-sm); }

.cover-tag { left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); line-height: var(--line-height-display); padding: var(--space-4) var(--space-8); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-full); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { margin-right: var(--space-8); }

.proof { font-size: var(--font-size-sm); margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: var(--border-width-hairline) solid var(--line); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); }
.proof-label { font-size: var(--font-size-xs); margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); font-size: var(--font-size-sm); line-height: var(--line-height-body); }

.banner { margin: 0 0 var(--space-8); }
.banner img { border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius-md); }

.foot { border-top: var(--border-width-hairline) solid var(--line); padding: var(--space-24) var(--gutter); color: var(--muted); font-size: var(--font-size-sm); }

@media (max-width: 480px) { h1 { font-size: var(--font-size-2xl); } }
```

### Not changed
- All visible text, word for word. No elements added or removed.
- Brand hue kept: #2f7a4b (`--color-brand`, formerly `--ok`).
- Token file: not edited.
- The existing `prefers-reduced-motion: reduce` block already turns off every transition and animation, so no Motion fix was needed (R-ui-polish-9).
- Selectors this page does not use (hero, plate, chip, finder and so on) are untouched.
- The Google Fonts links are left as they were.

### Open questions
- Which button is the page's primary: "Download" or "Copy install command"? I chose "Download" because its label names the skill. To switch, put `primary` back on the copy button and take it off the download link.
- The token file has no surface, text, border or action roles, no dark colours, and its neutrals are green-tinted. So the site's warm greys (`#f9f9f8`, `#ffffff`, `#f2f2f0`, `#e8e8e5`, `#d4d4d0`, `#1d1d1b`, `#6f6f6b`, `#9c9c97`), `#8f6200` and the whole dark theme (including `#6cc28f`) stay plain values. Do you want role tokens added to the token file?
- The site's `--sans` (Inter) and `--mono` (JetBrains Mono) stacks have no matching font-family token, because the file uses system-ui. They stay as they are.
- The Google Fonts request loads Inter 400 and 500 only. The token weight 600 will render as 500 or as synthetic bold. Either add 600 to the request, or switch to the token's system stack.
- `--radius` (14px, on `.cover-lg` and `.proof`) is kept, as the token supplement says. Radii of 12px moved to `--radius-md` (10px).
- No token matches the 3px left border on `.proof-answer`, the 2px height of `.qbar-progress`, the 6px dot on `.cover-tag`, or the 680px, 1120px and 28rem sizes. They stay plain.
