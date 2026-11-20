# component-kit references

The names below are the variable names of design-system's foundation. The truth is always the project's own
`design/tokens.css`: search it, and let the checker confirm. A name that is not there is a missing variable (layer 06, step 5).

## Spec template

One file per component, `design/components/<name>.md`. The ten sections, in this order, with these headings:

```
# <Name>

## Purpose
One or two sentences: what the user does with it.

## When not to use
- The wrong uses, each with the component to use instead.

## Anatomy
1. The parts, numbered, with the HTML element that carries each.

## Variants and sizes
A table of variants (use) and a table of sizes (height, padding as variables).

## States
### Default
### Hover
### Focus-visible
### Active
### Disabled
### Loading
### Empty
### Error
(each: what changes, with variables; Loading says the dimensions are locked; Error says how the user retries)

## Variables used
- `--exact-name`, one list, every variable the component needs.

## Keyboard and ARIA
- The element, the keys, the roles and attributes.

## Khmer text
- `--line-height-khmer`, `letter-spacing: 0`, no fixed heights.

## Do and don't
- Do ... / Don't ...

## Variables to add
- --wanted-name: nearest --existing-name (why)   or   None.
```

The eight states and what each means:

| State | Means |
|-------|-------|
| Default | resting appearance |
| Hover | pointer over (never the only way to learn something) |
| Focus-visible | keyboard focus: a ring of `--border-width-focus` in `--color-border-focus`, never removed |
| Active | pressed, or selected / on |
| Disabled | not available, with the reason when it is not obvious |
| Loading | work in progress; the dimensions are locked so nothing shifts; `aria-busy` |
| Empty | no content yet: say what goes here and the next action |
| Error | something failed: message in `--color-danger-text`, and how to retry |

A state that does not apply says why in one line ("Not applicable: a badge has no loading state of its own"); it is never left out.

## Variables to look for

| Need | Names |
|------|-------|
| Component tier (exist for three) | `--button-primary-bg`, `-bg-hover`, `-bg-pressed`, `-text`, `--button-secondary-text`, `-border`, `--button-radius`, `-height`, `-padding-x`; `--input-bg`, `-text`, `-border`, `-border-focus`, `-radius`, `-height`; `--card-bg`, `-border`, `-radius`, `-shadow`, `-padding` |
| Surfaces | `--color-surface-default`, `-subtle`, `-raised`, `-sunken`, `-inverse` |
| Text | `--color-text-default`, `-muted`, `-disabled`, `-inverse`, `-link`, `-link-hover` |
| Borders | `--color-border-default`, `-strong`, `-focus`; widths `--border-width-hairline`, `-thick`, `-focus` |
| Action | `--color-action-primary-bg`, `-bg-hover`, `-bg-pressed`, `-text`, `--color-action-secondary-text`, `-border` |
| Selected | `--color-selected-bg`, `--color-selected-text` |
| Status | `--color-<success|warning|danger|info>-bg-subtle`, `-border`, `-text`, `-bg`, `-text-on` |
| Space | `--space-0`, `-4`, `-8`, `-12`, `-16`, `-24`, `-32`, `-48`, `-64`; density `--density-control-x`, `-control-y`, `-row`, `-stack`, `-section` |
| Size | `--control-height-sm`, `-md`, `-lg`, `--size-target-min` |
| Shape | `--radius-sm`, `-md`, `-lg`, `-full`, `-control` |
| Elevation | `--shadow-1`, `-2`, `-3`; layers `--z-sticky`, `-dropdown`, `-command`, `-modal`, `-toast` only when `tokens.css` has them (modern effects) |
| Type | `--font-family-sans`, `-mono`, `--font-size-xs` to `-3xl`, `--font-weight-regular`, `-strong`, `--line-height-body`, `-heading`, `-khmer` |
| Motion | `--duration-fast`, `-base`, `-slow`, `--ease-standard`, `-enter`, `-exit` |

Palette steps (`--color-neutral-200`, `--color-primary-800`) are primitives: never used in a spec or in code.

For components without their own variables, use these defaults and note the wanted names under "Variables to add":

| Component | Starting point |
|-----------|----------------|
| select | the `--input-*` variables for the field, `--color-surface-raised` and `--shadow-2` for the list, `--color-selected-bg` for the chosen option |
| checkbox | `--input-border`, `--color-action-primary-bg` when checked, `--color-action-primary-text` for the mark, `--radius-sm`, `--size-target-min` for the hit area |
| dialog | `--color-surface-raised`, `--radius-lg`, `--shadow-3`, `--space-24`, scrim from `--color-surface-inverse` (code: `color-mix`), `--z-modal` when it exists |
| table | `--color-surface-default`, `--color-surface-subtle` (header), `--color-border-default`, `--density-row`, `--color-selected-bg` |
| nav | `--color-surface-default`, `--color-border-default`, `--color-text-muted`, current item `--color-selected-bg` and `--color-selected-text` |
| tabs | `--color-border-default` baseline, `--color-border-focus` for the current tab, `--color-text-muted`, `--space-12` |
| toast | status variables (`--color-info-bg-subtle`, `-border`, `-text`, and the success, warning and danger sets), `--shadow-3`, `--z-toast` when it exists |
| menu | like the select list: `--color-surface-raised`, `--shadow-2`, `--color-selected-bg`, `--space-8` |
| badge | status variables, `--radius-full`, `--font-size-xs`, `--font-weight-strong`, `--space-4` |

## Keyboard and ARIA contracts

| Component | Contract |
|-----------|----------|
| button | native `<button type="button">`; Enter and Space; loading `aria-busy="true"`; toggle `aria-pressed`; icon-only `aria-label` |
| input | `<label for>` always visible; `aria-invalid="true"` with the message in an element named by `aria-describedby`; `aria-required` or `required`; right `type` and `autocomplete`; retry for async checks is a button |
| select | native `<select>` first; a custom one is a combobox: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, list `role="listbox"` with `role="option"` and `aria-selected`; Up and Down, Home and End, Enter, Escape, type-ahead |
| checkbox | native `<input type="checkbox">` with a label; Space toggles; mixed state through the `indeterminate` property; a group is a `<fieldset>` with a `<legend>`; custom: `role="checkbox"` and `aria-checked` (`mixed` allowed) |
| card | no role when static; interactive has exactly one link or button inside, stretched, no nested controls; real heading |
| dialog | native `<dialog>` with `showModal()` (else `role="dialog"` and `aria-modal="true"`); `aria-labelledby` and a description; focus moves in, is trapped, Escape closes, focus returns to the opener; the page behind is inert |
| table | `<table>` with `<caption>`, `<th scope>`; sortable header holds a button and `aria-sort`; loading `aria-busy="true"`; empty is a row that spans all columns; no `role="grid"` unless cells are interactive |
| nav | `<nav aria-label>` with a list of links; current page `aria-current="page"`; a small-screen toggle is a button with `aria-expanded` and `aria-controls` |
| tabs | `role="tablist"`, `role="tab"` with `aria-selected` and `aria-controls`, `role="tabpanel"` with `aria-labelledby`; one tab stop (roving `tabindex`); Left and Right, Home and End; Tab moves into the panel |
| toast | `role="status"` (polite) or `role="alert"` for errors; never takes focus; an action stays until dismissed; others last long enough to read and pause while hovered or focused; dismiss is a real button |
| menu | button with `aria-haspopup="menu"` and `aria-expanded`; `role="menu"` and `role="menuitem"`; Down opens and moves, Up, Home and End, Escape closes and returns focus, type-ahead; a list of page links is a nav, not a menu |
| badge | not interactive; the meaning is also in the text (never colour alone); a count has an accessible name (`aria-label="3 unread"`); `role="status"` only when it updates live |

## Khmer text

Khmer script has tall stacked marks. For every text-bearing component: `line-height: var(--line-height-khmer)` and `letter-spacing: 0` under `:lang(km)`, controls grow from their minimum height (never a fixed height), labels wrap instead of truncating, and the focus ring is not clipped by `overflow`. design-system's `tokens.css` already sets the rule on `:lang(km)`; a component that sets its own `line-height` needs its own `:lang(km)` rule.

## Code per stack

Detect the stack from the project (layer 02). Every stack reads variables the same way.

| Stack | Pattern |
|-------|---------|
| HTML and CSS | one `.css` file per component with classes such as `.button`, `.button--primary`; states as `:hover`, `:focus-visible`, `[aria-busy="true"]`, `:disabled`; link `design/tokens.css` before it |
| React | one component file (`Button.tsx`) plus its `.css` or CSS module, or the project's own styling; props for variant, size, loading; spreads native props; `forwardRef` for inputs and buttons |
| Tailwind v3 | arbitrary values that read variables: `bg-[var(--button-primary-bg)]`, `rounded-[var(--button-radius)]`; or theme entries in `tailwind.config` whose values are `var(--...)` |
| Tailwind v4 | `bg-(--button-primary-bg)`, or `@theme inline { --color-primary: var(--button-primary-bg); }` |
| Vue / Svelte | single-file component with a `<style>` block using `var(--...)`; props and slots for variant, size, loading |
| CSS-in-JS | template strings or objects whose values are `'var(--...)'` strings |

Common to all: no raw colour or px size where a variable holds it (a scrim is `color-mix(in srgb, var(--color-surface-inverse) 50%, transparent)`); a rem or `%` or `min()` for layout widths is fine; transitions use `--duration-*` and `--ease-*` with a `prefers-reduced-motion` rule; icon sizes use `--space-16` or `--space-24`.

## Reviewer checklist

Answer each line yes or no. Any "no" blocks the reply until it is fixed.

- [ ] Each spec has all ten sections and the eight states, and the checker printed SPEC CHECK PASSED.
- [ ] Each variable name was searched in `design/tokens.css`; no palette step and no raw value is used.
- [ ] Wanted variables that do not exist are under "Variables to add" in the spec and in STATUS.md, and code uses the nearest one.
- [ ] The keyboard and ARIA contract matches the table above for that component.
- [ ] Khmer: `--line-height-khmer`, `letter-spacing: 0`, no fixed height.
- [ ] Code was built from the spec in the project's stack, and the checker printed CODE CHECK PASSED.
- [ ] Only one step was done in the turn, and STATUS.md names the next step and the exact words.
- [ ] `variables.json`, `tokens.css` and every other skill's file are untouched.
