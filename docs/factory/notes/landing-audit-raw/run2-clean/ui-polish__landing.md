<!-- skill: ui-polish | input: landing | turns: 10 | cost_usd: 0.59 | permission_denials: 0 | is_error: False -->

## UI polish: Skill Foundry landing page

16 fixes across hierarchy, contrast, typography, spacing, layout, states and tokens. Text and brand hue kept. Tokens from tokens.css and tokens.supplement.css.

The page's own `--bg`, `--fg`, `--muted`, `--ok` and `--surface` variables stay as they are, because the token files have no text, surface or border role tokens. Rules for the skill page only (`.qbar`, `.stats`, `.kv`, `dt/dd`, `.files`, `.example`, `.takeaway`, `.tokens-*`, `.banner`) are not used on this page and are untouched. As you asked, this gives only the changed rules rather than the whole page.

### Fixes
1. **Hierarchy**: 10 filled `btn primary` buttons ("Copy install command", one per card) gave the page ten primary actions. Now only the first card keeps `primary`; the other nine are `btn copy`. The fill is `--color-brand` with `--color-primary-50` text, hover `--color-primary-800`, pressed `--color-primary-900`. The old fill was near-black `--fg`. (R-ui-polish-5, R-ui-polish-21)
2. **Hierarchy**: the base `.btn` is now the secondary style: transparent background, `--ok` text and border. The header toggles and Download keep the quiet `.ghost` look. (R-ui-polish-5, R-ui-polish-20)
3. **Contrast**: `--faint` text fails 4.5:1. It is used on the card number, the search placeholder, the list markers and the footer. Those four now use `--muted`. See the table. (R-ui-polish-4)
4. **Typography**: 20 off-scale font sizes moved to tokens. Examples: `.9rem` → `--font-size-sm`, `.8rem`/`.72rem` → `--font-size-xs`, `1.1rem` → `--font-size-md`, `.95rem` → `--font-size-md`. (R-ui-polish-2, R-ui-polish-20)
5. **Typography**: body line-height 1.6 → `--line-height-body` (1.5). h1 line-height 1.12 → `--line-height-display` (1.2). h2, h3 and h4 had none and inherited 1.6; they now use `--line-height-heading` (1.25). h1 size `clamp(1.9rem,5vw,2.8rem)` → `clamp(--font-size-2xl, 5vw, --font-size-3xl)`. (R-ui-polish-3, R-ui-polish-2)
6. **Typography**: the page used three weights: 400, 500 and the default bold 700 on `<th scope="row">`. Now only 400 and 600, from `--font-weight-regular` and `--font-weight-strong`. (R-ui-polish-8, R-ui-polish-20)
7. **Spacing**: off-scale values moved to `--space-*`. Examples: `14px` → 16, `9px 14px` → 8 and 16, `7px 14px` → 8 and 16, `6px` → 8, `10px` → 12, `20px` → 24, `28px` → 32, `40px` → 48, and `2px` → 4. (R-ui-polish-1, R-ui-polish-20)
8. **Typography**: no paragraph had a width limit. The `680px` sections allow about 75 characters per line. `main p, main li` now get `max-width: var(--measure)`. (R-ui-polish-3)
9. **Layout**: `.proof` styled both the proof table and the answer `<figure>`, so the table got 14px padding and a border. The figure rule is now `figure.proof`. (R-ui-polish-1)
10. **Layout**: the global `:focus-visible` set `border-radius: 4px`, which squared off pill buttons and chips while focused. That line is removed. (R-ui-polish-6)
11. **States**: the focus outline is now `var(--border-width-focus)` wide with a 2px offset (was 3px). (R-ui-polish-6, R-ui-polish-20)
12. **States**: `.chip` had no hover style, and no control had a disabled style. Added `.chip:hover`, `.find:hover`, and `:disabled` styles for button, chip, role chip and search. (R-ui-polish-6)
13. **States**: target size. Nav links, buttons, chips, role chips, card title links, table links, agent-file links and Download-all now have `min-height` and `min-width` of `var(--size-target-min)`. Role chips were 36px above 480px wide. (R-ui-polish-7, R-ui-polish-20)
14. **Tokens**: radii: `999px` → `--radius-full`, `12px` → `--radius-lg`, `10px` → `--radius-md`, `6px` → `--radius-sm`. `.plate`'s `--radius` (14px) is untouched, as the supplement note says. (R-ui-polish-20)
15. **Tokens**: durations `.2s` → `--duration-base` and `.15s` → `--duration-fast`. `--gutter` is now `var(--space-16)`. (R-ui-polish-20)
16. **Motion**: no change needed. The existing `prefers-reduced-motion: reduce` block already turns off every transition and animation. (R-ui-polish-9)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Card number, placeholder, footer, list markers: `--faint` (#9c9c97) on `--bg` (#f9f9f8) | 2.62:1, fails | `--muted` (#6f6f6b) on `--bg` (#f9f9f8), 4.79:1 |
| Card number, placeholder: `--faint` (#9c9c97) on `--surface` (#ffffff) | 2.76:1, fails | `--muted` (#6f6f6b) on `--surface` (#ffffff), 5.05:1 |
| Same, dark: `--faint` (#75746f) on `--surface` (#1b1b1a) | 3.68:1, fails | `--muted` (#a3a29d) on `--surface` (#1b1b1a), 6.74:1 |
| Same, dark: `--faint` (#75746f) on `--bg` (#141413) | 3.94:1, fails | `--muted` (#a3a29d) on `--bg` (#141413), 7.21:1 |
| Primary button: `--bg` on `--fg`/`--muted` hover | 4.79:1 on hover | `--color-primary-50` (#f2faf5) on `--color-brand` (#2f7a4b), 4.93:1 |
| Primary hover | none | `--color-primary-50` on `--color-primary-800` (#235636), 8.05:1 |
| Primary pressed | none | `--color-primary-50` on `--color-primary-900` (#183824), 12.13:1 |
| Secondary button: `--ok` (#2f7a4b) on `--bg` (#f9f9f8) | none | 4.98:1 |
| Secondary button, dark: `--ok` (#6cc28f) on `--surface` (#1b1b1a) | none | 8.00:1 |

Ratios computed with the contrast script.

### Polished code
**HTML.** In cards 2 to 10, change the copy button class. Card 1 (a11y-audit) stays as it is.
```html
<button type="button" class="btn copy" data-copy="unzip changelog-writer-1.0.0.zip -d .claude/skills/" …>
```

**CSS.** Each rule below replaces the rule with the same selector.
```css
:root { --gutter: var(--space-16); }
body { font: var(--font-weight-regular) var(--font-size-md)/var(--line-height-body) var(--sans); margin: 0; background: var(--bg); color: var(--fg); overflow-wrap: anywhere; overflow-x: hidden; }
h1, h2, h3, h4 { font-family: var(--sans); font-weight: var(--font-weight-strong); font-style: normal; line-height: var(--line-height-heading); }
code, pre { font-family: var(--mono); font-size: var(--font-size-sm); }
code { background: var(--surface2); border-radius: var(--radius-sm); padding: .1em .35em; }
main p, main li { max-width: var(--measure); }
:focus-visible { outline: var(--border-width-focus) solid var(--ok); outline-offset: 2px; }

/* target size */
.skip, .tools a, .btn, .chip, .rolechip, .plate h3 a, .proof th a, .agent-files a, .dl-all, .meta a {
  display: inline-flex; align-items: center; min-height: var(--size-target-min); min-width: var(--size-target-min);
}
.skip { top: var(--space-8); }
.skip:focus { padding: var(--space-8) var(--space-12); }

.top { gap: var(--space-12); padding: var(--space-16) var(--gutter); }
.brand { font-weight: var(--font-weight-strong); font-size: var(--font-size-md); }
.tools { gap: var(--space-8); }
.tools a { font-size: var(--font-size-sm); }

.btn {
  justify-content: center; gap: var(--space-8); max-width: 100%;
  font: var(--font-weight-strong) var(--font-size-sm)/var(--line-height-display) var(--sans);
  color: var(--ok); background: transparent; border: var(--border-width-hairline) solid var(--ok);
  border-radius: var(--radius-full); padding: var(--space-8) var(--space-16); cursor: pointer; text-decoration: none;
  transition: background-color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);
}
.btn:hover { background: var(--surface2); }
.btn.ghost { color: var(--fg); border-color: var(--line); }
.btn.primary { background: var(--color-brand); color: var(--color-primary-50); border-color: var(--color-brand); }
.btn.primary:hover { background: var(--color-primary-800); border-color: var(--color-primary-800); }
.btn.primary:active { background: var(--color-primary-900); border-color: var(--color-primary-900); }
.btn:disabled, .chip:disabled, .rolechip:disabled, .find:disabled { opacity: .5; cursor: not-allowed; }

main { padding: var(--space-48) 0 var(--space-64); }
h1 { font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-3xl)); line-height: var(--line-height-display); margin: 0 0 var(--space-16); }
h2 { font-size: var(--font-size-lg); margin: var(--space-16) 0 var(--space-12); }
h3 { font-size: var(--font-size-md); margin: var(--space-24) 0 var(--space-8); }
h4 { font-size: var(--font-size-md); margin: var(--space-12) 0 var(--space-4); }
.meta { font-size: var(--font-size-sm); }
.meta a + a { margin-left: var(--space-12); }
.ver, .plate-index { font-size: var(--font-size-xs); }

.hero { gap: var(--space-24); padding-bottom: var(--space-32); }
.hero-chips { gap: var(--space-8); }
.hero-sub { margin: 0 0 var(--space-24); }
.hero-label { font-size: var(--font-size-xs); margin: 0 0 var(--space-8); }
.hero-prompt { border-radius: var(--radius-lg); padding: var(--space-16); }
.hero-prompt code { font-size: var(--font-size-md); }
.chip {
  font: var(--font-weight-strong) var(--font-size-sm)/var(--line-height-display) var(--sans);
  border-radius: var(--radius-full); padding: var(--space-8) var(--space-16);
}
.chip:hover { color: var(--fg); border-color: var(--line-strong); }
.chip[aria-pressed=true] { color: var(--fg); border-color: var(--fg); }

.collection { padding-top: var(--space-24); }
.collection-bar { gap: var(--space-8); margin-bottom: var(--space-16); }
.grid { gap: var(--space-16); }
.plate { padding: var(--space-16); gap: var(--space-8); transition: border-color var(--duration-base) var(--ease); }
.plate-head { gap: var(--space-8); }
.plate-index { color: var(--muted); padding-top: var(--space-4); }
.plate h3 { margin: var(--space-4) 0 0; font-size: var(--font-size-md); }
.plate-type, .plate-get { font-size: var(--font-size-sm); }
.plate footer { gap: var(--space-8); padding-top: var(--space-8); }
.cover { border-radius: var(--radius-md); }
.tags { margin: var(--space-8) 0 0; gap: var(--space-8); }
.tags li { font-size: var(--font-size-xs); border-radius: var(--radius-full); padding: var(--space-4) var(--space-12); }
.meter { margin: var(--space-4) 0; }
.meter-text { margin: var(--space-8) 0 0; font-size: var(--font-size-xs); }

.steps { padding-left: var(--space-24); }
.steps li { margin: var(--space-8) 0; }
.steps li::marker { font-family: var(--mono); color: var(--muted); }
.agent-files { padding-left: var(--space-16); }
.agent-files a { font-family: var(--mono); font-size: var(--font-size-sm); }
.codebox { gap: var(--space-8); border-radius: var(--radius-lg); padding: var(--space-12); }
.codebox pre { padding: var(--space-4) 0; }
.layers { padding-left: var(--space-24); gap: var(--space-8); }
.table-wrap { margin-top: var(--space-16); }
.proof { font-size: var(--font-size-sm); }              /* table.proof */
.proof th, .proof td { padding: var(--space-8) var(--space-12) var(--space-8) 0; }
.proof thead th, .proof tbody th { font-weight: var(--font-weight-strong); }
figure.proof { margin: var(--space-12) 0 var(--space-24); padding: var(--space-16); border: var(--border-width-hairline) solid var(--line); border-radius: var(--radius); background: var(--surface); }
.proof-ask { margin: 0 0 var(--space-12); font-size: var(--font-size-sm); }
.proof-label { font-size: var(--font-size-xs); margin-right: var(--space-8); }
.proof-answer { margin: 0 0 var(--space-12); padding: var(--space-12); font-size: var(--font-size-sm); line-height: var(--line-height-body); }

.finder { gap: var(--space-12); margin: 0 0 var(--space-24); }
.hero .finder { margin: var(--space-8) 0 var(--space-24); }
.find-label { font-weight: var(--font-weight-strong); }
.find { padding: var(--space-12) var(--space-16); border-radius: var(--radius-md); min-height: var(--size-target-min); }
.find:hover { border-color: var(--muted); }
.find::placeholder { color: var(--muted); }
.roles-filter { gap: var(--space-8); }
.rolechip {
  padding: var(--space-8) var(--space-16); font-size: var(--font-size-sm); border-radius: var(--radius-full);
  transition: color var(--duration-fast) ease-out, border-color var(--duration-fast) ease-out, background-color var(--duration-fast) ease-out;
}
.rolechip[aria-pressed=true] { font-weight: var(--font-weight-strong); }
.find-count { font-size: var(--font-size-sm); }
.roles { font-size: var(--font-size-sm); gap: var(--space-8); }
.role { padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); }
.live { font-size: var(--font-size-sm); }
.foot { padding: var(--space-24) var(--gutter); color: var(--muted); font-size: var(--font-size-sm); }

.cover-tag { left: var(--space-8); bottom: var(--space-8); font-size: var(--font-size-xs); padding: var(--space-4) var(--space-8); border-radius: var(--radius-full); }
.cover-tag[data-kind="run"]::before, .cover-tag[data-kind="proof"]::before { margin-right: var(--space-8); }
.recipe { margin: var(--space-16) 0 var(--space-32); }
.recipe-chain { gap: var(--space-8); margin: var(--space-8) 0 var(--space-16); }
.recipe-body { gap: var(--space-24); }
.recipe-body .cover { padding: var(--space-12); }
```
Also delete these now-redundant rules: `@media (max-width: 480px) { .rolechip { min-height: 44px; } }` and `.hero-part`-style comments are unaffected.

### Not changed
- All visible text, word for word. No element added or removed.
- Brand hue kept: `--color-brand` #2f7a4b (`--ok`).
- Token file: not edited.
- Reduced-motion block, hero animation, grid, hero and recipe layout.

### Open questions
- Which button is the one primary action? The page has no hero button, so I kept the first card's "Copy install command". Tell me if it should be another button.
- tokens.css has no text, surface, border, focus or action tokens, so page colours stay on `--bg`, `--fg`, `--muted`, `--ok` and `--surface`. The secondary button uses `--ok` because the primary-800 token is unreadable on the dark surface.
- The page loads Inter at weights 400 and 500 only. Weight 600 now renders as a synthesized bold. Add 600 to the existing font link, or confirm the look.
- No matching token for: the `680px` section width, the hero animation's `.7s`, the `4px` meter radius, the `3px` answer border and `ease-out` easing. Each stays a plain value. `--radius` stays 14px as the supplement note says.
- `--faint` is no longer used for text and can be removed from site.css.
