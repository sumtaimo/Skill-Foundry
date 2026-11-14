# Changelog

## 1.0.0 - 2026-11-14

- First version: a numbered regression checklist grouped by area, built only from the change description or diff.
- Ten core layers; rules R-test-planner-1 to R-test-planner-14 in RULES.json.
- Asks for the change when it is missing; never adds features the change does not name.
- Diff input: area headings use the shared name in the changed lines (for example `cart`), never one heading per identifier.
- Out-of-scope requests (test code, bug review) get one fixed sentence, then the checklist when a change text exists.
- Area means a screen, feature or service; fields and messages are items inside it. Layer 03 separates "nothing given" from "title only", each with an exact reply.
- Eval case `checkout-promo-description` expects `### footer` in lower case because the change text writes it that way (rule 4: exact names); the first recording showed the case was wrong on that point.
- One item per stated result: no second item from the same source phrase to test a result the phrase does not state; that gap is an open question. Found by reading the recorded answers (two items on one phrase, one of them guessed).
