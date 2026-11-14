# Examples

## Example: a CDN edge cache explainer

Prompt: "explain how a CDN edge cache serves a request, interactive"

Result: [demo.html](demo.html), one self-contained page.

- Size: Figure. Idea: the edge cache answers a request without asking the origin when it holds a copy.
- Object: a ground plate with a client, an edge cache (ink tone) and an origin.
- Parts: `Client`, `Request`, `Edge cache`, `Origin (skipped)`; the green dot on the edge cache top is the cache hit, named in the caption.
- Motion story: the request box slides along x from the client to the edge cache; it stops under reduced motion.
- Details: a screen edge on the client, three drive bays on the origin, the cache-hit light on the edge cache.
- Lint: 0 errors, 0 warnings.
- Page: light by default, theme button names the theme it switches to (`Dark theme` / `Light theme`, `aria-pressed` true when dark, including dark from `prefers-color-scheme`), choice remembered in `localStorage` inside try/catch, pause button, no external scripts, fits 390px with labels at 11 CSS px or more.
- Labels are hidden at rest and appear with their leader when a part is hovered, focused or tapped; cards under the figure name the parts.
- Leaders are plain lines with no anchor dots; the only round mark is the cache-hit `dot()`.
- Regenerate: `node examples/build-demo.mjs` (from the skill folder) writes `demo.html`, `../preview/example.html` and `../preview/cover.svg` from the engine; `buildDemo()` returns the same strings and the committed files must match it byte for byte.
