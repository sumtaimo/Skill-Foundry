# Landing relayout plan (draft, waiting for approval)

Status: PLAN ONLY. No UI code changes until the product owner approves this file.

## 1. Who the landing serves, and their one job

| Visitor | Job | Today | Gap |
|---|---|---|---|
| Person (developer, analyst, PO) | Find a skill for a task and install it | Finder sits below the hero and the "download all" link | The main task is not the first thing on the page |
| Agent | Read the catalogue, pick a skill, install it with a checked command | `skills.json` and `llms.txt` exist, linked at the bottom | Not visible near the top; no ready prompt to hand an agent |
| Reviewer | Trust that a skill really works | Real-agent line on cards; quality layers only in `docs/` | The proof story is not on the site |

## 2. Current order (index.html)

1. Hero: title, sub, typing prompt, cover, skill chips
2. Ready skills: checksums link, download all, finder, grid
3. For agents
4. How a skill is made
5. Install a skill
6. Limits

## 3. Proposed order

```
┌ Top bar: Skill Foundry · Skills · Install · For agents · Proof · theme · language ┐
│                                                                                    │
│ 1. HERO (find first)                                                               │
│    One line in. A skill out.                                                       │
│    [ Search by task, name or tag ............................ ]                    │
│    (All roles) (PO / architect) (Business analyst) (Developer) (QA auditor)        │
│    4 of 4 skills · all tested by real agents except 1                              │
│                                                                                    │
│ 2. RESULTS GRID (cards, slimmer)                                                   │
│    title · tagline · roles · real-agent badge                                      │
│    [Copy install command]  (primary)   Download .zip (secondary link)              │
│    "View details" goes to the skill page                                           │
│                                                                                    │
│ 3. INSTALL IN 3 STEPS   one command block + manual zip steps folded                │
│                                                                                    │
│ 4. FOR AGENTS   skills.json · llms.txt · a copyable prompt:                        │
│    "Read <site>/llms.txt, pick the skill for my task, install it, verify it."      │
│                                                                                    │
│ 5. PROOF   the quality layers as a short strip:                                    │
│    Lint → Evals → Real agent → Routing → Browser → Review → Release                │
│    with today's real numbers per skill (from recordings, never typed by hand)      │
│                                                                                    │
│ 6. HOW A SKILL IS MADE (short) · LIMITS · footer                                   │
└────────────────────────────────────────────────────────────────────────────────────┘
```

The typing demo and covers move from the hero into the cards and skill pages, so the first
screen is about finding. Mobile: one column, search full width, role chips wrap, 44px targets.

## 4. Skill page order

1. Header: title, tagline, roles, real-agent badge, **Copy install command** at the top
2. Four questions (unchanged): what it does, what you type, what you get, how you know
3. How you know: real-agent cases with the agent's actual answer (from `evals/live/`), meter
4. Download (zip, SHA-256), changelog

## 5. Rules the relayout keeps

- Only facts the site can prove: counts and results come from the registry and recordings.
- No new dependencies; Inter and JetBrains Mono only; one accent; light and dark; reduced motion.
- `figure-craft` is locked: its card shows "Not yet tested by a real agent" and its folder is not touched.
- Every existing site test keeps passing; new tests cover the new order and the agent prompt.

## 6. Agent goals: what is set and what is missing

| Agent / file | Purpose set? | What it says today |
|---|---|---|
| Project goal (`.harness/charter.md`) | Yes | "A library of reusable AI agent skills: build, test and manage them" |
| `PO_ARCHITECT` / orchestrator | Generic only | "Product Owner … governs scope, acceptance criteria and backlog priority" |
| `BA_ANALYST` / `lead-ba` (owns `docs/**`) | Generic only | "Investigates requirements … writes specs and acceptance criteria" |
| `DEV_ENGINEER` / `lead-dev` (owns `src/**`) | Generic only | "Implements scoped code changes" |
| `QA_AUDITOR` / `lead-qa` (owns `tests/**`) | Generic only | "Writes and runs tests; audits deliverables" |
| Backlog (`.harness/backlog.json`) | No | Empty, `project` field blank |
| User profile (`.harness/memory/profile.md`) | No | 7 items still "(fill me)" |
| Skill rules for every agent (`AGENTS.md`, lessons L1-L7) | Yes | Quality law, real-agent proof, one skill per session, locks |

None of the role files says what that role does **for Skill Foundry** (for example: QA must
record real-agent runs; BA must write the eval cases from the interview). Proposed goals,
waiting for approval:

- PO_ARCHITECT: keep the roadmap and backlog; approve each skill's scope and its eval cases; decide release.
- BA_ANALYST: interview the skill goal; write the description, rules and eval cases; write the review record.
- DEV_ENGINEER: build skill files, factory tools and the site; never change a locked skill.
- QA_AUDITOR: run lint, evals, real-agent live evals, routing and browser checks; block release on any failure.
