# References

## Change type to bump

| Change type | Example | Bump |
|-------------|---------|------|
| Breaking | A required section is renamed; an eval case changes meaning | MAJOR |
| New behaviour | A new step, rule, check or example set | MINOR |
| Fix | Wording, a typo, a link | PATCH |

Below 1.0.0 (`0.x`) a breaking change is MINOR: `0.9.4` with a breaking change gives `0.10.0`. The move to `1.0.0` happens only when the user asks for it.

## Entry shape

```
## 1.2.0 - 2026-11-14

- Breaking: Rename the output section so old reports no longer match.
- Add a step that reports version mismatches.
- Fix the link to the standard.
```

Each bullet uses only the words of meaning in the input: "fixed a link" gives `- Fix a link.`, never `- Fix a broken link.`
The entry is written in the language of the request.

## Format rules

- Semver: MAJOR for changes that break existing use, MINOR for new behaviour, PATCH for fixes and wording; below 1.0.0, breaking changes are MINOR.
- Every version bump has a CHANGELOG.md entry: `## <version> - <YYYY-MM-DD>` followed by bullet points.
- The newest entry is on top; older entries are never edited or reordered.
- The version in the SKILL.md frontmatter, the CHANGELOG and any registry or manifest entry must match.
