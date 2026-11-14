# copy-tight: findings from the portable checks (2026-11-14)

For the copy-tight owner session. Not changed here (one skill per session).

Same prompt ("An unexpected error has occurred while attempting to save your changes."), two fresh agents:

| Run | Rewrite | Change list |
|---|---|---|
| through the old installer | `Couldn't save your changes. Try again.` | "Added a next step" |
| through `npx … add` (recorded) | `We couldn't save your changes.` | "Kept the meaning: the save failed" |

Question for the skill: R-copy-tight-3 says the rewrite MUST NEVER change the meaning. Adding "Try again." adds an
instruction the source did not give. The skill does not say whether adding a next step is allowed, so agents differ.
Suggested fix in the skill (not in the eval): a rule that the rewrite adds no new action, promise or fact, plus an eval
case that checks an error message is not given a new next step. Then re-record live evals and the portable check.
