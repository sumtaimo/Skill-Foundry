# Reuse check (not part of the showcase)

The showcase has one object, the refrigerator. This folder holds the evidence that the same skill, unchanged, draws a different object in the same style.

- Input: `microwave-input.md`, one request, given to a real agent run with figure-craft 1.0.0.
- Result: passed, `lintStates` 0 errors and 0 warnings, four views, open and closed states, labels on hover.
- Screenshots: `microwave-open-front.png`, `microwave-open-back.png`, `microwave-closed.png`.
- Detail: 106 drawn elements in the front view (the first check, before detail was scaled to object size, had about 44 shape calls).
- The body is solid: one open side with the door swung out, the controls drawn on the face of the body, nothing see-through.
- Note: the showcase refrigerator has a reference figure in the skill for the same subject, so an agent can lean on it. This microwave has no reference, so it is the stronger evidence of what the skill produces on its own.
