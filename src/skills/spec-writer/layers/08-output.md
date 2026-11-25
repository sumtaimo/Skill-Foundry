# Layer 08: Output

The reply is one Markdown document with this shape. The headings between the restatement and "Open questions" appear only when they have a clause, always in this order:

```
## Acceptance criteria: <feature name in the text's words>

Requirement: <one sentence restating the requirement text in its own words>

### Main path
AC-1. Given <precondition>, when <one action>, then <one observable result>. _<source phrase>_

### Validation and errors
AC-2. Given ..., when ..., then .... _<source phrase>_

### Permissions and roles
### Empty, loading and disabled states
### Persistence after reload
### Limits

### Flow & State Table   (multi-screen or multi-step features only; omit for single-screen stories)
| Step | User does | System shows (loading / empty / error / success) | Next or exit |
|---|---|---|---|
| 1 | <stated action> | <stated states, or TBD (see Open questions)> | <next step or exit> |

Entry point: <stated entry point, or TBD (see Open questions)>
Exit: <stated exit, or TBD (see Open questions)>
Reload: <stated reload behaviour, or TBD (see Open questions)>
Permissions: <stated role/permission, or TBD (see Open questions)>

### Open questions
- [blocking] <Heading name>: <question to the Product Owner>? Blocks: <AC-n or "<source phrase>">
- [blocking] Conflict: <question that quotes both statements>? Blocks: "<source phrase>"
- [minor] <Heading name>: <question>? <Heading name>: <question>?

### Out of scope
- <what is excluded>. _<source phrase>_
```

Quality bar, applied to every clause:

1. One line, 40 words or fewer before the source phrase, starting with its id and a full stop ("AC-1.").
2. "Given", "when" and "then" appear once each, in that order, with "Given" capitalised after the id.
3. The "then" part is one observable result. It never says "works", "correctly", "properly" or "as expected".
4. Names, numbers, units and quoted messages are exactly those of the requirement text.
5. The source phrase is in italics with underscores, is the last thing on the line, and is found in the requirement text by search.
6. An open question is one sentence that ends with a question mark and can be answered by the Product Owner with a fact. A blocking line adds `Blocks:` and what it blocks after the question mark. Blocking lines come first, with no cap on their number; minor questions are at most three lines after them, two questions per line at most.
7. An empty "Open questions" section reads "None."; a document with no blocking question has no `[blocking]` line; an empty "Out of scope" section reads "None stated.". Neither heading is dropped.
8. The document holds no code, no checkbox, no table (except `### Flow & State Table` for multi-screen or multi-step features), no estimate, no priority and no closing remark after "Out of scope".
9. When layer 06, clause 5 or 6 applies, the fixed sentence is the first line, before the document heading.
