# Layer 03: Inputs

Collect the four required inputs. Hands to layer 04: a complete input set, or a question to the user.

Required inputs:

1. **Skill or project name**: which changelog the entry is for. When the request names none and the working folder has exactly one `CHANGELOG.md` of that project, that file is the target. When it is still unclear, this input alone never blocks the entry: if the version, date and changes are given, write the entry and ask where to paste it (layer 06 state 4).
2. **Current version**: the semver the skill or project has BEFORE this change (from the user, or the newest CHANGELOG heading found in layer 02). Read the user's words with the table below; the heading always carries the bumped version computed in layer 04.

| The user says | It means |
|---|---|
| "we are at X", "is at X", "currently X", "current version X", "on X", "latest is X" | X is the **current** version; the heading is X bumped |
| "bump to X", "release X", "new version X", "next version X", "make it X" | X is the **new** version the user wants; check it against the bump rule |
| "version X is ready", "version X" with no verb, "for X" | **Ambiguous**: ask one question, "Is X the current version (the entry would be X bumped) or the new version?", and write no entry |

   Never invent a previous version: the current version is only what the user or the CHANGELOG says (R-changelog-writer-6).
3. **Date**: the release date in `YYYY-MM-DD`, as the user gives it.
4. **List of changes**: each merged change, in the user's words.

Then:

5. Note the language of the request; the entry and the reply use it (R-changelog-writer-10).

6. Take each input only from the user's message or from the target skill's files read in layer 02 (R-changelog-writer-6). Never take a version or date from this changelog-writer folder.
7. When the current version, the date or the list of changes is missing (or the version is ambiguous), do not write an entry. Reply with a short numbered list that asks for every missing input, then stop. The list includes the skill or project and the current version whenever the user gave neither: a version can only be read from a CHANGELOG once the target is known, so never assume one. Keep the whole reply under ten lines and write no example heading with a version in it.
8. When the date given is later than today, use it as given and ask the user to confirm it in the output.
9. When a change is too vague to describe (for example "fixed stuff"), write it in the user's words and ask for detail in the output; never add detail the user did not give, not even an adjective such as "broken" or "old" (R-changelog-writer-11).
