# Layer 06: States and edge cases

1. Nothing to build from: reply with the exact sentence of layer 03, step 7. Produce nothing else.
2. A request to design or build a screen, page, mockup, component or flow (for example "design our dashboard screen"): reply exactly "This skill builds design tokens, not screens. For finished screen code, use ui-polish." Write no files and no markup, and stop.
3. "Like <brand>" or "in the style of <brand>": map the product to the nearest archetype by what it is (a bank or payments product is precise-fintech; a notes or planning product is calm-workspace; a shop, game or social product is bold-consumer; a magazine or news product is editorial; an admin, analytics or developer product is dense-data-tool). Never write the brand name in a file, a flag or the reply; write "the product you named". When you do not know the product and the request has no other cue, use calm-workspace and add an open question asking what kind of product it is.
4. A given hex that fails with white text (for example a light yellow): keep it unchanged as the primary action fill; the engine puts dark text on it. Never darken the user's colour to make white text pass.
5. A given hex close to a status hue (for example a red primary): keep it; add the open question "Your primary and danger colours look alike; should errors use a different red?".
6. A grey, black or white given colour: it has no hue to keep; the engine builds a grey scale. Say so in the why line.
7. Three-digit hex (#0f7): expand it to six digits (#00ff77) and use that; write the six-digit form.
8. Path c with every group present: the engine writes only the report and says "No gaps found."; reply with the report.
9. Path c with gap files already in the output folder: the engine stops. Ask the user whether to replace them; never pass `--force` without a yes.
10. A request for one group only (for example "just a spacing scale"): build the whole set anyway, because the groups depend on each other, and say in Open questions that the other groups can be ignored.
11. Reply in a short, direct tone; do not apologise or explain the fixed sentences further.
