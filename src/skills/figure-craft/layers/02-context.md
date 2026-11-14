# Layer 02: Context

1. Find where the figure will live: a page in the user's project, a document, or a standalone file.
2. Check for an existing figure of the same idea. If one exists, list what must be kept (labels, wording, size).
3. Note the languages the page ships in. Default: the language of the request.
4. Note any theme the host page already has. The figure still takes all its colours from `engine/tokens.mjs`; never copy host colours into the SVG.
5. Find out how the real object works before drawing it: read what the user supplied, then what the project contains. Record each fact you will draw and where it came from.
6. For every part, write where it sits in the real object (inside the body, in a bay at the back, on a face) and where that fact comes from. A part goes where it really is, not where it is easiest to draw.
7. Mark every fact you could not confirm as an assumption. When you are not sure where a part sits, ask the user; if you cannot ask, draw the most common arrangement, say so in the part's card and list it under assumptions. Never draw an invented part.
8. Write the required parts list: every part the idea sentence cannot be understood without, each with an id. Do this before any drawing decision. This list becomes `requiredParts` and is never shortened to make a check pass; if a part will not fit, split the figure or go back to the user.

Hand to layer 03: output location, languages, the confirmed facts, the assumptions and the required parts list.
