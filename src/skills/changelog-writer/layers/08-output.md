# Layer 08: Output

Return exactly these parts, in this order, and nothing else.

1. **Entry**: the new entry in a markdown code block: the heading, a blank line, then the bullets.
2. **Bump**: one line, `Bump: MAJOR|MINOR|PATCH (<old> → <new>)`, followed by the one-line reason.
3. **Mismatches**: `Mismatches: none`; or one line per file that must change to the new version; or, when the skill's files could not be found, ONE line that says so and names the files to set (for example `Mismatches: not checked, spec-check not found; set SKILL.md version, CHANGELOG.md and any registry entry to 1.1.0.`).
4. **Questions** (only when needed): at most three short questions, one line each, for example a future date or a vague change.
   End the reply after the last part; add no closing remark such as "I changed no files".

Quality bar:

5. Write the entry and the whole reply in the language of the user's request (R-changelog-writer-10); a reply-language preference from elsewhere never changes it.
6. Use the exact heading format; no extra words such as "Release" or "v" before the version.
7. Keep bullets short (one line each), in plain words, with no marketing words.
8. Keep the whole reply at most fifteen lines for a normal entry; count them before returning.
9. When inputs are missing, the output is only the numbered question list from layer 03.
