import { useState } from "react";
import { X, SlidersHorizontal, Calendar, PackageCheck, User } from "lucide-react";
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
  { value: "", label: "All Orders" },
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          Orders Management
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
          View customer orders, verify payments, and manage fulfillment workflow.
        </p>
      </div>

      {/* Filter Tabs - Horizontal Scroll on Mobile */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-none sm:pb-0 sm:flex-wrap">
        <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] pr-2 shrink-0">
          <SlidersHorizontal size={14} />
          <span>Filter:</span>
        </div>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`text-xs sm:text-sm px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors shrink-0 font-medium ${
              statusFilter === f.value
                ? "bg-[var(--color-primary)] text-white font-semibold shadow-xs"
                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-neutral-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Mobile Card List View (Visible on small screens < md) */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="p-8 text-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm">
            Loading orders...
          </div>
        ) : data?.orders.length === 0 ? (
          <div className="p-8 text-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] text-sm">
            No orders found matching this status.
          </div>
        ) : (
          data?.orders.map((o) => (
            <div
              key={o._id}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
                <div>
                  <p className="font-bold text-sm text-[var(--color-text-primary)]">
                    {o.orderNumber}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                    <Calendar size={12} />
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(o)}
                  className="px-3 py-1.5 rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold text-xs hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                >
                  Manage
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <OrderStatusBadge status={o.orderStatus} />
                  <PaymentStatusBadge status={o.paymentStatus} />
                </div>
                <div className="text-right">
                  <span className="text-xs text-[var(--color-text-muted)] block">Total</span>
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">
                    Rs {o.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Table View (Visible on md+ screens with responsive horizontal scroll backup) */}
      <div className="hidden md:block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-x-auto shadow-xs">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
            <tr>
              <th className="px-5 py-3.5">Order</th>
              <th className="px-5 py-3.5">Total</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Payment</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-[var(--color-text-secondary)]"
                >
                  Loading orders...
                </td>
              </tr>
            ) : data?.orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-[var(--color-text-muted)]"
                >
                  No orders found matching filter.
                </td>
              </tr>
            ) : (
              data?.orders.map((o) => (
                <tr
                  key={o._id}
                  className="hover:bg-neutral-50/60 transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-[var(--color-text-primary)]">
                    {o.orderNumber}
                  </td>
                  <td className="px-5 py-4 font-medium">
                    Rs {o.total.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={o.orderStatus} />
                  </td>
                  <td className="px-5 py-4">
                    <PaymentStatusBadge status={o.paymentStatus} />
                  </td>
                  <td className="px-5 py-4 text-xs text-[var(--color-text-muted)]">
                    {new Date(o.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="px-3 py-1.5 rounded-md bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold text-xs hover:bg-[var(--color-primary)] hover:text-white transition-colors"
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

      {/* Order Management Slide-Over Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full sm:w-[460px] h-full bg-[var(--color-surface)] flex flex-col shadow-2xl z-10 overflow-hidden">
            {/* Modal Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--color-border)] shrink-0 bg-neutral-900 text-white">
              <div className="flex items-center gap-2">
                <PackageCheck size={20} className="text-[var(--color-primary-light)]" />
                <h2 className="font-bold text-base tracking-tight">
                  Order {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order management drawer"
                className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <OrderStatusBadge status={selectedOrder.orderStatus} />
                <PaymentStatusBadge status={selectedOrder.paymentStatus} />
              </div>

              {/* Order Items */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-[var(--color-border)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                  Ordered Items
                </h3>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-[var(--color-text-primary)] font-medium">
                        {item.name} <span className="text-[var(--color-text-muted)] font-normal">× {item.quantity}</span>
                      </span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        Rs {(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-bold mt-3 pt-3 border-t border-[var(--color-border)] text-[var(--color-text-primary)]">
                  <span>Total Amount</span>
                  <span className="text-base text-[var(--color-primary)]">
                    Rs {selectedOrder.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-[var(--color-border)] space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2 flex items-center gap-1.5">
                  <User size={14} />
                  Delivery & Contact
                </h3>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {selectedOrder.address.area}, {selectedOrder.address.city}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Phone: {selectedOrder.address.phone}
                </p>
              </div>

              {/* Payment Verification Action */}
              {selectedOrder.paymentStatus === "pending" && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-3">
                  <p className="text-xs font-medium text-amber-800">
                    This order has pending payment verification.
                  </p>
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
                    className="w-full h-11 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-xs"
                  >
                    {verifyPayment.isPending
                      ? "Verifying..."
                      : "Mark Payment Verified"}
                  </button>
                </div>
              )}

              {/* Status Update Actions */}
              {nextStatuses.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3">
                    Fulfillment Workflow
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2">
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
                        className={`flex-1 h-11 rounded-lg text-sm font-semibold border transition-all ${
                          status === "cancelled"
                            ? "border-red-200 text-red-600 hover:bg-red-50"
                            : "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary-light)] hover:bg-[var(--color-primary)] hover:text-white"
                        }`}
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
