# Layer 05: Rules

Apply these while working. The ids match `RULES.json` in this folder.

1. R-changelog-writer-1: The heading MUST be `## <semver> - <YYYY-MM-DD>`.
2. R-changelog-writer-2: The bump MUST follow the change types: breaking is MAJOR, new behaviour is MINOR, fix is PATCH.
3. R-changelog-writer-3: Each bullet MUST hold one idea and start with a verb.
4. R-changelog-writer-4: Existing entries MUST NEVER be edited or reordered.
5. R-changelog-writer-5: The version MUST match the frontmatter and any registry or manifest entry; a mismatch is reported, never hidden.
6. R-changelog-writer-6: The skill NEVER invents a change, version or date; unknowns are asked.
