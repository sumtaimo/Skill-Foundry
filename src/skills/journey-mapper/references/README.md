# References

## 1. The seven slots

| Slot | It answers | A quote belongs here when the source says |
|---|---|---|
| Loading | What the actor sees while the step waits | what is shown while saving, sending or loading |
| Empty | What the actor sees when there is nothing to show | what is shown with no items, no results or no data yet |
| Error | What happens when the step fails | what happens when the system or the network fails, or a message for it |
| Success | What the actor sees or gets when the step works | the result, the next page or a message on success |
| Validation | Which input is accepted or refused | a rule on what the actor types or picks, a limit, a refusal message |
| Reload and back | What is kept after a reload, the back button, a new session or a return | what stays, resumes or restarts |
| Permissions | Who may do or see the step, and who may not | a role, an invite, a plan, a sign-in condition |

"Not applicable" is for a slot that cannot happen in the step: Empty in a step that shows no list or data; Validation in a step with no input. A gap is never "Not applicable".

## 2. Wording a question

- Ask, do not suggest. Good: "Which payment methods are accepted?" Suggesting: "Do you accept cards and PayPal?" (it names an answer the goal does not name).
- One topic per line: "Q5 [minor] Error (steps 1-4): What does the user see when a step fails?"
- Name the steps: "(step 2)", "(steps 1-4)", or "(whole journey)".
- Blocking: a step or the end of the journey cannot be built without the answer ("Who may sign up?" when the goal only says "users"). Minor: the journey can be built and the answer changes a detail.
- A missing step: "What happens between step 2 and step 3?", never "Is there an email confirmation step?"
- A conflict: "Conflict: "up to 5 codes" or "at most 3 codes"?", always blocking.

## 3. Worked slot lines

Goal: "New users sign up with an email and a password of at least 12 characters, then land on the dashboard."

```
2. New users enter an email and a password. Source: "sign up with an email and a password of at least 12 characters"
   - Loading: Not applicable: nothing is sent while typing
   - Empty: Not applicable: this step shows no list or data
   - Error: Q5
   - Success: Q3
   - Validation: "a password of at least 12 characters"
   - Reload and back: Q6
   - Permissions: "New users"
```

The 12-character rule is quoted. What the page says when the password is too short is not stated, so it is part of a question, never a made-up message.
