# Style archetypes

A style is one of these five sets of numbers. Pick by the user's words: style words first, then the kind of
product, then a product they compare to (by what that product is, never by its name). Use calm-workspace when nothing decides.

| Choice | precise-fintech | calm-workspace | bold-consumer | editorial | dense-data-tool |
|--------|-----------------|----------------|---------------|-----------|-----------------|
| Style words | precise, trustworthy, secure, serious, corporate, professional | calm, quiet, soft, friendly, gentle, minimal, focused | bold, playful, fun, vibrant, energetic, youthful | editorial, elegant, classic, literary, refined, reading | dense, compact, efficient, power user, data-heavy |
| Kinds of product | banking, payments, invoicing, accounting, insurance, trading | notes, docs, planning, wellness, team workspace | shopping, food delivery, games, social, kids, fitness | magazine, news, blog, publishing, portfolio | admin, analytics, dashboard, monitoring, developer tool, CRM tables |
| Default primary (when no hex) | #1d4ed8 | #0f766e | #e11d48 | #9a3412 | #4f46e5 |
| Neutral saturation | 12% | 6% | 4% | 3% | 8% |
| Type sizes xs to 3xl (px) | 12 14 16 18 20 24 30 | 12 14 16 20 24 30 36 | 12 14 16 20 24 36 48 | 12 14 18 24 30 36 48 | 12 14 16 18 20 24 24 |
| Type ratio (approximate) | 1.2 | 1.25 | 1.333 | 1.414 | 1.125 |
| Body size (md) | 16 | 16 | 16 | 18 | 16 |
| Weights | 400, 600 | 400, 600 | 400, 700 | 400, 700 | 400, 600 |
| Heading font | sans | sans | sans | serif (system) | sans |
| Radius sm / md / lg (px) | 4 / 6 / 8 | 6 / 10 / 16 | 8 / 12 / 24 | 0 / 2 / 4 | 2 / 4 / 6 |
| Control radius | md | md | full (pill) | md | md |
| Control heights sm / md / lg (px) | 32 / 40 / 48 | 36 / 44 / 52 | 40 / 48 / 56 | 32 / 40 / 48 | 24 / 32 / 40 |
| Default density | comfortable | spacious | spacious | spacious | compact |
| Shadow 1 (y, blur, spread, opacity) | 1, 2, 0, 0.08 | 1, 3, 0, 0.06 | 2, 4, 0, 0.12 | none | 1, 1, 0, 0.10 |
| Shadow 2 | 2, 6, -1, 0.10 | 4, 12, -2, 0.08 | 6, 16, -2, 0.16 | none | 2, 4, 0, 0.12 |
| Shadow 3 | 8, 16, -4, 0.12 | 12, 32, -8, 0.10 | 16, 40, -8, 0.20 | 8, 24, -6, 0.10 | 6, 12, -2, 0.14 |
| Durations fast / base / slow (ms) | 100 / 150 / 200 | 150 / 200 / 300 | 120 / 200 / 320 | 150 / 250 / 400 | 80 / 120 / 160 |
| Extra easing | none | none | emphasized cubic-bezier(0.34, 1.56, 0.64, 1) | none | none |
| Brand colour share of a screen, at most | 10% | 5% | 30% | 5% | 10% |
| Brand colour used on | primary action, links, focus ring, selected row | primary action, focus ring, selected item background | primary action, brand surfaces (hero, banners), badges, focus ring | links, focus ring, one highlight per page | primary action, selected rows and cells, focus ring, chart highlight |
| Brand surface role | no | no | yes (surface-brand, text-on-brand) | no | no |

The spacing scale (0 to 64 px), the 44 px target, line-heights, border widths and breakpoints are the same for every archetype.
Archetypes differ in rhythm through density, radius, type sizes, shadow and motion, never through off-scale numbers.
