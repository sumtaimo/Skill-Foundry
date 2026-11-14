# Layer 08: Output

Produce these files in the output folder, named from a short slug of the subject:

1. `<slug>.html`: one self-contained page with the figure as an orbit the reader can turn, tokens in one `<style>`, a caption, the hover hint, one card per labelled part, a theme button and, when motion is on, a pause button. No external scripts.
2. `<slug>.svg`: the front view as a standalone file.
3. `build-figure.mjs`: the script that builds both files from the engine and runs lint. Running it again gives the same bytes.
4. `lint-report.json`: `{ errors, warnings }` from `lint(model)`.
5. `report.md`: the idea sentence, the parts table with details, the motion story, the checks run and their results, open items.

Quality bar, checked before handing over:

6. Every labelled part is recognisable from its details alone, without reading the label.
7. Parts do not hide each other; each has clear space around it, and no labelled part is too small to read.
7a. The figure is full: every labelled part shows all the details its size calls for, and the page lists every labelled part in a card with what it does.
8. At rest the figure is clean: no labels and no leader lines. Hovering, focusing or tapping a part reveals its label with motion, in a side column, with the leader ending on that part.
8a. The object reads as the real thing at a glance: its whole outside in real materials, a full body, every required part present and visible, nothing floating, lit and shadowed by the engine.
8b. The object fills the frame; no empty margins are left for labels.
8c. Opened, the object shows its real contents and working parts inside; turned, every side has its real features.
8d. Lines are hairline and quiet; nothing is outlined heavily.
9. The figure is the engine's output, byte for byte. Nothing was drawn or adjusted by hand.
