import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAdminOrders,
  useVerifyPayment,
  useUpdateOrderStatus,
} from "../../hooks/useAdminOrders";
import { OrderStatusBadge } from "../../components/order/OrderStatusBadge";
import { PaymentStatusBadge } from "../../components/order/PaymentStatusBadge";
import { ORDER_STATUS_TRANSITIONS } from "../../constants/orderTransitions";
import type { Order } from "../../hooks/useOrder";

const FILTERS = [
  { value: "", label: "All" },
  { value: "placed", label: "Placed" },
  { value: "processing", label: "Processing" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data, isLoading } = useAdminOrders({
    orderStatus: statusFilter || undefined,
    limit: 50,
  });
  const verifyPayment = useVerifyPayment();
  const updateStatus = useUpdateOrderStatus();

  const nextStatuses = selectedOrder
    ? (ORDER_STATUS_TRANSITIONS[selectedOrder.orderStatus] ?? [])
    : [];

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
        Orders
      </h1>

      <div className="flex gap-1.5 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`text-sm px-3 py-1.5 rounded-[var(--radius-sm)] ${statusFilter === f.value ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold" : "text-[var(--color-text-secondary)] hover:bg-neutral-100"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-[var(--color-text-secondary)]"
                >
                  Loading...
                </td>
              </tr>
            ) : data?.orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-[var(--color-text-secondary)]"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              data?.orders.map((o) => (
                <tr
                  key={o._id}
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                    {o.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    Rs {o.total.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.orderStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentStatusBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)]">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="text-xs font-medium text-[var(--color-primary)]"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full sm:w-[420px] h-full bg-[var(--color-surface)] flex flex-col">
            <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--color-border)]">
              <h2 className="font-semibold text-[var(--color-text-primary)]">
                {selectedOrder.orderNumber}
              </h2>
              <button onClick={() => setSelectedOrder(null)}>
                <X size={20} className="text-[var(--color-text-secondary)]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="flex gap-2">
                <OrderStatusBadge status={selectedOrder.orderStatus} />
                <PaymentStatusBadge status={selectedOrder.paymentStatus} />
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">
                  Items
                </h3>
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span className="text-[var(--color-text-secondary)]">
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      Rs {(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-[var(--color-border)]">
                  <span>Total</span>
                  <span>Rs {selectedOrder.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">
                  Delivery
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {selectedOrder.address.area}, {selectedOrder.address.city}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {selectedOrder.address.phone}
                </p>
              </div>

              {selectedOrder.paymentStatus === "pending" && (
                <button
                  onClick={() =>
                    verifyPayment.mutate(selectedOrder._id, {
                      onSuccess: (order) => {
                        setSelectedOrder(order);
                        toast.success("Payment marked as verified");
                      },
                      onError: (err) => toast.error(err.message),
                    })
                  }
                  disabled={verifyPayment.isPending}
                  className="w-full h-11 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-sm font-semibold disabled:opacity-50"
                >
                  {verifyPayment.isPending
                    ? "Verifying..."
                    : "Mark payment verified"}
                </button>
              )}

              {nextStatuses.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">
                    Update status
                  </h3>
                  <div className="flex gap-2">
                    {nextStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateStatus.mutate(
                            { orderId: selectedOrder._id, orderStatus: status },
                            {
                              onSuccess: (order) => {
                                setSelectedOrder(order);
                                toast.success(`Order moved to ${status}`);
                              },
                              onError: (err) => toast.error(err.message),
                            },
                          )
                        }
                        disabled={updateStatus.isPending}
                        className={`flex-1 h-10 rounded-[var(--radius-md)] text-sm font-semibold border ${status === "cancelled" ? "border-red-200 text-red-600 hover:bg-red-50" : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-neutral-50"}`}
                      >
                        Move to {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
