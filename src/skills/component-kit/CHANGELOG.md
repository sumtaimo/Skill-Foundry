# Changelog

## 1.0.0 - 2026-11-20

- First release. Two steps that hand off through files: SPEC writes `design/components/<name>.md` for 3 to 4 of the twelve components (anatomy, variants, the eight states, exact variable names, keyboard and ARIA contract, Khmer text note), CODE builds the named components from their specs in the project's own stack.
- Zero-dependency checker `engine/spec-check.mjs` (`status`, `spec`, `code`): every variable a spec or code names must exist in `design/tokens.css`; no raw colour or px size; sections and states complete.
- Reads the variables design-system writes; never edits them. A missing variable is listed under "Variables to add" and the nearest semantic variable is used.
