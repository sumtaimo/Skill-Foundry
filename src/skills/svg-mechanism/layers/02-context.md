# Layer 02 — Context

Inspect the workspace before choosing colors, wrapper syntax, or CSS variable names.

1. Check for existing design token files in the project in this order:
   - `design/tokens.css` (and `design/STATUS.md`, `design/BRIEF.md` if present)
   - `tokens.css`, `variables.css`, or `globals.css` containing `--color-*` custom properties
2. Read the exact CSS variable names that already exist and reuse them verbatim (`--color-surface-default`, `--color-surface-raised`, `--color-text-default`, `--color-text-muted`, `--color-border-default`, `--color-action-primary-bg`, `--color-success-*`, `--color-warning-*`, `--color-danger-*`). Never invent renamed variants when a foundation variable exists, and never edit any file inside `design/`.
3. Detect the target stack from the user's request or workspace files:
   - Default when unspecified: self-contained, zero-dependency standalone HTML file (`<!doctype html>`) with embedded `<style>`, inline `<svg>`, and lightweight vanilla `<script>` for Play/Pause and stage inspection.
   - When React/JSX or Next.js is requested: deliver a clean functional React component (`*.jsx`/`*.tsx`) plus companion CSS module/stylesheet using CSS custom properties, with zero external animation dependencies.
4. Check the language of the requested labels (English, Khmer, or bilingual) so typography rules (`letter-spacing: 0` and vertical breathing room for Khmer) are applied from the start.
