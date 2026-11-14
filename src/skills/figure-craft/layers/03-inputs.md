# Layer 03: Inputs

Required:

1. The idea sentence from layer 01.
2. The size: Figure, Hero or Page.

Optional, with defaults:

3. Languages: the language of the request.
4. Output folder: the current working folder (the folder the agent was started in). Run `pwd` first and write there. The figure is a deliverable, not scratch work, so a scratch or temporary folder is wrong even when the runtime suggests it. Write the page, the SVG, the build script, the lint report and `report.md` there, never in a scratch or temporary folder the runtime may offer, and name the full path of each file in the answer. Only when the working folder cannot be written, use another folder and say why.
5. Motion: on, with one story. The user may ask for a still figure.
6. Label font size: 11, raised until labels render at 11 CSS px or more at 390px wide.

When an input is missing:

7. A missing idea sentence: ask, do not guess.
8. A subject whose real parts you do not know: ask the user for the parts, or state the parts you will draw as assumptions and get a yes before building.

The build needs `node` (version 22 or newer) to run `build-figure.mjs`. If the runtime does not allow `node`, write the script anyway, say plainly that it was not run, and do not report a lint result.
