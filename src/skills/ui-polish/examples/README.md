# Examples

Hand-written examples that follow the skill's own rules. They show the shape; they are not proof.

## Example 1: a sign-in form

Input:

```
<form style="padding:14px"><label style="font-size:13px;color:#999999">Email</label>
<input style="padding:5px"><button style="background:#16a34a;color:#fff;padding:5px 9px">Sign in</button></form>
```

Output:

```
## UI polish: Sign-in form

6 fixes across Spacing, Typography, Contrast and States. Text and brand hue kept.

### Fixes
1. **Spacing**: `padding: 14px` is off the scale. Now `padding: 16px`. (R-ui-polish-1)
2. **Spacing**: input `padding: 5px` is off the scale. Now `padding: 8px 12px`. (R-ui-polish-1)
3. **Typography**: label `font-size: 13px` is off the scale. Now `14px`. (R-ui-polish-2)
4. **Contrast**: label `#999999` on `#ffffff` is 2.85:1. Now `#595959`, 7.00:1. (R-ui-polish-4)
5. **Contrast**: white on button `#16a34a` is 3.30:1. Now `#15803d`, 5.02:1; same green hue. (R-ui-polish-4, R-ui-polish-11)
6. **States**: the button has no hover or focus style, and is 26 px tall. Added hover, :focus-visible and `min-height: 44px`. (R-ui-polish-6, R-ui-polish-7)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Email label | #999999 on #ffffff, 2.85:1 | #595959 on #ffffff, 7.00:1 |
| Sign in | #ffffff on #16a34a, 3.30:1 | #ffffff on #15803d, 5.02:1 |

### Polished code
(the full form with the fixes applied)

### Not changed
- All visible text, word for word.
- Brand hue kept: green.

### Open questions
- None.
```

## Example 2: no code

Input: "Polish our dashboard."

Output: "Paste the HTML and CSS of the finished screen you want polished."

## Example 3: a new design

Input: "Design a new onboarding flow."

Output: "This skill polishes a finished UI; it does not design new screens."

## Example 4: with a token file

Input: "Final polish on this card, our tokens.css is below." (a token file with `--space-12`, `--color-text-muted`, `--color-action-primary-bg` and the other tokens of a design-system file) and `<div style="padding:13px"><p style="font-size:13px;color:#999999">Due on 30 November.</p><button style="background:#2563eb;color:#fff">Pay now</button></div>`.

Output (shortened):

```
## UI polish: Invoice card

4 fixes across Spacing, Typography, Contrast and Tokens. Text and brand hue kept. Tokens from tokens.css.

### Fixes
1. **Spacing**: `padding: 13px` is off the scale. Now `padding: var(--space-12)`. (R-ui-polish-1, R-ui-polish-20)
2. **Contrast**: `#999999` on `#ffffff` is 2.85:1. Now `var(--color-text-muted)`, 6.38:1. (R-ui-polish-4, R-ui-polish-20)
3. **Hierarchy**: the raw blue button now uses the project's primary-fill tokens, 5.47:1. (R-ui-polish-5, R-ui-polish-21)
...

### Contrast
| Text | Before | After |
|------|--------|-------|
| Description | #999999 on #ffffff, 2.85:1 | `--color-text-muted` (#4a6462) on `--color-surface-default` (#ffffff), 6.38:1 |

Ratios computed with the contrast script.

### Not changed
- All visible text, word for word.
- Brand hue kept: `--color-brand` (#0f766e).
- Token file: not edited.

### Open questions
- None.
```

A value with no matching token (for example a purple badge) stays a plain value and is listed under Open questions; a token pair that fails its ratio is kept and reported with its ratio.
