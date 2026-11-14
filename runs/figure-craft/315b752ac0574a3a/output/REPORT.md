# figure-craft report: load balancer in front of three servers

## Decisions
- Size: **Figure** (one inline figure, no contents rail).
- Idea (one sentence): "A load balancer receives each request and sends it to one of three servers."
- Object: one load balancer box in front of three server boxes.
- Motion story: one small request box travels 18 units along the x axis from the load balancer to the near face of Server 2, then returns, looping every 3.2 s. The still frame shows the balancer, three servers and a green dot on Server 2 (named in the caption as the server that got the request).
- Labels (4): Server 1, Server 2, Server 3, Load balancer.

## Files (all in this output folder)
- `load-balancer.html`: self-contained page, tokens inlined, no external scripts.
- `load-balancer.svg`: standalone figure, tokens inlined.
- `build-figure.mjs`: builds both files from the engine in `src/skills/figure-craft/engine/`. Run with `node build-figure.mjs`.
- `lint-report.json`: lint output from `lint(model)`.
- `load-balancer.test.mjs`: 10 checks on the generated files. Run with `node --test load-balancer.test.mjs`.
- `REPORT.md`: this file.

## Checks run
| Check | Result |
|---|---|
| `lint(model)` (L1 to L8) | 0 errors, 0 warnings |
| `node --test load-balancer.test.mjs` | 10 of 10 pass |
| `node /home/user/Skill-Foundry/src/factory/lint-skills.mjs figure-craft` | no problems |
| Eval case "no-raw-colours" (contains `var(--`; no `fill="#`, no `stroke="#`) | pass |
| Label size at 390px (16 units x 326 px / 413.4 units) | about 12.6 CSS px, above the 11 px floor |

## Checklist outcome (`docs/skills/figure-craft/CHECKLIST.md`)
Yes: 1, 2, 3, 4, 5, 9, 11, 12, 14, 15, 16, 17, 18, 19, 20, 20a, 20b, 20c, 21, 22, 25, 26, 27, 29, 30, 35.
Not applicable at Figure size (the checklist has no N/A option, so the reviewer must accept these): 7, 8, 10, 33a (the skill's own demo files, which this run does not touch), 28 (only one language shipped).
**Not yet done (each blocks release):**
- 6 and 31: no screenshots in light, dark, 390px or a second language. No headless browser is available here, and ImageMagick needs approval in this session, so I could not rasterise the page.
- 13: no horizontal-scroll check at 390px in a real browser. The layout should not overflow (SVG is `width:100%`, the cards are one column at this width), but this is unverified.
- 23 and 33: reduced motion is verified only by the CSS string test, not by running the page with the preference set.
- 24: judged by reading the figure, not by looking at it.
- 32: console errors not checked in a browser. The script is short and guards `localStorage`, but this is unrun.
- 34: no second reader has restated the idea.

## Open items
1. Open `load-balancer.html` in a browser, check light, dark and 390px, check the console, and confirm reduced motion shows a still figure. Then answer items 6, 13, 23, 24, 31, 32, 33 and 34.
2. Only English is shipped. The checklist asks for a second language for verification; add one if the page needs translating.
3. The request box is drawn last, so it appears in front of the load balancer when it sits near it. That is a small depth inaccuracy, chosen so the request stays visible in the still frame.
4. The skill folder was not modified. Its demo files (`examples/demo.html`, `preview/`) were not regenerated.
