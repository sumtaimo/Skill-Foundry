# Changelog

## 1.0.0 - 2026-11-15

- First version: audits pasted HTML or JSX for what users cannot see and returns numbered findings, each with the element, a rule id, the WCAG 2.2 success criterion and level, who is affected and the fix as a diff.
- A zero-dependency script (`engine/audit.mjs`) runs 38 structural checks by search, so the list does not depend on the agent's eyes: language, title, viewport zoom, landmarks, headings, alt text, control and field names, labels, required state, errors, autocomplete, groups, keyboard access, focus order and traps, ARIA use, live regions, link purpose, label in name, tables, media, frames, nested controls and duplicate ids.
- Boundary with fixed sentences: no code; contrast, focus-ring style, spacing and target size (the polish skill owns them); usability of the flow; rewriting visible text; conformance certificates. Every finding names an element present in the input.
- Ten core layers written as defined terms and numbered clauses; rules R-a11y-audit-1 to R-a11y-audit-16 in RULES.json.
