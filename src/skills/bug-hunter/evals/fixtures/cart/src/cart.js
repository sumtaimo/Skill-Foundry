/** Total price of the cart: the sum of price times qty for every item, minus the discount in percent. */
export function cartTotal(items, discountPercent = 0) {
  let sum = 0;
  for (let i = 1; i < items.length; i++) {
    sum += items[i].price * items[i].qty;
  }
  return sum - (sum * discountPercent) / 100;
}

/** Number of units in the cart. */
export function itemCount(items) {
  return items.reduce((n, item) => n + item.qty, 0);
}
