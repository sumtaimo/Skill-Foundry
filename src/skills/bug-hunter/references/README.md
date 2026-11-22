# References

## 1. What is a bug, and what is not

| A bug (report it) | Not a bug (leave it out) |
|---|---|
| A wrong result: a total, count, date or text that is not what a test, the request or a project comment says | Code style: names, formatting, spacing, comments, `var` or `let`, long functions |
| A plain wrong result anyone can see from the function's own name and code (`isEmpty` returns true for a full list) | A business rule nobody stated ("a discount should never exceed 50%") |
| A throw or crash on an input the code can receive (an empty list, a missing field a caller passes) | A "what if" input no caller passes and no source mentions (`NaN`, `null`, `undefined` or a wrong type for a function whose tests and callers never use one) |
| Lost or corrupted data (an item skipped, a value overwritten, a mutation of the caller's input) | Speed, design, or a library you would prefer |
| A loop bound off by one, a wrong comparison, a missing `return` or `await` | UI look, contrast, spacing (ui-polish) and accessibility (a11y-audit) |
| A failing test, or a test setup that cannot run | A test that is missing: that is a Red step, not a finding by itself |

An edge case is a finding only when you can name the input, the line, the wrong result and the source of the right result. Empty lists, zero, one item, many items, repeated spaces and long or non-English text are inputs of the same kind as the tests use; `NaN` for a function always called with numbers is not.

## 2. Confirmed or suspect

- Confirmed: you ran the project's test command, a test failed, and you copied its failing line word for word. The cause is the cited line.
- Suspect: you read the code and can say "`<input>` gives `<wrong result>` because line <n> does <x>". The test command does not show it yet.
- A suspect never becomes confirmed by running other code. Its Red test, added by QA, is what confirms it.

## 3. Worked findings

Code `lib/cart.js`:

```
3  export function cartTotal(items) {
4    let sum = 0;
5    for (let i = 1; i < items.length; i++) sum += items[i].price * items[i].qty;
6    return sum;
7  }
```

Confirmed (a test fails):

```
1. `lib/cart.js:5` cartTotal skips the first item, so every total is too low.
   - Evidence: `+ 10` / `- 25` from "cartTotal adds every item"
   - Expected: 25 (source: test/cart.test.js:6)
   - Red: the failing test "cartTotal adds every item" in `test/cart.test.js`.
   - Green: start the loop at `let i = 0` on line 5; then run `npm test` and see every test pass.
```

Suspect (no test shows it):

```
1. `lib/slug.js:2` slugify replaces only the first space.
   - Reading: "New big idea" gives "new-big idea", because `replace(' ', '-')` on line 2 replaces one match only.
   - Expected: "new-big-idea" (source: the name and code of slugify, which joins words with "-")
   - Red: add a test in `test/slug.test.js`: slugify("New big idea") expects "new-big-idea". It must fail first; if it passes, drop this finding.
   - Green: use `replaceAll(' ', '-')` on line 2, only after Red fails.
```
