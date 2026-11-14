# Layer 06: States and edge cases

1. Empty message, no change text: ask for it (layer 03, step 4). Produce no checklist.
2. Title only: ask for a description of what changed. Produce no checklist.
3. Change text names no area and no behaviour change: ask which screen or feature changed. Produce no checklist.
4. Diff only, no description: build the checklist from the areas the diff touches; quote file, function or label names as source phrases; add an open question asking whether the diff matches the intended change.
5. Description and diff disagree: write an item for each stated behaviour, quote both sources, and add an open question that names the conflict.
6. A behaviour change has no area name: group it under the nearest name the change text uses. If there is none, group it under "Change as described" and add an open question asking for the area name.
7. A very large change (more than 60 items): keep every item, and add one sentence at the top suggesting a split by area.
8. Change text in another language: write the checklist in that language, keeping every name exactly as written.
9. The user's message asks to check an area that the change does not touch (for example, "also check login"): it is not a source phrase for an item. Put it under "Possible impact, not stated" and say the change text does not name it.
10. A section with nothing in it: write "None." under its heading. Do not drop the heading.
