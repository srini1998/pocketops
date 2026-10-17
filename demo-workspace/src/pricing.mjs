export function calculateTotal(subtotal, discountPercent = 0) {
  if (subtotal < 0 || discountPercent < 0 || discountPercent > 100) throw new RangeError('Invalid amount or discount');
  return Math.round(subtotal * (1 - discountPercent) * 100) / 100;
}
