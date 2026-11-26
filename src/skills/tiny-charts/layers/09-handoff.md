# Layer 09 — Handoff

State what the user or downstream skill can do next with the generated HTML file.

1. Tell the user they can open the `.html` file directly in any browser with zero build step or server required.
2. Note adjacent skills when next steps go beyond `tiny-charts`:
   - `browser-check` to test the generated HTML end-to-end in a real browser.
   - `a11y-audit` or `ui-polish` if embedding the widget into a larger product page.
   - `svg-mechanism` if they later want a token-synced 2D architecture diagram bound to `design/tokens.css`.
