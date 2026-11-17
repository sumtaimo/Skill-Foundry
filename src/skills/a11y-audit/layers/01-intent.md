# Layer 01: Intent

Defined terms, used by every layer:

- **Input**: the HTML or JSX the user pastes in the message or names as a file. Nothing else is a source.
- **Element**: one tag of the input. It is cited by a copy of its opening tag and its line number.
- **Script**: `engine/audit.mjs` in this skill folder. It reads the input and lists structural problems by search.
- **Check**: one rule of the script, with a **rule id** such as `img-alt`. The ids are listed in the references.
- **Finding**: one problem of one element: rule id, success criterion, who is affected, status, fix.
- **Success criterion (SC)**: a numbered requirement of the public web accessibility standard WCAG 2.2, written "SC 1.1.1", at level A or AA.
- **Status**: `failure` when the markup breaks the criterion, `advisory` when it is a best practice tied to the criterion. The script sets it.
- **Who is affected**: the people who hit the problem: keyboard users, screen reader users, voice control users, zoom users, deaf or hard-of-hearing users.
- **Manual test**: a check that needs a person with assistive technology; the script cannot do it.
- **Skipped by rule**: the checks this skill never makes (contrast, focus-ring style, spacing, target size). Every reply header says so in one fixed sentence, so a count of 0 findings is never read as a clean page.
- **Out of scope**: contrast, focus-ring style, spacing, target size (the polish skill owns them), usability of the flow, visible words, a conformance certificate.

Steps:

1. Read the user's message and find the goal in their words: an accessibility audit, an a11y check, a screen reader or keyboard check, an ARIA review of code.
2. Find the input in the message. If there is none, go to layer 03 and ask for it.
3. State the intent in one sentence: list, for the given markup, the problems users cannot see, each with element, criterion, who is affected and the exact fix.
4. State the outcome that proves success: every finding names an element that is in the input, its criterion is the one the script printed, and its fix is a small code change.
5. Ask one question only when the goal is unclear. Never guess the code.
6. Hand the intent and the defined terms to layer 02.
