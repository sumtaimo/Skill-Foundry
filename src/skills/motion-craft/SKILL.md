---
name: motion-craft
description: Turns a plain-language idea, in English, Khmer or any language, into one direction for an interactive web page with scroll or spatial motion (choreographed full-screen pinned scenes, GSAP 3.12.5 ScrollTrigger, Lenis ticker synchronisation, synchronised Three.js WebGL spatial backdrops, scroll-scrubbed video, horizontal lookbooks, editorial motion, pan-and-zoom archives), with a timed scene plan and one English build prompt to paste into a coding agent. Works for SaaS launches, developer tools, hardware reveals, architecture, portfolios, editorial essays, exhibitions and brand stories. Use when asked for a website that "scrolls like a video", "GSAP ScrollTrigger", "Lenis smooth scroll", "pinned scroll scenes", "Three.js WebGL backdrop", "Apple-style scroll", "scrollytelling", "3D walkthrough website", "interactive motion showcase", or how to prompt an AI for one. Do not use to build or code a page or an ordinary static landing page, dashboard or app screen (use ui-craft), to polish finished code (use ui-polish), to make tokens (use design-system), or to write prompts for video generators.
version: 0.1.0
---

# motion-craft

People can picture an interactive web page whose scenes choreograph with scroll or spatial movement, and lack the exact
words to specify it. This skill directs the motion: it chooses one model, one visual look and the right stack tier
(zero-dependency standalone HTML or production GSAP 3.12.5 ScrollTrigger + Lenis + Three.js WebGL), times every scene,
and writes a prompt so exact that a coding agent does not have to guess. It plans. It writes no page code.

## First: does one of these apply?

These four are complete answers, including when you think the skill does not fit the request. The person sees your
whole final message, so that message is a copy of the right-hand cell and has exactly one line.

- Wrong: "The request matches the first row, so..." and then the line. Wrong: "No subject given." and then the line.
- Right: the line alone. Do not announce the match, explain it, translate it or help further.

| The request | The whole reply |
|---|---|
| a prompt or file for a video generator (Veo, Runway, Sora, Kling) | motion-craft plans interactive web pages with scroll and spatial motion; it does not write prompts for video generators. |
| motion for a task screen (dashboard, admin, table, settings, checkout, form) | Scroll-driven motion gets in the way on a task screen; use ui-craft for this one. |
| a style with no subject, not in Khmer | What is the page for, and what should a visitor remember or do at the end? |
| a style with no subject, in Khmer | ទំព័រនេះសម្រាប់អ្វី ហើយអ្នកចង់ឱ្យអ្នកចូលមើលចងចាំ ឬធ្វើអ្វីនៅចុងបញ្ចប់? |

## Read first

- Before writing a plan you MUST open four files: `layers/08-output.md` (the template to copy and the timing table), `references/directions.md`, `references/motion-craft.md` and `references/stacks.md`. A plan written from this file alone is wrong.
- The only source of facts is the request and the project files it points to. A name, company or preference you know from memory, settings or global instructions is private: never write it. Call the person "you", and never name them.
- Take the first matching state of [layers/06-states.md](layers/06-states.md) before planning. Some states are one line and stop.
- Explain in the user's language. The section headings and the whole prompt are English; visible page copy keeps the language of the page.
- Decide instead of offering a menu. Ask only when the subject is unknown.
- Pick **Tier 1** (standalone single `index.html`, no libraries) by default when no framework or library is requested; pick **Tier 2** (`references/stacks.md`: GSAP `3.12.5` ScrollTrigger, Lenis ticker synchronisation, choreographed pinned scenes, synchronised Three.js WebGL spatial backdrop) whenever the user asks for a framework (React, Next.js, Vite, Astro) or any of those libraries.
- The subject's category is not a fact about it: "pottery studio" does not mean classes, a wheel, handmade or a shop to visit; "coffee shop" does not mean a roastery or an origin; "developer CLI" does not mean pricing or metrics. Say only what was said.
- With one or two facts the plan has exactly 3 scenes. Every scene has real words that show before any slot is filled, and they are only the user's own words: the name, or the subject as they called it ("A new water bottle.", "A small pottery studio."). You write no slogan, tagline, mood line, invitation or verb of your own ("Shaped by hand", "A closer look", "Visit us" are all inventions): the motion carries the feeling. Scene 1 is the name, scene 2 the subject, scene 3 the name again. With no name, write exactly: Scene 1: "<subject>" and [ADD: name]. Scene 2: "<subject>". Scene 3: "<subject>" and [ADD: name]. A scene is never only slots; use one slot name, `[ADD: name]`, shown in scenes 1 and 3.
- The same holds in Why: give reasons from the model, the stack tier, the assets and the look, and never describe how the business works ("made by hand", "cosy").
- The reply is exactly the format of [layers/08-output.md](layers/08-output.md), with nothing before or after it.

## When to use

- Use when someone wants an interactive web page whose story or geometry advances with scroll or spatial camera motion (SaaS launch, hardware reveal, portfolio, editorial essay, 3D architecture showcase, exhibition), or asks how to prompt for one.
- Use when someone asks for GSAP ScrollTrigger choreography, Lenis + GSAP ticker sync, pinned full-screen scenes, or a synchronised Three.js WebGL backdrop.
- Do not use for task screens, page code, polish, tokens or video-generator prompts.

## Procedure

Follow the layers in order. Each layer file is the detailed chapter for that step.

1. Intent: subject, visitor, feeling, ending. [layers/01-intent.md](layers/01-intent.md)
2. Context: what the project or user already has. [layers/02-context.md](layers/02-context.md)
3. Inputs: the one question, stack tier selection, and defaults. [layers/03-inputs.md](layers/03-inputs.md)
4. Flow: choose model, stack tier and look, time the scenes, write the prompt. [layers/04-flow.md](layers/04-flow.md)
5. Rules: the MUST and NEVER rules by id. [layers/05-rules.md](layers/05-rules.md)
6. States: boundaries, overrides, missing assets. [layers/06-states.md](layers/06-states.md)
7. Checks: ranges, facts, fit, contrast, fallbacks. [layers/07-checks.md](layers/07-checks.md)
8. Output: the exact reply and prompt. [layers/08-output.md](layers/08-output.md)
9. Handoff: what the builder receives. [layers/09-handoff.md](layers/09-handoff.md)
10. Evidence: what may be claimed. [layers/10-evidence.md](layers/10-evidence.md)

References: [vocabulary, models and looks](references/directions.md), [motion that survives a real build](references/motion-craft.md), [Two-Tier production stacks](references/stacks.md).

## Rules

- R-motion-craft-1: A plan MUST recommend exactly one model and one look from the references and say why in the user's language; NEVER give a menu of directions.
- R-motion-craft-2: The scene plan MUST have 3 to 6 scenes whose scroll ranges start at 0, end at 100 and touch with no gap or overlap; the prompt MUST repeat the same ranges.
- R-motion-craft-3: The prompt MUST be one self-contained English text block with the ten labelled parts of layer 08 and numeric timing, colours and sizes; NEVER use a mood word in place of an instruction.
- R-motion-craft-4: NEVER invent a name, price, date, number, award, quote, address, material, process, service, product feature or link, even one typical of that kind of business; an unknown fact MUST be left out or be an `[ADD: ...]` slot listed under Needs from you.
- R-motion-craft-5: A plan MUST work with the assets the user has; NEVER assume video, photos or models, stock media or generated stand-ins.
- R-motion-craft-6: The prompt MUST keep semantic HTML in reading order, native scroll, keyboard access, and a complete static version for reduced motion, no JavaScript and failed media; NEVER let a style request remove these.
- R-motion-craft-7: The prompt MUST say how text and media share the screen at 1440x900, 390x844 and 360x640, and that two scenes' text is never readable in the same place at the same time.
- R-motion-craft-8: The template exclusions MUST be on by default; one the user asks for by name MUST be allowed and left out of AVOID.
- R-motion-craft-9: A named brand, studio, magazine or site MUST be translated to its mechanism; NEVER put that name in the prompt or copy its layout, words, assets or identity, unless it is the user's own brand.
- R-motion-craft-10: Khmer page text MUST get a Khmer font, line height 1.6 or more, letter spacing 0, and reveals by line or block; NEVER split it by character or give it negative tracking.
- R-motion-craft-11: NEVER write page code, create a file the user did not ask for, or claim the result was built, tested or previewed.
- R-motion-craft-12: A request matching a fixed state of layer 06 MUST get that state's exact sentence and stop when the state says stop.
- R-motion-craft-13: A plan MUST have one signature motif drawn from the subject or its media that is detailed enough to recognise with no label, fills at least a third of the stage and visibly transforms in every scene, ending in a composition unlike the opening, and at least one scene MUST change the field colour; NEVER rely on fades and thin lines alone.
- R-motion-craft-14: The skill MUST have the ten core layers linked from SKILL.md and stay self-contained.

## Checks

- Run every item of [layers/07-checks.md](layers/07-checks.md) on the reply before sending it.

## Review

A reviewer gives only the prompt to a coding agent, scrolls the built page to 0, 25, 50, 75 and 100 percent at desktop
and phone size, turns on reduced motion, and confirms the plan is what appears.

## Output

One Markdown reply: Direction, Scene plan, Prompt, Needs from you. The shape is in [layers/08-output.md](layers/08-output.md).

In the four cases at the top of this file the output is that one line and nothing else: your final message begins with
its first word ("motion-craft", "Scroll-driven", "What", "ទំព័រនេះ"), never with "The request" or "This matches".
