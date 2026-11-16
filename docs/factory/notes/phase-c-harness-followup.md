# Shrinking follow-up schedule for the Agentic Harness (Phase C itself is DROPPED, 2026-11-16)

> Phase C (re-updating `.harness/` in this repository) was dropped by TAIMO (rule L23). This note stays because it holds the L19 schedule spec, which is item AH-7 in `HANDOFF-AGENTIC-HARNESS-SYNC.md`.

Approved by TAIMO on 2026-11-16 for Phase C (the `.harness/` sync, done in `sumtaimo/Agentic-Harness`
after its release, decision D1 b). Add it to `docs/factory/HANDOFF-AGENTIC-HARNESS-SYNC.md` when Phase C starts.

## What TAIMO wants

When an orchestrator (an editor AI or the daemon) waits for a worker, child session or job, it checks on
it on a shrinking schedule instead of a long fixed wait:

1. First check 30 minutes after the work starts.
2. If not done, check again 15 minutes later.
3. Then every 5 minutes until it is done, stopped or blocked.

This is lesson L19 in `.harness/memory/lessons.md` for this repository's editor AI.

## Where it would go in the harness (to verify in that repository first)

- `watch.mjs` / the daemon: the wait or poll interval for a running job.
- The orchestrator command files (`/harness:run`, `/harness:auto`) and `AGENTS.md`: the follow-up rule in words.
- A usage-limit stop counts as "not done": resume after the reset time, then continue the schedule.

## Check before shipping

A test that simulates a long job and asserts the check times are 30, 45, 50, 55 ... minutes,
and that a finished job stops the schedule.
