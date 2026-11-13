# Examples

## Example: a changelog-writer skill

Prompt: "Make a skill that writes CHANGELOG entries from a list of merged changes."

Expected result:

- Folder `src/skills/changelog-writer/` copied from the template.
- `RULES.json` with rules such as `R-changelog-writer-1` mapped to `chk-frontmatter` or a checklist line.
- `evals/cases.json` with at least one case.
- Report listing files, lint result, eval result and review outcome.
