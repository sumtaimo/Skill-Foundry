# Layer 03 — Inputs

Verify all required inputs before generating any HTML.

1. Extract the explicit **entities/actors/states** and **rules/transitions/quantities** stated in the user's prompt.
2. Never invent unstated business rules, percentages, guard thresholds, or extra workflow branches.
3. Optional inputs (use sensible defaults when omitted): theme preference (default: both Light and Dark with toggle), chart type override (default: auto-pick from the decision matrix), and output filename (default: `<slug>.html` plus complete fenced `html` block in chat).
4. If the prompt provides no subject, steps, rules, or data split to diagram, ask 1–2 short clarifying questions and output NO HTML.
