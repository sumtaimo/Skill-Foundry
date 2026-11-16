<!-- skill: copy-tight | input: skill-copy-tight | turns: 7 | cost_usd: 0.114 | permission_denials: 1 | is_error: False -->

Rewritten copy:
```
19	p	Real agent test: 8 of 8 cases pass
38	p	Paste this line after installing the skill.
41	p	You get these files and a short report.
46	p	A fresh agent got only this skill, in an empty project, and the request below. Its answer, word for word.
50	p	Machines check structure; a reviewer checks the rest.
77	li	Unzip it into .claude/skills/ in your project; keep the folder name.
79	p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it to .claude/skills/ in the current folder.
81	p	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
```

What changed:
- Cut filler
- Active voice
- Kept the numbers and names
- Shortened long sentences

I left every other line unchanged because it is already short and plain. That includes the nav items, buttons, headings, the 8 of 8 and 2 of 9 counts, the version, the file names and the `SHA-256` terms. I also left the changelog entries (lines 61–70) alone, because changelog text is out of scope for this skill. The layer list in lines 28–37 stays as it was.

The Bash tool was denied, so I read only two of the skill's layer files (04-flow and 06-states). I did not read the others or the checklist.
