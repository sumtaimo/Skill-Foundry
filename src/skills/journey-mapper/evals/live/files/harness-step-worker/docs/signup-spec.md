## Journey map: Sign up form (F1 "login", step 3 of 6)

Goal: "User: fills email + password and submits. Screen states to handle: loading, error, success. Validation: email format; password at least 8 characters."
Actors: "User"
Entry: Not stated (Q5)
Done when: "success"; Q4

### Steps
1. User fills in email and password. Source: "fills email + password"
   - Loading: Not applicable: nothing is sent while typing
   - Empty: Not applicable: this step shows no list or data
   - Error: Q1
   - Success: Q8
   - Validation: "email format; password at least 8 characters"; Q1, Q2, Q8
   - Reload and back: Q7
   - Permissions: "User"; Q6
2. User submits the form. Source: "and submits"
   - Loading: "loading"; Q8
   - Empty: Not applicable: this step shows no list or data
   - Error: "error"; Q3
   - Success: "success"; Q4
   - Validation: "email format; password at least 8 characters"; Q1, Q2, Q8
   - Reload and back: Q7
   - Permissions: "User"; Q6

### Validation messages
The goal names two rules and no message text for either. No message is written here; each one waits for Q1.
- Email: rule "email format". Message: Not stated (Q1).
- Password: rule "password at least 8 characters". Message: Not stated (Q1).

### Cross-step checks
- Reload or close mid-journey: Q7
- Cancel and come back later: Q7
- Permission change between steps: Q6
- Related modules: "4. Sign up form" (docs/features/login.md:9) builds from this spec; "2. Log in form" (docs/features/login.md:7) is in the same feature; Q9

### Open business questions
- Q1 [blocking] Validation (steps 1-2): What exact message does the user see when the email fails the email format rule, and what exact message when the password has fewer than 8 characters?
- Q2 [blocking] Validation (steps 1-2): Which rule defines a valid "email format"?
- Q3 [blocking] Error (step 2): Which failures after submit lead to the error state, and what message does the user see for each?
- Q4 [blocking] Success (step 2): What does the user see, and where do they go, after a successful sign up?
- Q5 [blocking] Entry (step 1): From where does the user reach the sign up form?
- Q6 [blocking] Permissions (steps 1-2): Who may open and submit the sign up form, and what happens when someone who may not opens it, including a user whose sign-in status changes while the form is open?
- Q7 [blocking] Reload and back (steps 1-2): What is kept in the form after a reload, the back button or leaving and returning, and what happens when the page is reloaded while the submit is loading?
- Q8 [minor] Loading and validation timing (steps 1-2): What does the user see while the submit is loading, and can they submit again during it? When are the email and password rules checked, and is submit allowed while a rule fails?
- Q9 [minor] Limits and related modules (steps 1-2): Is there a maximum length or any other rule for the email or the password? How does the sign up form link to the log in form?

### Not in this map
- Acceptance criteria: spec-writer can turn this map into Given-When-Then.
- What to retest after a change: test-planner.
- Screen design, copy and estimates.

Sources: the goal, docs/features/login.md. Steps: 2. Blocking questions: 7.
