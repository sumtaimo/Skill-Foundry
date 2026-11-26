# Layer 08 — Output

Deliver the auto-picker explanation and the complete, runnable single-file HTML.

1. Start with:
   - `Chart choice: <Statechart | Sequence | Flowchart | Timeline | Sankey>`
   - `Why this chart: <1–2 concise sentences grounded in the prompt>`
2. Provide the complete, self-contained `.html` file inside a fenced `html` code block from `<!doctype html>` to `</html>` with zero placeholders or truncation (and write it to disk if the workspace permits, naming the path).
3. Include a brief **Playable Controls & Logic Summary** noting the states/events wired into `CHART_SPEC` and how `"Show the logic"` synchronizes Rules and Flowchart.
4. For out-of-scope requests (Layer 01) or vague requests (Layer 03), skip steps 1–3 and output ONLY the single redirect sentence or 1–2 clarifying questions.
