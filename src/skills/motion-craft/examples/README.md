# Examples — motion-craft

## Example 1 (Tier 1 — standalone zero-dependency HTML/CSS/JS)

> Prompt: I run a small pottery studio called Field Kiln. I want a website that scrolls like a film and does not look like AI. I have no photos or video yet. Give me the prompt.

## Direction
**Model:** M1 Pinned scene story
**Look:** Material First
**Stack:** Tier 1 standalone HTML/CSS/JS
**Motion craft:** Weighted response, Masked line reveal, Scale hand-over
**Why:** You have no photos or video yet, so M1 uses a single persistent multi-tone SVG motif inside a standalone `index.html` with native scroll and weighted easing instead of heavy libraries or stock stand-ins. Material First pairs a warm clay-and-paper palette (`#E8DFD2` and `#2B2119`) with Fraunces and Work Sans, avoiding card grids, neon gradients, and bounce so the page feels deliberate rather than template-generated.

## Scene plan
| # | Scroll | On screen | Motion | Still version |
|---|---|---|---|---|
| 1 | 0-33% | "Field Kiln" on the left; whole stoneware vessel silhouette on the right over warm clay ground | Vessel holds steady, then scales up toward the rim and shifts left as text masks out | Static section with "Field Kiln" and vessel |
| 2 | 33-67% | "A small pottery studio." on the right; close-up on the vessel rim and handles on an inverted dark ground | Close-up holds tilted, throwing-rib bands brighten and ear handles open slightly, then zooms back out | Static section with "A small pottery studio." and close-up vessel |
| 3 | 67-100% | Centred closing lockup with the whole vessel above and "Field Kiln" centred below | Vessel settles upright in the top band while the closing name reveals and holds | Static closing section with vessel and "Field Kiln" |

## Prompt
```text
GOAL: An interactive scrollytelling showcase for a small pottery studio called Field Kiln, built for visitors to understand the studio and remember its name. One index.html with inline CSS and JavaScript, no libraries; a Google Fonts link is allowed.
CONTENT: Scene 1: "Field Kiln" · Scene 2: "A small pottery studio." · Scene 3: "Field Kiln". Add no other words or facts.
SCENES: Track 450vh. All percentages are of the whole track, from one progress value.
Motif: A stoneware pottery vessel silhouette in three levels: (a) main masses: a rounded belly tapering to a footed base and a flared collar neck (4:3 height-to-width ratio) in --motif-body (#6E3B1E on light ground, #D8B58F on inverted dark ground); (b) identifying parts: 1 flared lip rim, 1 recessed neck band, 1 curved belly body, 1 stepped foot ring at the base, and 2 symmetrical arched ear handles flanking the upper shoulder; (c) surface detail: 3 concentric horizontal throwing-rib bands across the shoulder and 1 crescent highlight along the left belly curve in --motif-highlight (#C49A76 on light ground, #F2EBE0 on dark ground) and --motif-accent (#2B2119 on light ground, #9E6B47 on dark ground).
Draw it with care as one inline SVG: closed, filled, curved paths in at least three distinct palette hex tones (main body, lighter highlight, accent detail — bound to CSS variables inheriting each section/scene's theme, never a hardcoded dark fill) with a tight viewBox. No stick lines and no bare circles or rectangles standing in for the object. Whenever a scene or inverted band turns dark, update those CSS variables so dark SVG fills switch to light hex tones and every part stays clear across every scene.
Scene 1 | 0-33% | motif right, centre 50%/50% of its area, whole vessel at scale 1, rotated 0deg, ground #E8DFD2 | whole vessel still at scale 1, throwing-rib bands at opacity 0.65 | hold 0-26, out 26-32
Scene 2 | 33-67% | motif left, centre 52%/38% of its area, close-up at scale 2 on the flared lip rim and upper shoulder handles, rotated -6deg, field inverted (#2B2119 ground, #E8DFD2 text) | whole motif scale 1 -> 2 toward the rim and shoulder and rotate 0 -> -6deg at 26-40%, ear handles rotate outward 0 -> 4deg, throwing-rib bands opacity 0.65 -> 1, field swaps at 32-34% | in 34-40, hold 40-60, out 60-66
Scene 3 | 67-100% | centred closing lockup (motif in top 64% box, closing name in bottom 36%), centre 50%/50% of top box, whole vessel at scale 1, rotated 0deg, ground #E8DFD2 | motif scale 2 -> 1 and rotate -6 -> 0deg at 60-74%, ear handles settle 4 -> 2deg, throwing-rib bands stay at opacity 1, field swaps at 66-68% | in 68-74, hold 74-100
MOTION: p = clamp(-track.getBoundingClientRect().top / (track.offsetHeight - stage.offsetHeight), 0, 1). One track, one position: sticky; top: 0; height: 100svh stage, no ancestor with overflow hidden.
Smooth with drawn += (p - drawn) * (1 - exp(-dt / 120ms)); set drawn = p on load, resize and anchor jump. Every value is a pure function of drawn, so scrolling back reverses it.
Animate only transform, opacity and clip-path, eased cubic-bezier(0.22, 1, 0.36, 1) inside each range. Never prevent or replace native scroll.
Scene 1 is complete at 0% and the last scene at 100%. Outgoing text is at opacity 0 before incoming text appears. The motif stays visible through every hand-over.
LOOK: Ground #E8DFD2, text #2B2119, accent #6E3B1E; inverted field swaps to ground #2B2119 and text #E8DFD2 (accent #6E3B1E or #D8B58F for shapes only, never text); display Fraunces (serif fallback) and body Work Sans (sans-serif fallback). Display clamp(36px, 5.2vw, 144px). The main line of every scene, also a category or subject line, is display type: scale down cleanly inside 40% desktop columns or mobile frames so the longest word fits inside its container with at least 24px margin and zero right-edge clipping, and never under 36px. Body at least 16px, measure at most 60ch. Keep the stage and inverted background layer strictly behind both motif and text (background z-index 0, single motif layer z-index 1, text layer z-index 2); drive opacity on only ONE wrapper per scene so inner .copy/.mask elements stay at opacity 1 (never leaving Scene 1 hidden at p = 0); at p = 0 the stage starts in Scene 1's opening ground (never inverted at rest), and when a later scene inverts, drive ground, text and motif colours together through inherited root/stage CSS variables at every breakpoint (>= 4.5:1 contrast; never use filter invert alone and never hardcode dark text under mobile media queries). Line height 1.05 for display, 1.5 for body, mask padding 0.1em.
LAYOUT: The motif lives in one persistent stage-bound centred box (overflow hidden; min-height 0; min-width 0; z-index 1) with overflow-x clip on the stage (never stack duplicate scene SVGs in the sticky stage). At scale 1 the whole silhouette fits inside that box (SVG max-width 85% and max-height 85%, width/height auto, aspect ratio preserved) so nothing clips below the fold at 0% or 100%; draw one unified single-SVG motif (never floating disconnected halves) and animate transform only on the inner graphic, never scale the box itself.
At 1440x900, before the last scene, place the motif box (width 60%, height 100%, overflow hidden) and the text column (width 40%, vertically centred) side by side in separate non-overlapping regions so the motif never bleeds behind text. Scene 1: motif right, text left; Scene 2: motif left, text right.
The last scene is a centred closing lockup, unlike the first: use a two-row grid or flex column of top 64% (minmax(0, 64%), overflow hidden) above bottom 36% (minmax(0, 36%)) at full width so the entire SVG motif stays inside the top 64% box and never shares space with or covers the closing name centred in the bottom 36%.
At 390x844 and 360x640 the box is top 0 to 45% of the stage in every scene and text sits between 52% and 94%, with 24px gutters, centred in the last scene. Text and motif never overlap, nothing is clipped, nothing scrolls sideways; shrink the display size until the longest line fits.
ASSETS: None: draw everything in SVG and CSS. No stock, generated or placeholder media.
FALLBACKS: Base HTML and CSS is the static version: semantic sections in reading order, every word visible at opacity 1, sticky stage/track hidden (display none) until active, compact auto-height static sections (no 100svh spacer above text) above the fold with zero overlap; and when the active stage class IS set, hide the static fallback container (display none) so static copy never shows behind or beneath the stage. Keep keyboard scene-jump links visually hidden until focused (:focus-visible) unless a top navbar was requested, so only the active scene copy is shown at rest. JavaScript adds the class that turns on the stage only when prefers-reduced-motion is not reduce, switches live when that changes, and removes it if setup throws.
Keyboard: every link is reachable, has visible focus, and focusing it scrolls to the hold of its scene. A deep link lands on that hold. Reload and resize draw the state of the current position.
Failed media shows the poster or the drawn still with the text intact; waiting over 300ms shows the poster or a quiet role="status" line, never a blank screen.
AVOID: sections that look like stacked template blocks while motion is on, scroll progress bars and decorative loading bars, card grids, glowing borders, neon or purple-blue gradients, pill badges, text on top of media, bounce, springs, scroll hijacking, cursor followers, invented statistics, testimonials, logos and stock media.
DONE WHEN: At 0, 25, 50, 75 and 100% on 1440x900, 390x844 and 360x640 the screen matches SCENES, with no overlapping text, empty screen, sideways scroll or console error.
Reduced motion and no JavaScript show every word. Tab shows each link in view. Reload at 50% draws the 50% state. Report each check as passed, failed or not run.
```

## Needs from you
- A short all-keyframe video (MP4/WebM) and poster image, or studio photographs, if you later want to upgrade from the drawn SVG motif to scroll-scrubbed video (M2).
- Any additional copy (such as location, hours, or a contact link) if you want to expand beyond the three-scene intro.

---

## Example 2 (Tier 2 — React + Vite + GSAP 3.12.5 ScrollTrigger + Lenis Ticker Sync)

> Prompt: Design a choreographed full-screen pinned scroll showcase for our developer CLI tool, PulseTrace, built in React + Vite using GSAP 3.12.5 ScrollTrigger and Lenis ticker synchronisation. No images yet — use diagram geometry. Give me the build prompt.

## Direction
**Model:** M1 Pinned scene story
**Look:** Swiss Typographic Grid
**Stack:** Tier 2 production stack (React + Vite + GSAP 3.12.5 ScrollTrigger + Lenis ticker sync)
**Motion craft:** Weighted response, masked line reveal, scale hand-over
**Why:** M1 Pinned scene story choreographs a single pinned viewport across three distinct diagram states without needing screenshots or video yet, powered by GSAP 3.12.5 ScrollTrigger and Lenis ticker synchronisation in React + Vite. Swiss Typographic Grid pairs a crisp `#FFFFFF` ground, `#111111` ink, and `#B3261E` shape accent with Inter Tight for a clean technical look that inverts cleanly in the middle scene. Weighted response, masked line reveal, and scale hand-over pace the transitions while keeping native scroll and static fallbacks intact.

## Scene plan
| # | Scroll | On screen | Motion | Still version |
|---|---|---|---|---|
| 1 | 0-33% | "PulseTrace" beside the whole execution-trace diagram on `#FFFFFF` | Diagram holds still; text exits cleanly | Full trace diagram and "PulseTrace" |
| 2 | 33-67% | "Developer CLI tool." beside a close-up of the branching span junction on inverted `#111111` | Diagram scales in and rotates; span capsules shift | Close-up diagram crop and subject line |
| 3 | 67-100% | Centred closing lockup with the settled trace diagram above "PulseTrace" | Diagram settles back to whole view; terminal diamond scales | Settled diagram above "PulseTrace" |

## Prompt
```text
GOAL: A choreographed full-screen pinned scroll showcase for PulseTrace, a developer CLI tool, for visitors who want to understand the subject and remember PulseTrace. React + Vite with pinned GSAP 3.12.5 ScrollTrigger (plus Lenis ticker sync), wrapped in gsap.matchMedia() with full static fallback.
CONTENT: Scene 1: "PulseTrace". Scene 2: "Developer CLI tool.". Scene 3: "PulseTrace". Add no other words or facts.
SCENES: Track 450vh. All percentages are of the whole track, from one progress value.
Motif: one unified execution-trace diagram silhouette recognisable with no label: (a) main masses: a stepped horizontal trace housing and three cascading span lanes (68% width, 74% height of viewBox) in --motif-body and --motif-shadow; (b) identifying parts: 1 tapered command-entry chevron block at the left origin, 4 interlocking rounded-bevel span capsules arranged in a 3-tier waterfall, 3 curved connector ribbons linking parent to child lanes, and 1 terminal status diamond in --motif-highlight; (c) surface detail: 6 graduated tick-notch inlays along the top datum rail and 3 inner latency-bar cutouts inside the span capsules in --motif-accent.
Draw it with care as one inline SVG: closed, filled, curved paths in at least three distinct palette hex tones (main body, lighter highlight, accent detail — bound to CSS variables inheriting each section/scene's theme, never a hardcoded dark fill) with a tight viewBox. No stick lines and no bare circles or rectangles standing in for the object. Whenever a scene or inverted band turns dark, update those CSS variables so dark SVG fills switch to light hex tones and every part stays clear across every scene.
Scene 1 | 0-33% | motif right, centre 50%/50% of its area, whole diagram at scale 1, rotation 0deg, field #FFFFFF | whole diagram still at scale 1, rotation 0deg, span capsules at translateX 0 | text hold 0-26, out 26-32
Scene 2 | 33-67% | motif left, centre 55%/45% of its area, close-up at scale 2 on the central branching span junction and datum ticks, rotated -6deg, field inverted (#111111 ground, #FFFFFF text) | whole diagram scale 1 -> 2 toward the central span junction and rotate 0 -> -6deg at 26-40%, span capsules translateX 0 -> 14px and connector ribbons opacity 0.7 -> 1, field and motif palette variables swap at 32-34% | text in 34-40, hold 40-60, out 60-66
Scene 3 | 67-100% | centred closing lockup (motif in top 64% box at centre 50%/52%, whole diagram at scale 0.92, rotated 6deg; closing name centred in bottom 36%), field #FFFFFF | whole diagram scale 2 -> 0.92 and rotate -6 -> 6deg at 60-74%, terminal status diamond scale 1 -> 1.18 and span capsules settle translateX 14px -> 0, field and motif palette variables swap back at 66-68% | text in 68-74, hold 74-100
MOTION: p = clamp(-track.getBoundingClientRect().top / (track.offsetHeight - stage.offsetHeight), 0, 1). One track, one position: sticky; top: 0; height: 100svh stage, no ancestor with overflow hidden.
Smooth with drawn += (p - drawn) * (1 - exp(-dt / 120ms)); set drawn = p on load, resize and anchor jump. Every value is a pure function of drawn, so scrolling back reverses it.
Animate only transform, opacity and clip-path, eased cubic-bezier(0.22, 1, 0.36, 1) inside each range. Never prevent or replace native scroll.
Scene 1 is complete at 0% and the last scene at 100%. Outgoing text is at opacity 0 before incoming text appears. The motif stays visible through every hand-over.
Register gsap.registerPlugin(ScrollTrigger) and wrap all timelines inside gsap.matchMedia() on (prefers-reduced-motion: no-preference) plus desktop/mobile breakpoints, calling ScrollTrigger.refresh() after document.fonts.ready. Add scene labels (scene-1..3) and use ScrollTrigger.labelToScroll() for focus jumps. Sync Lenis via lenis.on("scroll", ScrollTrigger.update), gsap.ticker.add((t) => lenis.raf(t * 1000)), gsap.ticker.lagSmoothing(0), destroying Lenis and removing the ticker callback on reduced-motion or unmount.
LOOK: Ground #FFFFFF, text #111111, accent #B3261E (shapes only, never text); inverted field #111111 ground, #FFFFFF text, motif CSS variables shifting to light tones (#D4D4D4 body, #FFFFFF highlight, #8A8A8A shadow, #E04F44 accent); Inter Tight display and body with system-sans / sans-serif fallbacks. Display clamp(36px, 5.2vw, 144px). The main line of every scene, also a category or subject line, is display type: scale down cleanly inside 40% desktop columns or mobile frames so the longest word fits inside its container with at least 24px margin and zero right-edge clipping, and never under 36px. Body at least 16px, measure at most 60ch. Keep the stage and inverted background layer strictly behind both motif and text (background z-index 0, single motif layer z-index 1, text layer z-index 2); drive opacity on only ONE wrapper per scene so inner `.copy`/`.mask` elements stay at opacity 1 (never leaving Scene 1 hidden at p = 0); at p = 0 the stage starts in Scene 1's opening ground (never inverted at rest), and when a later scene inverts, drive ground, text and motif colours together through inherited root/stage CSS variables at every breakpoint (>= 4.5:1 contrast; never use filter invert alone and never hardcode dark text under mobile media queries). Line height 1.05 for display, 1.5 for body, mask padding 0.1em.
LAYOUT: The motif lives in one persistent stage-bound centred box (overflow hidden; min-height 0; min-width 0; z-index 1) with overflow-x clip on the stage (never stack duplicate scene SVGs in the sticky stage). At scale 1 the whole silhouette fits inside that box (SVG max-width 85% and max-height 85%, width/height auto, aspect ratio preserved) so nothing clips below the fold at 0% or 100%; draw one unified single-SVG motif (never floating disconnected halves) and animate transform only on the inner graphic, never scale the box itself.
At 1440x900, before the last scene, place the motif box (width 60%, height 100%, overflow hidden) and the text column (width 40%, vertically centred) side by side in separate non-overlapping regions so the motif never bleeds behind text. Scene 1: motif right, text left; Scene 2: motif left, text right.
The last scene is a centred closing lockup, unlike the first: use a two-row grid or flex column of top 64% (minmax(0, 64%), overflow hidden) above bottom 36% (minmax(0, 36%)) at full width so the entire SVG motif stays inside the top 64% box and never shares space with or covers the closing name centred in the bottom 36%.
At 390x844 and 360x640 the box is top 0 to 45% of the stage in every scene and text sits between 52% and 94%, with 24px gutters, centred in the last scene. Text and motif never overlap, nothing is clipped, nothing scrolls sideways; shrink the display size until the longest line fits.
ASSETS: None: draw everything in SVG and CSS. No stock, generated or placeholder media.
FALLBACKS: Base HTML and CSS is the static version: semantic sections in reading order, every word visible at opacity 1, sticky stage/track hidden (display none) until active, compact auto-height static sections (no 100svh spacer above text) above the fold with zero overlap; and when the active stage class IS set, hide the static fallback container (display none) so static copy never shows behind or beneath the stage. Keep keyboard scene-jump links visually hidden until focused (:focus-visible) unless a top navbar was requested, so only the active scene copy is shown at rest. JavaScript adds the class that turns on the stage only when prefers-reduced-motion is not reduce, switches live when that changes, and removes it if setup throws.
Keyboard: every link is reachable, has visible focus, and focusing it scrolls to the hold of its scene. A deep link lands on that hold. Reload and resize draw the state of the current position.
Failed media shows the poster or the drawn still with the text intact; waiting over 300ms shows the poster or a quiet role="status" line, never a blank screen.
AVOID: sections that look like stacked template blocks while motion is on, scroll progress bars, decorative loading bars, card grids, glowing borders, neon or purple-blue gradients, pill badges, text on top of media, bounce, springs, scroll hijacking, cursor followers, invented statistics, testimonials, logos, and stock or generated media.
DONE WHEN: At 0, 25, 50, 75 and 100% on 1440x900, 390x844 and 360x640 the screen matches SCENES, with no overlapping text, empty screen, sideways scroll or console error.
Reduced motion and no JavaScript show every word. Tab shows each link in view. Reload at 50% draws the 50% state. Report each check as passed, failed or not run.
```

## Needs from you
- Any additional copy for PulseTrace (such as a short description, install command, or call-to-action link) if you want more than the name and subject shown.
- Real CLI output captures or authored diagram assets if you later want to replace the drawn SVG diagram geometry.
