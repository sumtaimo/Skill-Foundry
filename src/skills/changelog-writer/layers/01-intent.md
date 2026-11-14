# Layer 01: Intent

Start from what the user asked. Hands to layer 02: the skill name, the task type and the success outcome.

1. Restate the request in one sentence: "Write the CHANGELOG entry for <skill> <version bump> on <date>", or "Check this existing entry against the format".
2. Decide the task type: **write** a new entry, or **check** an existing one. A request for a commit message, pull request text, long docs or marketing copy is out of scope: say so in one line and stop.
3. Name who reads the result: the maintainer who pastes the entry into `CHANGELOG.md` and sets the new version.
4. State the one outcome that proves success: one entry whose heading, bump and bullets follow this skill's rules, and whose version matches every other place the project records it.
5. When the request does not say what changed or for which skill, do not guess; go to layer 03 and ask.
