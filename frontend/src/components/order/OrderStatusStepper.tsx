type OrderStatus = "placed" | "processing" | "delivered" | "cancelled";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "processing", label: "Processing" },
  { key: "delivered", label: "Delivered" },
];

export function OrderStatusStepper({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return (
      <div
        className="flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-[var(--radius-md)]"
        style={{
          backgroundColor: "var(--color-status-cancelled-bg)",
          color: "var(--color-status-cancelled)",
        }}
      >
        Order cancelled
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                i <= currentIndex
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-neutral-200 text-[var(--color-text-muted)]"
              }`}
            >
              {i < currentIndex ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs mt-1.5 ${i <= currentIndex ? "text-[var(--color-text-primary)] font-medium" : "text-[var(--color-text-muted)]"}`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${i < currentIndex ? "bg-[var(--color-primary)]" : "bg-neutral-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
