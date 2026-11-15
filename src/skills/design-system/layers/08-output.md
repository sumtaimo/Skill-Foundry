# Layer 08: Output

1. Files, in the output folder:
   - Paths a and b: `design-tokens.json` (W3C design tokens), `tokens.css` (custom properties, light and dark), `design-system-report.md`.
   - Path c: `design-tokens.gaps.json` and `tokens.gaps.css` (only the missing groups, plus dark values for existing role tokens when dark mode was missing), `design-system-report.md`, and `existing-tokens.css` when the user pasted the tokens.
2. The reply is the report, word for word as the engine printed it (the content of design-system-report.md), in this shape. This holds even when the request asks for a short summary or a list of files and checks: the report already has the files, the checks (the contrast table) and the open questions. Put a note of your own in the report through `--open` before you reply, never as text around it.

```
## Design system: <product name>

Path <a | b | c>, <how>. Archetype: <archetype id>. <why, one line>

This report is the whole reply: ...

### Files

### Colours kept
| Input | Hex | Hue | Placed at |

Hue check: ...

### Contrast
| Text | On | Light | Dark | Needs | Result |

### Kept from your system      (path c only)
### Added                      (path c only)
### Existing pairs below the minimum (kept, not changed)   (path c only)

### How to use
### Open questions
- None.
```

3. Each contrast row is one role with its lowest ratio over the surfaces listed. Never shorten the table, and never replace numbers with words like "good" or "AA".
4. Describe safety checks in words ("no font files, imports or links"); never quote the strings layer 07 searches for, because the reply is checked as text together with the files.
5. Quality bar: a developer can load tokens.css and get a working light and dark theme with no other file; a designer finds the brand hex untouched at a named step; every text pair a screen needs has a ratio that passes; nobody finds a brand name the user only compared to.
6. Hand the files and the reply to layer 09.
