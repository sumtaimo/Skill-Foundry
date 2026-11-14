# Layer 03: Inputs

Required:

1. The change text: a description of what changed, or a diff. A title or a single word is not enough.

Optional:

2. A release or ticket name, used in the checklist heading.
3. Areas the user says are risky, stated in the user's own words.

When one is missing:

4. Nothing but the request, with no change text and no title (for example only "What should we retest after this change?"): reply exactly "Paste the change description or the diff you want the checklist for." Stop. Produce no checklist.
5. A title, name or release label only, with no description of what changed (for example "the new checkout release"): do not use step 4. Reply exactly "Describe what changed in <the title in the user's words>." Stop. Produce no checklist and no headings.
6. If the change text names no area and no behaviour change, ask one question that names what is unclear, for example "Which screen or feature changed?". Stop.
7. Never fill a gap with a guess about the product.
8. Hand the complete change text and the optional inputs to layer 04.
