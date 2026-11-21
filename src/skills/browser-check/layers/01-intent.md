# Layer 01: Intent

Defined terms used in every layer:

- **Address**: the page to open. A local address (`localhost`, `127.0.0.1`, `*.localhost`, any port), a local HTML file, or a preview address the user typed themselves.
- **Flow**: the user journey to click through, in the user's words ("sign up with an email", "add a shirt to the cart and pay").
- **Step**: one action a user takes (open, click, type, choose, press a key) or one thing to see (a text, an address).
- **Evidence**: what the browser reported: the step status, console errors, page errors, failed requests and screenshot files.
- **Browser tools**: the Playwright browser tools of the agent (names like `browser_navigate`, `browser_click`, `browser_snapshot`), when the agent has them.
- **Script**: `engine/check.mjs` in this skill folder.

1. Read the user's request and find the address and the flow.
2. State the goal in one sentence: "Open <address> and check that <flow> works."
3. When the address or the flow is missing, go to layer 03, step 3 or 4; do not guess either one.
4. When the request is about something else (a test plan, an accessibility audit, a design review), go to layer 06.

Hands to layer 02: the address, the flow and the goal sentence.
