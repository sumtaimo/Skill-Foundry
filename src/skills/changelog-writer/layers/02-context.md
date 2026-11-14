# Layer 02: Context

Find what already exists, so nothing is overwritten. Hands to layer 03: the existing entries, the current version and the places that record it.

1. Look for the target skill's `CHANGELOG.md` (usually next to its `SKILL.md`). If it exists, read every entry. The target is the skill the user named, never this changelog-writer folder; when no skill is named yet, read nothing here and go to layer 03.
2. Mark every existing entry as read-only: its heading, bullets and order stay exactly as they are (R-changelog-writer-4).
3. Read the newest heading of the target skill's CHANGELOG; its version is the current version when the user did not give one.
4. Find every other place that records the version: the `version:` line in the `SKILL.md` frontmatter and, when the project has one, a registry or package manifest entry for the skill.
5. Note each fact with its file and line, for example `SKILL.md:4 version: 1.0.0`.
6. When the skill or its files cannot be found, record "not found" for each and go on; do not invent their content. Layer 07 reports it.
