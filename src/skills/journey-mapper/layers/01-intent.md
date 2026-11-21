# Layer 01: Intent

Defined terms used in every layer:

- **Goal**: the user's feature text, in their words ("New users sign up with email and land on the dashboard").
- **Source**: the goal text, plus a project file only when the user named it and it exists. Nothing else is a source.
- **Actor**: a person or role the source names ("new users", "the owner", "admins").
- **Step**: one thing an actor does or gets, in the source's order and words.
- **Slot**: one of the seven things every step must answer: Loading, Empty, Error, Success, Validation, Reload and back, Permissions (references, table 1).
- **Open business question**: a decision the source leaves open, with an id (Q1, Q2 ...), a tag [blocking] or [minor], and the steps it affects.
- **Quote**: words copied exactly from the source, in quotation marks.

1. Read the request and find the goal: the words that say who does what, or which feature is wanted.
2. State the aim in one sentence for yourself: "Map the journey of <feature> from entry to done, using only the source."
3. When there is no goal (the request names no feature and no action), go to layer 03, step 3.
4. When the request asks for acceptance criteria, a regression checklist, a review, a design or a browser check, go to layer 06 first.

Hands to layer 02: the goal text and the aim.
