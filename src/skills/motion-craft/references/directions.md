# Directions

## Plain words to industry terms

| The user says | Term for the prompt |
|---|---|
| moves like a video, scenes change in place | choreographed full-screen pinned scenes, scrollytelling stage |
| my video plays as I scroll | scroll-scrubbed video |
| walk through rooms, fly through, 3D backdrop | synchronised Three.js WebGL spatial backdrop, scroll-driven camera on a Catmull-Rom path |
| slides sideways, horizontal gallery | horizontal lookbook scroll |
| smooth, heavy, expensive, buttery inertia | weighted (damped) response to native scroll (or Lenis + GSAP 3.12.5 ticker sync in Tier 2) |
| GSAP, ScrollTrigger, pinned timeline | GSAP 3.12.5 ScrollTrigger timeline with gsap.matchMedia() |
| words slide out of nowhere | masked typography reveal |
| opens like a curtain or door | architectural curtain wipe |
| explore in any direction, map/archive | pan and zoom spatial canvas |
| clean, breathing, gallery | generous negative space, frameless media |

## Supported site domains (not only cinema)

- **SaaS & developer tools:** interactive product reveals, architecture diagrams, terminal/flow choreography (Swiss Typographic Grid or Gallery Dark).
- **Hardware & physical products:** scroll-scrubbed product films, exploded/rotated silhouettes, macro detail hand-overs (Gallery Dark or Material First).
- **Architecture & 3D spaces:** synchronised Three.js WebGL spatial backdrops, room walkthroughs, daylight/inverted lighting shifts (Architectural Minimalism).
- **Editorial & long-form reading:** natural-height chapters with scroll-linked margins, hairlines, and inverted bands (Editorial Luxury).
- **Portfolios, fashion & exhibitions:** horizontal lookbooks, pan-and-zoom archives, frameless image choreography (Editorial Luxury or Gallery Dark).
- **Craft, coffee, food & bold campaigns:** tactile palettes, drawn multi-tone SVG motifs, kinetic typography (Material First or Kinetic Brutalism).

## Models (first true condition wins)

| Id and name | Condition | Needs | Static version |
|---|---|---|---|
| M6 Spatial canvas | user asks for free exploring | 5 or more items | ordered list of items |
| M2 Scroll-scrubbed video | user has footage | short all-keyframe video, poster | poster and captions |
| M3 3D walkthrough / WebGL spatial backdrop | user asks for rooms, 3D, WebGL spatial backdrop or a fly-through and has a model, or plain geometry is enough | Tier 1: inline Canvas 2D/CSS 3D (Three.js as upgrade); Tier 2: Three.js WebGL synced to ScrollTrigger | one still section per stop |
| M4 Horizontal lookbook | user asks for sideways, or has 5 or more peer images | ordered items | vertical list |
| M5 Editorial motion flow | long reading, articles, many paragraphs | text | the same page, still |
| M1 Pinned scene story | everything else, including SaaS launches, product showcases and no-asset stories | nothing (or GSAP/Lenis in Tier 2) | ordered sections |

## Looks

| Look | Fits | ground | text | accent | Latin display / body | Khmer display / body |
|---|---|---|---|---|---|---|
| Architectural Minimalism | spaces, architecture, craft, calm services | #F2EFE9 | #24211D | #6B4F3A | Instrument Sans / Instrument Sans | Kantumruy Pro / Kantumruy Pro |
| Editorial Luxury | fashion, hotels, food, portfolios, essays | #FAF8F4 | #171717 | #7A2E2E | Bodoni Moda / Instrument Sans | Noto Serif Khmer / Noto Sans Khmer |
| Swiss Typographic Grid | SaaS, dev tools, software, studios, events, facts | #FFFFFF | #111111 | #B3261E | Inter Tight / Inter Tight | Noto Sans Khmer / Noto Sans Khmer |
| Material First | coffee, clay, textiles, food | #E8DFD2 | #2B2119 | #6E3B1E | Fraunces / Work Sans | Suwannaphum / Kantumruy Pro |
| Gallery Dark | film, art, music, hardware, SaaS dark launch | #11100F | #F1ECE4 | #D6A45C | Cormorant Garamond / Manrope | Noto Serif Khmer / Noto Sans Khmer |
| Kinetic Brutalism | youth, music, bold campaigns | #F0F000 | #0A0A0A | #0A0A0A | Anton / Space Grotesk | Koulen / Kantumruy Pro |

An inverted scene swaps ground and text. The accent on an inverted field is for shapes only, never text.

Match the subject and pace. A look is a starting palette; given brand colours win when their contrast passes.

## Craft moves (two or three)

- Weighted response: drawn progress eases toward scroll progress (or Lenis + GSAP ticker sync in Tier 2); the scrollbar stays native.
- Masked line reveal: lines rise out of an overflow mask.
- Curtain wipe: a plane uncovers the next composition with `clip-path`.
- Scale hand-over: the hero element of one scene becomes the ground of the next.
- Frameless media: edge to edge inside its own area, no shadow, border or radius.
- Hairline structure: 1px rules draw and reposition to organise each scene.
- Depth drift: two layers at most move at different rates, never the text.
- Spatial camera choreography: synchronised WebGL / perspective camera and lighting move on a single progress curve.

## Default exclusions

- sections that look like stacked template blocks while motion is on
- scroll progress bars and decorative loading bars
- card grids, glowing borders, neon or purple-blue gradients
- pill badges, and text on top of media
- bounce, springs, scroll hijacking, cursor followers
- invented statistics, testimonials, logos and stock media
