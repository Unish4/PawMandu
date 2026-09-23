import { Link } from "react-router";
import type { Product } from "../../hooks/useProducts";

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

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-border-strong)] hover:shadow-[0_4px_16px_rgba(28,25,23,0.06)] transition-all">
      <Link to={`/product/${product.slug}`} className="block no-underline">
        <div className="relative aspect-square bg-neutral-100">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-xs">
              No image
            </div>
          )}
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
          disabled={isOutOfStock}
          className="text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  );
}
