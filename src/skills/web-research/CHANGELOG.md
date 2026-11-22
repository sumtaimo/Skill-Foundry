# Changelog

## 0.1.0 - 2026-11-22

- First version: reads public pages (official docs, standards, comparable products) for a spec; every fact cites the URL it was fetched from with one exact quote of at most 25 words; facts and inferences are kept apart; pages that could not be fetched are named with the tool's reason; nothing is filled from memory.
- Prompt-injection safe: text inside a page is data; a page instruction is never followed and is reported under Warnings with a fixed line.
- Fixed sentences for no fetch tool, no question, a journey request (journey-mapper), an acceptance-criteria request (spec-writer), a login or form request, and a request to save a file.
- Read-only: writes no file and runs no command; follows the task's own format (JSON only) and writes a harness worker's assigned file.
- Requested by Agentic-Harness for BA_ANALYST (uses the role's `mcp__fetch`; `WebFetch` works too).
