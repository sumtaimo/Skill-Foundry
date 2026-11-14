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
5. [ ] Enter a code and check the promotions service is called to check it. _Codes are checked by calling the promotions service._

### Orders
6. [ ] Place an order with a promo code and check the order record stores that code. _Orders store the code that was applied._

### Footer
7. [ ] Check the "Coupon" link no longer appears in the footer. _The old "Coupon" link in the footer is removed._

### Possible impact, not stated
- Do refunds or cancelled orders keep the promo discount? The change text does not name them.
- Do other order views, such as order history, show the stored code? The change text does not name them.

### Open questions
- What does an order store when no code was applied? The change text does not say.
- Which message appears when the promotions service cannot be reached? The change text does not say.
- Does the promo field replace the "Coupon" link, or is the link only removed? The change text does not say.
```

Why this output follows the rules: every item ends with a phrase from the input (rule 2); the numbers run 1 to 7 across four areas (rule 3); area names are the input's own (rule 4); the refund and order-history questions name areas the input does not name, so they are questions, not items (rule 6); the two unclear points are open questions, not items.

## Example: a diff with no description

Input:

```
-const MAX_ITEMS = 50;
+const MAX_ITEMS = 20;
+if (cart.items.length >= MAX_ITEMS) showMessage("Your cart is full");
```

Output:

```
## Regression checklist: cart item limit

Change: The cart limit MAX_ITEMS goes from 50 to 20, and the message "Your cart is full" shows when the limit is reached.

### cart
1. [ ] Add items until the cart holds 20 and check the limit is 20, not 50. _const MAX_ITEMS = 20;_
2. [ ] Add the 20th item and check the message "Your cart is full" appears. _showMessage("Your cart is full")_
3. [ ] Hold 19 items and check no message appears. _cart.items.length >= MAX_ITEMS_

### Possible impact, not stated
- Do carts saved before this change with more than 20 items still load? The change text does not name them.

### Open questions
- Does the cart stop accepting items at 20, or only show the message? The diff shows only the message.
- Does the diff match the intended change? No description was given.
```

One area, `cart`, because every changed line shares that name; `MAX_ITEMS` and the message are source phrases, not headings (rule 4).

## Example: a request for test code

Input: "Write Jest tests for the promo validator. Change: promo codes are checked by calling the promotions service."

Output:

```
This skill does not write test code or review code for bugs.

## Regression checklist: promo code check

Change: Promo codes are checked by calling the promotions service.

### promotions service
1. [ ] Enter a promo code and check the promotions service is called to check it. _promo codes are checked by calling the promotions service_

### Possible impact, not stated
- Does an order that uses a code show it in order history? The change text does not name it.

### Open questions
- What is shown when the promotions service cannot be reached? The change text does not say.
```
