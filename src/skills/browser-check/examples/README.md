# browser-check examples

These are hand-written examples of the format; they are not proof. The proof is in `evals/live/`.

## 1. A sign-in flow with one failing step

Request: "Open index.html and check that signing in with an empty email shows an error, and with an email says Welcome back."

```
## Browser check: sign in

Page: index.html · Browser: Chromium via the script · Widths: 1280 and 390 px
Result: 4 of 5 steps passed. FAILED
Typed values: "ana@example.test"

### Steps
1. PASS: click Sign in with an empty email
2. PASS: see "Enter your email."
3. PASS: type "ana@example.test" in Email
4. PASS: click Sign in
5. FAIL: see "Welcome back". The text did not appear within 5 seconds; screenshot browser-check-out/fail-step-5.png

### Console and page errors
- None.

### Failed requests
- GET http://127.0.0.1:41234/api/login answered HTTP 404

### Screenshots
- browser-check-out/fail-step-5.png
- browser-check-out/end-1280.png
- browser-check-out/end-390.png

### Not checked
- Accessibility, visual design and other browsers than Chromium.
- Steps the user did not name.

### Open questions
- Should /api/login answer on this page, or is the 404 expected without a backend?
```

## 2. The app is not running

Request: "Check the checkout at http://localhost:3000/checkout."

```
I could not open the page in a browser, so nothing below was checked in a browser.

## Browser check: checkout
...
### Open questions
- Please start the app (your package.json has "npm run dev") and ask again.
```
