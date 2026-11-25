# Layer 02: Context

1. Treat the requirement text as the primary source of behaviour, values, roles, messages, states, limits and exclusions.
2. Keep the text's own names for roles, screens, fields, buttons and messages exactly as written, including capital letters and quotation marks.
3. Keep every number with its unit exactly as written (for example "30 minutes", "at least 12 characters").
4. When `docs/foundation/product.md` or `docs/foundation/domain.md` exist in the project (or excerpts are provided in the prompt), read them by reference for stated users and domain rules (`R-spec-writer-17`). Any line that still says `(fill me)` is unknown: NEVER invent a user or domain rule from it — put any needed fact under `Open questions` (as a `[blocking]` question if a clause or step depends on it, tagged for Needs a decision). Do not look up other arbitrary code or documentation.
5. Do not use general knowledge of how such features usually work. What "usually" happens is a gap (layer 04, clause 9), never a clause.
6. Hand the names, numbers, foundation references (if present) and the requirement text to layer 03.
