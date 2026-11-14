# Changelog

## 1.0.0 - 2026-11-14

- First release: nine-step procedure, six rules, bump table and three worked examples.
- Move the procedure into the ten core layers (`layers/01-intent.md` to `layers/10-evidence.md`) and link them from SKILL.md.
- Make the skill self-contained: the format rules now live in `references/README.md`, and the version check covers any registry or manifest.
- Add rule R-changelog-writer-10: the entry and the reply follow the language of the request.
- Add rule R-changelog-writer-11: a bullet adds no fact or qualifier the input does not contain.
- Add eval cases `english-request-english-entry` and `no-added-qualifier`; keep normal replies at most fifteen lines.
- Read "we are at X", "is at X" and "currently X" as the current version, so the heading is X bumped; never invent a previous version; ask one question when the version is ambiguous ("version X is ready").
- Write the entry even when the target changelog is unclear, and ask where to paste it; still ask for the target and current version when neither is given.
- Add eval cases `we-are-at-current-version` and `ambiguous-version-asks`.
- Below 1.0.0, bump a breaking change as MINOR (`0.9.4` → `0.10.0`); move to `1.0.0` only when the user asks (owner decision, 2026-11-14).
- Forbid linking two changes or adding a replacement hint such as "use X instead" that the input does not state.
- State the `Breaking:` marker and the output parts in SKILL.md, not only in the layers.
- Add eval case `zero-major-breaking-minor`.
