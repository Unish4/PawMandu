type OrderStatus = "placed" | "processing" | "delivered" | "cancelled";

const STYLES: Record<
  OrderStatus,
  { bg: string; color: string; label: string }
> = {
  placed: {
    bg: "var(--color-status-placed-bg)",
    color: "var(--color-status-placed)",
    label: "Placed",
  },
  processing: {
    bg: "var(--color-status-processing-bg)",
    color: "var(--color-status-processing)",
    label: "Processing",
  },
  delivered: {
    bg: "var(--color-status-delivered-bg)",
    color: "var(--color-status-delivered)",
    label: "Delivered",
  },
  cancelled: {
    bg: "var(--color-status-cancelled-bg)",
    color: "var(--color-status-cancelled)",
    label: "Cancelled",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const s = STYLES[status];
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}
