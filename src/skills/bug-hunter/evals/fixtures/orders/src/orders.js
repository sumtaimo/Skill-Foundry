/** Orders with status "open", oldest first. Does not change the list it is given. */
export function openOrders(orders) {
  return orders.filter((o) => o.status === 'open').sort((a, b) => a.createdAt - b.createdAt);
}

/** Average order value in cents; 0 when there are no orders. */
export function averageValue(orders) {
  const total = orders.reduce((sum, o) => sum + o.cents, 0);
  return Math.round(total / orders.length);
}

/** Marks an order as shipped and returns a new order object; the given order is not changed. */
export function ship(order, when) {
  order.status = 'shipped';
  order.shippedAt = when;
  return order;
}
