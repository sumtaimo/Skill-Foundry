# Design Foundation Plan: Figma-style variables from brief to product

> Status: **[planned] draft**. The owner approved the direction in chat (2026-11-20), and the audit fixes of
> 2026-11-20 are applied (section 9). Nothing here is built yet. Work does not start until the owner says so.
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

## 1a. Scope: skills, not the harness

Skill Foundry builds skills. Orchestration (auto-continue, chaining steps, scheduling, parallel workers) belongs
to the agentic harness. A skill only does its own step well, writes its result to files, and stops with a clear
next step. The harness in this repo is older than the latest Agentic-Harness release, so S0 checks the latest
harness version first and adjusts this plan (roles, skill injection, any new hooks) to it.

Owner direction: a slower, clear start (foundation first) is preferred over a fast start with low quality.

## 1b. Two working rules

1. **Small first, proven first.** Build MVP-1 (section 5) end to end and prove it with a real agent in an
   empty project before any later scope (more brands, density, platform, other stacks, Figma round trip).
2. **No step starts without proof of the step before.** Each session ends with a real-agent recording in an
   empty project, not a plan or a self-assessment.

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

Khmer typography variables (audit item 4): one body line-height for Khmer (a single number, replacing the
three different values in `ui-craft`: 1.55, 1.6 and 1.65), and `letter-spacing: 0` for `:lang(km)`, so the
negative heading tracking never applies to Khmer.

Every variable has Figma-style **scopes** (for example `border` → stroke only), so an agent cannot use a
border colour as a text colour.

### 3.3 Alias chain and propagation

```
--gray-200: #E5E7EB  →  --color-border: var(--gray-200)  →  --card-border, --input-border, --table-line
```

- Components MUST use component or semantic variables only. A raw hex or px value in web code is reported by `check --code` (3.4).
- Every value is resolved by the engine. AI never computes colours or ratios.

### 3.4 Engine commands (zero dependencies, inside the skill folder)

| Command | What it does |
|---|---|
| `init --brief design/BRIEF.md` | build all collections from the brief (cold start) |
| `set color.border "#D1D5DB" [--mode dark]` | change one variable, recompute dependent `on-*` colours, re-check every pair in every mode, regenerate files, append to `CHANGES.md`, print the impact ("1 variable → 37 uses, 42 pairs PASS") |
| `brand add B --accent "#0F766E"` | add a brand mode (D3) |
| `check [--code src/]` | contrast in all modes, broken aliases, scope misuse; raw values in **web code only** (CSS, SCSS, Tailwind, TS). It **reports** them and never replaces them (matches `R-ui-polish-28`). Generated files for other stacks are checked by regenerating and comparing a hash, not by parsing Swift, Kotlin or Dart |
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

Guards (audit item 1):
- **Locked values**: values the user set (brand hex, any value passed to `set`) are never recomputed. The engine recomputes only what it derived itself.
- **All or nothing**: `set` checks every pair in every mode and brand before writing anything. One failing pair means nothing is written.
- **Rule R-design-system-9 is split**: tokens the user already had in the project are never changed. `design/variables.json`, which the skill owns, changes only through `set`.
- The current engine only handles light and dark for one brand (`engine/tokens.mjs` line 342) and has no `set` command, so all of this is new work in S1.

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
| Not a skill | review (S0), recipe (S7), handoff prompt for the Agentic-Harness repo (S8, last) |


| # | Session | Scope | Done when |
|---|---|---|---|
| S0 | Review (no skill change) | (a) read the other session's finished work and list conflicts with this plan; (b) check the latest Agentic-Harness version and what changed against this repo's copy; (c) install the agentic harness in an **empty folder** and record the real role files (`writablePaths`, `allowedTools`), because user projects may differ from this repo's roles | Conflict list + real role table approved by owner |
| S1 | `design-system`: **MVP-1** | `variables.json` with three tiers, light/dark, **one brand**; engine `init`, `set` (locked values, all-or-nothing), `check` (web only), `explain`; D5 vocabulary (1.0.0 names kept as aliases); weights 400–700; web fonts (D4); Khmer typography variables; one brief message on cold start; `STATUS.md` | a real agent in an empty project: brief → variables → `set color.border` changes everything, all pairs PASS; old 14 cases still pass |
| S2 | `design-system`: scale-up | more brands (D3) and extended collections, then density, then other stacks, then Figma export/import; three directions as previews | each addition proven in an empty project before the next |
| S3 | new skill `component-kit` | two separate steps that hand off through files: **spec** (component specs + component-tier variables) and **code** (built in the project's stack) | `checkPage` on every web component in every state and mode |
| S4 | `ui-craft` | reads `design/` first; with no tokens and no `design/BRIEF.md` it asks "use defaults or build the foundation first?" instead of silently using its default palette (`layers/03-inputs.md` lines 9–10); one Khmer line-height; remove year wording; D5 names | recipe proof below |
| S5 | `ui-polish` | token mode uses the variables vocabulary; reports raw values as drift | re-recorded evals + `tokens-then-polish` |
| S6 | `ux-review`, `a11y-audit` | small alignment only (overlaps from the handoff note) | re-recorded evals |
| S7 | Recipe `product-from-zero` | empty project → brief → variables → components → one screen → `set color.border` → whole product updated | `recipe-run.mjs --record` passes |
| S8 (last) | Handoff to the Agentic-Harness repo | outside this repo's boundary: only write the prompt in section 10 and set registry `roles` from S0's real role table. Nothing is changed in the harness from here | owner pastes the prompt into the harness repo session |

Version bumps (`design-system` likely 2.0.0 or 1.1.0 with aliases; project version) need the owner's OK in chat.

## 5a. Skill chain with permission (one skill active at a time)

The harness roles limit which skills an agent may load. Loading many skills at once makes the context
large and causes errors. So the chain is gated:

1. Only **one skill is active** per step. It loads only its own `SKILL.md` and the files the step needs.
2. When its step is done, the skill writes `design/STATUS.md` with `step_completed`, the files produced and
   `next_skill` (for example `component-kit`), then **stops**.
3. It asks the user one line: "Step done: <what>. Next: <skill> to <action>. Continue? (yes / change / stop)".
   The next skill loads only after "yes". The gate lives **inside the skill**: the harness has no `next_skill`
   mechanism and `.harness/*.mjs` must not be edited here. In autopilot, each step is one backlog item, run
   one at a time (the existing READY flow). If a real harness `next_skill` hook is wanted, it is proposed to
   the harness template owner, not patched in this repo.
4. The next skill starts from `STATUS.md` and the file paths, never from the previous chat text
   (AGENTS.md "Hand off through files"). This keeps each context small.
5. If quota runs out mid-step, nothing is lost: `STATUS.md` says exactly where to continue.

Role facts in this repo (`.harness/roles/*.json`, audit item 3): only DEV_ENGINEER can write `design/**`
(`writablePaths: **`) and run `node` (`Bash(node:*)`). BA_ANALYST writes `docs/**` only. UX_DESIGNER writes
`src/**/*.css|scss|less` only. QA_AUDITOR runs `npm test` only. None of the last three can run the engine.
So, until S0 confirms the roles in a real user project:

| Step | Skill | Who |
|---|---|---|
| Brief | `design-system` | in chat: the skill asks the user. In the harness: the orchestrator asks the user, and DEV_ENGINEER writes `design/BRIEF.md` |
| Variables (engine) | `design-system` | DEV_ENGINEER |
| Component specs | `component-kit` (spec step) | DEV_ENGINEER (writes `design/components/*.md`) |
| Component code | `component-kit` (code step) | DEV_ENGINEER; UX_DESIGNER may own the CSS files only |
| Screens | `ui-craft` | DEV_ENGINEER (UX_DESIGNER for CSS-only work, with a markup handoff) |
| Check | engine `check` | DEV_ENGINEER runs it. QA_AUDITOR runs `npm test` and writes tests that call it |

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
- `design/STATUS.md` has **one writer** per step (the orchestrator, or the single agent of that step).
  Parallel workers never write it, so it cannot conflict on the `uat` branch.
- `design/build/` is generated. The skill tells the user to git-ignore it and regenerate it from
  `variables.json`. When a stack needs the files committed, each one starts with a "generated, do not edit" header.

## 9. Audit of 2026-11-20 (applied above)

| # | Risk | Verdict | Where fixed |
|---|---|---|---|
| 1 | Multi-axis modes and auto-contrast: engine has light/dark only, no `set`, R-9 forbids changing tokens | REAL | 3.6 guards, S1/S2 split |
| 2 | Cross-stack drift: no drift check exists; parsing Swift/Kotlin/Dart gives false positives; conflicts with `R-ui-polish-28` | REAL | 3.4 `check` web only, report only, hash for generated files |
| 3 | Roles: only DEV can write `design/**` or run `node`; `component-kit` crossed two roles; `ui-craft` silently uses defaults; harness has no `next_skill` | REAL | 5a role table, S0 (b), S3 split, S4 gate |
| 4 | Khmer: three different line-heights, negative tracking applies to Khmer; `STATUS.md` and `build/` churn | PARTIAL | 3.2 Khmer variables, section 8 |

## 10. S8 handoff: prompt for the Agentic-Harness repository (do last)

Boundary: Skill Foundry builds skills. How the harness offers, fetches and orders them is the harness's job,
so it is changed in the Agentic-Harness repository, not here. When S1 to S7 are done and released, the owner
pastes this prompt into a session on that repository:

> Skill Foundry has released a design path: `design-system` (brief, Figma-style variables, `set`/`check`),
> `component-kit` (specs, then code) and `ui-craft` (screens from `design/`). Each skill does one step,
> writes its result under `design/` and ends with a `STATUS.md` naming the next skill. Please make the harness:
> 1. Keep one default skill at first setup, never many at once. Today that default is the landing-page skill.
>    When a project needs design work, offer `design-system` as the default design skill.
> 2. Fetch skills on demand, one at a time: when a task needs a skill the project does not have, fetch only that
>    skill (`npx github:sumtaimo/Skill-Foundry add <skill>`) for the role that needs it, instead of loading all skills.
> 3. Follow the order a skill writes in `design/STATUS.md` (`next_skill`), asking the user before each next step,
>    or continuing automatically when the user turned that on in the harness.
> 4. When a user asks to create a new skill, first look up Skill Foundry's catalogue (`npx github:sumtaimo/Skill-Foundry list`);
>    if a skill matches, suggest it instead of creating a new one.
> 5. Check that role permissions let the role that owns each step write `design/**` and run the skill's engine.

## 11. S1 result (2026-11-20, branch `plan/design-foundation`)

Done and proven with fresh agents (see `docs/skills/design-system/CHECKLIST.md`, section 1.2.0): `design-system` 1.2.0 with
`engine/variables.mjs` (`init`, `set`, `check`, `explain`, `build`), three tiers, light and dark, scopes, locked values,
all-or-nothing `set`, web-only report-only `check --code`, the component tier for button, input and card, the Khmer
line and `:lang(km)`, the once-only brief, and `STATUS.md`. 21 live cases, routing 62 of 62, portable and recipe re-recorded,
`npm test` 421 pass, `release:check` READY.

Moved to S2 on purpose (small first): font weights beyond two, brands as modes and extended collections, density and
platform modes, stacks other than web, Figma export and import, three directions as previews, and making path d the
default for paths a and b. Moved to S3 to S8 as planned: `component-kit`, `ui-craft`, `ui-polish`, `ux-review`, `a11y-audit`,
the recipe `product-from-zero` and the handoff prompt for the harness repository.

Findings of S1 for later sessions: the recorder kept only 4000 characters of a reply (now 12000); the "2026" wording is
still in `ui-craft` and in the backlog ids and is removed in S4; harness roles are unchanged in 1.0.23 (only DEV_ENGINEER
can write `design/**` and run `node`), so `init` and `set` run with DEV_ENGINEER.

