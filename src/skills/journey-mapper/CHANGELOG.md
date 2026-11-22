# Changelog

## 0.1.0 - 2026-11-21

- First version: grows a short feature goal into the whole user journey (header, numbered steps with seven slots each: Loading, Empty, Error, Success, Validation, Reload and back, Permissions; cross-step checks; open business questions tagged blocking or minor).
- Read-only: writes no file and runs no command; the map is the reply, so it works in the read-only `[HARNESS FEATURE_BA]` planner call of Agentic-Harness 1.0.39.
- Never invents a business rule: every fact is a quote of the goal (or a named file with path and line); every gap is a question that asks and never suggests.
- Fixed sentences for a missing goal, an acceptance-criteria request (spec-writer), a regression-checklist request (test-planner), a review, design or browser request, and a request to save a file.
- From the Agentic-Harness risk check (harness 1.0.41): when the task prompt requires a format (the `[HARNESS FEATURE_BA]` call replies with ONLY JSON), the skill fills that format and prints no Markdown map; steps the task asks for beyond the goal's words are kept as proposals with their question in `needsDecision`; fields it does not own (acceptance criteria, workers, files) follow the task and the other injected skills (R-journey-mapper-14). A harness worker with an assigned file writes the map into that file only and ends with a short report on the task's acceptance criteria (R-journey-mapper-15). Two live cases use the exact harness prompts (`harness-feature-json`, `harness-step-worker`); the worker case first allowed 8 reply lines, and was raised to 30 because a worker's report on each acceptance criterion is wanted, not a defect.
- Requested by Agentic-Harness for BA_ANALYST (keywords journey, workflow, user flow, feature, onboarding, sign up, checkout).
