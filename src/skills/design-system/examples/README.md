# Examples

Hand-written examples that follow the skill's own rules. They show the shape; they are not proof.
The numbers are the ones the engine prints for these inputs.

## Example 1: one hex, a kind of product

Input: "Build a design system for our invoicing app. Our brand colour is #0f766e."

Command:

```
node <skill folder>/engine/tokens.mjs --out . --primary "#0f766e" --archetype precise-fintech --name "Invoicing app" --why "An invoicing product calls for precise, trustworthy numbers."
```

Reply (shortened here; the real reply keeps the whole contrast table):

```
## Design system: Invoicing app

Path a, from your colour. Archetype: precise-fintech. An invoicing product calls for precise, trustworthy numbers.

### Colours kept
| Input | Hex | Hue | Placed at |
|-------|-----|-----|-----------|
| primary | #0f766e | 175° | primary-800 |

### Contrast
| Text | On | Light | Dark | Needs | Result |
|------|----|-------|------|-------|--------|
| text-default | surface-default | 14.26:1 | 17.08:1 | 4.5:1 | pass |
| action-primary-text | action-primary-bg | 5.47:1 | 5.47:1 | 4.5:1 | pass |

### Files
- design-tokens.json
- tokens.css
- design-system-report.md

### Open questions
- None.
```

## Example 2: nothing to build from

Input: "Make us a design system."

Output: "Give me a brand colour as a hex code (for example #2563eb), a few words about the style you want, or the path to your existing design tokens."

## Example 3: a screen

Input: "Design our settings page."

Output: "This skill builds design tokens, not screens. For finished screen code, use ui-polish."
