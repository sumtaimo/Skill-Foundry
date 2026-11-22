# bug-hunter examples

These are hand-written examples of the format; they are not proof. The proof is in `evals/live/`.

## 1. A confirmed bug

Request: "Hunt for bugs in src/cart.js. Customers say the cart total is wrong."

```
## Bug hunt: src/cart.js

Scope: `src/cart.js`
Test command: `npm test`
Test run: 2 passed, 1 failed
Result: 1 confirmed, 0 suspect

### Confirmed
1. `src/cart.js:5` cartTotal starts its loop at 1, so the first item is never added.
   - Evidence: `AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:` with `10 !== 25`
   - Expected: 25 (source: test/cart.test.js:6)
   - Red: the failing test "cartTotal adds every item" in `test/cart.test.js`.
   - Green: change `let i = 1` to `let i = 0` on line 5; then run `npm test` and see every test pass.

### Suspect
None.

### Not in this hunt
- Code style, naming and formatting; UI style (ui-polish) and accessibility (a11y-audit).
- What to retest after a change: test-planner.
- Files outside the scope.

Evidence: `npm test` (2 passed, 1 failed). Files read: `package.json`, `src/cart.js`, `test/cart.test.js`.
```

## 2. A regression checklist request

Request: "We changed the discount code. Give me a regression checklist of what to retest."

```
bug-hunter finds bugs in code; a regression checklist of what to retest after a change comes from test-planner.
```
