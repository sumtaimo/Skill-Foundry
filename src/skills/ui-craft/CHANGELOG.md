# Changelog

## 1.0.0 - 2026-11-19

- Foundation first (session S4; needs the owner's decision on 1.1.0): reads `design/STATUS.md`, `BRIEF.md`, `tokens.css` and `components/*.md` before code and uses only variables that exist there (`R-ui-craft-19`).
- Cold-start gate (needs the owner's decision on 1.1.0): a whole product screen with no tokens asks one fixed question (defaults for a prototype, or build the foundation first with `design-system`) before any code (`R-ui-craft-20`).
- Token names (needs the owner's decision on 1.1.0): the private names (`--bg`, `--surface`, `--fg`, `--line`, `--accent`...) are replaced by the `design-system` names (`--color-surface-default`, `--color-text-default`, `--color-border-default`, `--color-action-primary-bg`...).
- Khmer (needs the owner's decision on 1.1.0): one body line-height of 1.6 (was 1.55, 1.6 and 1.65), `letter-spacing: 0` under `:lang(km)`, heading tracking never applies to Khmer.
- Wording (needs the owner's decision on 1.1.0): the year is removed from the skill text; the description now sends token and variable building to `design-system`.
- Ready: all 8 live eval cases recorded by fresh real `claude` agents and passing.
- Vague requests get a short reply (under 10 lines) with two questions, no skill/layer narration.
- Full code must appear in the reply as fenced code blocks, never only a file path, summary or published page.
- `R-ui-craft-5` requires exact `--z-sticky`, `--z-dropdown`, `--z-command`, `--z-modal`, `--z-toast` names; `R-ui-craft-7` requires a native `<dialog>` with `showModal()` for `Ctrl+K` palettes.

## 0.1.0 - 2026-11-18

- Initial draft of `ui-craft`: modern product UI craft covering frosted glass/gradient surfaces, fluid typography, `--z-*` layering, `Ctrl+K` command palettes, adaptive floating/sliding navigation, GPU/reduced-motion physics, all 8 UI lifecycle states (including loading skeleton, empty filter reset, and inline error retry), inline AI action bars, and role-aware handoff for `DEV_ENGINEER` and `UX_DESIGNER`.
