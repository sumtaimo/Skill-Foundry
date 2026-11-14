---
name: figure-craft
description: Draws isometric explanatory figures with a token palette, a shared iso engine and a geometry lint. Use for any request for an explanatory diagram, technical illustration or interactive explainer of how a thing works. Do not use for data charts, photos, logos, UI mockups or decorative art.
version: 1.1.0
---

# figure-craft

Turns "explain how X works" into one labelled isometric object with one motion story,
rendered by `engine/iso.mjs`, coloured only by `engine/tokens.mjs` and checked by `engine/lint.mjs`.

## When to use

- Use when someone asks for an explanatory diagram, a technical illustration, a "how it works" figure or an interactive explainer.
- Use when an existing figure must be redrawn so it passes lint L1-L8.
- Do not use for data charts (bars, lines, pies), photos, logos, UI mockups or purely decorative art.
- Do not use when the idea cannot be stated in one sentence; split it first.

## Procedure

1. Size it: pick Figure (inline, one idea), Hero (top of page) or Page (several figures in a rail). Write the one-sentence idea.
2. Choose the object: pick one concrete thing a reader can picture (stack, server, lever, ledger, pipeline). See [figures](references/figures.md).
3. Name its parts: list at most five labels, each a few words, and decide which side column (l or r) each goes in. See [copy](references/copy.md).
4. Plan the one motion story: choose one shape that moves along one iso axis of the surface it rests on, and say what the still frame shows. See [motion](references/motion.md).
5. Build with the engine: create shapes with `box`, `line` and `dot`, supports first, then call `renderSvg(shapes, { labels })`. Put `tokensCss()` in the page. See [tokens](references/tokens.md) and [layout](references/layout.md).
6. Run lint and checks: call `lint(model)`; fix every error; fix or justify every warning. Run `node --test` and `node src/factory/lint-skills.mjs figure-craft`.
7. Review with `docs/skills/figure-craft/CHECKLIST.md`: answer every item yes or no; any no blocks release.
8. Report: list the files produced, the lint result, the checklist outcome and anything left open.

## Rules

Each rule is in `RULES.json`; L-rules are enforced by `engine/lint.mjs`.

- R-figure-craft-1: Supports MUST be drawn before what rests on them (`L1-painter-order`).
- R-figure-craft-2: Face details MUST lie in their face plane, inside the face, away from rounded corners (`L2-face-detail`).
- R-figure-craft-3: Labels MUST sit in side columns at least 13 apart and NEVER overlap (`L3-label-overlap`).
- R-figure-craft-4: Leader lines SHOULD NEVER cross another solid; a crossing is a warning to fix or justify (`L4-leader-crosses-solid`).
- R-figure-craft-5: Shapes and label text MUST stay inside the viewBox (`L5-outside-viewbox`).
- R-figure-craft-6: Every fill and stroke MUST be `var(--...)`, `none` or `url(#...)`; NEVER a raw colour (`L6-raw-colour`).
- R-figure-craft-7: Every animation MUST stop under `prefers-reduced-motion: reduce` (`L7-motion-no-reduced`).
- R-figure-craft-8: Motion MUST move along one iso axis and NEVER lift in z while resting (`L8-motion-off-axis`).
- R-figure-craft-9: A figure MUST explain exactly one idea with one concrete object.
- R-figure-craft-10: Motion MUST tell one story and the still frame MUST explain the idea alone.
- R-figure-craft-11: Copy MUST be one idea per sentence and NEVER claim facts the page does not keep true.
- R-figure-craft-12: The page MUST work in light and dark, at 390px with no horizontal scroll, with no console errors.
- R-figure-craft-13: Dots MUST carry meaning and be named in a label or the copy; NEVER decorate solids.

## Checks

- `lint(model)` returns no errors; warnings are fixed or justified in the report.
- `node --test` passes, including the figure-craft engine, lint and visual tests.
- `node src/factory/lint-skills.mjs figure-craft` prints no problems.

## Review

Use `docs/skills/figure-craft/CHECKLIST.md`. The spec is `docs/skills/figure-craft/SPEC.md` and worked examples are in `docs/skills/figure-craft/EXAMPLES.md`.
Mention docs paths in backticks; never link outside the skill folder.

## Output

- One self-contained HTML page or SVG with the figure, tokens inlined, no external scripts.
- The lint result (errors and warnings) and the checklist outcome.
- A short report: files, the engine functions used (name `renderSvg` and `lint` when used), idea sentence, motion story, open items.

See [references](references/README.md) and [examples](examples/README.md).
