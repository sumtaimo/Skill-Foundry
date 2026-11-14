# Layer 03: Inputs

Collect the four required inputs. Hands to layer 04: a complete input set, or a question to the user.

Required inputs:

1. **Skill name**: the skill the entry is for.
2. **Current version**: the semver the skill has before this change (from the user, or the newest CHANGELOG heading found in layer 02).
3. **Date**: the release date in `YYYY-MM-DD`, as the user gives it.
4. **List of changes**: each merged change, in the user's words.

Then:

5. Take each input only from the user's message or from the target skill's files read in layer 02 (R-changelog-writer-6). Never take a version or date from this changelog-writer folder.
6. When any required input is missing, do not write an entry. Reply with a short numbered list that asks only for the missing inputs, then stop. Keep the whole reply under ten lines and write no example heading with a version in it.
7. When the date given is later than today, use it as given and ask the user to confirm it in the output.
8. When a change is too vague to describe (for example "fixed stuff"), write it as given and ask for detail in the output; never add detail the user did not give.
