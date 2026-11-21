# Layer 03: Inputs

Required:

1. An address (layer 01). A plain file path is fine: the script serves its folder on 127.0.0.1 by itself.
2. A flow, or the request "just open it", which means: open the page, take screenshots, report errors.

When one is missing:

3. No address: reply only "Which local address or HTML file should I open? For example http://localhost:3000/ or index.html." and stop.
4. No flow, and the request is more than "open it": reply only "Which steps should I click through? For example: open the sign-up page, type an email, press Sign up, see the welcome text." and stop.
5. Test data: use the values the user gave; otherwise make test values that end in `.test` (for example `ana@example.test`); never real personal data (R-browser-check-6).

Hands to layer 04: the address, the steps in the user's order and the test values.
