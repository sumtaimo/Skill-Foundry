# References

## Change type to bump

| Change type | Example | Bump |
|-------------|---------|------|
| Breaking | A required section is renamed; an eval case changes meaning | MAJOR |
| New behaviour | A new step, rule, check or example set | MINOR |
| Fix | Wording, typo, a wrong link | PATCH |

## Entry shape

```
## 1.2.0 - 2026-11-14

- Breaking: Rename the output section so old reports no longer match.
- Add a step that reports version mismatches.
- Fix the link to the standard.
```

## Source

The format comes from `docs/factory/STANDARD.md` section 10 and the steps in `docs/factory/PUBLISHING.md`.
