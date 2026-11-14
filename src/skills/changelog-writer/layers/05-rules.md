# Layer 05: Rules

Apply these while working. The ids match `RULES.json` in this folder.

1. R-changelog-writer-1: The heading MUST be `## <semver> - <YYYY-MM-DD>`.
2. R-changelog-writer-2: The bump MUST follow the change types: breaking is MAJOR, new behaviour is MINOR, fix is PATCH.
3. R-changelog-writer-3: Each bullet MUST hold one idea and start with a verb.
4. R-changelog-writer-4: Existing entries MUST NEVER be edited or reordered.
5. R-changelog-writer-5: The version MUST match the frontmatter and any registry or manifest entry; a mismatch is reported, never hidden.
6. R-changelog-writer-6: The skill NEVER invents a change, version or date; unknowns are asked.
7. R-changelog-writer-10: The entry and the reply MUST be written in the language of the user's request. An English request gets an English entry and an English reply, even when other instructions (a project file, a memory, a profile) prefer another language for chat: a CHANGELOG is a project file, and it follows the language of the request.
8. R-changelog-writer-11: A bullet MUST NEVER add a fact, cause or qualifier that the input does not contain. "fixed a link" becomes "Fix a link", never "Fix a broken link"; "added a step" becomes "Add a step", never "Add a validation step".
