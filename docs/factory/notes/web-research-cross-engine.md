# web-research: make the tool wording work for Codex and Antigravity (for a web-research session)

Audit (2026-11-22, Agentic-Harness maintenance session): 16 of 17 skills have no Claude-only words in SKILL.md. Only
`web-research` names Claude Code's tools (`mcp__fetch`, `WebFetch`), in SKILL.md (line 16, R-web-research-6), RULES.json,
layers/01-intent.md, layers/03-inputs.md (the fixed sentence), references/README.md, examples/README.md,
evals/cases.json, tests/web-research.test.mjs and the `no-fetch-tool` recording.

Effect today: on Codex or Antigravity the skill looks for "a tool whose name ends in `fetch`" and, finding none, says the
fixed no-tool sentence. That is a safe failure (honest, no fact from memory) but a capability gap.

Proposed wording (not applied):
- Fetch tool = any tool of the agent that opens a URL and returns the page text: `WebFetch` or an `mcp__…fetch` tool in
  Claude Code, the web or browse tool in Codex, the browser or read-URL tool in Antigravity, or any MCP fetch server.
- Fixed sentence: "web-research needs a tool that reads web pages; none is available, so no page was read."

Why it was not done in the maintenance session: it is a skill change, so it needs fresh real-agent proof. `live-evals.mjs
--run` is NOT enough: it runs the agent with its default tools (WebFetch was available in the no-fetch-tool case, so the
case failed) and records no `tools` / `fetches` / `reads` / `commands`, which tests/web-research.test.mjs requires. The
recorder that produced the existing recordings (restricted tools, stream capture, five rounds) is not in the repository.
Next session: rebuild or recover that recorder, change the files above, record all 12 cases, rerun routing and
`portable-check`, and, if a Codex or Antigravity CLI is available, record at least `node-docs-fact` and `no-fetch-tool` with it.
