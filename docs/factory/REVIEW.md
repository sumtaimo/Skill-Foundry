# Skill Review Checklist

Copy this list into the review and tick each item. Any unticked item blocks status `ready`.

## Clarity
- [ ] Procedure is numbered, imperative, one action per step
- [ ] Every rule uses MUST or NEVER and has an id `R-<skill>-<n>`
- [ ] No step relies on unstated knowledge
- [ ] SKILL.md is at most 150 lines; details are in references/

## Triggers
- [ ] Description says when to use the skill
- [ ] Description says when not to use it and names the alternative
- [ ] Trigger words match how a user would phrase the request
- [ ] Does not overlap another skill in the registry

## Coverage
- [ ] Main path, edge cases and error states are covered
- [ ] Every rule in RULES.json has a check or checklist item
- [ ] Every checklist item from RULES.json is reviewed here

## Examples
- [ ] examples/README.md shows at least one realistic input and output
- [ ] Examples follow the skill's own rules

## Evals
- [ ] evals/cases.json covers the main path and at least one negative case (`notContains` or `maxLines`)
- [ ] Each case has a unique id
- [ ] Evals pass with `runEvals`
- [ ] Live evals: every case has a real-agent recording in `evals/live/` and `node src/factory/live-evals.mjs <name>` prints 0 failed

## Preview quality
- [ ] Tagline is at most 90 characters and states the outcome
- [ ] Tags are at most 5 and relevant
- [ ] Example prompt works as written
- [ ] cover.svg is readable in light and dark themes (colours via `var(--...)` or `currentColor`)

## Visual items (UI skills only)
- [ ] Output checked with `checkPage` at widths 1440 and 390
- [ ] Checked in light and dark themes with reduced motion
- [ ] No `console-error` problems
- [ ] No `horizontal-scroll` problems
- [ ] No `text-outside-svg` problems
- [ ] If Playwright is not installed, the skip ("playwright not installed") is recorded and the visual check is done by hand

## Release
- [ ] `node src/factory/lint-skills.mjs <name>` exits 0
- [ ] Version, CHANGELOG and registry entry match
