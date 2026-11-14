# Tokens

- MUST take every colour from `TOKENS` through `tokensCss()`; the page puts its output in one `<style>`.
- MUST use `var(--...)`, `none` or `url(#...)` for every fill and stroke (lint `L6-raw-colour`).
- MUST support light (default) and dark via `[data-theme="dark"]` and `prefers-color-scheme`.
- NEVER override token values per figure.
- NEVER write a hex, rgb or named colour into SVG attributes.

Example:

```js
import { tokensCss } from './engine/tokens.mjs';
const css = tokensCss(); // ":root{--bg:...;--line-strong:...;--iso-top:...}..."
```

Bad: `<path fill="#ff0000"/>`. Good: `<path fill="var(--danger)"/>`.
