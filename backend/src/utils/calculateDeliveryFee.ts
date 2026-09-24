export function calculateDeliveryFee(subtotal: number): number {
  return subtotal > 0 ? 100 : 0;
}