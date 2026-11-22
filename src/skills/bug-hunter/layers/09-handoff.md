# Layer 09: Handoff

1. The user receives one reply: the report. Nothing is saved; the user or a harness copies it where it belongs.
2. QA adds each Red test first and runs the test command: it must fail. A suspect whose Red test passes is dropped.
3. A developer then makes the Green change at the cited line and runs the test command again: every test must pass.
4. test-planner can list what else to retest after the fix; bug-hunter writes no checklist.
5. A finding with "Expected: unclear" goes to the product owner first: the business decides which result is right.

Hands to layer 10: the reply.
