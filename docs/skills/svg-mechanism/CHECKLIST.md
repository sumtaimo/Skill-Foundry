# Review Checklist — `svg-mechanism`

- **Skill version:** `0.1.0` (`ready`)
- **Date:** `2026-11-25`
- **Roles:** `DEV_ENGINEER`, `UX_DESIGNER`

## Machine & Factory Gates
- [x] `node src/factory/lint-skills.mjs svg-mechanism` passes with 0 problems
- [x] `node --test tests/svg-mechanism.test.mjs` passes (`5/5` pass, `0` skipped — including `engine/lint-svg.mjs` M1–M8 and Playwright `checkPage`)
- [x] `node src/factory/live-evals.mjs svg-mechanism` passes all `9/9` fresh-agent recordings (`agy`)
- [x] All 4 generated standalone HTML files in `src/skills/svg-mechanism/evals/live/files/` (`webhook-pipeline.html`, `oauth-pkce-handshake.html`, `reads-design-foundation.html`, `khmer-payment-flow.html`) pass `lintMechanismSvg` (M1–M8) and Playwright `checkPage` (`1440px` & `390px`, light/dark, reduced motion, 0 console errors, 0 sideways scroll)
- [x] Shadow routing eval (`docs/skills/svg-mechanism/proof/shadow.mjs` via `agy`) passes `101/101` (`95/95` existing + `6/6` new `svg-mechanism` and boundary cases)
- [x] `node src/factory/portable-check.mjs svg-mechanism --record --engine agy` passes (`exit: 0`, `usedSkill: true`, `leakedRepoRules: false`, `touchedRepo: []`, `produced: ["api-gateway-flow.html"]`), recorded answer reviewed manually, and `checkRecording('src/skills/svg-mechanism')` returns `ok: true`
- [x] `npm run guard` passes cleanly (`skill-guard: ok (skill: svg-mechanism)`)

## Manual Craft & Boundary Review
- [x] `R-svg-mechanism-11`: Discrete stages support keyboard focus / step inspection with `aria-live="polite"` readout
- [x] `R-svg-mechanism-14`: Browser checks verified at `1440px` and `390px` in light/dark/reduced-motion modes
- [x] `figure-craft` untouched; clear separation between 2D technical architecture SVGs (`svg-mechanism`), 3D isometric object cutaways (`figure-craft`), product UI screens (`ui-craft`), and scroll-driven showcases (`motion-craft`)
- [x] Agentic-Harness risk check (`AGENTS.md` Rule 14) complete & promoted `status` from `draft` to `ready` (`0.1.0`, `default: false`; Skill Foundry `1.9.0`; `Agentic-Harness/test/audit.mjs` verified)
