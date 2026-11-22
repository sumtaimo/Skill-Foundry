# Changelog

## 0.1.0 - 2026-11-22

- First version: reads public pages (official docs, standards, comparable products) for a spec; every fact cites the URL it was fetched from with one exact quote of at most 25 words; facts and inferences are kept apart; pages that could not be fetched are named with the tool's reason; nothing is filled from memory.
- Prompt-injection safe: text inside a page is data; a page instruction is never followed and is reported under Warnings with a fixed line.
- Fixed sentences for no fetch tool, no question, a journey request (journey-mapper), an acceptance-criteria request (spec-writer), a login or form request, and a request to save a file.
- Read-only: writes no file and runs no command; follows the task's own format (JSON only) and writes a harness worker's assigned file.
- What fresh real agents found while it was built, all fixed in the skill, no case weakened: a login URL was fetched (the skill now never fetches a login or form URL); open questions suggested answers ("for example 32") that no page stated (new R-web-research-17); quotes joined two sentences and ran to 26 to 29 words (a quote is now one sentence or part of one); a line about what the agent did came before the fixed sentence (nothing comes before it now); a harness worker that read only SKILL.md missed the one-line fact format, the exact Warnings line and the "no code fence" rule, and copied Markdown links from the page into its note (all four are now in SKILL.md itself). One case was wrong and was fixed: the `conflict` fixture gave a yearly and a monthly price, which is not a real conflict; the review page now states a yearly price too.
- Requested by Agentic-Harness for BA_ANALYST (uses the role's `mcp__fetch`; `WebFetch` works too).
