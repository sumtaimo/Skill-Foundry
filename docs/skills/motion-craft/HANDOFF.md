# motion-craft — Session Handoff

Status: **`0.1.0` draft** on branch `motion-craft` (branched cleanly off `master` at `a3c1ad3`; preserves earlier `scroll-director` draft on `claude/cinematic-scroll-motion-6c286c`).

## What is complete

1. Renamed `scroll-director` -> `motion-craft` across `src/skills/motion-craft/`, `docs/skills/motion-craft/`, `tests/motion-craft.test.mjs`, and `src/factory/registry.json`.
2. Added Two-Tier stack selection (`references/stacks.md`), broadened supported domains (`references/directions.md`), GPU frame-budget hygiene (`references/motion-craft.md`), and Tier 2 GSAP `3.12.5` ScrollTrigger + Lenis Ticker Sync + Choreographed Pinned Scenes + Synchronised Three.js `0.160.0` WebGL Spatial Backdrop templates (`layers/08-output.md`).
3. Recorded all 16 fresh live evals (`evals/live/*.json`), verified `live-evals motion-craft: 16 passed, 0 failed` and `tests/motion-craft.test.mjs: 24/24 pass`.
4. Verified shadow routing (`proof/shadow.mjs` + `mc1`–`mc7`, `102` cases via `agy`): **102 passed, 0 failed** (`95/95` existing + `7/7` new).
5. Recorded `evals/portable.json` via `portable-check.mjs motion-craft --record --engine agy` outside the repo (`ok: true`, `usedSkill: true`, `leakedRepoRules: false`, `touchedRepo: []`, `produced: 0`).
6. Regenerated `examples/README.md` with both Tier 1 (`no-assets`) and Tier 2 (`gsap-lenis-saas`) real-agent examples.

## Ready-to-add routing cases (`mc1`–`mc7` for promotion to `ready`)

- `mc1`: `"I want a website that scrolls like a video for our tea shop, write me the prompt."` -> `motion-craft`
- `mc2`: `"ខ្ញុំចង់បាន website សម្រាប់ហាងកាហ្វេ \"ដើមត្នោត\" ដែល scroll ទៅដូចមើលវីដេអូ។ សូមសរសេរ prompt ឱ្យខ្ញុំ។"` -> `motion-craft`
- `mc3`: `"Give me a build prompt for our SaaS product launch using GSAP ScrollTrigger pinned scenes and Lenis ticker synchronisation."` -> `motion-craft`
- `mc4`: `"Write a prompt for an architecture studio showcase with a synchronised Three.js WebGL spatial backdrop on scroll."` -> `motion-craft`
- `mc5`: `"Build me a clean pricing landing page with a navbar, FAQ and footer in React."` -> `ui-craft`
- `mc6`: `"Make our admin invoice table dashboard scroll smoothly when rows are filtered."` -> `none`
- `mc7`: `"Write a Veo prompt for a cinematic 8 second drone shot over rice fields."` -> `none`

## Remaining before setting `ready`

- Agentic-Harness risk check on `roles` (`["UX_DESIGNER"]`) and `keywords` (AGENTS.md Rule 14).
- Owner approval to set `status: "ready"`, add `mc1`–`mc7` into repo `src/factory/routing/cases.json` + `live.json`, update `CHANGELOG.md` + `package.json`, run `npm run release:check`, and merge to `master`.
