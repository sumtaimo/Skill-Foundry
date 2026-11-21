# journey-mapper examples

These are hand-written examples of the format; they are not proof. The proof is in `evals/live/`.

## 1. A short sign-up goal

Request: "Map the user journey: new users sign up with an email and a password of at least 12 characters, then land on the dashboard."

```
## Journey map: sign up

Goal: "new users sign up with an email and a password of at least 12 characters, then land on the dashboard"
Actors: "new users"
Entry: Not stated (Q1)
Done when: "land on the dashboard"

### Steps
1. New users enter an email and a password. Source: "sign up with an email and a password of at least 12 characters"
   - Loading: Not applicable: nothing is sent while typing
   - Empty: Not applicable: this step shows no list or data
   - Error: Q4
   - Success: Not applicable: typing has no result of its own
   - Validation: "a password of at least 12 characters"
   - Reload and back: Q5
   - Permissions: "new users"
2. New users submit the sign-up. Source: "sign up"
   - Loading: Q3
   - Empty: Not applicable: this step shows no list or data
   - Error: Q4
   - Success: "then land on the dashboard"
   - Validation: Q2
   - Reload and back: Q5
   - Permissions: "new users"
3. New users land on the dashboard. Source: "then land on the dashboard"
   - Loading: Q3
   - Empty: Q6
   - Error: Q4
   - Success: "land on the dashboard"
   - Validation: Not applicable: this step has no input
   - Reload and back: Q5
   - Permissions: "new users"

### Cross-step checks
- Reload or close mid-journey: Q5
- Cancel and come back later: Q5
- Permission change between steps: Not applicable: one actor only
- Related modules: "the dashboard"

### Open business questions
- Q1 [blocking] Entry (step 1): Where does a new user start the sign-up?
- Q2 [blocking] Validation (step 2): What happens when the email is already registered?
- Q3 [minor] Loading (steps 2-3): What does the user see while the sign-up is sent and the dashboard loads?
- Q4 [minor] Error (steps 1-3): What does the user see when a password is too short or a step fails?
- Q5 [minor] Reload and back (whole journey): What is kept after a reload, the back button or leaving mid-way?
- Q6 [minor] Empty (step 3): What does a new user's dashboard show before there is any data?

### Not in this map
- Acceptance criteria: spec-writer can turn this map into Given-When-Then.
- What to retest after a change: test-planner.
- Screen design, copy and estimates.

Sources: the goal. Steps: 3. Blocking questions: 2.
```

## 2. No goal

Request: "Can you map the user journey for me?"

```
Tell me the feature goal in one or two sentences: who does what, and when it is done.
```
