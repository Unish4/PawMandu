import { useParams, Link } from "react-router";
import { useOrder } from "../hooks/useOrder";
import { OrderStatusBadge } from "../components/order/OrderStatusBadge";
import { PaymentStatusBadge } from "../components/order/PaymentStatusBadge";
import { OrderStatusStepper } from "../components/order/OrderStatusStepper";
import qrCode from "../assets/QR.jpeg";
import { useState } from "react";
import { useCancelOrder } from "../hooks/useCancelOrder";
import { ConfirmDialog } from "../components/ConfirmDialog";
import toast from "react-hot-toast";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);

  const cancelOrder = useCancelOrder();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading)
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center text-[var(--color-text-secondary)]">
        Loading...
      </div>
    );
  if (!order)
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        Order not found.
      </div>
    );

  const handleCancel = () => {
    cancelOrder.mutate(order._id, {
      onSuccess: () => toast.success("Order cancelled"),
      onError: (err) => toast.error(err.message),
    });
    setConfirmOpen(false);
  };

  const whatsappNumber = WHATSAPP_NUMBER || "9779823532028";
  const whatsappMessage = encodeURIComponent(
    `Hi, I've paid for order ${order.orderNumber} (Rs ${order.total}). Please confirm.`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const showPaymentPanel =
    order.paymentStatus === "pending" && order.orderStatus !== "cancelled";

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            Order {order.orderNumber}
          </h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <OrderStatusBadge status={order.orderStatus} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="mb-8">
        <OrderStatusStepper status={order.orderStatus} />
      </div>

      {showPaymentPanel && (
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 mb-6">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-4">
            Complete your payment
          </h2>
          <img
            src={qrCode}
            alt="Payment QR code"
            className="w-48 h-48 mx-auto rounded-[var(--radius-lg)] object-contain border border-[var(--color-border)]"
          />
          <p className="text-center text-sm font-medium text-[var(--color-text-primary)] mb-4">
            Scan and pay Rs {order.total.toLocaleString("en-IN")}
          </p>
          <ol className="text-sm text-[var(--color-text-secondary)] space-y-1.5 mb-5 list-decimal list-inside">
            <li>Scan and pay via the QR above</li>
            <li>Screenshot your payment</li>
            <li>Send it on WhatsApp with your order number</li>
            <li>We confirm and start preparing your order</li>
          </ol>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="block w-full h-11 rounded-[var(--radius-md)] bg-[var(--color-whatsapp)] text-white text-sm font-semibold text-center leading-[44px]"
          >
            Message us on WhatsApp
          </a>
        </div>
      )}

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 mb-6">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
          Delivery details
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {order.address.label} — {order.address.area}, {order.address.city}
        </p>
        {order.address.landmark && (
          <p className="text-sm text-[var(--color-text-muted)]">
            {order.address.landmark}
          </p>
        )}
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {order.address.phone}
        </p>
        {order.deliveryInstructions && (
          <p className="text-sm text-[var(--color-text-muted)] mt-2 italic">
            "{order.deliveryInstructions}"
          </p>
        )}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
          Order summary
        </h3>
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between text-sm mb-1.5"
          >
            <span className="text-[var(--color-text-secondary)]">
              {item.name} × {item.quantity}
            </span>
            <span className="text-[var(--color-text-primary)]">
              Rs {(item.price * item.quantity).toLocaleString("en-IN")}
            </span>
          </div>
        ))}
        <div className="flex justify-between text-sm text-[var(--color-text-secondary)] pt-2 mt-2 border-t border-[var(--color-border)]">
          <span>Delivery</span>
          <span>Rs {order.deliveryFee}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold mt-1">
          <span>Total</span>
          <span>Rs {order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link
          to="/shop"
          className="text-sm font-medium text-[var(--color-primary)]"
        >
          Continue shopping
        </Link>
      </div>

      {order.orderStatus === "placed" && (
        <div className="text-center mt-4">
          <button
            onClick={() => setConfirmOpen(true)}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Cancel this order
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Cancel this order?"
        description="This can't be undone. Your items will be released back into stock."
        confirmLabel="Cancel order"
        onConfirm={handleCancel}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
