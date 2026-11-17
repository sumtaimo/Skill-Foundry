# Lessons the user taught

Rules here are injected into every harness worker prompt and should be read by any
editor AI before it starts work. Add with:  node .harness/memory.mjs remember "..."
Remove with:  node .harness/memory.mjs forget L3
- [L1] (2026-11-13) Explain to TAIMO in Khmer (never Thai); keep file names, commands, code and technical terms in English.
- [L2] (2026-11-13) Quality and detail MUST come from the skill itself (its rules, lint and references), never from an agent adding it by hand afterwards; when output is weak, fix the skill and re-run. This applies to every skill.
- [L3] (2026-11-13) Every skill MUST be usable by other people outside this repo: it starts from the goal the user states, is self-contained in its own folder, and the showcase shows only real recorded output.
- [L4] (2026-11-14) Skill versions stay at 1.0.0 until TAIMO says a version is final; never bump a version on your own, record changes under the current version instead.
- [L5] (2026-11-14) figure-craft showcases ONE object only (the refrigerator), at the detail level of the reference figure TAIMO gave; do not add other showcase objects.
- [L6] (2026-11-14) Every new skill MUST follow the skill-smith procedure: template copy, ten layer files, RULES.json, examples, evals, cover, lint, review checklist in docs/skills/<name>/, pack, registry entry and a test.
- [L7] (2026-11-14) Project purpose: Skill Foundry is a factory and growing library of reusable, tested AI agent skills; read docs/PROJECT.md first and plan future work from its roadmap and docs/factory/ROADMAP.md.
- [L8] (2026-11-14) A skill is done only when a fresh real agent, given only the skill folder, passes its live evals (node src/factory/live-evals.mjs <name>) and routing evals; hand-written answers never count as proof.
- [L9] (2026-11-14) When a real agent fails a skill eval, fix the skill, not the eval case, and re-record with a new agent.
- [L10] (2026-11-14) Never bring brands, products or languages from outside this project (e.g. WABOOKS, WeBill365, WeCafe, Korean) into Skill Foundry work or questions; use only what is in this repository or what the user says here.
- [L11] (2026-11-14) Change at most one skill per session, never edit a skill listed in src/factory/locks.json (write notes in docs/factory/notes/ instead), and run npm run guard before every commit; on a WARNING stop and tell the user.
- [L12] (2026-11-14) Never leave work half done: finish every task you start, including the gaps and open items your own report lists, in the same session; if something truly cannot be done, say exactly what blocked it and what you need, and hand any work for another skill to a named session instead of writing 'left for later'.
- [L13] (2026-11-14) Ship every ready skill through the skill-foundry CLI (npx github:sumtaimo/Skill-Foundry add/check/update) with correct roles in the registry, so existing and new projects can install, update and auto-assign skills to harness roles; never break updates for projects that already installed a skill.
- [L14] (2026-11-14) Follow one release path: lab branch, real-agent proof, npm run release:check must print READY, TAIMO approves in chat, merge to master, Pages, users npx update (docs/factory/PUBLISHING.md); never skip a step.
- [L15] (2026-11-15) Skills inspired by real books MUST use only the principles, written as checkable rules; never name the books or authors in the skill or its docs.
- [L16] (2026-11-15) Before any new skill or skill change, check docs/factory/ROADMAP.md (Built, Candidates, merged/dropped, overlap gate); warn TAIMO about any overlap and propose improving or merging an existing skill instead; never start a duplicate skill, even if TAIMO asks, until TAIMO decides after the warning.
- [L17] (2026-11-15) When this session controls child sessions, answer their questions for TAIMO within the scope TAIMO already approved, follow them up until done, and ship through lab branch, release:check READY, then master; ask TAIMO only for new business decisions.
- [L18] (2026-11-16) During work on a skill, re-record only the real-agent cases the change affects; re-record every case once, fresh, right before the final release:check, so release proof stays complete while cost stays low.
- [L19] (2026-11-16) Follow up child sessions on a shrinking schedule: first check 30 minutes after start, then 15 minutes later if not done, then every 5 minutes until done; never wait an hour.
- [L20] (2026-11-16) Read docs/factory/STATUS.md at the start of every session and update it before reporting: phases, TAIMO's decisions, open questions, and every skill weakness found in real use (one backlog line each), so nothing found is forgotten.
- [L21] (2026-11-16) Release path: claude/... work branch, then merge to the lab branch (staging, TAIMO's name for UAT) and run release:check there, then ask TAIMO in chat to release lab to master; never merge a work branch straight to master.
- [L22] (2026-11-16) This project is also TAIMO's Agentic Harness user: whenever you notice an Agentic Harness bug or issue, report it to TAIMO in chat as feedback and ask where to record it; do not put it on GitHub until TAIMO confirms.
- [L23] (2026-11-16) Never change the Agentic Harness from this project (not .harness/ here, not its code): only report harness issues to TAIMO; TAIMO has them fixed in the separate sumtaimo/Agentic-Harness project.
- [L24] (2026-11-16) Phase C (re-updating this repository's .harness/) is dropped by TAIMO; the Agentic-Harness project updates its harness copy here only when TAIMO orders it.
- [L25] (2026-11-17) docs/factory/notes/harness-findings-2026-11-16.md stays on the lab branch only (TAIMO, 2026-11-17); remove it in a commit on lab before lab is released to master, and never put private docs or links on master.
- [L26] (2026-11-17) Remove internal handoff, guide, and process notes from docs/ after Step 2 finishes and before releasing lab to master, so internal working processes do not leak publicly.
