# figure-craft checklist: CDN edge cache figure

Source: `docs/skills/figure-craft/CHECKLIST.md` (35 items plus 20a-20c, 33a). Answers: yes, no, n/a, or NOT RUN.
Any no or NOT RUN blocks release.

Evidence key: **lint** = `lint-report.json` (L1-L8 on the rendered model); **test** = `node --test` run of the figure-craft test files; **code** = read in `cdn-edge-cache.html` or the engine; **browser** = rendered in a browser.

| # | Item | Answer | Evidence |
|---|------|--------|----------|
| 1 | Size chosen and stated | yes | Figure (one object, inline) |
| 2 | One idea, stated in one sentence | yes | "A request travels from the client to the edge cache, which answers it without asking the origin." |
| 3 | Concrete object | yes | Ground plate with client, edge cache and origin blocks |
| 4 | Fills and strokes all tokens (L6) | yes | lint: 0 errors; `fills`/`strokes` in lint-report.json all `var(--...)` or `none` |
| 5 | Light and dark from `TOKENS` via `tokensCss()`, no overrides | yes | code: `page()` in build-demo uses `tokensCss()`; no per-figure colour |
| 6 | Reads correctly in light and dark | **NOT RUN** | browser screenshot blocked (see report) |
| 7 | Contents rail | n/a | Figure size, not Page |
| 8 | One rail marker | n/a | Figure size, not Page |
| 9 | One reading column | yes | code: `main{max-width:720px}` |
| 10 | Margin notes below text on phones | n/a | no margin notes |
| 11 | Facts as label/value cards | yes | code: three `dl` cards (Client, Edge cache, Origin) |
| 12 | Phone gutter 16px | yes | code: `main{padding:24px 16px 48px}` |
| 13 | No horizontal scroll at 390px | **NOT RUN** | not rendered; by arithmetic the svg is about 340px wide and the cards use `minmax(180px,1fr)` |
| 14 | Supports drawn before what rests on them (L1) | yes | lint: 0 errors. Note: no shape sets `rests`, so L1 passes vacuously; draw order is still supports first |
| 15 | Face detail in face plane, inside, away from corners (L2) | yes | lint: 0 errors (one dot on `edge` top face at z=40) |
| 16 | Labels in side columns, gap at least 13 (L3) | yes | lint: 0 errors |
| 17 | Leaders avoid other solids (L4) | yes | lint: 0 warnings |
| 18 | Shapes and label text inside viewBox (L5) | yes | lint: 0 errors |
| 19 | No decorative dots; each dot named | yes | the one dot is named in the caption ("The green light means a cache hit.") |
| 20 | Shared projection, no hand skew | yes | code: all geometry through `project` in `engine/iso.mjs` |
| 20a | No marker at leader ends | yes | `build-demo` test "demo html has no leader-end dots or markers" passed |
| 20b | Label text at least 11 CSS px at 390px | yes (calculated) | `labelPxAt390` = 11.98 in lint-report.json. Calculated from the viewBox, not measured in a browser |
| 20c | Theme button names its target, `aria-pressed` tracks dark | yes (code) | code: `sync()` sets "Light theme"/"Dark theme" and `aria-pressed`; not clicked in a browser |
| 21 | One looping story | yes | code: keyframes `infinite`, request box moves along x |
| 22 | Motion on one iso axis (L8) | yes | lint: 0 errors (`move: [26,0,0]`) |
| 23 | Still under reduced motion (L7) | yes (code) | lint: 0 errors; code: `@media (prefers-reduced-motion: reduce){animation:none}`; the pause button is hidden under reduced motion. Not seen in a browser |
| 24 | Still frame explains the idea | yes (by reading) | Labels and caption carry the idea without motion. Not looked at in a rendered still |
| 25 | Each sentence one idea, plain words | yes | Caption has two sentences, one idea each |
| 26 | Copy short | yes | Labels are 1-3 words |
| 27 | Only facts the page keeps true | yes | No counts, versions or badges |
| 28 | Same keys in every language | n/a | one language shipped |
| 29 | Build and lint zero errors | yes | build ran; lint 0 errors, 0 warnings; skill `lint-skills` no problems |
| 30 | Geometry L1-L8 run on rendered model | yes | `lint-report.json`, model from the same shapes as the page (byte parity check) |
| 31 | Screenshots in light, dark, 390px, second language | **NOT RUN** | Chrome headless screenshot needed approval and was not run; no second language |
| 32 | Console free of errors | **NOT RUN** | needs a browser |
| 33 | Reduced motion checked to show still figure | **NOT RUN** | needs a browser; the Playwright visual test was skipped |
| 33a | Demo files equal `buildDemo()` byte for byte | yes | `build-demo` test "buildDemo output matches committed files byte for byte" passed; `cdn-edge-cache.html` is `buildDemo().demoHtml` |
| 34 | Someone other than the author restates the idea | **NOT RUN** | needs a human reader |
| 35 | Lint warnings fixed or justified | yes | 0 warnings |

## Outcome

Not releasable yet. Items 6, 13, 31, 32, 33 and 34 are NOT RUN. Items 7, 8, 10 and 28 are n/a for this size and language count. All other items are yes.
