# References

## The checks

The script runs these 39 checks. The criterion, level, who and status are the script's; the reply copies them. "failure" means the markup breaks the criterion; "advisory" is a best practice tied to it. A check marked "full page only" is skipped for a fragment.

| Rule id | Success criterion (WCAG 2.2) | Level | Affects | Status | What it looks for |
|---------|------------------------------|-------|---------|--------|-------------------|
| `html-lang` | 3.1.1 Language of Page | A | screen reader | failure, full page only | html has no lang, or an invalid code |
| `page-title` | 2.4.2 Page Titled | A | screen reader | failure, full page only | no title, or an empty title |
| `viewport-zoom` | 1.4.4 Resize Text | AA | zoom | failure, full page only | viewport blocks zoom (user-scalable=no, maximum-scale below 2) or has a fixed width |
| `main-landmark` | 2.4.1 Bypass Blocks | A | keyboard, screen reader | failure, full page only | no main landmark, or more than one |
| `landmark-name` | 1.3.1 Info and Relationships | A | screen reader | advisory | several nav landmarks without a distinct name |
| `heading-order` | 1.3.1 Info and Relationships | A | screen reader | advisory | heading level jumps by more than one |
| `heading-empty` | 2.4.6 Headings and Labels | AA | screen reader | failure | a heading with no text |
| `img-alt` | 1.1.1 Non-text Content | A | screen reader | failure | img, area or role=img svg without alt or name |
| `img-alt-bad` | 1.1.1 Non-text Content | A | screen reader | failure | alt is a file name or "image of ..." |
| `control-name` | 4.1.2 Name, Role, Value | A | screen reader, voice control | failure | button, link, input button or widget role with no name |
| `form-label` | 3.3.2 Labels or Instructions | A | screen reader, voice control | failure | input, select or textarea with no label (placeholder only counts as none) |
| `label-orphan` | 1.3.1 Info and Relationships | A | screen reader, voice control | failure | label that labels nothing |
| `required-state` | 1.3.1 Info and Relationships | A | screen reader | failure | label says required (asterisk or word) but the field has no required |
| `error-link` | 3.3.1 Error Identification | A | screen reader | failure | aria-invalid with no linked error text |
| `lang-parts` | 3.1.2 Language of Parts | AA | screen reader | failure | text in another writing system than the page's (for example Khmer on an English page) with no lang attribute on it or above it |
| `autocomplete` | 1.3.5 Identify Input Purpose | AA | keyboard, voice control | failure | field for the user's own email, name, phone, address or password without autocomplete |
| `group-name` | 1.3.1 Info and Relationships | A | screen reader | failure | radio group outside a fieldset, or a fieldset without legend |
| `click-no-keyboard` | 2.1.1 Keyboard | A | keyboard, voice control | failure | click handler on an element the keyboard cannot reach |
| `link-no-href` | 2.1.1 Keyboard | A | keyboard | failure | anchor with no href |
| `tabindex-positive` | 2.4.3 Focus Order | A | keyboard | failure | tabindex above 0 |
| `native-element` | 4.1.2 Name, Role, Value | A | keyboard, screen reader | advisory | role on a div or span where a native element exists |
| `redundant-role` | 4.1.2 Name, Role, Value | A | screen reader | advisory | role that repeats the native role |
| `aria-hidden-focusable` | 4.1.2 Name, Role, Value | A | keyboard, screen reader | failure | aria-hidden on something focusable |
| `aria-invalid-use` | 4.1.2 Name, Role, Value | A | screen reader | failure | role or aria- attribute that does not exist |
| `aria-ref-missing` | 1.3.1 Info and Relationships | A | screen reader | failure | aria-labelledby, describedby, controls or owns pointing at a missing id |
| `aria-label-ignored` | 4.1.2 Name, Role, Value | A | screen reader | advisory | aria-label on a plain div or span with no role |
| `aria-state-missing` | 4.1.2 Name, Role, Value | A | screen reader | failure | custom checkbox, switch, radio, tab or combobox without its state attribute |
| `dialog-name` | 4.1.2 Name, Role, Value | A | screen reader | failure | dialog with no name |
| `status-message` | 4.1.3 Status Messages | AA | screen reader | failure | toast, alert or error container that is not a live region |
| `link-purpose` | 2.4.4 Link Purpose (In Context) | A | screen reader, voice control | failure | link text such as "click here" or "read more" (advisory when the sentence around it gives the purpose) |
| `label-in-name` | 2.5.3 Label in Name | A | voice control | failure | aria-label that does not contain the visible text |
| `table-header` | 1.3.1 Info and Relationships | A | screen reader | failure | data table with no th |
| `video-captions` | 1.2.2 Captions (Prerecorded) | A | deaf or hard-of-hearing | failure | video without a captions track |
| `audio-transcript` | 1.2.1 Audio-only and Video-only (Prerecorded) | A | deaf or hard-of-hearing | failure | audio with no transcript on the page |
| `media-autoplay` | 1.4.2 Audio Control | A | screen reader | failure | media that autoplays with sound |
| `iframe-title` | 4.1.2 Name, Role, Value | A | screen reader | failure | iframe with no title |
| `nested-interactive` | 4.1.2 Name, Role, Value | A | keyboard, screen reader | failure | a control inside a control |
| `focus-trap` | 2.1.2 No Keyboard Trap | A | keyboard | failure | inline script that cancels Tab and never handles Escape |
| `duplicate-id` | 1.3.1 Info and Relationships | A | screen reader, voice control | failure | an id used twice that a label or aria attribute points to |

Notes:

- The standard is WCAG 2.2. SC 4.1.1 (Parsing) is obsolete in 2.2, so duplicate ids are reported only when a label or aria attribute points to them (SC 1.3.1).
- Heading order is a best practice under SC 1.3.1, not a strict failure, so the script marks it advisory.
- `link-purpose` is a failure when the link stands alone and an advisory when the sentence, list item or cell around it gives the purpose, because SC 2.4.4 allows purpose from context.
- `lang-parts` compares writing systems (Khmer, Thai, Arabic, Hebrew, Han, kana, Hangul, Cyrillic, Devanagari, Greek, Latin) with the page language; text with no lang in a language that shares the page's writing system (for example French on an English page) cannot be seen by the script, so it is a manual check. With no page language (a fragment, or no lang on html) the page is taken to use the writing system of most of the text, and the finding's note says so. Proper names, code and a single Latin word or two in another writing system are not reported.
- The script reads markup only. It cannot see CSS, so it never reports contrast, focus-ring style, spacing or target size.

## Who is affected

- keyboard: people who use Tab, Enter, Space and arrow keys, including switch and voice-to-keyboard users.
- screen reader: people who hear the page (NVDA, JAWS, VoiceOver, TalkBack).
- voice control: people who speak the visible label to press a control (Voice Control, Dragon).
- zoom: people who enlarge the page or the text (200% text, 400% reflow).
- deaf or hard-of-hearing: people who need captions and transcripts.

## Native HTML before ARIA

1. A native element brings name, role, state, focus and keys for free: use `button`, `a href`, `label`, `fieldset` with `legend`, `nav`, `main`, `th`, `dialog`.
2. ARIA only adds meaning; it adds no behaviour. A `div role="button"` still needs a script for Enter and Space.
3. Use ARIA where HTML has no element: live regions (`role="status"`, `role="alert"`), `aria-describedby` for error text, `aria-expanded`, `aria-current`.
4. A hidden-from-screen-reader element (`aria-hidden="true"`) must not hold anything focusable.

## What every fix looks like

- A tag or attribute change on the element, as a diff, never a rewrite of the screen.
- A name that must differ from the visible text begins with the visible text, so voice control still works (SC 2.5.3).
- Placeholders from the script (`Short description of what the image shows`, `Name of the action`, `<topic>`, `en`) are replaced from the input: the language code of the page text, a nearby heading, the id or class of an icon button.

## Manual tests (the script cannot do these)

1. Keyboard only through the whole screen: reachable, readable order, no trap (SC 2.1.1, 2.1.2, 2.4.3).
2. A screen reader on a real browser: names, roles, states and headings (SC 4.1.2, 1.3.1).
3. Voice control: say each visible label (SC 2.5.3).
4. Zoom to 200% and reflow at 400% (about 320 CSS px wide) (SC 1.4.4, 1.4.10).
5. Alt text quality (when the input has images), caption accuracy and audio description (SC 1.1.1, 1.2.2, 1.2.5).
6. Dialogs: focus in, trapped while open, Escape closes, focus returns (SC 2.1.2, 2.4.3).
7. Forms: errors announced and focus moved to the first (SC 3.3.1, 4.1.3).

## Reviewer checklist

Answer each line yes or no. Any "no" blocks the reply until it is fixed.

- [ ] Every finding has an element that is in the input, a criterion, who is affected and a diff fix.
- [ ] Every criterion number, level and status is the one the script printed.
- [ ] Every fix is a small change and uses native HTML where it does the job.
- [ ] No visible word changed.
- [ ] No finding is about contrast, focus-ring style, spacing, target size, flow or visible text.
- [ ] The reply never says the page is accessible, compliant, conformant or certified.
- [ ] "Needs a manual test" is present and "Not checked here" is not empty.
- [ ] A boundary or certificate request got its exact sentence.
- [ ] The output follows the format in layer 08.
