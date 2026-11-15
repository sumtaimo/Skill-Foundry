# Token mode

Read this file only when there is a token file (layer 02). The skill needs no other skill: it reads the file and nothing else.

## Reading the token file

- **CSS file** (`tokens.css`): custom properties such as `--space-12: 12px;`. Use the light values in the root block. Dark values sit in a `prefers-color-scheme: dark` block and a `[data-theme="dark"]` block; reading them is only for the dark-theme check of layer 06, step 18. A `var(--other)` value is an alias; follow it to the final value.
- **JSON file** (`design-tokens.json`, W3C design tokens): every token has `$type` and `$value`; aliases are written in braces, such as `{color.neutral.900}`. The CSS name of a JSON path is `--` plus the path joined with hyphens: `color.primary.800` is `--color-primary-800`, `space.12` is `--space-12`, `font.size.md` is `--font-size-md`, `font.weight.strong` is `--font-weight-strong`. Role tokens live under `color.role.light` and `color.role.dark`, and their CSS name has no `role`: `color.role.light.text-muted` is `--color-text-muted`. Motion tokens have no `motion` in the CSS name: `motion.duration-base` is `--duration-base`. `control.target-min` is `--size-target-min`. When only the JSON file exists, the page must load the custom properties; say so under "Open questions" (layer 06, step 16).
- **Gap files** (`tokens.gaps.css`, `design-tokens.gaps.json`): read them after the main file; they only add tokens.
- The script reads both formats: `node engine/contrast.mjs --tokens <file> --list` prints every token with its final value. Use it, instead of reading a long file by eye, when it can run.
- Use only names that the file really has. A token file from another tool, or with other names, is read by meaning (a token whose name says "spacing 12" or "muted text"); when the meaning is not clear from the name and value, do not use the token.

## Which token a value gets

Names below are the ones a token file made by a design-system skill has. Another file: the token of the same meaning.

| Value in the code | Token |
|-------------------|-------|
| Page or card background | `--color-surface-default`; a raised card `--color-surface-raised`; a quiet band `--color-surface-subtle`; a well or table header `--color-surface-sunken` |
| Body text, headings | `--color-text-default` |
| Secondary, helper or placeholder text | `--color-text-muted` |
| Disabled text | `--color-text-disabled` (exempt from contrast) |
| Text on a dark surface | `--color-text-inverse` on `--color-surface-inverse` |
| Link; link on hover | `--color-text-link`; `--color-text-link-hover` |
| Card or divider border; input border | `--color-border-default`; `--color-border-strong` |
| Focus ring colour | `--color-border-focus` |
| Primary button | background `--color-action-primary-bg`, hover `--color-action-primary-bg-hover`, pressed `--color-action-primary-bg-pressed`, text `--color-action-primary-text` |
| Secondary button | text `--color-action-secondary-text`, border `--color-action-secondary-border`, transparent background |
| Selected row or tab | `--color-selected-bg` with `--color-selected-text` |
| A status (success, warning, danger, info) | text `--color-<status>-text`; subtle background `--color-<status>-bg-subtle`; border `--color-<status>-border`; solid badge `--color-<status>-bg` with `--color-<status>-text-on` |
| Brand colour, as the brand | `--color-brand` |
| A raw palette colour that no role covers | the scale token with that value (`--color-primary-800`); never a made-up name |
| Margin, padding, gap | `--space-0`, `-4`, `-8`, `-12`, `-16`, `-24`, `-32`, `-48`, `-64` (the number is the px) |
| Font size 12, 14, 16, 18, 20, 24, 30 (and 36, 48 when the file has them) | `--font-size-xs`, `-sm`, `-md`, `-lg`, `-xl`, `-2xl`, `-3xl` (and `-4xl`, `-5xl`) |
| Line-height 1.5; headings 1.25; display 1.2 | `--line-height-body`; `--line-height-heading`; `--line-height-display` |
| Font weight 400; 600 | `--font-weight-regular`; `--font-weight-strong` |
| Paragraph max-width | `--measure` |
| Font family | `--font-family-sans`, `-heading`, `-mono` |
| Radius | `--radius-sm`, `-md`, `-lg`, `-full`; a control `--radius-control` |
| Control height | `--control-height-sm`, `-md`, `-lg`; the 44 px click target `--size-target-min` |
| Border width 1px; 2px; focus outline width | `--border-width-hairline`; `--border-width-thick`; `--border-width-focus` |
| Shadow | `--shadow-1`, `-2`, `-3` |
| Transition time and easing | `--duration-fast`, `-base`, `-slow`; `--ease-standard`, `-enter`, `-exit` |

Rules for choosing:

1. A value matches by its role first and its number second. A grey `#6b7280` used for helper text is `--color-text-muted`, whatever its hex. A number that is not on the token scale goes to the nearest token value, larger on a tie (layer 04, step 5), exactly as in default mode: `13px` padding becomes `var(--space-12)`.
2. The focus outline is `outline: var(--border-width-focus) solid var(--color-border-focus); outline-offset: 2px;`. The 2 px offset has no token and stays plain; it is not an open question.
   The skill's own fixed values (disabled `opacity: 0.5` and `cursor: not-allowed`, `outline-offset: 2px`, `0`) are never open questions either.
3. Text size and line-height pairs: body 16 px is `--font-size-md` with `--line-height-body`; a heading takes `--line-height-heading`.
4. A zero value stays `0`.
5. A value with no matching token stays a plain value and is listed under "Open questions" in one line each, for example "`#7c3aed` on the Beta badge has no matching token; add one to the token file or confirm it stays". A group the file does not have at all (no radius tokens, no motion tokens) is one line for the whole group, and its default-mode scale is used (layer 04, step 6e).
6. Never write a token name from this table that the file does not have.

## Primary and secondary actions

One filled primary action, written with `--color-action-primary-bg`, its hover and pressed tokens, and `--color-action-primary-text` (rule 21). Every other action: transparent background, `--color-action-secondary-text` text and `--color-action-secondary-border` border; hover swaps the background to `--color-selected-bg`. A file with no `action` tokens: use its brand or primary token with the text token that the contrast script shows passing, and say which in the fix. The brand colour of the code is replaced by the token (layer 06, step 14).

## A token pair that fails

Run `node engine/contrast.mjs --tokens <file> <text token> <background token>` for every token pair the polished code uses (and with `--theme dark` when the file has dark values). A pair below 4.5:1 (3:1 for large text):

1. Keep the token in the polished code. Never swap in a raw colour and never redefine the token.
2. Write the pair in the Contrast table with its ratio and the word "fails", as `--color-text-muted` (#9ca3af) on `--color-surface-default` (#ffffff), 2.54:1, fails.
3. Write one line under "Open questions" with the token, the ratio and the fix that belongs to the token owner: "`--color-text-muted` is 2.54:1 on `--color-surface-default`; the token file needs a darker value (for example `--color-neutral-700`, 6.38:1, from `--scale`)". Take the example from `node engine/contrast.mjs --tokens <file> --scale --color-neutral- --on <background token>`.
4. Count the pair in the summary only as a finding, not as a fix.

## Utility classes

Tailwind-style markup keeps its syntax and takes tokens as arbitrary values, with a type hint where the value could be a colour or a size: `p-[var(--space-12)]`, `gap-[var(--space-8)]`, `text-[length:var(--font-size-md)]`, `leading-[var(--line-height-body)]`, `font-[var(--font-weight-strong)]`, `text-[color:var(--color-text-muted)]`, `bg-[var(--color-action-primary-bg)]`, `hover:bg-[var(--color-action-primary-bg-hover)]`, `rounded-[var(--radius-control)]`, `min-h-[var(--size-target-min)]`, `focus-visible:outline-2 focus-visible:outline-[color:var(--color-border-focus)] focus-visible:outline-offset-2`. In JSX with `style={{ }}` objects the same names are written as strings, `padding: 'var(--space-12)'`. Never convert classes into inline styles or the other way round (layer 02, step 2).
