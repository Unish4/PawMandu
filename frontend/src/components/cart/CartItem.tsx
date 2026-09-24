import { Trash2 } from "lucide-react";
import {
  useUpdateCartItem,
  useRemoveCartItem,
  type CartItemResolved,
} from "../../hooks/useCart";

export function CartItem({ item }: { item: CartItemResolved }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const isUnavailable = item.issue === "unavailable";
  const maxQty = item.product?.stock ?? item.quantity;

  const changeQuantity = (delta: number) => {
    const next = item.quantity + delta;
    if (next < 1) return;
    if (item.product && next > item.product.stock) return; // stepper simply stops at the stock ceiling, no error needed
    updateItem.mutate({ productId: item.productId, quantity: next });
  };

  return (
    <div className="flex gap-3 py-4 border-b border-[var(--color-border)] last:border-0">
      <div className="w-16 h-16 rounded-[var(--radius-md)] bg-neutral-100 flex-shrink-0 overflow-hidden">
        {item.product?.images[0] && (
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">
          {item.product?.name ?? "Product no longer available"}
        </p>

        {isUnavailable ? (
          <p className="text-xs text-red-600 mt-1">
            No longer available — remove to continue
          </p>
        ) : (
          <>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              Rs {item.product!.price.toLocaleString("en-IN")}
            </p>
            {item.issue === "insufficient_stock" && (
              <p className="text-xs text-amber-600 mt-1">
                Only {item.product!.stock} left in stock
              </p>
            )}
            <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-sm)] w-fit mt-2">
              <button
                onClick={() => changeQuantity(-1)}
                disabled={updateItem.isPending || item.quantity <= 1}
                className="w-7 h-7 text-sm text-[var(--color-text-secondary)] disabled:opacity-30"
              >
                −
              </button>
              <span className="w-7 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => changeQuantity(1)}
                disabled={updateItem.isPending || item.quantity >= maxQty}
                className="w-7 h-7 text-sm text-[var(--color-text-secondary)] disabled:opacity-30"
              >
                +
              </button>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => removeItem.mutate(item.productId)}
        disabled={removeItem.isPending}
        className="text-[var(--color-text-muted)] hover:text-red-600 self-start"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
