# Lessons the user taught

Rules here are injected into every harness worker prompt and should be read by any
editor AI before it starts work. Add with:  node .harness/memory.mjs remember "..."
Remove with:  node .harness/memory.mjs forget L3
- [L1] (2026-11-13) Explain to TAIMO in Khmer (never Thai); keep file names, commands and technical terms in English.
- [L2] (2026-11-13) Quality and detail MUST come from the skill itself (its rules, lint and references), never from an agent adding it by hand afterwards; when output is weak, fix the skill and re-run. This applies to every skill.
- [L3] (2026-11-13) Every skill MUST be usable by other people outside this repo: it starts from the goal the user states, is self-contained in its own folder, and the showcase shows only real recorded output.
