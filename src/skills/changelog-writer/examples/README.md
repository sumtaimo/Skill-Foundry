# Examples

## Example 1: a new step and a fix

Input: skill `spec-check`, current version `1.0.0`, date `2026-11-14`, changes: "added a step that lists open questions", "fixed a broken link in references".

Output:

```
## 1.1.0 - 2026-11-14

- Add a step that lists open questions.
- Fix a broken link in references.
```

Bump: MINOR, because one change is new behaviour and none is breaking. Mismatches: none.

## Example 2: a breaking change

Input: skill `spec-check`, current version `1.1.0`, date `2026-11-20`, changes: "renamed the Output section".

Output:

```
## 2.0.0 - 2026-11-20

- Breaking: Rename the Output section so old reports no longer match.
```

Bump: MAJOR. The older `## 1.1.0` and `## 1.0.0` entries stay below, unchanged.

## Example 3: missing input

Input: "write a changelog entry". Output: a question asking for the skill name, current version, date and the list of changes. No entry is written.
