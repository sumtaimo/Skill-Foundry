# References

## Writing one check item

- Start with a verb. State the action and the expected result, so the answer is yes or no.
- Good: "Remove the applied promo code and check the order total returns to the price before the code."
- Weak: "Test promo codes." It has no action, no expected result and no source phrase.
- One item checks one behaviour. If a sentence holds two behaviours, write two items.

## Area names

- Use the names the change text uses: the screen, feature or service it names, written exactly as it writes them. A field, button or message is an item inside its area, not a heading.
- Use "Change as described" only when the change text names no area, and add an open question asking for one.
- For a diff, use the name the changed lines share, as written (for example `cart`), not each constant or function.
- Do not create an area the change text does not name. Adjacent areas go under "Possible impact, not stated".

## Source phrases

- Copy the words from the change text exactly. Do not paraphrase them.
- For a diff, the source phrase may be a file, function, route or visible label from the changed lines.
- A user's own note counts as a source only when the user wrote it in the message.

## Diff input

- Read the changed lines, not the whole file.
- Prefer the labels users see over internal identifiers in the checklist wording; keep the identifier in the source phrase.

## Reviewer checklist

Answer each line yes or no. Any "no" blocks the reply until it is fixed.

- [ ] Every item is a yes or no check of one behaviour.
- [ ] Every item ends with a source phrase that appears in the change text.
- [ ] Every area heading is a name the change text uses.
- [ ] No item is about an area the change text does not name.
- [ ] Every unclear point is under "Open questions", not in an item.
- [ ] The numbers run 1 to N with no gap or restart.
- [ ] No two items share a source phrase unless it states both results.
- [ ] The output has no code, script or test data.
- [ ] Every item about removed behaviour says "no longer".
- [ ] A test-code or bug-review request got the exact decline sentence and no code.
- [ ] For a diff, area headings are the shared name, not a constant or function name.
- [ ] The output follows the format in layer 08.
