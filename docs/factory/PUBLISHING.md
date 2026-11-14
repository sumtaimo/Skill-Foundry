# Publishing a Skill

1. Bump `version` in the SKILL.md frontmatter (semver, see STANDARD.md section 10).
2. Add a `## <version> - <YYYY-MM-DD>` entry to the skill's CHANGELOG.md.
3. Update the `version` of the skill in `src/factory/registry.json`.
4. Run the tests: `node --test "tests/**/*.test.mjs"`.
5. Run the linter: `node src/factory/lint-skills.mjs <name>`. Fix every reported problem until it exits 0.
6. Complete the checklist in REVIEW.md.
7. Pack the skill: `node src/factory/pack.mjs <name>` (output goes to `dist/` unless `--out <dir>` is given).
8. Read the sha256 from the pack output, or from `dist/checksums.json` when packing with `--all`.
9. Record the sha256 with the release notes.
10. Set `status` to `ready` for the skill in `src/factory/registry.json`.

The zip is named `<name>-<version>.zip`, holds the files under `<name>/` and includes `<name>/INSTALL.txt`.
To pack every skill except `_template`: `node src/factory/pack.mjs --all`. This also writes `all-skills.zip` and `checksums.json`.
