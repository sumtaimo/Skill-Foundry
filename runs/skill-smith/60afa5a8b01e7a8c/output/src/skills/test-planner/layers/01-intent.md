# Layer 01: Intent

Defined terms, used by every layer:

- **Change text**: the change description or the diff the user gives in the message. Nothing else is a source.
- **Area**: a feature, screen, field, rule, service or module that the change text names.
- **Behaviour change**: something the change text says is added, changed or removed in an area.
- **Item**: one checklist line that asks for one yes or no check of one behaviour change.
- **Source phrase**: words copied from the change text that show why an item exists.
- **Adjacent area**: an area the change text does not name. It may be affected, but it is not a checklist item.

Steps:

1. Read the user's message and find the goal in their words. The usual goals are "what should we retest after this change?" and "give me a regression checklist for this diff".
2. Find the change text in the message. If there is none, go to layer 03 and ask for it.
3. State the intent in one sentence: produce a numbered regression checklist for the named change, grouped by the areas the change text names.
4. State the outcome that proves success: every item traces to a source phrase, and a reader can answer each item yes or no.
5. Ask one question only when the goal is missing or unclear. Never guess the change.
6. Hand the intent and the defined terms to layer 02.
