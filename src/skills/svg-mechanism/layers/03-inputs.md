# Layer 03 — Inputs

Extract only what the user provided and never fabricate unrequested architecture.

1. List the exact nodes, actors, stages, branches, and error/retry paths named by the user.
2. Check if the mechanism is missing or underspecified:
   - If no concrete system, mechanism, or flow is named, ask 1–2 short numbered questions:
     1. Which system or mechanism should the diagram explain, and what are its main stages or branches?
     2. Should it be a standalone HTML/SVG file or a React/JSX component, and should it bind to existing CSS tokens?
   - Stop after asking; do NOT emit placeholder `<svg>` or fabricated architecture.
3. Capture constraints from the request:
   - Primary happy-path flow direction (left-to-right for pipelines, top-to-bottom for layered stacks, two-column exchange for handshakes).
   - Secondary branches (cache miss, retry queue / DLQ, error path, webhook signature rejection).
   - Required interactive controls (Play/Pause is always included; add step/stage inspection when there are 3+ distinct stages).
4. Record any user-supplied token names or brand accent variables so Layer 05 maps every SVG surface, stroke, and signal to them.
