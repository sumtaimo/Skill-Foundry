# Motion craft

Numbers and failure rules the builder needs. Copy only the lines that fit the chosen model and stack tier.

## Scroll engine and GPU budget

- **Tier 1 (standalone default):** A track of `450vh` (or `600vh` for 4 to 6 scenes) holds one `position: sticky; top: 0; height: 100svh` stage. No ancestor of the stage has `overflow: hidden`. `p = clamp(-track.getBoundingClientRect().top / (track.offsetHeight - stage.offsetHeight), 0, 1)`. Smooth with `drawn += (p - drawn) * (1 - exp(-dt / 120ms))`; set `drawn = p` on load, resize and anchor jump.
- **Tier 2 (production stack — see `references/stacks.md`):** Use `GSAP 3.12.5` + `ScrollTrigger` wrapped in `gsap.matchMedia()` (`(prefers-reduced-motion: no-preference)`), optionally paired with `Lenis` synchronised via `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, and `gsap.ticker.lagSmoothing(0)`. Call `ScrollTrigger.refresh()` after `document.fonts.ready`.
- Everything is a pure function of progress `p`/`drawn`, so scrolling back reverses it. Never call `preventDefault` to hijack native wheel/touch or block native keyboard scrolling.
- Animate only composite properties (`transform`, `opacity`, `clip-path`), eased `cubic-bezier(0.22, 1, 0.36, 1)` inside each range. Apply `will-change: transform` only on active animated layers and avoid layout reads (`offsetHeight`, `getBoundingClientRect`) inside per-frame `onUpdate` loops (cache metrics on resize/refresh).

## Scenes

- Scene 1 is fully visible and still at p = 0, with no entrance: its text and shapes are drawn in full, none starting at opacity 0, scale 0 or an undrawn stroke. The last scene is complete and still at p = 1.
- All percentages are of the whole track, taken from the timing table of layer 08.
- Each scene holds still between its text in and its text out.
- Outgoing text reaches opacity 0 before incoming text leaves 0. Planes and shapes cover that moment, so it is never an empty screen.
- The signature motif stays on screen through every hand-over. Keep the stage background and inverted-field plane behind both motif and text (`z-index` lower than both: background `0`, persistent motif/canvas `1`, text `2`), start in Scene 1's opening ground at `p = 0`, change field colour only while no text is visible, and explicitly switch text hex and motif strokes/fills to high-contrast light/dark tones on inverted fields (never rely on CSS `filter: invert()` alone).
- A moving plane or shape never crosses readable text.
- Use `visibility: hidden` only on decorative layers. A focused link scrolls the page to the hold of its scene (using `ScrollTrigger.labelToScroll()` in Tier 2).

## Type and fit

- Display `clamp(36px, 5.2vw, 144px)` (or scaled down via container/viewport width, never below 36px); every scene's main line (also a category or subject line) is display type sized so the longest word fits inside both the 40% desktop column (`1440x900`) and mobile frames (`390x844`, `360x640`) with zero right-edge clipping. Body 16px or more; text measure 60ch or less.
- At 1440x900 (M1 to M4), before the last scene, place the motif/media box (`width: 60%`, full height, `overflow: hidden`) and text column (`width: 40%`, vertically centred) in non-overlapping regions so artwork never bleeds behind text. In the closing lockup (last scene of M1 and M2), use two separated rows (`minmax(0, 64%)` with `overflow: hidden` above `minmax(0, 36%)`) at full width so the whole motif stays strictly inside the top 64% box and the closing name stays centred in view in the bottom 36% with zero overlap. Keep one persistent motif box (`overflow: hidden; min-height: 0; min-width: 0; z-index: 1`, text layer `z-index: 2`, background layer `z-index: 0`), never stack duplicate opaque scene SVGs on top of each other inside the stage, set `overflow-x: clip` on the stage, cap the inner SVG to `max-width: 85%; max-height: 85%` (aspect ratio preserved), keep all M3/canvas media inside its overflow-hidden split box so lines never cross text, and transform only the inner graphic — never scale the box itself. Keep scene-jump keyboard links visually hidden until `:focus-visible` unless a navbar was requested.
- At 390x844 and 360x640 (M1 to M4), the motif or media box is top 0 to 45% of the stage in every scene and text sits between 52% and 94%, both inside 24px gutters (centred in the last scene). Shrink the display size until the longest line fits; nothing is clipped and nothing scrolls sideways.
- Latin line height 1.05 for display, 1.5 for body, with mask padding 0.1em above and below on reveal masks so ascenders and descenders are not cut. Khmer: line height 1.6, letter spacing 0, `lang="km"`, reveal by line or block, never by character (clusters and subscripts break), and mask padding 0.2em above and below so marks are not cut.

## Media and 3D

- With video or photos the media is the motif. Each scene changes its crop or scale (for M4, advance the horizontal filmstrip across frames without forcing a 2x CSS crop or closing lockup).
- Video (M2): muted, `playsinline`, `preload="metadata"`, poster image, a keyframe at least every 10 frames. Seek only after the last seek finishes; show the poster on error.
- 3D / Spatial Backdrop (M3): device pixel ratio capped at 2, rendering paused off screen (`IntersectionObserver`), `webglcontextlost` shows the static version. Real text stays in HTML on dedicated safe zones; frame shots by camera distance/FOV along a `CatmullRomCurve3` path rather than CSS scale.
  - **Tier 1 (standalone offline HTML with plain geometry):** render rooms with inline Canvas 2D perspective or CSS 3D (avoid fragile raw WebGL shaders and emit zero external CDN scripts or module imports that fail on `file://`; keep Three.js noted as a multi-file upgrade if authored `.glb`/`.gltf` models are added later).
  - **Tier 2 (production framework / WebGL spatial backdrop):** use pinned `three@0.160.0` synchronised to the same `ScrollTrigger` / Lenis progress `p`, with an inline Canvas 2D / static fallback on `webglcontextlost` and full renderer/geometry disposal on cleanup.
- Drawn shapes (M1 and M5): build every change from `transform`, `opacity` and `clip-path` of the named SVG parts. Never ask for path morphing.

## Editorial flow (M5) and spatial canvas (M6)

- M5 keeps natural document height (no `position: sticky` `100svh` stage or closing lockup); full-width edge-to-edge `<section>` bands (especially inverted bands) enclose an inner reading column in order (`max-width: 60ch; margin-inline: auto`, 24px phone gutters), put `overflow: hidden` on every motif box (`max-width: 100%`) and `overflow-x: clip` on `html, body` and every section so shifted SVGs never cause sideways scroll, switch dark SVG fills to light hex tones inside inverted bands, animate only `transform`, `opacity` and `clip-path` from section progress (never hide inner `.copy` children separately from the animated text wrapper), and invert at least one chapter or band.
- M6 uses one `100svh` pan-and-zoom canvas (no fixed `Track <n>vh` scroll track or closing lockup): pointer pan/zoom and `Tab`/arrow keys step through items in order, centring each item smoothly, with `Esc` or the final stop returning to overview.

## Fallbacks and verification

- Base HTML and CSS is the static version: every scene a compact auto-height section in reading order (no `100svh` spacer pushing Scene 1 text below the fold), every word visible at opacity 1, sticky stage/track hidden (`display: none`) until active, and when the active stage class IS set the static fallback sections are hidden (`display: none`) so they never bleed under or overlap the stage. JavaScript adds one class (or enters `gsap.matchMedia()`) that turns on the stage only when `prefers-reduced-motion` is not `reduce`.
- Live change of that setting switches versions cleanly (reversing `gsap.matchMedia()` and destroying Lenis in Tier 2). Content stays visible if execution throws.
- Waiting longer than 300ms shows the poster or a quiet `role="status"` line, never a blank screen.
- Keyboard: every link reachable with visible focus, scrolling to its scene's hold. Reload at mid-scroll draws the mid-scroll state. Deep link `#scene-n` jumps straight to that scene's hold.
