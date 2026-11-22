# Layer 07: Checks

1. Every confirmed finding has an Evidence line that appears word for word in the test command's output.
2. No finding is confirmed when the test command did not run.
3. Every cited line number was read with the read tool, which shows line numbers, and the line holds the code the finding names.
4. Every finding has `file:line`, a concrete input, the wrong result, an expected result with its source, Red and Green.
5. No expected result is a business rule or a value that no test, request, comment or doc states, and no suspect needs an input of a kind the project never uses.
6. No finding is about style, naming, formatting, spacing, comments, UI style or accessibility.
7. The Result line counts match the numbered findings under Confirmed and Suspect.
8. No tool call wrote, edited or deleted a file, and the only command run was the test command.
9. No sentence says the code is bug-free or correct.

Any "no" goes back to layer 04 or layer 08. Hands to layer 08: the checked reply.
