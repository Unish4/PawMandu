type PaymentStatus = "pending" | "verified";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const isVerified = status === "verified";
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isVerified
          ? "var(--color-status-delivered-bg)"
          : "var(--color-status-processing-bg)",
        color: isVerified
          ? "var(--color-status-delivered)"
          : "var(--color-status-processing)",
      }}
    >
      {isVerified ? "Payment verified" : "Pending confirmation"}
    </span>
  );
}
