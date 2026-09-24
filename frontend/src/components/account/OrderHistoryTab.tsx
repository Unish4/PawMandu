import { useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useOrders } from "../../hooks/useOrders";
import { useAddToCart } from "../../hooks/useCart";
import type { Order } from "../../hooks/useOrder";
import { OrderStatusBadge } from "../order/OrderStatusBadge";
import { PaymentStatusBadge } from "../order/PaymentStatusBadge";
import { EmptyState } from "../EmptyState";

const FILTERS = [
  { value: "", label: "All" },
  { value: "placed", label: "Placed" },
  { value: "processing", label: "Processing" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderHistoryTab() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, refetch } = useOrders(
    filter || undefined,
    page,
  );
  const addToCart = useAddToCart();

  const handleReorder = async (order: Order) => {
    let added = 0;
    let unavailable = 0;
    let failed = 0;

    for (const item of order.items) {
      try {
        await addToCart.mutateAsync({
          productId: item.productId,
          quantity: item.quantity,
        });
        added++;
      } catch (err: unknown) {
        const errorObj = err as {
          status?: number;
          response?: { status?: number };
          message?: string;
        };
        const status = errorObj?.status ?? errorObj?.response?.status;
        const msg = (errorObj?.message || "").toLowerCase();
        const isUnavailable =
          status === 404 ||
          status === 400 ||
          msg.includes("not found") ||
          msg.includes("stock") ||
          msg.includes("unavailable");

        if (isUnavailable) {
          unavailable++;
        } else {
          failed++;
        }
      }
    }

    if (added > 0) {
      const label = added > 1 ? "items" : "item";
      toast.success(`${added} ${label} added to cart`);
    }
    if (unavailable > 0) {
      const label = unavailable > 1 ? "items" : "item";
      toast.error(
        `${unavailable} ${label} could not be added - no longer available`,
      );
    }
    if (failed > 0) {
      const label = failed > 1 ? "items" : "item";
      toast.error(
        `Failed to add ${failed} ${label} due to network or server error. Please try again.`,
      );
    }
  };

  return (
    <div>
      <div className="flex gap-1.5 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={`text-sm px-3 py-1.5 rounded-[var(--radius-sm)] ${
              filter === f.value
                ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                : "text-[var(--color-text-secondary)] hover:bg-neutral-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Loading orders...
        </p>
      ) : isError ? (
        <EmptyState
          title="Could not load orders"
          description={error.message || "Please try again."}
          action={
            <button
              onClick={() => refetch()}
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              Retry
            </button>
          }
        />
      ) : !data || data.orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Your order history will show up here."
          action={
            <Link
              to="/shop"
              className="text-sm font-semibold text-[var(--color-primary)]"
            >
              Start shopping
            </Link>
          }
        />
      ) : (
        <div>
          <div className="space-y-3">
            {data.orders.map((order) => (
              <div
                key={order._id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <OrderStatusBadge status={order.orderStatus} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                  {order.orderNumber} · {order.items.length} item
                  {order.items.length > 1 ? "s" : ""} ·{" "}
                  {order.items
                    .slice(0, 2)
                    .map((i) => i.name)
                    .join(", ")}
                  {order.items.length > 2
                    ? ` +${order.items.length - 2} more`
                    : ""}
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                  Rs {order.total.toLocaleString("en-IN")}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleReorder(order)}
                    className="text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                  >
                    Reorder
                  </button>
                </div>
              </div>
            ))}
          </div>

          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--color-border)]">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-[var(--color-text-secondary)]">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(data.pagination.totalPages, p + 1))
                }
                disabled={page >= data.pagination.totalPages}
                className="text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
