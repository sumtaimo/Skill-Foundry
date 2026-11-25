# Layer 10 — Evidence

Record verifiable proof that the mechanism SVG meets every structural, visual, and accessibility requirement.

1. Keep the delivered HTML or JSX self-contained and reproducible so reviewers can open it directly or mount it without missing assets.
2. When `engine/lint-svg.mjs` is executed, report the exact pass/fail result for checks `M1` through `M8` with zero fabricated claims.
3. When browser verification is executed, confirm `1440px` and `390px` viewports across light mode, dark mode, and `prefers-reduced-motion: reduce` with `0` console errors and `0px` horizontal overflow (`scrollWidth <= clientWidth`).
4. Verify every stage, branch, and label in the SVG traces directly back to the user's prompt with zero invented endpoints, fake metrics, or raw `#hex` attributes inside `<svg>`.
