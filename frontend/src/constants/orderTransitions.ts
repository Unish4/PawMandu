export const ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  placed: ["processing", "cancelled"],
  processing: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};
