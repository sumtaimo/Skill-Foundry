# Layer 05: Rules

Apply every rule below to every string. The ids match `RULES.json`.

1. R-copy-tight-3: The rewrite MUST NEVER change the meaning of the copy.
2. R-copy-tight-4: The rewrite MUST NEVER change numbers, names or their capital letters.
3. R-copy-tight-5: Legal text MUST NEVER be rewritten; it is returned with the fixed note `Legal text is returned unchanged.`
4. R-copy-tight-6: The output MUST contain the rewritten copy and the change list.
5. R-copy-tight-7: The change list MUST NEVER quote removed words.
6. R-copy-tight-8: The rewrite MUST NEVER add a new action, promise or fact that the original does not state (for example a next step such as "Try again" that the source never gave). Keep a next step only when the original already has one.
7. When two rules pull apart (a shorter string would drop a number), the rule that protects meaning, numbers and names wins.
