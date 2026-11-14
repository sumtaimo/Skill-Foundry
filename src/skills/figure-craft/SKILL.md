---
name: figure-craft
description: Draws a detailed isometric figure that explains how a thing works, from the goal the user states, with a token palette, a shared iso engine and a geometry, layout and detail lint. Use for any request for an explanatory diagram, technical illustration or interactive explainer of an object or system. Do not use for data charts, photos, logos, UI mockups or decorative art.
version: 1.2.0
---

# figure-craft

Turns "explain how X works" into one labelled isometric object with identifying details on every
named part and one motion story. The figure is rendered by `engine/iso.mjs`, coloured only by
`engine/tokens.mjs` and checked by `engine/lint.mjs`. The skill is self-contained: everything it
needs is in this folder, so it works in any project.

## When to use

- Use when someone asks for an explanatory diagram, a technical illustration, a "how it works" figure or an interactive explainer.
- Use when an existing figure must be redrawn so it passes lint L1-L12.
- Do not use for data charts (bars, lines, pies), photos, logos, UI mockups or purely decorative art.
- Do not use when the idea cannot be stated in one sentence; split it first.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: start from the goal the user states. [layers/01-intent.md](layers/01-intent.md)
2. Context: where the figure will live and what exists. [layers/02-context.md](layers/02-context.md)
3. Inputs: what is required and what to ask. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: object, parts, details, motion, build. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST and NEVER list. [layers/05-rules.md](layers/05-rules.md)
6. States and edge cases: themes, phone, reduced motion. [layers/06-states.md](layers/06-states.md)
7. Checks: lint, checklist, browser. [layers/07-checks.md](layers/07-checks.md)
8. Output: the files and the quality bar. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the reader or next skill receives. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what is recorded as proof. [layers/10-evidence.md](layers/10-evidence.md)

## Rules

Each rule is in `RULES.json`; L-rules are enforced by `engine/lint.mjs`. The full list with ids is in [layers/05-rules.md](layers/05-rules.md).

- Detail comes from the skill: every labelled part MUST carry a face detail that identifies it (`L11-no-detail`). NEVER hand-edit the SVG after the engine rendered it.
- Parts MUST be large enough to read (`L12-part-too-small`), joined or spread with a gap (`L10-crowded`), and the moving part MUST be labelled (`L9-moving-unlabelled`).
- Bigger parts MUST carry more details, up to three (`L11-no-detail`), so the figure is full.
- Every fill and stroke MUST be a token (`L6-raw-colour`).

## Checks

- `lint(model)` returns no errors; every warning is fixed, or justified in the report.
- Every item in [references/checklist.md](references/checklist.md) is answered yes or no; any no blocks release.
- The page is opened in a browser when one is available: light, dark, 390px wide, reduced motion, console clean.

## Review

Use [references/checklist.md](references/checklist.md). A second reader states the idea back in one sentence.

## Output

- One self-contained HTML page and one SVG with the figure, tokens inlined, no external scripts.
- The build script that produced them from the engine, so the figure can be regenerated.
- The lint result (errors and warnings) and a short report: idea sentence, parts and their details, motion story, open items.

See [references](references/README.md) and [examples](examples/README.md).
