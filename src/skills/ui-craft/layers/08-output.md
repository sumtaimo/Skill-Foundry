# Layer 08: Output

Structure the response cleanly so either a human developer or the next harness worker (`DEV_ENGINEER` / `QA_AUDITOR`) can apply it immediately:

1. **Start with a brief summary header**:
   ```markdown
   ## UI Craft: <target surface>

   Stack: <vanilla | tailwind | react | css-handoff> · Theme: light + dark · States: complete
   ```
2. **Tokens & Architecture section**: List applied/added CSS variables (`--color-surface-default`, `--color-surface-raised`, `--glass-bg`, `--r-*`, `--z-*`) and layout grid/breakpoint strategy.
3. **Code section**:
   - Provide clean, runnable files or complete code blocks matching the detected stack (HTML/CSS/JS, Tailwind JSX, or CSS stylesheet).
   - Never truncate code with `// ... rest unchanged` on generated new screens/components.
   - Put the complete code inside the reply itself as fenced code blocks. Saving a file is optional and extra, never a replacement: a reply that only points to a file path, or only summarises the code, is incomplete. Never publish or upload the code anywhere without the user asking.
   - In `css-handoff` mode (`UX_DESIGNER`), include the full CSS code followed by a structured **Markup Handoff Contract** block naming every required class, semantic tag, `aria-*` attribute, and `data-state` hook.
4. **Interactive States & Keyboard Contract**: Summarize keyboard shortcuts (`Cmd/Ctrl+K`, arrows, `Enter`, `Escape`) and how loading, empty, error, and reduced-motion states behave.
5. **Verification & Open Questions**: State which checks ran (browser widths/themes or contrast verification) vs what remains for runtime wiring or product copy decisions.
6. Hand final deliverables to Layer 09.
