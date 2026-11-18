# Landing page specification

The Skill Foundry landing page shows developers and their AI agents which skills exist, how they were checked with real agents, and how to install them. It must feel calm, premium and hand-crafted (references: pro.reactbits.dev light, skills.wheresryan.sh/anatomy/community).

Source of truth for names: the run's shared interface contract. Current markup: `src/site/lib/render.mjs:343-431` (`renderIndex`). Strings: `src/site/lib/i18n.mjs`.

## 1. Global rules

- Palette neutral, light theme default, dark theme via `[data-theme=dark]`. Primary buttons black.
- Spacing on a 4px grid. These React Bits rules (values measured on reactbits.dev and pro.reactbits.dev; they replace the older Stripe-exact rules) apply to EVERY rendered page (landing and skill pages).
- Radius tokens (replace all older ones): `--r-xs` 4px (inline code only); `--r-sm` 6px (every badge, chip, tag, role chip, version chip, New label, step number, cover tag); `--r-md` 10px (all buttons incl. icon buttons and Copy, inputs, code and command boxes, preview frames inside cards and stage); `--r-lg` 14px (cards, stage, result box, stat, step, agent, limit cards, faq box); `--r-xl` 16px (header bar only). 50% only for tiny dots. No 999px and no other values.
- One badge size: every badge-like element (New label, role chips, version chip, `step-n`, cover tag) has min-height 24px, padding 0 8px, 13px weight 500, line-height 1, 1px `var(--line)` border, `var(--surface)` background, `var(--muted)` color, radius `var(--r-sm)`. The New label uses fg background and bg text.
- Header (floating glass bar): the header element is `position: fixed`, top 16px (12px under 760px), 16px gap left and right; inner bar max-width 1120px centred, height 56px, radius `var(--r-xl)`. At the top: transparent background, transparent 1px border, no shadow. Scrolled: `site.js` toggles the existing class `is-scrolled` when `window.scrollY > 8` (passive listener, also checked on load); the bar then has background `--glass-bg` (color-mix of `var(--surface)` at 72%, defined in light and dark blocks), `backdrop-filter: blur(24px) saturate(1.4)`, 1px border `var(--line)`, shadow `0 2px 16px rgba(0,0,0,.06)` in light (dark: token value). `main` gets top padding so the hero is not hidden.
- Header content: left = restored logo mark + wordmark "Skill Foundry" only; the Skills/brand chip is removed. Right = theme button, language button, black Install button (`btn cta`). No text nav links (Collection, Proof, Install, For agents) on any page; the phone menu button, the `#site-menu` panel and their script are removed. Skill pages keep their All skills back link in the page body.
- Buttons: every `.btn` is 44px tall, padding 0 20px, 15px weight 500, radius `var(--r-md)`, icon gap 8px, transition 150ms. Primary and cta: background `var(--fg)` with the top highlight `linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,0) 60%)` layered over it, color `var(--bg)`, inset `0 1px 0 rgba(255,255,255,.12)`, shadow `0 6px 20px -8px rgba(0,0,0,.45)` (tokens per theme); hover translateY(-1px) and a slightly stronger shadow; active no lift. Secondary (`.btn`, `.btn.ghost`): background `var(--surface)`, 1px `var(--line)` border, color `var(--fg)`, shadow `0 1px 2px rgba(0,0,0,.04)`; hover border `var(--line-strong)`. Copy buttons are compact secondary (36px only where tests allow, else 44px).
- Background (neutral, no purple, nothing loud): a soft dot grid (radial-gradient dots about 1px every 22px, token `--dot`) behind the hero fading out with a radial mask; a very soft radial glow (token `--glow`) centred behind the showcase stage; a faint top-to-transparent neutral wash at the very top. All colours are tokens in `:root`, light and dark.
- Clean up: remove redundant landing content (for example repeated explanations under the install steps, duplicated counts, empty or unused wrappers) and leftover classes/CSS for removed parts (nav links, menu, brand chip, qbar tabs on landing), but keep every id, class and string that `tests/site-*.test.mjs` require. DEV reports exactly what was removed.
- Skill page footer: `build.mjs` passes the Skill Foundry `version` into the skill page render so the footer shows it on every page.
- Skill page section navigation (`nav.qbar`, replaces the old plain row with numbered links and a full-width green line): a floating glass bar like the header, sticky at top = header height + 24px, centred, max-width 1120px, radius `var(--r-lg)`, same glass tokens, glass styling only once it sticks. Links have no leading numbers (if a test needs them, show them as small muted badges), muted text; the active link is fg on a soft `--surface-2` highlight (radius `var(--r-sm)`) that slides between links (CSS transition on a moving indicator element positioned by JS). Horizontally scrollable on phone with fade edges. A thin 2px progress bar sits inside the bottom edge of the bar (`var(--ok)` allowed only in qbar/progress rules). It never overlaps the header.
- Sections: separated by whitespace only, no full-width border lines between sections and none above the footer meta.
- Hero, stage (`#result`) and skill card grid (`#collection`) keep their structure (`render.mjs:265-290`, `:354-359`).
- Exactly one `btn primary` on the landing (today the hero Copy button, `render.mjs:276`). No search input, no role filter (existing tests forbid them).
- Every new visible string exists in English and Khmer in `i18n.mjs`.
- No invented data. Numbers come only from the build data:
  - ready skills count = length of the ready skills list from `src/factory/registry.json` passed to `renderIndex`.
  - real-agent cases "P of T" = sum of `s.live.passed` / `s.live.total` over ready skills (same reduce as `render.mjs:267`), from `src/skills/<name>/evals/live/` recordings.
  - agent roles count = number of distinct roles in the ready skills' `roles` (registry). DEV must use the same value the hero shows; if the hero does not show it yet, it is computed from the registry, never typed in.
  - per-skill rows: `s.live.passed / s.live.total` and `s.rules.machine / s.rules.total` (`render.mjs:350`).

## 2. Section header (every section below the hero)

`<header class="sec-head">` with `<p class="eyebrow">` (13px, uppercase, muted, letter-spacing .08em), the existing h2 (24px, weight 600, letter-spacing -0.02em) and optional `<p class="sec-lead">` (muted, max-width 560px). The old number badges (class `numbered`) are removed.

## 3. Sections

| Section | Purpose | Content | Desktop 1440 | Phone 375 |
|---|---|---|---|---|
| `#proof` | Show the skills are checked by real agents | `<div class="stats">` with exactly three `<div class="stat">` (`stat-num` + `stat-label`): ready skills, cases "P of T", agent roles. Below: per-skill table (`render.mjs:365-370`) shown open inside a `--r-lg` box | stats 3 columns of quiet cards | stats stacked, table scrolls in `.table-wrap` |
| `#install` | Get the skills into a project | `<ol class="steps">` of three `<li class="step">`: `step-n` badge, h3, at most one sentence (no repeated explanation under the steps), codebox + Copy. 1 Install all skills `npx github:sumtaimo/Skill-Foundry add --all`; 2 Or add one skill `npx github:sumtaimo/Skill-Foundry add <skill>`; 3 Check and update `npx github:sumtaimo/Skill-Foundry check` / `update`. Under it a small muted line linking to the No Node.js zip fallback | 3-column grid | 1 column |
| `#agents` | Let an AI agent pick and install a skill | `<div class="agent-card">` (`--r-lg`): left the explanation and links to existing files only (`skills.json`, `llms.txt`, `render.mjs:407-408`); right the agent prompt codebox with Copy (`render.mjs:411`) | 2 columns | stacked, text first |
| `#limits` | Say honestly what the skills do not do | `<ul class="limit-grid">` of three `<li class="limit">` (texts `limits.p1..p3`), each with a small neutral icon (decorative, `aria-hidden`) | 3 columns | 1 column |
| `#questions` | Answer common questions | Each question `<details class="faq">` with `<summary>` (16px, 500, plus/minus icon right), all inside one `--r-lg` box with thin dividers; answers muted. Existing questions: what, node, edit, made (`render.mjs:424-427`) | full width, max content width | full width |
| `footer.foot` | Navigation and project facts | `<div class="foot-cols">`: col 1 logo + one-line tagline; col 2 Product (Collection, Install, For agents); col 3 Project (GitHub repo, Changelog only if it exists, License MIT); plus ONE meta group in the same block on one line: "by TAIMO · Skill Foundry version x.y.z · (c) year" (build `version`, current year), no divider line above it and no separate row. Transparent background, 13px muted. Same on every page | 3 columns + meta group | 1 column, meta group wraps inside itself |

All ids and h2s (`proof-title`, `install-title`, `agents-title`, `limits-title`, `questions-title`) stay unchanged.

## 4. States

- Theme: light (default) and dark; every color, border and the cover tokens switch with `data-theme`.
- Hover: links and buttons show a visible change (color or background), no layout shift.
- Focus: every link, button and summary shows a visible `:focus-visible` outline.
- FAQ: closed shows plus icon; open shows minus icon and the muted answer.
- Copy: after a successful copy the button text changes to the existing copied string (`copy.*` keys) and returns; copy failure leaves the command selectable.

## 5. Accessibility

- Body text at least 16px; eyebrow and footer 13px are the only smaller text.
- Every interactive target at least 44 x 44px (Copy buttons, summaries, footer links, header theme, language and Install buttons).
- Decorative icons have `aria-hidden="true"`.
- Text contrast meets WCAG AA in both themes. Heading order: one h1, then h2 per section, h3 inside steps/cards.

## 6. Acceptance criteria (Given / When / Then)

Cover-token bug
1. Given the built site, when `site.css` is read, then `--cover-bg` and `--cover-accent` are defined in `:root`, `[data-theme=light]` and `[data-theme=dark]`.
2. Given light theme, when a skill cover such as skill-smith renders, then `--cover-bg` equals the surface-2 value and `--cover-accent` the line-strong value, and the cover is not black.
3. Given dark theme, when the same cover renders, then both tokens use the matching dark values.

Section header
4. Given any section below the hero, when rendered, then it contains `header.sec-head` with `p.eyebrow` and the h2, and no number badge.

Proof
5. Given the registry and live recordings, when `#proof` renders, then `.stats` has exactly three `.stat`, each with `.stat-num` and `.stat-label`.
6. Given the same data, when the numbers are compared with the hero, then ready count, "P of T" and roles count match the build data exactly.
7. Given the page loads, when `#proof` is viewed, then the per-skill table is visible without opening a toggle, inside a `--r-lg` box.

Install
8. Given `#install`, when rendered, then `ol.steps` holds three `li.step`, each with `span.step-n` and an h3, in the order Install all, Add one, Check and update, with the exact commands above.
9. Given a step with a command, when Copy is pressed, then the exact command is copied and the success state shows.
10. Given `#install`, then a muted No Node.js zip fallback line follows the steps.

Agents
11. Given `#agents`, then `div.agent-card` links only to files that exist (`skills.json`, `llms.txt`) and the prompt codebox Copy copies the prompt.

Limits
12. Given `#limits`, then `ul.limit-grid` has three `li.limit` with the existing texts and decorative icons.

Questions
13. Given `#questions`, then each question is `details.faq` inside one `--r-lg` box; when a summary is activated (click, Enter or Space), then it opens and the icon becomes minus.

Footer
14. Given any page, then `footer.foot` has `.foot-cols` with brand, Product and Project columns and ONE meta group in the same block holding by TAIMO, the build version and the current year on one line, with no divider line above it and no separate row; Changelog link appears only if the changelog page exists.

Global
15. Given the landing, then exactly one `btn primary` exists, and no search input or role filter exists.
16. Given width 1440, then stats, steps and limits show 3 columns; given width 375, then they show 1 column with no horizontal page scroll.
17. Given Khmer selected, then every new string is translated (key present in both languages in `i18n.mjs`).
18. Given `npm test`, then all existing tests pass unchanged.

React Bits (every page: landing and skill pages)
19. Given `site.css`, when radius values are read, then only `--r-xs` 4px, `--r-sm` 6px, `--r-md` 10px, `--r-lg` 14px, `--r-xl` 16px and 50% (tiny dots) occur; no 999px and no other radius.
20. Given any badge, chip, tag, step number or cover tag, then its radius is `var(--r-sm)`; given any button, Copy, input, codebox or preview frame, then `var(--r-md)`; given any card, stage, result box, stat, step, agent, limit card or faq box, then `var(--r-lg)`; given the header bar, then `var(--r-xl)`.
21. Given any `.btn`, when measured, then it is 44px tall, padding 0 20px, 15px weight 500, radius `var(--r-md)`, transition 150ms.
22. Given a primary or cta button, then it has `var(--fg)` background with the top highlight gradient, `var(--bg)` text, the inset highlight and the drop shadow; when hovered, then it lifts 1px with a stronger shadow; when active, then it does not lift.
23. Given a secondary or ghost button, then it has `var(--surface)` background, 1px `var(--line)` border, `var(--fg)` text; when hovered, then the border is `var(--line-strong)`.
24. Given a page at scroll 0, when the header renders, then it is fixed 16px from the top (12px under 760px), the bar is max 1120px wide, 56px tall, transparent with a transparent 1px border and no shadow.
25. Given the page, when `window.scrollY` becomes greater than 8, then the header gets `is-scrolled` and the bar shows `--glass-bg`, blur(24px) saturate(1.4), 1px `var(--line)` border and the shadow; when it returns to 8 or less, then the class is removed.
26. Given the header on any page, then it contains only the logo mark + "Skill Foundry" wordmark, theme button, language button and `btn cta` Install; no nav links, no brand chip, no menu button and no `#site-menu`.
27. Given the hero at scroll 0, then it is not hidden under the fixed header (main has top padding).
28. Given `site.css` in light and dark, then `--dot`, `--glow` and `--glass-bg` are defined in both, and the dot grid, stage glow and top wash use only neutral colours.
29. Given a skill page, when the footer renders, then it shows the Skill Foundry build `version`, same as the landing footer.
30. Given the landing after clean-up, then no CSS or markup remains for nav links, the menu, the brand chip or landing qbar tabs, and every id/class required by `tests/site-*.test.mjs` still exists.
31. Given a skill page, then the All skills back link remains in the page body; when scrolled, `nav.qbar` sticks at header height + 24px as a centred glass bar (max 1120px, `var(--r-lg)`) that never overlaps the header, links show no leading numbers (or only muted badges), and it scrolls sideways at 375px with fade edges and no page overflow.
32. Given any page, then no full-width border line separates sections and none sits above the footer meta group.

Edge cases (React Bits)
- Page reloaded while scrolled: header shows `is-scrolled` immediately (checked on load).
- JS disabled: header stays transparent; content stays readable and not hidden under it.
- Dark theme: glass, shadow, button and background tokens use the dark values.
- Phone (375px): header gap 12px top, logo plus three controls fit in one row with 44px targets and no overflow.
- Browser without `backdrop-filter`: the `--glass-bg` background alone keeps text readable.
- Missing `version` in build data: footer omits the version text rather than showing "undefined".

## 6b. Motion contract (every rendered page)

Calm, neutral motion makes every page feel alive for visitors without moving layout. All current design decisions above stay in force.

Global motion rules
- Motion uses only `transform` and `opacity` (background drift uses `background-position`); no layout-shifting animation. UI durations 150-600ms with `var(--ease)`; nothing flashy; neutral colours (tokens) only.
- Reduced motion: every animation and transition is switched off inside the existing `@media (prefers-reduced-motion: reduce)` block; JS motion checks `matchMedia('(prefers-reduced-motion: reduce)')` and does nothing when it matches.
- No JS: everything is visible. Reveal hiding applies only when `html` has class `js` (set by `site.js`).

| Motion | Trigger | Timing |
|---|---|---|
| Hero dot grid drift (`bg-drift`, background-position) | page load | about 40s linear infinite |
| Stage glow breathe (`glow-breathe`, opacity + scale) | page load | about 8s ease-in-out infinite alternate |
| Optional two faint blurred neutral blobs (`blob-float`) | page load | 20s or longer |
| Scroll reveal: `.reveal` gets `is-in` (IntersectionObserver), opacity 0 to 1, translateY 12px to 0 | enters viewport | 500ms; grid cards staggered 60ms via `--i` |
| Hero entrance: New pill, h1, subtitle, install box, button row fade up | load | 80ms steps |
| Card hover: translateY(-2px), shadow + border-color; preview image scale 1.02 in frame | hover | 150-600ms |
| Button hover lift 1px; active scale .98; Copy success check state fades | hover / active / copy | 150ms |
| FAQ plus icon rotates 45deg; answer fades in | open | 150-600ms |
| Header glass fade on `is-scrolled` | scrollY > 8 | 200ms |
| Stats count up from 0, once | first visible | JS; final HTML text stays the real number |
| qbar active indicator slides; progress bar 2px | scroll / section change | 150-600ms |

Reveal applies to: section heads, skill cards, stat cards, step cards, agent card, limit cards, faq box, stage.

Acceptance criteria (motion)
M1. Given `site.css`, then keyframes `bg-drift`, `glow-breathe` (and `blob-float` if blobs exist) exist and use only token colours.
M2. Given `html.js` and a `.reveal` element outside the viewport, when it scrolls in, then it gets `is-in` and fades up 12px over 500ms; cards in one grid start 60ms apart via `--i`.
M3. Given JS disabled (no `js` class), when any page loads, then every `.reveal` element is fully visible.
M4. Given `prefers-reduced-motion: reduce`, when any page loads or is used, then no animation or transition runs (all off inside the existing media block), stats show their final numbers, and JS motion does nothing.
M5. Given the landing load, then the New pill, h1, subtitle, install box and button row fade up in order, 80ms apart.
M6. Given a card, when hovered, then it lifts 2px with shadow and border-color change and its preview image scales to 1.02 without leaving its frame.
M7. Given a button, when hovered, then it lifts 1px; when pressed, then it scales to .98; when Copy succeeds, then the existing success state fades in and back.
M8. Given a FAQ item, when opened, then the plus icon rotates 45deg and the answer fades in.
M9. Given the header, when `is-scrolled` toggles, then the glass fades over 200ms.
M10. Given `#proof` first visible with motion allowed, then each `.stat-num` counts up from 0 once to the exact number already in the HTML; it never runs twice.
M11. Given any motion rule in `site.css`, then it animates only `transform`, `opacity` (or `background-position` for the drift) with durations 150-600ms for UI motion.
M12. Given a skill page, when the active section changes, then the `--surface-2` indicator slides to the active link and the 2px progress bar inside the qbar bottom edge reflects scroll progress; `var(--ok)` appears only in qbar/progress rules.

Edge cases (motion)
- Browser without IntersectionObserver: `site.js` marks all `.reveal` as `is-in` immediately (content never stays hidden).
- Reload mid-page: elements already in view reveal at once; stats already passed show their final number.
- Reduced motion switched while open: CSS stops animations; JS checks before starting each motion.
- Dark theme: background layers and glow use dark token values.
- Khmer: count-up and reveal do not change text, so translated strings stay intact.

## 7. Edge cases

- No ready skills: hero falls back to title only (`render.mjs:266`); stats must not show fake numbers (show 0 or hide, never invent).
- A skill with no live recording: table shows `proof.notyet`, it adds 0 to P and T.
- Missing `allBytes`: the all-skills download link is hidden (`render.mjs:397`).
- Clipboard blocked (file:// or denied): no success state shown; command stays selectable.
- Long Khmer strings must wrap inside cards without overflow at 375px.
