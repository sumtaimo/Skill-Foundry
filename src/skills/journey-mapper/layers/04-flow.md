# Layer 04: Flow

Header:

1. Goal: copy the goal word for word in quotation marks, without the request words around it ("Map the workflow for", "Please").
2. Actors: quote each actor the source names. None named: write "Not stated (Q<n>)".
3. Entry and Done when: quote where the journey starts and what counts as done. Not stated: "Not stated (Q<n>)".

Steps:

4. Write one step per action the source states, in the source's order: "<n>. <actor> <action>. Source: "<quote>"". At most 10 steps; for a longer goal add one line under the header suggesting a split by feature.
5. A step may split one stated phrase into the actions its words name (for "sign up with an email and a password": enter the email and password, then submit), and each part quotes that phrase.
6. A step the journey seems to need but the source does not name is never a step: ask "What happens between step <a> and step <b>?" as an open question.
7. Under each step write the seven slot lines in this order: Loading, Empty, Error, Success, Validation, Reload and back, Permissions (references, table 1).
8. Fill a slot with a quote when the source states it, and quote it exactly.
9. When the source does not state it, write the question id (for example "Q4") and add the question in step 12. When a quote answers only part of the slot, write the quote, then "; " and the question id.
10. Write "Not applicable: <reason in at most ten words>" only when the slot cannot happen in that step (Empty in a step that shows no list or data). Never use it to hide a gap.

Cross-step checks:

11. Answer four lines for the whole journey, each a quote or a question id: reload or close in the middle of the journey; cancel and come back later; a permission that changes between steps; related modules the source names (or "None named.").

Open business questions:

12. Write each question as one plain question that asks and never suggests (R-journey-mapper-4; references, part 2). Start it with the slot or topic, then the steps it affects: "Q3 [minor] Loading (steps 1-4): What does the user see while the step is waiting?"
13. Tag a question [blocking] when a step or the end of the journey cannot be built without the answer; tag the rest [minor].
14. Merge minor questions by topic: one line per slot or topic across all steps, with one id that every affected slot uses.
15. List the blocking questions first, then the minor ones, numbered Q1, Q2 ... in list order; the slots use those ids.
16. Two statements that disagree: one blocking question written exactly as `Q<n> [blocking] Conflict: "<quote 1>" or "<quote 2>"? (steps <a>-<b>)`, with the word "Conflict" followed by a colon (R-journey-mapper-11). Never pick one. List it first.

Hands to layer 05: the draft map.
