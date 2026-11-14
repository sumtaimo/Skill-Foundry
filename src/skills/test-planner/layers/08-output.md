# Layer 08: Output

The reply is one Markdown document with this shape:

```
## Regression checklist: <change name>

Change: <one sentence restating the change text in the user's words>

### <Area name as the change text names it>
1. [ ] <verb-first check with its expected result>. _<source phrase>_

### <Next area>
7. [ ] <next item, numbering continues>. _<source phrase>_

### Possible impact, not stated
- <question about an adjacent area>? The change text does not name it.

### Open questions
- <question about an unclear or conflicting point>
```

Quality bar, applied to every item:

1. One check with one expected result, on one line of 25 words or fewer.
2. The item starts with a verb.
3. No item repeats another item, and no two items share a source phrase unless that phrase states both results.
4. Area headings and item wording use the user's names exactly, with the same capital letters.
5. An item about removed behaviour says what must no longer happen.
6. An empty "Possible impact, not stated" or "Open questions" section reads "None.".
7. Sections stay in the order shown above.
8. For a diff, area headings are the shared name from the changed lines, as written in the diff, not constants or function names.
9. When layer 06, step 11 applies, the fixed sentence is the first line, before the heading.
