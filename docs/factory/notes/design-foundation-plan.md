# Design Foundation Plan: Figma-style variables from brief to product

> Status: **[planned]**, approved direction from the owner in chat (2026-11-20). Nothing here is built yet.
> Read with `docs/PROJECT.md`, `AGENTS.md` (SKILL QUALITY LAW) and `docs/factory/notes/2026-ui-upgrade-handoff.md`.
> Before Session S0 starts, check `git log origin/lab`: another session was still working on the UI skills
> when this plan was written. Merge with its work. Do not overwrite it.

## 1. Goal

Agents that build real products usually skip the foundation. They hardcode `#E5E7EB` in fifty places, so
a product cannot scale and one colour change becomes fifty edits and fifty bugs. This plan makes the
Skill Foundry design skills work like a real product design team with **Figma-style variables**:

- The skill learns the product from the user once (a brief) and proposes complete directions. It does not ask an open questionnaire.
- Every value lives once, as a **primitive**. Roles alias primitives (**semantic**), and components alias roles (**component**).
- Changing one variable updates the whole product. The engine also recomputes the dependent contrast colours (for example `on-accent`) and checks every pair in every mode.
- The work runs in small steps with a saved status, so a user low on quota never loses work.
- It works by default for every project that installs the agentic harness, including an empty project.

## 2. Owner decisions (2026-11-20)

| Id | Question | Decision |
|---|---|---|
| D1 | Figma | Work **just like Figma Variables**: collections, modes, aliases, scopes, plus export and import of Figma's variable JSON |
| D2 | Tiers | **All three tiers**: primitive → semantic → component (component tier for core components only) |
| D3 | Multi-brand | **Yes**. Brands are modes of the Color collection (white-label) |
| D4 | Web fonts | **Yes**, when the brief names one (Khmer included), always with a system-stack fallback |
| D5 | Token names | **Yes**. The `design-system` `--color-*` vocabulary is the standard, and every other UI skill follows it |

Other owner rules: no year ("2026") in skill text; real human design process, not "a skill by name";
token budget first; one skill per session; never break existing installs.

## 3. Architecture

### 3.1 Files in the user's project

```
design/
  BRIEF.md            the user's answers (source of truth). Asked once per product, never again
  DESIGN.md           principles, chosen direction, token vocabulary, decisions log
  STATUS.md           done / next step / exact words to continue (quota safety)
  variables.json      ALL variables: collections, modes, aliases (the single source)
  tokens.css          generated from variables.json, never edited by hand
  build/               generated per stack (see 3.5). Only the targets the project uses
  design-tokens.json  generated, W3C format (backward compatible with 1.0.0)
  figma-variables.json generated, Figma import format
  components/<name>.md component specs (variants, 8 states, tokens used, a11y, do/don't)
  CHANGES.md          every variable change: who, what, impact count, contrast result
```

Rule: only `variables.json` is edited, and only through the engine. Everything else is generated.

### 3.2 Collections and modes (Figma model, built for the hard case first)

The model is designed for the most complex real Figma file, so that simple projects are a subset of it,
not a rewrite later. The simple path stays one command (`init`). The complex features are optional.

Real-world Figma features the model MUST support:

| Feature | Meaning |
|---|---|
| Variable types | COLOR, FLOAT (number: size, radius, opacity, weight), STRING (font family, style name), BOOLEAN (show/hide, feature flags) |
| Deep aliases | any depth (primitive → semantic → component → variant), with cycle and broken-alias detection |
| Groups | slash names (`color/bg/surface`), mapped 1:1 to CSS (`--color-bg-surface`) and code names |
| Multi-axis modes | brand × theme × density × platform resolved together (for example Brand B + Dark + Compact + Mobile) |
| Extended collections | a brand collection inherits a base collection and overrides only some values (white-label at scale) |
| Per-mode overrides | one variable may alias different variables in different modes |
| Scopes | where a variable is allowed (fill, stroke, text, gap, radius, effect…) |
| Code syntax | each variable keeps its name per platform (Web, iOS, Android) |
| Hidden / private | primitives hidden from component authors, so only semantic variables are picked |
| Composite styles | text styles, shadows and gradients built from variables (Figma "styles" bound to variables) |
| Description + deprecation | every variable has a description; renamed ones keep a deprecated alias |



| Collection | Variables | Modes |
|---|---|---|
| Color | primitive scales 50–900 (+950 neutral), semantic roles (`bg`, `surface`, `surface-2`, `fg`, `muted`, `accent`, `on-accent`, `border`, `border-strong`, `focus`, `success/warning/danger/info` + `on-*`), glass surface + opaque fallback | Light, Dark × Brand A, Brand B… |
| Typography | family (sans, heading, mono, Khmer), size, weight (regular 400, medium 500, semibold 600, bold 700), line-height (Khmer-safe), letter-spacing, **text styles** (display, h1–h4, body, label, caption, code) | Desktop, Mobile |
| Size & Space | spacing 0–64 (4 px grid), control heights (≥ 44 px target), icon sizes | Compact, Comfortable |
| Shape | radius xs–xl + full, border widths (hairline 1 px, strong 2 px) | — |
| Elevation | shadow levels 0–4, `--z-sticky/-dropdown/-command/-modal/-toast` | Light, Dark |
| Motion | durations (120–240 ms), easings, springs | Normal, Reduced |

Every variable has Figma-style **scopes** (for example `border` → stroke only), so an agent cannot use a
border colour as a text colour.

### 3.3 Alias chain and propagation

```
--gray-200: #E5E7EB  →  --color-border: var(--gray-200)  →  --card-border, --input-border, --table-line
```

- Components MUST use component or semantic variables only. A raw hex or px value is a lint error (drift check, 3.5).
- Every value is resolved by the engine. AI never computes colours or ratios.

### 3.4 Engine commands (zero dependencies, inside the skill folder)

| Command | What it does |
|---|---|
| `init --brief design/BRIEF.md` | build all collections from the brief (cold start) |
| `set color.border "#D1D5DB" [--mode dark]` | change one variable, recompute dependent `on-*` colours, re-check every pair in every mode, regenerate files, append to `CHANGES.md`, print the impact ("1 variable → 37 uses, 42 pairs PASS") |
| `brand add B --accent "#0F766E"` | add a brand mode (D3) |
| `check [--code src/]` | contrast in all modes, broken aliases, scope misuse, **raw values in project code** |
| `export figma` / `import figma <file>` | Figma Variables JSON (collections, modes, `VARIABLE_ALIAS`, colours as 0–1 RGBA) |
| `explain color.border` | the alias chain and every use. Cheap answer to "what changes if…" |

### 3.5 Any stack, not only HTML

`variables.json` is the only source. HTML is not the product, just one output.
The engine generates the targets the project uses, detected from its files or named in the brief:

| Target | Output |
|---|---|
| Web | CSS custom properties, SCSS, Tailwind theme (v3 config and v4 `@theme`), CSS-in-JS / TS object |
| React Native / Expo | TS theme object |
| iOS | Swift (`Color`, `Font`, spacing constants) |
| Android | Compose theme (Kotlin) and XML resources |
| Flutter | Dart `ThemeData` / `ThemeExtension` |
| Design tool | Figma Variables JSON (round trip) |

Previews (the three directions, the variable map) are rendered as a page only so a human can look at them.
They are viewing aids, never the deliverable. Component specs (`components/*.md`) are stack-neutral, and
`ui-craft` writes the code in the project's own stack.

### 3.6 Contrast follows the change

When a colour changes, the engine re-derives its scale, picks `on-*` text colours that reach 4.5:1 (3:1 for
borders and focus), and checks every declared pair in every mode and brand. If no colour can pass, it
refuses the change and proposes the nearest passing value. It never ships a failing pair silently.

## 4. Human design process (cold start included)

1. **Read context**: the user's first prompt, plus `README`, `package.json` and existing code or tokens if any. Infer product, users, platform, language and density.
2. **One brief message**: about 6 lines, each pre-filled with the recommended answer (★). The user replies "OK" or changes a number. If the user gives no answer, the skill continues with ★ values, marked "assumed, editable" in `BRIEF.md`. The questions are fixed text in the skill, so no tokens are spent inventing them.
3. **Three directions**: each one has principles, colour, type, one button, one card and one sample screen, generated by the engine as a real preview page (a viewing aid, not the deliverable), with why it fits and its risk.
4. **One or two business questions only**, when the owner alone can know the answer (for example price-led or quality-led).
5. Foundation and semantic variables → component specs → screens, **one step per turn**, each ending with a `STATUS.md` update and "type … to continue".

The skill triggers only for UI or product work when `design/BRIEF.md` is missing. With a brief present it
reads `BRIEF.md` + `DESIGN.md` (small files) and continues without asking.

## 5. Work sessions (NOT nine new skills)

A **session** is one block of work by one agent. The rule "one skill per session" means each session
changes at most one skill. Only **one new skill** is created (`component-kit`). Everything else
updates the skills that already exist:

| Kind | Skills |
|---|---|
| New | `component-kit` |
| Updated | `design-system` (main change), `ui-craft`, `ui-polish`, small alignment in `ux-review`, `a11y-audit` |
| Not a skill | review (S0), recipe (S7), harness defaults (S8) |


| # | Session | Scope | Done when |
|---|---|---|---|
| S0 | Review | Read the other session's finished work on `lab`; list conflicts with this plan in `docs/factory/notes/` | Conflict list approved by owner |
| S1 | `design-system` (variables core) | `variables.json` model, three tiers, collections, modes, scopes, engine `init/set/check/explain`, D5 vocabulary (1.0.0 names kept as aliases), weights 400–700 (replaces "two weights"), web fonts (D4, replaces R-8) | live, routing, portable pass; existing 14 cases still pass |
| S2 | `design-system` (process) | cold-start brief, three directions with real HTML, `STATUS.md`, brands (D3), Figma export/import | real agent in an empty project produces `design/` end to end |
| S3 | new skill `component-kit` | component specs + component-tier variables for core components (button, input, select, checkbox, card, dialog, table, nav, tabs, toast, menu, badge) | `checkPage` on every component in every state and mode |
| S4 | `ui-craft` | reads `design/` first; refuses raw values; gate: no `design/` → start S1 flow; remove year wording; D5 names | recipe proof below |
| S5 | `ui-polish` | token mode uses the variables vocabulary; reports raw values as drift | re-recorded evals + `tokens-then-polish` |
| S6 | `ux-review`, `a11y-audit` | small alignment only (overlaps from the handoff note) | re-recorded evals |
| S7 | Recipe `product-from-zero` | empty project → brief → variables → components → one screen → `set color.border` → whole product updated | `recipe-run.mjs --record` passes |
| S8 | Harness defaults | registry `roles` (BA asks the brief, UX owns `design/**`, DEV builds, QA runs `check`); default install for harness projects | `tests/factory-foundry-cli.test.mjs` passes |

Version bumps (`design-system` likely 2.0.0 or 1.1.0 with aliases; project version) need the owner's OK in chat.

## 5a. Skill chain with permission (one skill active at a time)

The harness roles limit which skills an agent may load. Loading many skills at once makes the context
large and causes errors. So the chain is gated:

1. Only **one skill is active** per step. It loads only its own `SKILL.md` and the files the step needs.
2. When its step is done, the skill writes `design/STATUS.md` with `step_completed`, the files produced and
   `next_skill` (for example `component-kit`), then **stops**.
3. It asks the user one line: "Step done: <what>. Next: <skill> to <action>. Continue? (yes / change / stop)".
   The next skill loads only after "yes". In autopilot, the harness reads `next_skill` and starts it only if
   that skill is allowed for the role that owns the next step.
4. The next skill starts from `STATUS.md` and the file paths, never from the previous chat text
   (AGENTS.md "Hand off through files"). This keeps each context small.
5. If quota runs out mid-step, nothing is lost: `STATUS.md` says exactly where to continue.

| Step | Skill | Role (harness) |
|---|---|---|
| Brief + directions | `design-system` | BA_ANALYST asks, UX_DESIGNER proposes |
| Variables | `design-system` | UX_DESIGNER |
| Components | `component-kit` | UX_DESIGNER (spec) → DEV_ENGINEER (code) |
| Screens | `ui-craft` | DEV_ENGINEER |
| Check | `ui-polish`, `a11y-audit`, engine `check` | QA_AUDITOR |

## 6. Token budget rules (for every session and for the skills themselves)

- Ask once per product. `BRIEF.md` replaces repeated questions.
- Numbers come from the engine. The agent reads its short printout, not whole files.
- One step per turn, with a checkpoint in `STATUS.md`. Large steps are split (3–4 components per turn).
- Each step loads only the files it needs (`BRIEF.md`, `DESIGN.md`, previous step's output).
- A change goes through `set` (one line), never a search-and-replace across the codebase.

## 7. Extra ideas (approved to include where they fit)

- **Drift check** in `check --code`: finds raw hex or px in the project and suggests the matching variable. It keeps the product consistent as it grows.
- **Token changelog and deprecation**: renamed variables keep an alias with a "deprecated" note for one version, so updates never break existing screens.
- **Variable map page**: a generated HTML page showing every collection and mode and where each variable is used. This is real output for the showcase site.
- **Khmer-first typography**: line-heights and font pairs tested for Khmer script.
- **Impact preview**: `set … --dry-run` shows what would change before writing.

## 8. Compatibility and risks

- Existing installs: 1.0.0 file names and token names keep working (aliases). `add`, `check` and `update` must not break.
- The other session's work (glass, modern surfaces, motion) becomes Color, Elevation and Motion variables and style **directions**, not fixed defaults.
- Risk: a large engine change in S1. It is mitigated by keeping the 1.0.0 cases as regression tests.
- Risk: Figma JSON format changes. It is mitigated by keeping the export in one module with a fixture test.
- Web fonts need network access. Every font stack ends in the system stack, so offline still renders.
