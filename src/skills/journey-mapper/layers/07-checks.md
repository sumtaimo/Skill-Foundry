# Layer 07: Checks

1. Every quoted phrase appears word for word in the goal or in a named file with its path and line.
2. No step, actor, role, limit, message, provider or number appears that the source does not state.
3. Every step has the seven slot lines, in order, and each is a quote, a question id or "Not applicable" with a short reason.
4. Every question id used in a slot or in the header exists under "Open business questions", and every question names the steps it affects.
5. No question contains "for example", "e.g.", "such as" or a list of answer options.
6. Blocking questions come first; minor questions are merged, one line per topic.
7. No Given-When-Then clause, no AC id and no regression checklist appears.
8. No tool call wrote, edited or deleted a file, and no command ran.

Any "no" goes back to layer 04 or layer 08. Hands to layer 08: the checked reply.
