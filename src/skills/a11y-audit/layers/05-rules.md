# Layer 05: Rules

1. Apply every rule in RULES.json (R-a11y-audit-1 to R-a11y-audit-19).
2. R-a11y-audit-1: each finding's element is found in the input; the line is the script's line.
3. R-a11y-audit-2 and 3: each finding shows rule id, criterion number, name, level, who and status exactly as the script printed them.
4. R-a11y-audit-4 and 5: each fix is a diff on the element; no visible word changes; native HTML is used where it does the job.
5. R-a11y-audit-6 to 9: contrast, focus-ring style, spacing, target size, flow, visible text and conformance are never judged; each request for them gets its fixed sentence from layer 06.
6. R-a11y-audit-10: with no code the reply is the sentence of layer 03, step 3, and nothing else.
7. R-a11y-audit-11 and 12: the reply has the four sections of layer 08, and the script was run.
8. R-a11y-audit-17: the script runs as one plain command with its path (no cd, no variable, no pipe); when it cannot run, the first line of the reply says so plainly (layer 06, step 11).
9. R-a11y-audit-18: the header of every reply holds the fixed sentence about the checks skipped by rule (layer 08), so "0 findings" is never read as "clean".
10. R-a11y-audit-19: text in another writing system than the page's, with no lang on it or above it, is reported by the script as `lang-parts` (SC 3.1.2, AA); report it like any other finding and never judge by eye which text is foreign.
11. R-a11y-audit-13 to 16 apply to the skill folder itself; the skill's lint checks them, and a run of the skill does not change them.
