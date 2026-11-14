# Examples

## Example: promo codes at checkout

Input (the change description, as a QA lead might paste it):

> Change: Checkout now has a promo code field on the cart review step. Codes are checked by calling the promotions service. A valid code lowers the order total before tax. An invalid code shows "This code is not valid." Orders store the code that was applied. The old "Coupon" link in the footer is removed.

Output:

```
## Regression checklist: promo codes at checkout

Change: Checkout adds a promo code field on the cart review step, which the promotions service checks, and orders store the code that was applied.

### Checkout
1. [ ] Enter a valid promo code on the cart review step and check the order total drops by the code's value before tax. _A valid code lowers the order total before tax._
2. [ ] Enter an invalid promo code and check the message "This code is not valid." appears and the total does not change. _An invalid code shows "This code is not valid."_
3. [ ] Check the promo code field appears on the cart review step. _promo code field on the cart review step_
4. [ ] Check tax is calculated on the total after the promo discount. _lowers the order total before tax_

### Promotions service
5. [ ] Check a valid code is accepted when the promotions service is called. _Codes are checked by calling the promotions service._
6. [ ] Check an invalid code is rejected when the promotions service is called. _Codes are checked by calling the promotions service._

### Orders
7. [ ] Place an order with a promo code and check the order record stores that code. _Orders store the code that was applied._
8. [ ] Place an order without a promo code and check the order record stores no code. _Orders store the code that was applied._

### Footer
9. [ ] Check the "Coupon" link no longer appears in the footer. _The old "Coupon" link in the footer is removed._

### Possible impact, not stated
- Do refunds or cancelled orders keep the promo discount? The change text does not name them.
- Do other order views, such as order history, show the stored code? The change text does not name them.

### Open questions
- Which message appears when the promotions service cannot be reached? The change text does not say.
- Does the promo field replace the "Coupon" link, or is the link only removed? The change text does not say.
```

Why this output follows the rules: every item ends with a phrase from the input (rule 2); the numbers run 1 to 9 across four areas (rule 3); area names are the input's own (rule 4); the refund and order-history questions name areas the input does not name, so they are questions, not items (rule 6); the two unclear points are open questions, not items.

## Example: a diff with no description

Input: a diff that changes `MAX_ITEMS` from 50 to 20 in a cart module, and adds a message "Your cart is full" when the limit is reached.

Output: one area, "Cart", with items that quote the constant's name and the message text as source phrases. An open question asks whether the limit is meant to apply to saved carts as well, since the diff does not say.
