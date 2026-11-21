# Layer 08: Output

The reply is one Markdown document with this shape. A fixed sentence from layer 06, when one applies, is the first line, before the heading.

````
## Journey map: <feature in a few words>

Goal: "<the goal, word for word>"
Actors: "<actor>", "<actor>" | Not stated (Q<n>)
Entry: "<where it starts>" | Not stated (Q<n>)
Done when: "<the end state>" | Not stated (Q<n>)

### Steps
1. <Actor> <action>. Source: "<quote>"
   - Loading: Q4
   - Empty: Not applicable: this step shows no list or data
   - Error: Q5
   - Success: "<quote>"
   - Validation: "<quote>"
   - Reload and back: Q6
   - Permissions: "<quote>"
2. ...

### Cross-step checks
- Reload or close mid-journey: "<quote>" | Q<n>
- Cancel and come back later: "<quote>" | Q<n>
- Permission change between steps: "<quote>" | Q<n>
- Related modules: "<quote>" | None named.

### Open business questions
- Q1 [blocking] Conflict: "<quote 1>" or "<quote 2>"? (steps 2-3)
- Q2 [blocking] Validation (step 2): <question>?
- Q4 [minor] Loading (steps 1-3): <question>?

### Not in this map
- Acceptance criteria: spec-writer can turn this map into Given-When-Then.
- What to retest after a change: test-planner.
- Screen design, copy and estimates.

Sources: the goal<, <path>>. Steps: <n>. Blocking questions: <n>.
````

Quality bar:

1. The header has its four lines; each is a quote or "Not stated" with a question id.
2. Steps keep the source's order and words; each has "Source:" with its quote.
3. Every step has the seven slot lines, in the order above, with the slot names exactly as written.
4. Every question is one line: id, tag, topic, the steps in brackets, one or two plain questions that ask and never suggest. A conflict line starts "Conflict:" right after the tag.
5. Blocking questions come first; minor ones are merged by topic.
6. "Not in this map" always has its three bullets.
7. The last line counts the steps and the blocking questions and names the sources.
8. No Given-When-Then clause, no checklist, no screen design and no new copy appears.

Hands to layer 09: the reply.
