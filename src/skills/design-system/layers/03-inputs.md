# Layer 03: Inputs

Required (at least one):

1. One or more hex colours (path a), or style words or a kind of product (path b), or an existing system (path c), or a request for the foundation of a product or for a change to a variable (path d).

Collected when present:

2. **Colour roles.** A hex the user names ("accent #f59e0b", "our red for errors #b91c1c") gets that role: primary, accent, neutral, success, warning, danger or info. An unnamed hex: the first is primary, the second is accent. A third unnamed hex is not used; ask about it under Open questions.
3. **Archetype.** Pick one of the five in references/archetypes.md by the user's words: style words first, then the kind of product, then "like <brand>" mapped by what that product is. With none of these, use calm-workspace and say so in the why line.
4. **Font.** Only when the user names one (a web font such as Inter counts). It goes first in the stack; no files, imports or links are added, and the report says the user loads the font files.
4a. **Modern group.** Only when the user asks for glass or frosted panels, a glow, glossy buttons, z-index layers, "modern" effects, or the ui-craft tokens: note it, so layer 04 adds `--modern` (R-design-system-22). Style words alone ("modern", "clean") do not count without one of those effects.
5. **Product name**, for the report heading: the name the user gives for their own product; else a short description ("Invoicing app"). Never the name of a product they compare to.
6. **Output folder**: the one the user names; else the current folder.

When nothing is given:

7. No hex, no style or product words, no existing system and no design/BRIEF.md: reply exactly with the brief below. It is the whole reply, even when you were asked for a report of files, checks and open items: add nothing before or after it. Stop. Write no files and no tokens.

```
Before I build your design foundation, confirm or change each line. Reply "OK" to accept all of them.
1. Product: tell me in a few words what you are building and who uses it.
2. Brand colour: a hex code such as #2563eb, or leave it and I choose one from the style.
3. Style: A calm and focused (default), B precise and trustworthy, C bold and playful, D editorial, E dense and data-heavy.
4. Font: the system font (default), or name a font and I put it first in the stack.
5. Modes: light and dark (default).
6. Effects: standard (default), or modern with glass, glow and layered depth.
```

7a. The user answers the brief ("OK", or changes by number, or "use your defaults"): path d. Each line they did not answer takes the default of the brief (style A is calm-workspace, B precise-fintech, C bold-consumer, D editorial, E dense-data-tool; no colour means the archetype's own colour). Save design/BRIEF.md in the format of references/README.md ("Design brief") with an `Assumed:` line that lists what they did not answer, then go to layer 04, step 2b. A user who says they have no answers or to use your defaults has answered the brief with OK.
7b. design/BRIEF.md exists: read it, do not ask again, and go to layer 04, step 2b or 2c.
8. A brand colour named in words only ("our brand is green") and no hex: reply exactly "Give me the hex code of your brand colour (for example #2563eb)." and stop; never guess a hex for a brand. A colour word that only describes the style ("warm, earthy tones") is a style word: use path b.
9. Hand the inputs to layer 04.
