# Layer 06: States and edge cases

Handle each case below the same way every time.

1. **All inputs given, CHANGELOG found**: follow layer 04 and report mismatches.
2. **Required input missing**: ask only for what is missing, in a short numbered list; write no entry (layer 03 step 7).
3. **No CHANGELOG.md yet**: write the new entry as the first one under a `# Changelog` title and say the file is new.
4. **Target unclear, or skill or version files not found** (for example several CHANGELOG files and none matches the changes): write the entry from the user's input, and say in the mismatch line which files could not be checked and which files must show the new version.
5. **Mixed change types**: the highest type decides the bump (breaking over new behaviour over fix); every change still gets its own bullet.
6. **One message holds two changes** ("added a step and fixed a link"): split it into two bullets.
7. **User names the new version** (only with words such as "bump to X", "release X", "new version X"; see the table in layer 03): check it against the bump rule; if it differs, say which version the rule gives and why. "We are at X" or "currently X" is never a new version: it is the current one.
   **Ambiguous version** ("version X is ready"): ask only that one question and write no entry; never choose one reading and never invent a previous version.
8. **Check task**: compare the given entry with rules 1 to 6 and list each problem with the rule id; do not rewrite older entries.
9. **Project policy that holds versions** (for example "versions stay at 1.0.0 until approved"): still write the computed version in the heading, and ask the user in the output whether to apply it now.
10. **Vague change**: keep the user's words; ask in the output for the detail; never guess it (R-changelog-writer-11). Do not put a guessed qualifier into the question either; ask "Which link did you fix?".
11. **Date in the future or in an odd format**: keep the user's date, convert only an unambiguous format to `YYYY-MM-DD`, and ask to confirm otherwise.
