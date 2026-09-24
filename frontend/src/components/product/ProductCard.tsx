import { Link } from "react-router";
import type { Product } from "../../hooks/useProducts";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAddToCart, useCartQuantity } from "../../hooks/useCart";

import { ProductImage } from "./ProductImage";

const SPECIES_STYLE: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  dog: {
    color: "var(--color-species-dog)",
    bg: "var(--color-species-dog-bg)",
    label: "Dog",
  },
  cat: {
    color: "var(--color-species-cat)",
    bg: "var(--color-species-cat-bg)",
    label: "Cat",
  },
  fish: {
    color: "var(--color-species-fish)",
    bg: "var(--color-species-fish-bg)",
    label: "Fish",
  },
};

export function ProductCard({ product }: { product: Product }) {
  const species = SPECIES_STYLE[product.species];
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const categoryName =
    typeof product.categoryId === "object"
      ? product.categoryId.name
      : undefined;

  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  const cartQuantity = useCartQuantity(product._id);
  const remainingStock = product.stock - cartQuantity;
  const isFullyInCart = !isOutOfStock && remainingStock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
    addToCart.mutate(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () => toast.success(`${product.name} added to cart`),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-border-strong)] hover:shadow-[0_4px_16px_rgba(28,25,23,0.06)] transition-all">
      <Link to={`/product/${product.slug}`} className="block no-underline">
        <div className="relative aspect-square bg-neutral-100">
          <ProductImage
            src={
              typeof product.images[0] === "string"
                ? product.images[0]
                : product.images[0]?.url
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <span
            className="absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: species.color, backgroundColor: species.bg }}
          >
            {species.label}
          </span>
          {isOutOfStock && (
            <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700">
              Out of stock
            </span>
          )}
          {isLowStock && (
            <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              Low stock
            </span>
          )}
        </div>
        <div className="px-3 pt-3">
          {categoryName && (
            <p className="text-xs text-[var(--color-text-muted)] mb-0.5">
              {categoryName}
            </p>
          )}
          <h3 className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-2">
            {product.name}
          </h3>
        </div>
      </Link>
      <div className="p-3 pt-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          Rs {product.price.toLocaleString("en-IN")}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isFullyInCart || addToCart.isPending}
          className="text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {isOutOfStock
            ? "Out of stock"
            : isFullyInCart
              ? "In cart"
              : addToCart.isPending
                ? "..."
                : "Add"}
        </button>
      </div>
    </div>
  );
}
