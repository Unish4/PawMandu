import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "../components/product/ProductCard";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";
import { useAddToCart, useCartQuantity } from "../hooks/useCart";

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

export default function ProductPage() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const [quantity, setQuantity] = useState(1);
  const cartQuantity = useCartQuantity(product?._id ?? "");

  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const addToCart = useAddToCart();

  const [quantitySlug, setQuantitySlug] = useState(slug);
  if (slug !== quantitySlug) {
    setQuantitySlug(slug);
    setQuantity(1);
  }

  const remainingStock = product ? product.stock - cartQuantity : 0;
  const [prevRemainingStock, setPrevRemainingStock] = useState(remainingStock);
  if (remainingStock !== prevRemainingStock) {
    setPrevRemainingStock(remainingStock);
    if (quantity > remainingStock && remainingStock > 0) {
      setQuantity(remainingStock);
    }
  }

  const categoryId =
    typeof product?.categoryId === "object"
      ? product.categoryId._id
      : undefined;
  const categoryName =
    typeof product?.categoryId === "object"
      ? product.categoryId.name
      : undefined;
  const { data: related } = useProducts(
    { category: categoryId, limit: 4 },
    { enabled: !!categoryId },
  );

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-[var(--color-text-secondary)]">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          Product not found
        </h1>
        <Link
          to="/shop"
          className="text-[var(--color-primary)] text-sm font-medium"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const species = SPECIES_STYLE[product.species];
  const isOutOfStock = product.stock === 0;
  const relatedProducts =
    related?.products.filter((p) => p._id !== product._id) ?? [];

  const handleAddToCart = () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
    addToCart.mutate(
      { productId: product._id, quantity },
      {
        onSuccess: () => toast.success(`${product.name} added to cart`),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        <div className="aspect-square rounded-[var(--radius-lg)] bg-neutral-100 overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm">
              No image available
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ color: species.color, backgroundColor: species.bg }}
            >
              {species.label}
            </span>
            {categoryName && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-[var(--color-text-secondary)]">
                {categoryName}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
            {product.name}
          </h1>
          <p className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
            Rs {product.price.toLocaleString("en-IN")}
          </p>

          {isOutOfStock ? (
            <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-red-50 text-red-700 mb-4">
              Out of stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="inline-block text-sm font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 mb-4">
              Only {product.stock} left
            </span>
          ) : null}

          {product.description && (
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              {product.description}
            </p>
          )}

          {!isOutOfStock && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-[var(--color-border)] rounded-[var(--radius-md)]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 text-[var(--color-text-secondary)]"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(remainingStock, q + 1))
                  }
                  disabled={quantity >= remainingStock}
                  className="w-9 h-9 text-[var(--color-text-secondary)] disabled:opacity-30"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addToCart.isPending || remainingStock <= 0}
                className="flex-1 h-11 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-sm font-semibold disabled:opacity-50"
              >
                {addToCart.isPending ? "Adding..." : "Add to cart"}
              </button>
            </div>
          )}

          <p className="text-xs text-[var(--color-text-muted)]">
            Flat Rs 100 delivery, Kathmandu Valley only — questions? Message us
            on WhatsApp.
          </p>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            You might also like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
