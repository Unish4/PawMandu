import { useState } from "react";
import { useNavigate, Link } from "react-router";
import toast from "react-hot-toast";
import { useAddresses } from "../hooks/useAddresses";
import { useCart } from "../hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";
import { AddressFormModal } from "../components/account/AddressFormModal";
import axios from "axios";
import { ErrorState } from "../components/ErrorState";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: addresses, isLoading: addressesLoading } = useAddresses();
  const {
    data: cart,
    isLoading: cartLoading,
    isError: cartError,
    refetch: refetchCart,
  } = useCart();
  const checkout = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [instructions, setInstructions] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const defaultAddressId =
    addresses && addresses.length > 0
      ? (addresses.find((a) => a.isDefault) ?? addresses[0])._id
      : "";

  const activeAddressId =
    selectedAddressId && addresses?.some((a) => a._id === selectedAddressId)
      ? selectedAddressId
      : defaultAddressId;

  const hasUnresolvedIssues = cart?.items.some((i) => i.issue) ?? false;

  const handlePlaceOrder = () => {
    if (!activeAddressId) {
      toast.error("Select a delivery address");
      return;
    }
    checkout.mutate(
      {
        addressId: activeAddressId,
        deliveryInstructions: instructions || undefined,
      },
      {
        onSuccess: (order) => navigate(`/orders/${order._id}`),
        onError: (err) =>
          toast.error(
            (axios.isAxiosError(err) && err.response?.data?.message) ||
              err.message,
          ),
      },
    );
  };

  if (cartLoading || addressesLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <ErrorState onRetry={() => refetchCart()} />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Your cart is empty
        </h1>
        <Link
          to="/shop"
          className="text-[var(--color-primary)] text-sm font-medium"
        >
          Go shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-[1fr_360px] gap-8">
      <div className="space-y-6">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-3">
            Delivery address
          </h2>
          {addresses && addresses.length > 0 ? (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`flex items-start gap-3 p-3 rounded-[var(--radius-md)] border cursor-pointer ${
                    activeAddressId === addr._id
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-light)]"
                      : "border-[var(--color-border)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={activeAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                    className="mt-1 accent-[var(--color-primary)]"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {addr.label}
                    </span>
                    <p className="text-[var(--color-text-secondary)]">
                      {addr.area}, {addr.city}
                      {addr.landmark && ` — ${addr.landmark}`}
                    </p>
                    <p className="text-[var(--color-text-muted)]">
                      {addr.phone}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)] mb-3">
              No saved addresses yet.
            </p>
          )}
          <button
            onClick={() => setAddressModalOpen(true)}
            className="text-sm font-medium text-[var(--color-primary)] mt-3"
          >
            + Add new address
          </button>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-3">
            Delivery instructions (optional)
          </h2>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Leave at the gate"
            rows={3}
            className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
          />
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
          <h2 className="font-semibold text-[var(--color-text-primary)] mb-3">
            Order items
          </h2>
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-[var(--color-text-secondary)]">
                  {item.product?.name ?? "Unavailable"} × {item.quantity}
                </span>
                <span className="text-[var(--color-text-primary)]">
                  {item.product
                    ? `Rs ${(item.product.price * item.quantity).toLocaleString("en-IN")}`
                    : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-fit rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 sticky top-20">
        <h2 className="font-semibold text-[var(--color-text-primary)] mb-3">
          Order summary
        </h2>
        {hasUnresolvedIssues && (
          <p className="text-xs text-red-600 mb-3">
            Some items in your cart need attention before you can check out.
          </p>
        )}
        <div className="space-y-1.5 text-sm mb-4">
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Subtotal</span>
            <span>Rs {cart.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Delivery</span>
            <span>Rs {cart.deliveryFee}</span>
          </div>
          <div className="flex justify-between font-semibold text-[var(--color-text-primary)] pt-2 border-t border-[var(--color-border)]">
            <span>Total</span>
            <span>Rs {cart.total.toLocaleString("en-IN")}</span>
          </div>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={
            hasUnresolvedIssues || checkout.isPending || !activeAddressId
          }
          className="w-full h-11 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-sm font-semibold disabled:opacity-40"
        >
          {checkout.isPending ? "Placing order..." : "Place order"}
        </button>
      </div>

      <AddressFormModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
      />
    </div>
  );
}
