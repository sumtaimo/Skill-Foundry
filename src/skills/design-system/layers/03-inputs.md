# Layer 03: Inputs

Required (at least one):

1. One or more hex colours (path a), or style words or a kind of product (path b), or an existing system (path c).

Collected when present:

2. **Colour roles.** A hex the user names ("accent #f59e0b", "our red for errors #b91c1c") gets that role: primary, accent, neutral, success, warning, danger or info. An unnamed hex: the first is primary, the second is accent. A third unnamed hex is not used; ask about it under Open questions.
3. **Archetype.** Pick one of the five in references/archetypes.md by the user's words: style words first, then the kind of product, then "like <brand>" mapped by what that product is. With none of these, use calm-workspace and say so in the why line.
4. **Font.** Only when the user names one. It goes first in the stack; no files, imports or links are added.
5. **Product name**, for the report heading: the name the user gives for their own product; else a short description ("Invoicing app"). Never the name of a product they compare to.
6. **Output folder**: the one the user names; else the current folder.

When nothing is given:

7. No hex, no style or product words and no existing system: reply exactly "Give me a brand colour as a hex code (for example #2563eb), a few words about the style you want, or the path to your existing design tokens." Stop. Write no files and no tokens.
8. A brand colour named in words only ("our brand is green") and no hex: reply exactly "Give me the hex code of your brand colour (for example #2563eb)." and stop; never guess a hex for a brand. A colour word that only describes the style ("warm, earthy tones") is a style word: use path b.
9. Hand the inputs to layer 04.
