# Production Motion Stacks (Two-Tier Selection)

Choose **exactly one** tier per plan based on the user's request. Never mix conflicting stack instructions in `GOAL`.

## Tier 1 — Lightweight Standalone (Default)

Use when the user names no framework or library, or asks for one standalone HTML file.

- **Stack:** `One index.html with inline CSS and JavaScript, no libraries; a Google Fonts link is allowed.`
- **Scroll loop:** native scroll + damped progress `drawn += (p - drawn) * (1 - exp(-dt / 120ms))`.
- **3D plain geometry (M3 offline):** inline Canvas 2D perspective projection or CSS 3D perspective (no external CDN scripts or module imports that fail on `file://`; note Three.js as a later multi-file upgrade if `.glb`/`.gltf` models are added).

## Tier 2 — Production Motion Stack

Use when the user asks for a framework (React, Next.js, Vite, Astro, Vue, Svelte), a production motion library, **GSAP / ScrollTrigger**, **Lenis**, **Three.js / WebGL spatial backdrop**, or choreographed full-screen pinned scenes in an app codebase.

### P1 — GSAP `3.12.5` + `ScrollTrigger`
- Register once: `gsap.registerPlugin(ScrollTrigger)`.
- Drive pinned or editorial motion from one `gsap.timeline({ scrollTrigger: { trigger, start: "top top", end: "bottom bottom", scrub: 1, pin: stage, invalidateOnRefresh: true } })` (omit `pin` for M5 natural editorial height).
- Wrap every timeline and ScrollTrigger inside `gsap.matchMedia()`:
  - `(prefers-reduced-motion: no-preference) and (min-width: 1024px)` for desktop `1440x900` choreography.
  - `(prefers-reduced-motion: no-preference) and (max-width: 1023px)` for mobile `390x844` / `360x640` choreography.
  - Automatic cleanup reverts all inline styles when reduced motion is enabled or a component unmounts.
- Call `ScrollTrigger.refresh()` after `document.fonts.ready` and on debounced `ResizeObserver`.

### P2 — Lenis + GSAP `3.12.5` Ticker Synchronisation
- Use when the user asks for Lenis or weighted smooth scroll in a Tier 2 stack (native scrollbar, wheel, touch, and keyboard navigation remain intact — this is weighted smoothing, never scroll hijacking).
- Sync exact frame timing with GSAP `3.12.5`:
  - `const lenis = new Lenis({ duration: 1.15, smoothWheel: true })`
  - `lenis.on("scroll", ScrollTrigger.update)`
  - `const tick = (time) => lenis.raf(time * 1000); gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);`
- Accessibility & cleanup:
  - Create Lenis ONLY inside `(prefers-reduced-motion: no-preference)`.
  - On reduced-motion change or unmount, call `gsap.ticker.remove(tick)` and `lenis.destroy()`.
  - On keyboard focus jump or hash deep-link, call `lenis.scrollTo(targetY, { immediate: true })` (or `window.scrollTo`).

### P3 — Choreographed Full-Screen Pinned Scenes
- Structure one persistent `100svh` pinned stage (`z-index: 0` ground/backdrop -> `z-index: 1` persistent motif/canvas -> `z-index: 2` single-wrapper text layers).
- Add explicit timeline labels at each scene boundary (`tl.addLabel("scene-1", 0)`, `"scene-2"`, `"scene-3"`).
- Drive outgoing text to `opacity: 0` before incoming text leaves `0`, while the persistent motif or spatial backdrop bridges the hand-over continuously.
- Use `ScrollTrigger.labelToScroll()` so keyboard focus on any deep link scrolls directly to that scene's hold state.

### P4 — Synchronised Three.js WebGL Spatial Backdrop
- Use pinned `three@0.160.0` (via npm in framework apps; never removed UMD `build/three.min.js`).
- Mount one shared `WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })` inside the stage media/backdrop container (`z-index: 1`, `overflow: hidden`), capped at `Math.min(window.devicePixelRatio, 2)`.
- Sync camera position and target directly to the same `ScrollTrigger` / Lenis progress `p` (`0..1`) via `THREE.CatmullRomCurve3`, coordinating FOV, lighting, fog, and material palette swaps with HTML field inversion (at least 4.5:1 contrast for all HTML copy).
- Pause WebGL rendering off-screen (`IntersectionObserver`), handle `webglcontextlost` by revealing the still Canvas 2D / static fallback with all copy intact, keep all real text in semantic HTML on dedicated non-overlapping safe zones (never baking text into textures), and dispose geometries, materials, and renderer on teardown.
