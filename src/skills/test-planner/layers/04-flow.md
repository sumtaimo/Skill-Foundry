# Layer 04: Flow

1. List every area the change text names, in the order they first appear in the change text. Fields, buttons, messages and rules belong to the area that contains them (a "promo code field" on Checkout is an item under Checkout, not a heading). Write each heading exactly as the change text writes it, including lower case.
2. For a diff, name each area from the name its changed lines share (for example `cart` in `cart.items.length`), written exactly as in the diff, lower case included. Use one area per shared name, never one area per constant, function or line. Put the identifiers in the source phrases, not in the heading. If the lines share no name, use "Change as described".
3. For each area, list each behaviour change as one short phrase, marked added, changed or removed.
4. For each behaviour change, write one item that asks for one yes or no check of the new or changed behaviour.
5. Write each item to start with a verb and to state the expected result, for example "Enter a valid promo code and check the order total drops by the code's value."
6. For each removed behaviour, write one item that checks it is gone and uses the words "no longer" (for example "Check the Coupon link no longer appears in the footer."). If the change text does not name what replaces it, also write an open question.
7. Write an item for an unchanged behaviour only when the change text states a link to the changed area (for example, "uses the same validator"). Quote that link as the source phrase.
8. End every item with a source phrase: words copied exactly from the change text or the diff, in italics. Two items may share a source phrase only when the phrase states both results; a result the phrase does not state is an open question, not a second item.
9. Place each item under the one area heading it belongs to.
10. Number the items 1 to N in one run across all areas, with no restart at each heading.
11. Move each adjacent area the change text does not name into the section "Possible impact, not stated", written as a question.
12. Write each unclear point, and each place where the change text conflicts with itself, in the section "Open questions".
13. Hand the numbered list, the impact questions and the open questions to layer 05.
