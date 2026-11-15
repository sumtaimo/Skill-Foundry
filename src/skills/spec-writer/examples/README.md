# Examples

These examples are hand-written to show the format. They are not proof; proof is the recorded answers of real agents.

## Example: a user story with a limit and an exclusion

Input:

> Write acceptance criteria for this story: As a shopper, I want to save an item to my wishlist from the product page. A saved item shows a filled heart icon. A wishlist holds at most 50 items. Sharing a wishlist is not part of this story.

Output:

```
## Acceptance criteria: wishlist

Requirement: A shopper saves an item to the wishlist from the product page, a saved item shows a filled heart icon, and a wishlist holds at most 50 items.

### Main path
AC-1. Given a shopper on the product page, when the shopper saves the item to the wishlist, then the item is in the shopper's wishlist. _save an item to my wishlist from the product page_
AC-2. Given an item the shopper has saved, when the shopper views it, then it shows a filled heart icon. _A saved item shows a filled heart icon._

### Limits
AC-3. Given a wishlist that holds 50 items, when the shopper saves one more item, then the wishlist still holds 50 items. _A wishlist holds at most 50 items._

### Open questions
- Validation and errors: What does the shopper see when a save is refused because the wishlist is full?
- Permissions and roles: What happens when a visitor who is not signed in saves an item?
- Empty, loading and disabled states: What does an empty wishlist show?
- Persistence after reload: Does the filled heart icon remain after the page is reloaded?

### Out of scope
- Sharing a wishlist. _Sharing a wishlist is not part of this story._
```

Why it follows the rules: each clause ends with words copied from the input (rule 3); ids run AC-1 to AC-3 across two headings (rule 4); only the two supported headings appear (rule 5); the four gaps are questions that suggest no answer (rule 6); the one exclusion is the text's own (rule 8).

## Example: vague words

Input: "Acceptance criteria please. Requirement: The search page must be fast. Results show the product name."

Output:

```
## Acceptance criteria: search page

Requirement: The search page must be fast, and results show the product name.

### Main path
AC-1. Given a search that returns results, when the user views the results, then each result shows the product name. _Results show the product name._

### Open questions
- Limits: What measurable value defines "fast" for the search page?
- Empty, loading and disabled states: What does the search page show when a search returns no results?

### Out of scope
None stated.
```

## Example: requests outside the boundary

| Input | Whole reply, or first line |
|---|---|
| "Write acceptance criteria for this feature." | Paste the feature request, user story or requirement you want acceptance criteria for. |
| "Write acceptance criteria for the new export feature." | Describe the requirement for the new export feature: who uses it, what they do and what must happen. |
| "Give me a regression checklist for this diff: ..." | This skill does not write regression checklists for a change or diff; use test-planner for that. |
| "Write Cypress tests for this story: ..." | This skill does not write test code. (then the acceptance criteria for the story) |
| "... write the criteria and estimate the story points" | This skill does not design screens, rewrite copy, estimate or prioritise. (then the acceptance criteria) |
