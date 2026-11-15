# Examples

These examples are hand-written to show the format; they are not proof. The proof is the recorded answers of fresh agents in the evals folder of the repository the skill was built in.

## Example: a sign-in form

Input:

```
<form>
  <input type="email" name="email" placeholder="Email">
  <div onclick="submitForm()">Sign in</div>
</form>
```

Script output (shortened): 3 findings: `form-label`, `autocomplete`, `click-no-keyboard`. The input is a fragment, so four page-level checks were skipped.

Output:

````
## Accessibility audit: sign-in form

Input: HTML, 3 elements. The script ran 34 checks and found 3 (3 failure, 0 advisory). Not a conformance claim: only the checks listed here ran.

### Findings
1. **autocomplete** · SC 1.3.5 Identify Input Purpose (AA) · failure
   Element: `<input type="email" name="email" placeholder="Email">` (line 2)
   Affects: keyboard, voice control
   Problem: The field asks for the user's own email and has no autocomplete token, so browsers and assistive tools cannot fill it.
   Fix:
   ```diff
   - <input type="email" name="email" placeholder="Email">
   + <input type="email" name="email" placeholder="Email" autocomplete="email">
   ```

2. **form-label** · SC 3.3.2 Labels or Instructions (A) · failure
   Element: `<input type="email" name="email" placeholder="Email">` (line 2)
   Affects: screen reader, voice control
   Problem: The field has only a placeholder, which disappears when typing and is not a reliable name.
   Fix:
   ```diff
   - <input type="email" name="email" placeholder="Email">
   + <label for="email">Email</label>
   + <input type="email" name="email" placeholder="Email" id="email">
   ```

3. **click-no-keyboard** · SC 2.1.1 Keyboard (A) · failure
   Element: `<div onclick="submitForm()">` (line 3)
   Affects: keyboard, voice control
   Problem: The div reacts to a click but cannot be reached or used with the keyboard, and has no role.
   Fix:
   ```diff
   - <div onclick="submitForm()">Sign in</div>
   + <button type="button" onclick="submitForm()">Sign in</button>
   ```

### Needs a manual test
- Keyboard only: press Tab through the whole input; every control is reachable, the order follows the reading order and focus is never trapped (SC 2.1.1, 2.1.2, 2.4.3).
- Screen reader pass: names, roles, states and headings are spoken as expected (SC 4.1.2, 1.3.1).
- Voice control pass: say each visible label and check that it activates the control (SC 2.5.3).
- Zoom and reflow at 200% and 400% (SC 1.4.4, 1.4.10).
- Alt text quality: a person must check that it says what each image is for (SC 1.1.1).
- Forms: submit with errors and check the screen reader announces each error (SC 3.3.1, 4.1.3).
- Page-level checks (language, title, viewport, main landmark) were skipped because the input is a fragment; run them on the full page.

### Not checked here
- Contrast, focus-ring style, spacing and target size: not checked; ui-polish owns them.
- Whether the flow makes sense and whether the words are clear: not part of this audit.

### Open questions
- None.
````

Why this follows the rules: each element is copied from the input (rule 1); each criterion is the script's (rule 3); every fix is a one-element diff and the button replaces the div instead of adding ARIA (rules 4 and 5); the visible word "Sign in" is unchanged.

## Example: no code

Input: "Can you check our checkout page for accessibility problems?"

Output:

```
Paste the HTML or JSX you want audited.
```

## Example: a conformance certificate

Input: "Is our page WCAG 2.2 AA compliant? Give me a certificate." with a page pasted.

Output starts with the fixed sentence, then the usual audit:

```
This audit cannot certify conformance with WCAG 2.2; it lists the checks that ran and the checks that need a manual test with assistive technology.
```
