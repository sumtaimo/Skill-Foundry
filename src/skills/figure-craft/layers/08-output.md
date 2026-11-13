# Layer 08: Output

Produce these files in the output folder, named from a short slug of the subject:

1. `<slug>.html`: one self-contained page with the figure inline, tokens in one `<style>`, a caption, label/value cards, a theme button and, when motion is on, a pause button. No external scripts.
2. `<slug>.svg`: the same figure as a standalone file.
3. `build-figure.mjs`: the script that builds both files from the engine and runs lint. Running it again gives the same bytes.
4. `lint-report.json`: `{ errors, warnings }` from `lint(model)`.
5. `report.md`: the idea sentence, the parts table with details, the motion story, the checks run and their results, open items.

Quality bar, checked before handing over:

6. Every labelled part is recognisable from its details alone, without reading the label.
7. Parts do not hide each other; each has clear space around it.
8. Labels are horizontal in two side columns, and each leader ends on its own part.
9. The figure is the engine's output, byte for byte. Nothing was drawn or adjusted by hand.
