import { useParams, Link } from "react-router";
import { useOrder } from "../hooks/useOrder";
import qrCode from "../assets/QR.jpeg";

const WHATSAPP_NUMBER = "9779823535028";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);

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

  const whatsappMessage = encodeURIComponent(
    `Hi, I've paid for order ${order.orderNumber} (Rs ${order.total}). Please confirm.`,
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] text-2xl">
          ✓
        </div>
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
          Order placed!
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Order {order.orderNumber}
        </p>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[var(--color-text-primary)]">
            Complete your payment
          </h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
            {order.paymentStatus === "pending"
              ? "Pending confirmation"
              : "Verified"}
          </span>
        </div>

        {order.paymentStatus === "pending" && (
          <>
            <div className="w-48 h-48 mx-auto mb-4 rounded-[var(--radius-lg)] bg-neutral-100 flex items-center justify-center text-xs text-[var(--color-text-muted)]">
              <img
                src={qrCode}
                alt="Payment QR code"
                className="w-48 h-48 mx-auto rounded-[var(--radius-lg)] object-contain border border-[var(--color-border)]"
              />
            </div>
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
          </>
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
        <div className="flex justify-between text-sm font-semibold pt-2 mt-2 border-t border-[var(--color-border)]">
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
    </div>
  );
}
