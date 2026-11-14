# Layer 08: Output

Return exactly these parts, in this order, and nothing else.

1. **Entry**: the new entry in a markdown code block: the heading, a blank line, then the bullets.
2. **Bump**: one line, `Bump: MAJOR|MINOR|PATCH (<old> → <new>)`, followed by the one-line reason.
3. **Mismatches**: `Mismatches: none`, or one line per file that must change to the new version, or the files that could not be checked.
4. **Questions** (only when needed): at most three short questions, for example a future date or a vague change.

Quality bar:

5. Write in the language of the user's request.
6. Use the exact heading format; no extra words such as "Release" or "v" before the version.
7. Keep bullets short (one line each), in plain words, with no marketing words.
8. Keep the whole reply under twenty lines for a normal entry.
9. When inputs are missing, the output is only the numbered question list from layer 03.
