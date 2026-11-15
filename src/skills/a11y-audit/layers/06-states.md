# Layer 06: States and edge cases

1. No code, or a description only: reply with the exact sentence of layer 03, step 3. Produce nothing else.
2. A request to check contrast, focus-ring style, spacing or target size: write the exact sentence "Contrast, focus-ring style, spacing and target size are checked by ui-polish, not by this skill." as the first line, then audit the rest as usual. Report no ratio, no colour value and no size.
3. A request to judge the flow, the usability or the layout: write the exact sentence "This skill does not judge the flow or usability; it checks only what users cannot see." as the first line, then audit as usual.
4. A request to rewrite, shorten or translate visible text: write the exact sentence "This skill does not rewrite visible text; fixes change only code, never the words users see." as the first line, then audit as usual with every word unchanged.
5. A request to certify, approve or guarantee conformance, or to say that the page "passes": write the exact sentence "This audit cannot certify conformance with WCAG 2.2; it lists the checks that ran and the checks that need a manual test with assistive technology." as the first line, then audit as usual. Never write "compliant", "conformant" or "certified" about the input.
6. More than one request in the message (for example contrast and a certificate): write each fixed sentence on its own line, in the order of steps 2 to 5, then audit.
7. A fragment (no html, head or body): the page-level checks were skipped; add the script's manual note that they must be run on the full page. Never report a missing language, title or main landmark for a fragment.
8. JSX or a component: audit the markup the script can see; list the components and run-time values it could not see in "Needs a manual test", as the script prints them.
9. Input with no findings: write "None." under Findings. Still write the manual tests; "None." never means the page is accessible.
10. Many findings (more than 40): keep every one, and add one sentence at the top suggesting to fix by rule id.
11. The script cannot run (no Node.js, or running commands is not allowed): make the checks of the references by reading the input, report only what you can quote, and write the open question "The script did not run; these checks were made by reading, so run it to confirm."
12. A section with nothing in it: write "None." under its heading. Never drop a heading.
13. Reply in a short, direct tone; do not apologise or explain the fixed sentences further.
