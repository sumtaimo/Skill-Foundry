# Layer 02: Context

1. The skill runs in any project. Use only the request, the files of the user's project and this skill folder.
1a. Look for `design/variables.json` and `design/BRIEF.md`. A `design/variables.json` is this skill's own foundation: use path d (set, check, explain), never path c. A `design/BRIEF.md` holds the user's answers: read it and never ask the brief again.
2. Look for an existing system in the project: files named like `*tokens*.json`, `*tokens*.css`, `*.tokens.json`, `theme.css`, `variables.css`, and any CSS file with five or more custom properties (`--name: value;`) in a `:root` block. Skip `.claude/`, `node_modules/`, build output and this skill folder.
3. When the user pastes tokens in the message, they are the existing system. Save them word for word to `existing-tokens.css` (or `existing-tokens.json` for JSON) in the output folder, so the engine can read them, and say so in the report.
4. When the user names a file or folder, use only that as the existing system.
5. Never open, edit, rename or delete an existing token file other than to read it (R-design-system-9).
6. Note what the user says about the product (what it is, who uses it) and about the style; layer 03 uses these words to pick the archetype.
7. Hand the path, the existing files (if any) and the user's words to layer 03.
