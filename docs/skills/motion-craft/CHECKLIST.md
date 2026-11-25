# motion-craft — Quality Checklist

## Draft Proof Summary (2026-11-24, `0.1.0` draft)

- **Name & Scope:** Renamed and broadened from `scroll-director` to `motion-craft` to serve general interactive web motion beyond cinema (SaaS launches, developer tools, hardware reveals, architecture/3D spatial showcases, editorial essays, portfolios, exhibitions — English, Khmer, or any language).
- **Two-Tier Stack Architecture (`references/stacks.md`):**
  - **Tier 1 (Default):** Zero-dependency standalone `index.html`, native scroll + damped `drawn` loop, offline Canvas 2D / CSS 3D for plain-geometry M3.
  - **Tier 2 (Production Motion Stack):** Pinned **GSAP `3.12.5` + `ScrollTrigger`** inside `gsap.matchMedia()`, **Lenis + GSAP `3.12.5` Ticker Synchronisation** (`lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`), **Choreographed Full-Screen Pinned Scenes** (`ScrollTrigger.labelToScroll()`), and **Synchronised Three.js `0.160.0` WebGL Spatial Backdrop** (`THREE.CatmullRomCurve3`, `dpr <= 2`, `IntersectionObserver`, `webglcontextlost` Canvas 2D fallback, full unmount disposal).
- **Live evals (16/16 pass):** Re-recorded all 16 cases (`agy (gemini-4-hydrogen-medium)` for 10 cases incl. `gsap-lenis-saas`, `threejs-webgl-backdrop`, Khmer, and all demo prompts; `codex (gpt-5.6-luna)` for 6 English cases). `node --test tests/motion-craft.test.mjs`: **24/24 pass**.
- **Shadow routing (`agy`, 102 cases):** **102 passed, 0 failed** (`95/95` existing cases + `7/7` new `mc1`–`mc7` cases covering classic scroll, Khmer, SaaS GSAP+Lenis, Three.js WebGL spatial backdrop, and negative boundaries). Kept out of repo `src/factory/routing/` while `status: "draft"`.
- **Portable check (`agy`):** Recorded `src/skills/motion-craft/evals/portable.json` on the Tier 2 GSAP + Lenis prompt outside the repo (`exit: 0`, `usedSkill: true`, `leakedRepoRules: false`, `touchedRepo: []`, `produced: 0`; hash verified).
- **Lint & Guard:** `node src/factory/lint-skills.mjs motion-craft` (`no problems`), `npm run guard` (`skill-guard: ok (skill: motion-craft)`).

## Promotion to `ready` (2026-11-25, `0.1.0` ready; Skill Foundry `1.9.0`)

- **Rebase onto `master`:** Rebased `motion-craft` cleanly onto `master` (`9435546`) with zero conflicts.
- **Agentic-Harness risk check (AGENTS.md Rule 14):** Verified `roles: ["UX_DESIGNER", "BA_ANALYST"]` against Agentic-Harness `.harness/roles/` and all `.harness/skills/` (`brand-craft`, `ui-craft`, `spec-writer`, `api-craft`, etc.) plus all Skill Foundry ready skills — zero role or keyword collisions; non-default (`fetched on demand`). Including `BA_ANALYST` alongside `UX_DESIGNER` (both spec/planning roles that write no page code) ensures backward compatibility with older Agentic-Harness installs (e.g. `release-v1.0.6` without `ux-designer.json`) so `foundry doctor` reports 0 problems.
- **Registry & routing:** Promoted `status: "ready"` in `src/factory/registry.json` (`version: "0.1.0"`, non-default); added `mc1`–`mc7` into `src/factory/routing/cases.json` and recorded live routing via `agy` (`102/102` passed, `0` failed, `0` stale).
- **Tests, release tracking & gates:** Updated `tests/site-finder.test.mjs` (`UX_DESIGNER` ready skills list), bumped `package.json` to `1.9.0`, added `## 1.9.0 - 2026-11-25` to root `CHANGELOG.md`, and verified `npm run guard`, `npm run release:check` (`READY`), and Agentic-Harness `test/audit.mjs --foundry`.
- **Pending owner action:** Merge `motion-craft` to `master` after TAIMO's in-chat approval.
