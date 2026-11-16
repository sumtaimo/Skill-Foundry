<!-- skill: copy-tight | input: skill-figure-craft | turns: 8 | cost_usd: 0.115 | permission_denials: 1 | is_error: False -->

Rewritten copy: (only lines that changed; the other 91 stay as they are, and line numbers match the input file)

```
40	p	Paste this line after installing the skill.
50	p	A fresh agent got an empty project, this skill and the request below. Its answer, word for word.
55	p	An agent ran this skill on the prompt above. Output unedited.
59	p	Machines check structure; a reviewer checks the rest.
70	p	Stays 1.0.0 until the owner calls it final. Changes are listed as they land.
93	li	Unzip into .claude/skills/ in your project; keep the folder name.
95	p	Or copy one command. It downloads the zip, checks its SHA-256 and unzips it into .claude/skills/ in the current folder.
97	p	Drawn from the real output above, with the install command. Updates when the skill is recorded again.
```

What changed:
- Cut filler and repeated phrasing
- Active verbs, shorter sentence structure
- Kept the version, the SHA-256 name, the path and the file names exactly
- Left short, plain strings (buttons, nav, tags, headings, labels) unchanged
- Left the changelog entries (lines 71–86) unchanged. They are release notes, not UI strings, and belong to changelog-writer.
