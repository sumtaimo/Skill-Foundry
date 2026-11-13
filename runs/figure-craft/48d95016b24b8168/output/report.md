# figure-craft report: how a CDN edge cache serves a request

Prompt: "explain how a CDN edge cache serves a request, interactive"

## Files

- `cdn-edge-cache.html`: the self-contained interactive page (tokens inlined, no external scripts). Byte-identical to `buildDemo().demoHtml` from the skill's `examples/build-demo.mjs`.
- `cover.svg`: flat cover figure from the same engine (`buildDemo().coverSvg`).
- `lint-report.json`: L1-L8 result on the rendered figure model, plus label size and palette use.
- `checklist-result.md`: answers to `docs/skills/figure-craft/CHECKLIST.md`.
- `build-figure.mjs`: rebuilds the figure from the engine and checks it against the skill's demo. Run with `node build-figure.mjs`.

## Idea

A request travels from the client to the edge cache, which answers it without asking the origin.

## Object and parts

A ground plate with three blocks: Client, Edge cache (ink tone) and Origin. Labels: `Client`, `Request`, `Edge cache`, `Origin (skipped)`. One green dot on the edge cache top marks a cache hit.

## Motion story

The request block slides along the x axis from the client to the edge cache, loops every 3.2 s, and stops under `prefers-reduced-motion`. The still frame shows the labelled blocks and the caption, so the idea reads without motion.

## Lint

L1-L8 on the rendered model: 0 errors, 0 warnings. Labels render at 11.98 CSS px at 390px (calculated from the viewBox). `lint-skills figure-craft`: no problems.

## Tests

`node --test` on the four figure-craft test files: 23 pass, 0 fail, 1 skipped. The skipped one is the visual test (Playwright is not installed).

## Open items

1. **Browser checks not run.** Headless Chrome is installed, but the screenshot command needed approval and I did not run it. Still needed: light, dark and 390px screenshots, a console-error check, a reduced-motion still, and no horizontal scroll at 390px. Checklist items 6, 13, 31, 32 and 33 depend on these.
2. **No second language.** Item 31 asks for a second-language screenshot. Only English is shipped.
3. **Independent read.** Item 34 needs someone other than the author to restate the idea.
4. **Vacuous L1.** No shape sets `rests`, so L1 passes without checking anything. Draw order is still supports first. Setting `rests` would make the rule bite.
5. **Node version.** The skill says Node 24. This environment has Node 22.23.4; the engine and tests ran without errors.
6. **Skill folder not modified.** I did not run the skill's `build-demo.mjs` as a script, because it writes into the skill folder. I only imported it.
