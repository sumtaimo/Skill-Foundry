# Guide: keeping Skill Foundry and Agentic Harness in sync

For TAIMO to paste into the `sumtaimo/Agentic-Harness` repository (session on branch `lab`). Self-contained: that
repository cannot see this one. The full engineering brief is `docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md` (paste it
first, then this guide's prompt; or give the raw URL). Written 2026-11-16; the current state of the other repository is in
`docs/factory/STATUS.md` of Skill Foundry.

## 0. Paste order (TAIMO)

Send two things to the session in `sumtaimo/Agentic-Harness`, in this order:
1. **First:** the whole file `docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md` (the handoff).
2. **Then, in a second message:** section 2 of this guide (the kickoff prompt). It tells the session to use the handoff
   that was already sent.
Sections 3 to 5 of this guide are for TAIMO to read; they do not need to be pasted.

## 1. One paragraph

Skill Foundry ships only domain skills (`npx github:sumtaimo/Skill-Foundry`). Agentic Harness ships only the harness
(`npx github:sumtaimo/Agentic-Harness`). Each project works alone; together they must work without conflict in either
install order. When a skill is duplicated, Skill Foundry wins. Skill Foundry never changes the harness; the harness is
changed only here, in this repository.

## 2. Ready-to-paste kickoff prompt (second message; the handoff was pasted first)

```text
Repo: sumtaimo/Agentic-Harness. Work on branch `lab` only; never edit `release` directly.
Skill Foundry reference: master 6d0c255 (https://github.com/sumtaimo/Skill-Foundry/commit/6d0c255). Its staging branch
`lab` holds later skill fixes until TAIMO releases it; pin `master`.

Read AGENTS.md, docs/MAINTAINING.md and the handoff brief HANDOFF-AGENTIC-HARNESS-SYNC.md that I pasted in my previous
message (it is also at
https://raw.githubusercontent.com/sumtaimo/Skill-Foundry/lab/docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md). If you cannot
find it above, stop and ask me to paste it; do not guess its content.

Decisions already made by TAIMO (do not ask again): Skill Foundry installs are npx-first; eight roles are known and
UX_DESIGNER writes CSS only; recognised harness starter copies (for example the 15-line spec-writer stub) are replaced
by Skill Foundry with a .orig backup, unknown user skills never; pointers omit allowedTools (bare Edit, Write, Bash for
skills with engine/); Agentic-Harness pulls Skill Foundry skills only with --with-skills for now.

Work in this order:
1. Inspect governance.mjs, handoff.mjs, sessions.mjs, doctor.mjs, team.json, roles/*.json, skills/*/SKILL.md, install.mjs, watch.mjs and daemon.mjs.
2. Ask TAIMO, in plain Khmer, to confirm H1 to H11 of the brief (H7 staging branch name, H8 worker permissions in cloud
   sessions, H9 one worker at a time and resume after a usage limit, H10 adopt remote cloud branches for cross-engine
   continuation, H11 checkpoint push and auto-push at 80% quota warning). Never guess.
3. Implement only the approved changes on `lab`; add unit tests and the two-order integration test (harness first, then
   Skill Foundry; Skill Foundry first, then harness) against Skill Foundry master; add the L19 schedule test
   (checks at 30, 45, 50, 55 minutes; a usage-limit stop counts as not done).
4. Run npm test and npm run audit. Report honestly for TAIMO's review (lab to release), with a short list of what changed,
   what was tested, and anything left open with its real blocker.
```

## 3. The sync loop (so neither side drifts)

| Step | Who | What |
|---|---|---|
| 1 | Skill Foundry session | Finds a harness problem while working. Reports it to TAIMO in chat (rule L22). Never edits the harness (L23). |
| 2 | TAIMO | Decides: fix it, or not. Pastes the report into the Agentic-Harness session, or tells that session to read the handoff. |
| 3 | Agentic-Harness session | Fixes it on `lab`, adds a test, reports. |
| 4 | TAIMO | Confirms; Agentic-Harness releases `lab` to `release`. |
| 5 | Skill Foundry session | Re-runs the two-order test against the new harness release and records the result in `docs/factory/STATUS.md`. |

Same rule in both directions: if the Agentic-Harness session finds a Skill Foundry problem, it reports it to TAIMO and
does not edit Skill Foundry.

## 4. Shared facts (keep identical in both repositories)

- Rules on both sides: follow-up of started work at 30, then 15, then every 5 minutes (L19); a usage-limit stop counts as
  not done and resumes after the reset; real-agent runs one at a time; the cost a session reports leaves out the
  `claude -p` agents it runs.
- Release path: work branch, then `lab`, then TAIMO confirms in chat, then the release branch. Nothing skips `lab`.
- Valid permission rules are `Edit(...)`; `Write(...)` deny rules are invalid.
- Pointer contract: `.harness/skills/<name>/SKILL.md` with `installed-by: skill-foundry <version>`, `roles`, `keywords`,
  `autoApply: true`; `.claude/skills/<name>/.foundry.json` is the version stamp.
- In user-facing output, guide plainly; do not expose internal skill rules, layers, evaluation criteria or protection
  details.

## 5. What is done and what is open (2026-11-17)

Done and released on Skill Foundry `master`: Phase A (CLI fixes, `doctor`), Phase B (site, roles, starter-copy
replacement, smooth wording). On `lab`, waiting for TAIMO's release: shorter skill pages and the skill improvements S1 to
S7 as they finish. Open for this repository: AH-1 to AH-13 and H1 to H11 in the brief. Not planned: re-updating
Skill Foundry's own `.harness/` (dropped by TAIMO). Internal handoff/guide docs stay on `lab` only until Step 2 finishes
and are removed before public `master` release.
