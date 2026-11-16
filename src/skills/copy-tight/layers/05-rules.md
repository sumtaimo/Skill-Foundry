# Layer 05: Rules

Apply every rule below to every string. The ids match `RULES.json`.

1. R-copy-tight-3: The rewrite MUST NEVER change the meaning of the copy.
2. R-copy-tight-4: The rewrite MUST NEVER change numbers, names or their capital letters.
3. R-copy-tight-5: Legal text MUST NEVER be rewritten; it is returned with the fixed note `Legal text is returned unchanged.`
4. R-copy-tight-6: The output MUST contain the rewritten copy and the change list.
5. R-copy-tight-7: The change list and every reason MUST NEVER quote removed words.
6. R-copy-tight-8: The rewrite MUST NEVER add a new action, promise or fact that the original does not state (for example a next step such as "Try again" that the source never gave). Keep a next step only when the original already has one.
7. R-copy-tight-9: The answer MUST contain only the rewritten copy and the change list: nothing before or after them, such as a note about searching or editing project files, a question or an offer.
8. R-copy-tight-10: For a list of strings the answer MUST have exactly one table row per input string, in the original order; it MUST NEVER drop, merge or reorder a string. A string that stays the same is listed as `Kept`.
9. R-copy-tight-11: Every reason MUST name the concrete change for that string; a generic phrase alone ("Cut filler") is not a reason.
10. R-copy-tight-12: A string the user marked to keep as is MUST NEVER be changed, and a claim label MUST NEVER have its claim wording changed.
11. R-copy-tight-13: A string over about 25 words MUST be split into sentences where the meaning allows, and a split MUST NEVER add a fact, change the meaning or touch legal text.
12. When two rules pull apart (a shorter string would drop a number), the rule that protects meaning, numbers and names wins.
