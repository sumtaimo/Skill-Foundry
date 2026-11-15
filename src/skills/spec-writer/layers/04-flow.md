# Layer 04: Flow

1. Split the requirement text into statements, in the order the text gives them. One sentence may hold several statements.
2. Mark each statement that the text says is not included ("out of scope", "not part of", "later", "excluded", "not in this release") as an exclusion. It never becomes a clause.
3. Mark each statement whose only content is a vague word (for example "the page must be fast") as vague. It never becomes a clause; clause 10 handles it.
4. Give every other statement exactly one heading:
   - **Main path**: what the user does and gets when everything is valid.
   - **Validation and errors**: what happens with wrong, missing or rejected input, including a rule on what the user types (length, format) and any error message.
   - **Permissions and roles**: who may or may not do or see something.
   - **Empty, loading and disabled states**: what is shown when there is nothing to show, while waiting, or when a control cannot be used.
   - **Persistence after reload**: what is still there after a reload, a new session or a return to the screen.
   - **Limits**: a stated cap on a count, a size, a rate or a time (for example "at most 5 per order", "expires after 30 minutes").
5. When a statement fits two headings, use the more specific one: a statement that names a role goes under "Permissions and roles"; a statement about a reload goes under "Persistence after reload"; a statement with a cap goes under "Limits"; otherwise use the first heading in the list of clause 4 that fits.
6. Write one clause for each statement: "AC-n. Given <precondition>, when <one action>, then <one observable result>." Take the precondition, the action and the result from the statement. When the statement gives no precondition, use the role or the screen the text names; when the text names none, write "Given the feature is available".
7. Write one behaviour and one result per clause. When a statement holds two results, write two clauses, each with its own source phrase. Never join two results with "and".
8. End every clause with its source phrase in italics: the words of the statement, copied without change from the requirement text. Do not shorten the inside of a phrase with "..." and do not correct its spelling. Two clauses never share one source phrase.
9. For every gap, write an open question instead of a clause. A gap is: a heading of clause 4 with no statement; a result the text implies but does not state (for example what an error message says); a value a clause would need (a size, a count, a time) that the text does not give.
10. For every vague word, write the open question exactly in this shape: `What measurable value defines "<word>" for <thing the text applies it to>?` Quote the word as the text writes it. Add no number, no unit and no example.
11. When two statements disagree (for example "up to 5" and "at most 3"), write a clause for neither. Write one open question that starts with "Conflict:" and quotes both.
12. Start every open question with the heading it belongs to and a colon (for example "Limits: ..."). Write at most three questions per heading, the ones a clause most needs. A question never suggests an answer: no "for example", no "such as", no option list, no value.
13. Write one "Out of scope" line for each exclusion, ending with its source phrase in italics. Write nothing there that the text does not exclude.
14. Number the clauses AC-1 to AC-N in one run, in heading order, with no restart at a heading. Drop every heading that has no clause.
15. Hand the clauses, the open questions and the out-of-scope lines to layer 05.
