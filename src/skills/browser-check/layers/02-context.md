# Layer 02: Context

1. The address and the flow from the user are the only sources; never assume pages, buttons or texts the user did not name or the browser did not show.
2. Check which browser the agent has: when the Playwright browser tools are available, use them (layer 04, part A).
3. When they are not, use the script with Node.js (layer 04, part B). It needs the `playwright` package in the project or installed globally, and its Chromium browser.
4. When neither can run, follow layer 06, step 2. Never describe the page from its source code as if it had been opened.
5. Read the project's files only to learn the address or the start command to tell the user (for example `package.json` scripts); never change them.

Hands to layer 03: which browser will run (tools, script or none).
