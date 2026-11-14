# Showcase site review

Build with `node src/site/build.mjs --out dist/site`, open `dist/site/index.html` and one skill page. Answer each line yes or no.

## Signature
- [ ] Hero reads one line in, skill out: prompt types, then the cover assembles part by part along iso axes. yes / no
- [ ] Hero chips exist, one per ready skill, and clicking one replays the hero. yes / no
- [ ] With reduced motion, prompt and cover show complete with no animation. yes / no
- [ ] Plates show No. index (two digits, mono), tags top right, cover, title, You type (one line), You get, meter, version and download. yes / no
- [ ] Meter text reads exactly "M of T rules machine-checked" and matches RULES.json. yes / no
- [ ] Download buttons read "Download <name> <version> (.zip, <size> KB)". yes / no
- [ ] Skill page has the four questions in order: what it does, what you type, what you get, how you know. yes / no
- [ ] Each of the four sections starts with a bold takeaway sentence. yes / no
- [ ] Download and Install sections follow the four questions. yes / no
- [ ] Sticky question bar is slim, with a 2px progress line that follows scroll. yes / no
- [ ] Collection has a plain top bar only. yes / no
- [ ] Type is Inter 500/400 and JetBrains Mono only; no serif, no italic. yes / no
- [ ] Accent --ok (#2f7a4b light, #6cc28f dark) appears only on active tab, progress line, meter fill and focus rings. yes / no
- [ ] No paragraph has more than 3 sentences; one idea per sentence. yes / no
- [ ] Every button says what it does. yes / no
- [ ] No numbers in copy except No. index, versions, meter counts and sizes. yes / no

## Own look
- [ ] Nothing looks copied from the inspiration page: no left pointer list, no serif italics, no 01 / 05 numbering. yes / no

## Kept behaviour
- [ ] Download links point to existing `downloads/<name>-<version>.zip`; `data-sha256` equals `checksums.json`. yes / no
- [ ] Example iframe (if any) has `sandbox="allow-scripts"`, no `allow-same-origin`. yes / no
- [ ] Phone at 390px: 16px gutter, no horizontal scroll, one column. yes / no
- [ ] Dark toggle works, survives reload, no light flash. yes / no
- [ ] KH switches every UI string; skill content stays English with `lang="en"`. yes / no
- [ ] Khmer copy reviewed by a native speaker (required before release). yes / no
- [ ] Keyboard reaches every control with a visible focus ring. yes / no
