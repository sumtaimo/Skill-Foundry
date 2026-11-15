# Layer 01: Intent

Defined terms, used by every layer:

- **Requirement text**: the feature request, user story or requirement the user gives in the message. Nothing else is a source. A diff, a title or the request sentence itself is not a requirement text.
- **Statement**: one thing the requirement text says the product does, shows, allows, refuses, keeps or excludes.
- **Clause**: one acceptance criterion, on one line, with an id, in Given-When-Then form: a precondition, one action, one observable result.
- **Observable result**: something a person can see or read without looking at the code: a screen, a message, a value, a state of a control, a stored record that is shown again.
- **Source phrase**: words copied from the requirement text, without change, that show where a clause or an out-of-scope line comes from.
- **Heading**: one of six fixed groups, in this order: "Main path", "Validation and errors", "Permissions and roles", "Empty, loading and disabled states", "Persistence after reload", "Limits".
- **Gap**: something a clause would need that the requirement text does not state.
- **Vague word**: a quality word with no measure in the text, such as "fast", "easy", "simple", "secure", "intuitive", "user-friendly", "quickly", "reliable", "scalable".
- **Open question**: a question to the Product Owner about a gap, a vague word or a conflict. Every open question is either blocking or minor.
- **Blocking question**: an open question whose answer a clause needs. Without it, a clause for a statement of the text cannot be written or cannot be tested: a value, a role, a state or a result is missing. It names the clause or the source phrase it blocks. A vague word and a conflict are always blocking.
- **Minor question**: an open question about something no statement of the text points to (an edge case, an extra role, a screen state), or a detail the tester can settle without the Product Owner. It blocks no clause.
- **Exclusion**: something the requirement text itself says is not included.

Clauses:

1. Read the user's message and find the goal in their words. The usual goals are "write acceptance criteria for this story" and "turn this requirement into Given-When-Then".
2. Find the requirement text in the message. If there is none, go to layer 03.
3. State the intent in one sentence: write the acceptance criteria for the named requirement as clauses AC-1 to AC-N, with every blocking gap as a blocking question and the rest as a few merged minor lines.
4. State the outcome that proves success: every clause traces to a source phrase, and a tester can answer each clause pass or fail.
5. Ask one question only when the goal is unclear. Never guess the requirement.
6. Hand the intent and the defined terms to layer 02.
