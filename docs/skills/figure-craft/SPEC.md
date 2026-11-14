# figure-craft spec

Isometric explanatory figures: one idea, one object, drawn from shared tokens with the iso engine and checked by lint rules L1-L20. The skill's own layers (`src/skills/figure-craft/layers/`) are the procedure; this file is the factory-side spec. Checklist item numbers (C#) refer to `CHECKLIST.md`.

## Inputs
- A one-line prompt naming the idea.
- Size: `Figure`, `Hero` or `Page`.
- Languages to ship (at least one; the second is used for verification).

## Outputs
- Shape list (`box`, `line`, `dot` from `engine/iso.mjs`) and labels.
- `renderSvg(shapes, { labels })` result: `{ svg, model }`, pure and deterministic.
- Theme CSS from `tokensCss()`.
- Copy strings per language with identical keys.
- Lint report from `lint(model)` with zero errors.

## Layers

### 1. Intent
Pick the size: Figure (inline, one object), Hero (top of page), Page (full explainer with rail). State the one idea in one sentence.
- AC: size stated (C1); one idea (C2); concrete object (C3).

### 2. Tokens
All colour comes from `TOKENS` (`light`, `dark`) via `tokensCss()`; iso faces use `--iso-top`, `--iso-a`, `--iso-b`, ink variants for emphasis.
- AC: no raw colour (L6-raw-colour, C4); themes from tokens only (C5); both themes read (C6).

### 3. Layout
Contents rail with numbered sections 01 / 09; one reading column; margin notes fall below text on phones; label/value cards for facts; 16px phone gutter; no horizontal scroll.
- AC: rail and numbering (C7); one rail marker per state (C8); one column (C9); notes below on phones (C10); cards (C11); 16px gutter (C12); no horizontal scroll at 390px (C13).

### 4. Figure
Isometric rules: shared projection, supports drawn first, face details in their face, labels in side columns, leaders clear of solids, everything inside the viewBox, no decorative dots.
- AC: L1-painter-order (C14); L2-face-detail (C15); L3-label-overlap (C16); L4-leader-crosses-solid, warning (C17); L5-outside-viewbox (C18); no decorative dots (C19); shared projection (C20).

### 5. Motion
One story, looping, moving only along iso axes of the supporting surface; still under reduced motion.
- AC: one looping story (C21); L8-motion-off-axis (C22); L7-motion-no-reduced (C23); still frame explains (C24).

### 6. Copy
One idea per sentence, plain words, short; no claims the page cannot keep true; same keys in every language.
- AC: one idea, plain words (C25); short (C26); only self-kept facts, no "tests passing" badges (C27); same keys in every language (C28).

### 7. Verification
Build, lint, geometry checks, screenshots (light, dark, 390px, second language), console errors, reduced motion.
- AC: build and lint clean (C29); geometry L1-L8 run (C30); four screenshots (C31); no console errors (C32); reduced motion still (C33).

### 8. Review
A second reader restates the idea; warnings fixed or justified.
- AC: idea restated (C34); warnings handled (C35).

## Lint rules
| id | level | meaning |
|---|---|---|
| L1-painter-order | error | shape drawn before the shape it rests on |
| L2-face-detail | error | dot outside its face, out of plane, or within r of a rounded corner |
| L3-label-overlap | error | labels closer than 13 vertically in a column, or overlapping |
| L4-leader-crosses-solid | warning | leader crosses another box outline |
| L5-outside-viewbox | error | shape or label text outside viewBox |
| L6-raw-colour | error | fill or stroke not `var(--...)`, `none` or `url(#...)` |
| L7-motion-no-reduced | error | animation without reduced-motion fallback |
| L8-motion-off-axis | error | move not along one axis of the resting surface |
| L9-moving-unlabelled | error | the moving part has no label |
| L10-crowded | warning | parts on one base closer than 4, or spanning under 30% of the base |
| L10 note | | parts that touch are one structure and are not warned |
| L11-no-detail | error | a labelled part has fewer face details than 1 + one per 8% of the drawing (max 3) |
| L12-part-too-small | error | a labelled part covers less than 1% of the drawing (aim for 3%) |
| L13-no-solid-body | error | solid volumes cover less than 20% of the drawing |
| L14-missing-part | error | `requiredParts` missing, or a required part not drawn or not labelled |
| L15-floating | error | a part above the ground neither rests on nor touches another part |
| L16-hidden-part | error | a labelled part is less than 40% visible behind later-drawn solids (glass does not hide) |
| L17-one-material | error | three or more solids all of one material |
| L18-outside-container | error | a shape marked `inside` reaches outside its container |
| L19-sparse | error | fewer than 40 face details, 4 per labelled part or 1.5 per solid, fewer than 120 elements (2.5 per solid for a big object), a large bare solid, or a detail drawn twice |
| L20-attach-outside | error | a part declared `attach` floats, lies inside its body or its opening, sits on a cut-away side, or is drawn on the wrong side of the body (checked in every view) |
| R31-card-location | error | (`lintCards`) a card lacks what the part does, where it sits in the real object, or the source of that fact |

Showcase: one object, the refrigerator (`examples/build-demo.mjs`), at the detail level of the owner's reference. Version stays 1.0.0 until the owner calls it final.

Round bodies: an upright cylinder opens like a box (each open face removes a quarter of the wall, `'xy'` is a half-section), has an open top (`mouth`), takes a lid that lifts (`lid`), wears details that follow its wall (`face: 'wrap'`: `ring`, `band`, `studs`) and carries handles, spouts and hinges on its outside (`handle`, `spout`, `attach`, lint L20). The orbit keeps four true views and scrubs between them by cross-fade; a continuous rotation is not offered (see `references/orbit.md` for why).

Open and orbit: `open` bodies (`'xy'` is a cutaway), states with `when`, show contents marked `inside`; `renderViews` gives four views a quarter turn apart and `orbitHtml` the turn controls. Style: hairline outlines, near-white palette.

Materials and light: `steel`, `white`, `dark`, `glass`, `plain`, `ink`; round solids; panels; pipe tones. One light direction with soft cast shadows, from the engine only.

Labels: chips beside the part; hidden at rest; revealed with motion on hover, focus or tap (`labelMode: 'hover'`, default). Up to 9 labels on hover, 5 when always shown.
