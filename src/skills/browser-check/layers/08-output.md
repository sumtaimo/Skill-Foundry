# Layer 08: Output

The reply is one Markdown document with this shape. A fixed sentence from layer 06, when one applies, is the first line, before the heading.

````
## Browser check: <flow in a few words>

Page: <address> · Browser: <Chromium via the browser tools | Chromium via the script> · Widths: 1280 and 390 px
Result: <n> of <m> steps passed. <PASSED | FAILED | NOT RUN>
Typed values: <each value typed, or "none">

### Steps
1. PASS: open <address>
2. PASS: type "ana@example.test" in Email (used input "Email")
3. FAIL: see "Welcome back". The page still shows the sign-up form; screenshot /tmp/browser-check-<time>/fail-step-3.png
4. NOT RUN: press Log out (an earlier step failed)
5. FAIL: press Join. 2 elements match: button "Join", button "Join the team"; asked which one under Open questions

### Console and page errors
- console error: <as reported>

### Failed requests
- POST http://localhost:3000/api/signup answered HTTP 500

### Screenshots
- /tmp/browser-check-<time>/end-1280.png
- /tmp/browser-check-<time>/end-390.png

### Not checked
- Accessibility, visual design and other browsers than Chromium.
- Steps the user did not name.

### Open questions
- None.
````

Quality bar:

1. Steps keep the user's order and words; the status is the first word after the number.
2. A FAIL line says what was expected and what the browser showed, and gives the screenshot path.
3. Error and request lines are copied as reported, one per line; an empty section reads "None."
4. Screenshot paths are copied as the script or tools printed them.
5. "Not checked" always has its two bullets, also when everything passed.
6. No cause in the code is guessed; a likely next step for a developer goes to Open questions as a question.
7. No step, button or text appears that the user did not name or the browser did not show.
8. Every click, type, choose and tick step names the element it used, as the browser reported it.

Hands to layer 09: the reply and the screenshot files.
