# Worked Examples

Verified real-agent outputs from `evals/live/` and `evals/live/files/`.

## Example 1 — Webhook Delivery Pipeline (Standalone HTML)

- **Case:** `webhook-pipeline` (recorded by fresh `agy` agent, saved in `evals/live/files/webhook-pipeline.html`)
- **Prompt:** Build a standalone HTML file with an animated 2D architecture SVG showing how a webhook delivery pipeline works (`Producer -> Queue -> Worker`, with failed-delivery `Retry DLQ` branch) synced to light/dark CSS tokens with Play/Pause, keyboard stage focus, and `prefers-reduced-motion` static fallback.
- **Verified checks:**
  - `engine/lint-svg.mjs` (`M1`–`M8`): `ok: true` (0 errors; explicit `viewBox`, `<defs>` gradients & markers, `role="img"` + `<title>` + `<desc>`, Play/Pause `aria-pressed`, `prefers-reduced-motion: reduce`, zero raw `#hex` inside `<svg>`, safe `<text>` margins, light/dark tokens)
  - Playwright `checkPage`: `0` problems at `1440px` and `390px` in light mode, dark mode, and reduced motion (`0` console errors, `0px` sideways scroll)

## Example 2 — Khmer QR Payment Flow (Standalone HTML)

- **Case:** `khmer-payment-flow` (recorded by fresh `agy` agent, saved in `evals/live/files/khmer-payment-flow.html`)
- **Prompt:** Animated 2D mechanism SVG with Khmer labels (`អតិថិជនស្កេន QR -> ធនាគារផ្ទៀងផ្ទាត់ -> បញ្ជាក់ការទូទាត់`), `letter-spacing: 0`, generous box padding, light/dark CSS tokens, Play/Pause, and reduced motion.
- **Verified checks:**
  - `engine/lint-svg.mjs` (`M1`–`M8`): `ok: true` (0 errors)
  - Playwright `checkPage`: `0` problems at `1440px` and `390px` in light/dark/reduced-motion

## Example 3 — Design Foundation Token Sync (`reads-design-foundation`)

- **Case:** `reads-design-foundation` (saved in `evals/live/files/reads-design-foundation.html`)
- **Prompt:** AI Agent Loop (`Planner -> Executor -> Verifier -> Commit`, with Retry loop) linking directly to `design/tokens.css` variables (`--color-surface-default`, `--color-action-primary-bg`, `--color-warning-text`) without overwriting foundation tokens or hardcoding hex literals inside `<svg>`.
- **Verified checks:** `lintMechanismSvg` `ok: true`, Playwright `checkPage` `0` problems.
