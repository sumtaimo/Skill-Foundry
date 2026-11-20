# Layer 08: Output

The answer is plain text, no files. Use format A for one string and format B for two or more strings. Never mix them.

## Format A: one string

1. The line `Rewritten copy:` then the new string. A string over about 25 words may become several sentences in the same line, separated by a space.
2. A blank line, then the line `What changed:` then at most 5 short bullets. Each bullet names the concrete change for this string (which part went, which verb replaced a passive, what was kept), never a removed word in any form (no quotes, no backticks) and never only a generic phrase such as "cut filler".
3. For legal text: the original text unchanged under `Rewritten copy:`, then `What changed:` followed by `Legal text is returned unchanged.`
4. Fixed bullets: `- No change needed` for copy that is already tight; `- Length limit was not met; meaning kept.` when a user limit could not be met.

## Format B: two or more strings

1. The line `Rewritten copy:` then this table, one row per input string, in the original order, nothing dropped:

```
| ID | Before | After | Saved | Reason |
|---|---|---|---|---|
| 1 | <input string exactly as given> | <new string, ready to paste> | <number> | <concrete change for this string> |
```

2. ID: the user's own id, or the line number of the string in the request (1, 2, 3 ...). Before: the input exactly as given. After: the new string; a string over about 25 words becomes two or more sentences in the same cell. Saved: characters of Before minus characters of After, spaces counted, 0 for a kept row.
3. Reason: one short phrase with the concrete change for that string, never a removed word in any form (R-copy-tight-7), never only a generic phrase (R-copy-tight-11). Example: `Dropped the time phrase and the polite closing; amount kept`.
4. A string that stays the same is still a row: After equals Before, Saved is 0, and the reason starts with `Kept:` and says why, for example `Kept: already tight`, `Kept: marked keep as is`, `Kept: claim wording`, `Kept: name only`, or `Kept: legal text. Legal text is returned unchanged.`
5. A blank line, then `What changed:` then at most 3 bullets: `- <N> strings in, <N> rows out: <X> changed, <Y> kept.`, `- Total characters saved: <Z>.`, and when a user limit was not met `- Length limit was not met; meaning kept.`

## Both formats

- Quality bar: each string is shorter or equal in length, uses everyday words, keeps every number and name exactly, fits its UI job (verb-first buttons, errors that say what happened) and adds no new action, promise or fact; a next step stays only if the original had one.
- Keep the whole answer short and start with Rewritten copy: and end after the change list (R-copy-tight-9): no preamble, no closing note, no question, no offer, no mention of searching or editing files, no explanation of the skill, no alternatives unless the user asked for options.
