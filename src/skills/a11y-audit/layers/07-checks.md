# Layer 07: Checks

Checks anyone can run by search, in any project:

1. For each finding, search the input for its element (the copy of the opening tag). It must be found; a missing element removes the finding.
2. Compare the finding numbers: they run 1 to N with no gap and no repeat, in the order of the script.
3. Compare each rule id, criterion number, level and status with the script output; they are identical.
4. Search the reply for "contrast", "focus ring", "spacing" and "target size". They may appear only in the fixed sentence of layer 06, step 2, in the header sentence about the checks skipped by rule (layer 08) and in the "Not checked here" line. Also verify that no contrast ratio (such as `:1`), hex colour value or pixel size from the prompt or input appears anywhere in the reply.
5. Search the reply for "compliant", "conformant", "certified" and "passes WCAG". None may appear except inside the fixed sentence of layer 06, step 5.
6. Compare every visible word of the input with the fixes: none is changed.
7. Search the reply for the four section headings of layer 08, in order, and for the header sentence about the checks skipped by rule, word for word.
7a. When the script ran, it ran as one plain command (layer 04, step 1); when it did not, the first line of the reply says so (layer 06, step 11).

Reviewer checklist, answered yes or no (the same list is in references/README.md):

8. Every finding has an element, a criterion, who is affected and a diff fix.
9. Every fix is a small change and prefers native HTML.
10. No finding is about contrast, focus-ring style, spacing, target size, flow or visible text.
11. The reply never says the page is accessible or conformant, and lists what needs a manual test.
12. A boundary or certificate request got its exact sentence.
13. The output follows the format in layer 08.

Hand the answers to layer 08 for the quality bar and to layer 10 for the record.
