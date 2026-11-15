# References

## Writing one clause

- Form: "AC-n. Given <precondition>, when <one action>, then <one observable result>. _<source phrase>_"
- Good: "AC-2. Given a reset link that was sent more than 30 minutes ago, when the user opens it, then the link is refused as expired. _The reset link expires after 30 minutes._"
- Weak: "AC-2. The reset link works correctly." It has no precondition, no action, no observable result and no source phrase.
- Invented: "AC-2. ... then the message "This link has expired" is shown." when the text gives no such message. The message is an open question.
- One clause, one result. "then the item is saved and a toast is shown" is two clauses, and only if the text states both.

## The six headings

| Heading | A statement belongs here when it says |
|---|---|
| Main path | what the user does and gets when everything is valid |
| Validation and errors | what happens with wrong, missing or rejected input; a rule on what the user types; an error message |
| Permissions and roles | who may or may not do or see something |
| Empty, loading and disabled states | what is shown with nothing to show, while waiting, or when a control cannot be used |
| Persistence after reload | what is still there after a reload, a new session or a return |
| Limits | a stated cap on a count, a size, a rate or a time |

A heading with no statement never appears above "Open questions"; it appears there as the first words of a question.

## Source phrases

- Copy the words from the requirement text exactly. Do not paraphrase, shorten with "..." or fix spelling.
- Prefer the whole statement; use a shorter part only when the sentence holds several statements.
- Two clauses never share a source phrase.

## Open questions

- One sentence, to the Product Owner, starting with a heading name and a colon, or with "Conflict:".
- Ask for the fact that is missing. Good: "Limits: What is the largest file a user can upload?" Not allowed: "Limits: Is the largest file 5 MB?" (it suggests a value) and "Validation and errors: Which formats, for example JPG or PNG, are accepted?" (it suggests examples).
- A vague word always gets: `What measurable value defines "<word>" for <thing>?`, with the heading name in front.
- At most three questions per heading.

## Vague words

"fast", "quick", "quickly", "easy", "simple", "intuitive", "user-friendly", "secure", "safe", "reliable", "robust", "scalable", "modern", "seamless", "responsive" (when no screen size is given), "soon", "large", "small", "many", "few".
None of them is a testable result. Never replace one with a number.

## Fixed sentences

| Situation | Exact sentence |
|---|---|
| No requirement text | Paste the feature request, user story or requirement you want acceptance criteria for. |
| A title only | Describe the requirement for <the title in the user's words>: who uses it, what they do and what must happen. |
| Regression checklist or retest list for a change or diff | This skill does not write regression checklists for a change or diff; use test-planner for that. |
| Test code, scripts or test data | This skill does not write test code. |
| Design, copy, estimate or priority | This skill does not design screens, rewrite copy, estimate or prioritise. |

## Reviewer checklist

Answer each line yes or no. Any "no" blocks the reply until it is fixed.

- [ ] Every clause states only behaviour, values, roles, messages, states and limits the requirement text states.
- [ ] Every clause is one line with Given, when and then once each, one action and one observable result.
- [ ] Every clause ends with an italic source phrase found in the requirement text by search.
- [ ] The ids run AC-1 to AC-N with no gap, repeat or restart.
- [ ] Every heading above "Open questions" has at least one clause.
- [ ] Every gap is an open question that starts with a heading name and suggests no answer, example or value.
- [ ] Every vague word has the measurable-value question, and no clause, number or unit was made from it.
- [ ] Every "Out of scope" line has a source phrase from the text, or the section reads "None stated."
- [ ] With no requirement text or only a title, the reply is the exact sentence, with no clause and no heading.
- [ ] A request outside the boundary got its exact sentence and none of the refused work.
- [ ] The output follows the format in layer 08.
