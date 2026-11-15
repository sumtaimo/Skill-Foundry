# Layer 08: Output

1. Write the reply in exactly this shape, with these headings in this order:

```
## UI polish: <screen name>

<n> fixes across <areas>. Text and brand hue kept.

### Fixes
1. **Spacing**: `padding: 13px` is off the scale. Now `padding: 12px`. (R-ui-polish-1)
2. **Contrast**: `#aaaaaa` on `#ffffff` is 2.32:1. Now `#6b7280`, 4.83:1. (R-ui-polish-4)

### Contrast
| Text | Before | After |
|------|--------|-------|
| Card description | #aaaaaa on #ffffff, 2.32:1 | #6b7280 on #ffffff, 4.83:1 |

### Polished code
<one code block with the full polished code>

### Not changed
- All visible text, word for word.
- Brand hue kept: <each brand colour>.

### Open questions
- None.
```

2. Each fix starts with its bold area name, one of: **Spacing**, **Typography**, **Contrast**, **Hierarchy**, **States**, **Layout**, **Motion**.
3. Number fixes 1 to N with no gap or restart.
4. Write the full polished code, not a diff and not "the rest is unchanged".
5. List in "Open questions" only what the code cannot answer, for example which action is primary when two are equal.
6. Quality bar: a front-end developer can paste the polished code and ship it; a designer reads each fix and sees the rule behind it; nobody can find a changed word.
7. Hand the reply to layer 09.
