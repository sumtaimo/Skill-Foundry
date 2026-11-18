# Layer 04: Flow

Execute design and implementation in this exact order:

1. **Establish Token Foundation** ([references/surfaces-and-tokens.md](../references/surfaces-and-tokens.md)):
   - Map existing project tokens or emit `:root`, `[data-theme="dark"]`, and `@media (prefers-color-scheme: dark)` variables for canvas/surfaces (`--bg`, `--surface`, `--surface-2`, `--glass-bg`), borders (`--line`, `--line-strong`), text (`--fg`, `--muted`, `--fg-on-accent`), focus ring (`--focus`), highlights/glows (`--btn-gloss`, `--glow`, `--dot`), radius scale (`--r-xs: 4px`, `--r-sm: 6px`, `--r-md: 10px`, `--r-lg: 14px`, `--r-xl: 16px`), and layering (`--z-sticky` .. `--z-toast`).
2. **Design Spatial Layout & Visual Hierarchy**:
   - Establish clean `4px` spacing rhythm (`4, 8, 12, 16, 20, 24, 32, 48, 64 px`), max-width container, `1px` hairline card/container framing, and restrained background texture (dot grid + subtle radial ambient glow when fitting hero/stage views, never noisy neon gradients).
   - Ensure ONE clear primary filled action per viewport/panel; give secondary controls neutral surface borders and ghost/quiet treatments.
3. **Architect Navigation & Command Patterns** ([references/navigation-and-states.md](../references/navigation-and-states.md)):
   - For app shells or multi-section pages, build adaptive navigation: floating glass header (`backdrop-filter: blur(20px) saturate(1.4)` when scrolled), collapsible sidebar icon-rail or sticky sub-nav with sliding active indicator, mobile drawer fallback at `< 768px`, and `Ctrl+K` / `Cmd+K` Command Palette (`<dialog>` or `role="dialog"` + fuzzy search + arrow/Escape keyboard handling + `<kbd>` hints).
4. **Build Components, Buttons & Typography**:
   - Use modern optical typography (`>= 16px` body, `-0.02em` heading tracking, intentional weights `400/500/600/700`, `tabular-nums` for data/badges).
   - Build primary CTA buttons with subtle top specular gradient highlight, `>= 44x44px` interactive hit area, crisp tactile hover (`translateY(-1px)`), and active press down.
   - Where inline SVGs or icons appear, bind all colours to `currentColor` or `var(--...)` (`aria-hidden="true"` on decorative icons).
5. **Implement Inline AI / Contextual Action Bars (when requested or AI-centric)** ([references/motion-and-ai.md](../references/motion-and-ai.md)):
   - Include compact prompt input, quick-action chips, live streaming/thinking pulse with stop/cancel button, and accept / undo-revert bar.
6. **Wire Motion Physics & All 8 Lifecycle States**:
   - Add crisp GPU-only transitions (`transform`, `opacity`) + spring/cubic-bezier easing (`120ms–240ms`) + `@media (prefers-reduced-motion: reduce)`.
   - Implement explicit styles and templates for Default, Hover, `:focus-visible`, Active/Selected, Disabled, Shimmer Skeleton (dimension-locked), Empty Search/Filter (with clear reset action), and Inline Error/Retry.
7. Hand completed design and code to Layer 05 for rule verification.
