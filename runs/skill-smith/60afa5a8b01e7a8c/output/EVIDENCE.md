# skill-smith run: test-planner 0.1.0

Run folder: `runs/skill-smith/60afa5a8b01e7a8c/output/`. All files were written here. The repository was not edited by this run as far as this session shows: every write went to this folder or the session scratchpad, and a `git status` check was blocked by the permission prompt, so it was not run.

## 1. Files created

Skill folder: `src/skills/test-planner/` (inside this output folder)

- `SKILL.md`, `RULES.json`, `CHANGELOG.md`, `preview.json`
- `layers/01-intent.md` to `layers/10-evidence.md` (the ten core layers)
- `references/README.md` (checklist writing guide and reviewer checklist)
- `examples/README.md` (one hand-written worked example and one diff example)
- `evals/cases.json` (4 cases: main path, diff input, negative test-code request, missing change text)
- `evals/live/<case-id>.json` (4 recordings, one per case)
- `preview/cover.svg`

Other files:

- `dist/test-planner-0.1.0.zip` (sha256 431d2456296044be2743185edf1f0516f318aacf4a655844a37e77fb61c4a257, 16218 bytes), packed with the factory's own packer into this output folder
- `registry-entry.proposed.json` (status `draft`; not added to the repository registry)
- `EVIDENCE.md` (this file)

## 2. Checks run

- Factory linter (`lint-skills`, library call, repository test folder used for `chk-check-tested`): no problems.
- Factory live-eval scorer (`live-evals`, scoring the 4 recordings): 4 passed, 0 failed.
- Cover safety, read by the linter: viewBox present, no script element, no foreignObject element, no external links, colours only as token variables, currentColor or none. Size well under 40 KB.
- SKILL.md is 65 lines (limit 150); the linter's size check passed.
- Negative case: the fresh agent refused to write test code and wrote no files (`notContains` checks passed).

Not run:

- `npm test` and `npm run guard` in the repository: not run, because they would touch the repository and this run was limited to the output folder.
- `run-skill.mjs`: not run. It writes into the repository's `runs/` folder. The recordings in `evals/live/` are text replies from fresh agents, with `files: []`, because the skill produces text, not files.
- `routing-evals.mjs`: not run. It covers only registry entries with status `ready`, and this skill is not registered in the repository.
- Visual check of the cover in light and dark themes: not run; no rendering tool was used.

## 3. Recorded real runs

Each case was answered by a fresh general-purpose agent that was given the skill folder path and the case prompt only, and told to read only files in that folder. Replies were saved verbatim (leading indentation removed) into `evals/live/<case-id>.json`.

| Case | Result |
|------|--------|
| checkout-promo-description | pass: 6 items in 5 areas, 4 possible-impact questions, 4 open questions |
| cart-limit-diff | pass: 5 items in 3 areas, 2 possible-impact questions, 2 open questions |
| negative-write-test-code | pass: refused test code, wrote nothing |
| no-change-text | pass: asked for the change text, no checklist |

Note: the diff case used code identifiers as area headings (for example `showMessage("Your cart is full")`). The rules allow names taken from the diff, so this was not changed; the rules were not edited after recording, so the recordings stay valid.

## 4. Review (author self-check against the review checklist)

This is the author's own check, not an independent review. The owner or a second reviewer must confirm it before status `ready`.

Answered yes:

- Procedure is numbered and imperative; each rule uses MUST or NEVER with an id.
- SKILL.md is within 150 lines; details are in layers and references.
- The description says when to use the skill and when not to, and names the alternative (answer in the chat).
- The trigger phrases are the two requests the user named.
- No overlap with the other registry skills (changelog-writer, copy-tight, figure-craft, skill-smith).
- Main path, missing input and negative request are covered.
- Every rule maps to a check id or a checklist line.
- Each eval case has a unique id; live recordings exist for every case.
- Tagline is 90 characters or fewer; 4 tags.
- Lint exit is clean; version, CHANGELOG heading and frontmatter match (0.1.0, 2026-11-14).

Answered no:

- Cover readable in light and dark themes: not verified visually.
- Registry entry matches: the entry exists only as a proposal in this output folder, not in the repository.

## 5. Open items

- The skill folder is in this output folder, not under the repository's `src/skills/`. Moving it there is an owner decision.
- Registry entry: `registry-entry.proposed.json` has `roles: ["BA_ANALYST", "QA_AUDITOR"]`. Those roles were chosen by the author, not given by the owner; confirm or change them.
- `skill-smith`'s own eval case for this prompt expects `src/skills/test-planner/SKILL.md` inside the repository, so it will only pass after the folder is moved there.
- Routing evals need the registry entry at status `ready` and a routing recording before the skill can be routed.
- Cover light/dark check still to do.
- `npm test` and `npm run guard` still to run in the repository.

## 6. Assumptions

- The input gave the goal, users, triggers, outputs and exclusions in full, so the interview in layer 01 was not repeated.
- The skill works from the change text only: it does not read the codebase, and it treats diff names as sources.
- Version stays at 0.1.0 until the owner calls it final.

## 7. Safety checks, in words

The cover has no script element, no foreignObject element and no external links. The skill's own text names no repository paths. The output of every case contains no test code (checked by searching for the test-call words).
