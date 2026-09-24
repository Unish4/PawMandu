import crypto from "crypto";

export function generateOrderNumber(): string {
  const random = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()
    .slice(0, 6);
  return `PM-${random}`;
}
