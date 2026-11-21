# Layer 04: Flow

1. Turn the flow into numbered steps, one action or one thing to see per step, in the user's order. Add an "expect" step after each action whose result the user named.
2. Keep the user's words for texts to see ("Welcome back"); never invent a text the user did not give. When the result is not named, add an open question instead of a guess.

Part A, browser tools:

3. Open the address with the navigate tool; then for each step use the matching tool (references, table 2) and read its result.
4. After each step, take a snapshot or a screenshot; a step passes only when the tool result shows it did.
5. At the end read the console messages and the network requests with the tools; take a screenshot at 1280 and at 390 px wide.

Part B, the script:

6. Write the steps as a JSON array to `browser-check-out/steps.json` with the file-writing tool (references, table 1).
7. Run ONE plain command: `node <path of this skill>/engine/check.mjs --file <page.html> --steps browser-check-out/steps.json` or the same with `--url <address>`.
8. Read the script output. Exit 0 means every step passed and the page threw no error; 1 means a step failed or the page threw; 2 means it could not run (layer 06, step 2).
9. When a step fails because the target was not found, you may correct the target once (for example `text=` to `label=`) and run again; say so in the reply. Never change what the step checks.

Both parts:

10. Copy the steps, errors, requests and screenshot paths into the format of layer 08, as reported.

Hands to layer 05: the results, the errors and the screenshot paths.
