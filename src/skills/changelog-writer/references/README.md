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

## Format rules

- Semver: MAJOR for changes that break existing use, MINOR for new behaviour, PATCH for fixes and wording.
- Every version bump has a CHANGELOG.md entry: `## <version> - <YYYY-MM-DD>` followed by bullet points.
- The newest entry is on top; older entries are never edited or reordered.
- The version in the SKILL.md frontmatter, the CHANGELOG and any registry or manifest entry must match.
