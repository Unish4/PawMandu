import { useEffect } from "react";
import { X, ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@clerk/react";
import { useUIStore } from "../../store/uiStore";
import { useCart } from "../../hooks/useCart";
import { CartItem } from "./CartItem";
import { useNavigate } from "react-router";

export function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const { isSignedIn } = useAuth();
  const { data: cart, isLoading } = useCart();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const hasUnresolvedIssues = cart?.items.some((i) => i.issue) ?? false;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <div className="relative w-full sm:w-[400px] h-full bg-[var(--color-surface)] flex flex-col shadow-[0_20px_48px_rgba(28,25,23,0.16)]">
        <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Your cart
          </h2>
          <button
            onClick={closeCart}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {!isSignedIn ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart
                size={32}
                className="text-[var(--color-text-muted)] mb-3"
              />
              <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Sign in to view your cart
              </p>
              <Link
                to="/sign-in"
                onClick={closeCart}
                className="text-sm text-[var(--color-primary)] font-medium"
              >
                Sign in
              </Link>
            </div>
          ) : isLoading ? (
            <p className="py-8 text-sm text-[var(--color-text-secondary)]">
              Loading...
            </p>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart
                size={32}
                className="text-[var(--color-text-muted)] mb-3"
              />
              <p className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Your cart is empty
              </p>
              <Link
                to="/shop"
                onClick={closeCart}
                className="text-sm text-[var(--color-primary)] font-medium"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            cart.items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))
          )}
        </div>

        {isSignedIn && cart && cart.items.length > 0 && (
          <div className="border-t border-[var(--color-border)] px-5 py-4 space-y-2">
            {hasUnresolvedIssues && (
              <p className="text-xs text-amber-600 mb-1">
                Some items changed since you added them — review before
                checkout.
              </p>
            )}
            <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
              <span>Subtotal</span>
              <span>Rs {cart.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
              <span>Delivery</span>
              <span>Rs {cart.deliveryFee}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-[var(--color-text-primary)] pt-2 border-t border-[var(--color-border)]">
              <span>Total</span>
              <span>Rs {cart.total.toLocaleString("en-IN")}</span>
            </div>
            <button
              disabled={hasUnresolvedIssues}
              onClick={() => {
                closeCart();
                navigate("/checkout");
              }}
              className="w-full h-11 mt-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Proceed to checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
