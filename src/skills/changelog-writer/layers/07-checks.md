# Layer 07: Checks

Check the draft before returning it. Fix every failure first. Hands to layer 08: a checked entry.

1. The heading matches `## <digits>.<digits>.<digits> - <YYYY>-<MM>-<DD>` exactly, with a space-hyphen-space between version and date.
2. The heading version is exactly one step above the current version for the chosen bump; it is never the current version itself.
3. Every bullet starts with a verb (or `Breaking:` and a verb) and holds one idea.
4. Breaking bullets come first; no bullet appears twice.
5. Every fact in the entry (change, version, date) comes from the user's input or a file read in layer 02.
6. Older entries, when shown, are identical to the file and in the same order.
7. Each place that records the version was compared, or listed as not found.
8. When the project has a changelog linter or test, run it if you can and give the result; if you cannot run it, say so.
