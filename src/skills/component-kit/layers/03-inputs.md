# Layer 03: Inputs

Required:

1. The step (layer 01, step 2) and the component names. A name outside the set is allowed when the user asks for it (for example avatar); it gets the same ten sections.

Collected when present:

2. **Count.** At most four components in one turn. When more are named, or "all components" is asked, take the first four in set order (or in the user's order when they gave one) and list the rest in `design/STATUS.md` under `components_pending`.
3. **Stack** (CODE only). The one the user names; else the one found in layer 02, step 6; else plain HTML and CSS. A Tailwind project reads colours and sizes through variables (see references, "Code per stack").
4. **Folder** (CODE only). The one the user names; else the project's component folder; else `components/` in the project root.
5. **Variants the user needs** (for example "danger button", "table with sorting"). They are added to the spec's variants.
6. **Language.** When the product serves Khmer readers (BRIEF.md, or the user says so) the Khmer text note in each spec states the actual handling; it is always present.

When an input is missing:

7. No component names: ask the question of layer 01, step 1.
8. CODE with no spec for a named component: follow layer 06, step 2 for it.
9. No stack found and none named: build plain HTML and CSS, and say so in the report ("No stack found, so these are plain HTML and CSS").
