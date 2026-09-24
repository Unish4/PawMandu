import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks/useAdminProducts";
import { useCategories } from "../../hooks/useCategories";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import type { Product } from "../../hooks/useProducts";

const SPECIES_OPTIONS = ["dog", "cat", "fish"] as const;

function ProductFormModal({
  open,
  onClose,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  existing?: Product;
}) {
  const [species, setSpecies] = useState<string>(
    typeof existing?.species === "string" ? existing.species : "dog",
  );
  const [name, setName] = useState(existing?.name ?? "");
  const [categoryId, setCategoryId] = useState(
    typeof existing?.categoryId === "object"
      ? existing.categoryId._id
      : typeof existing?.categoryId === "string"
        ? existing.categoryId
        : "",
  );
  const [price, setPrice] = useState(existing?.price?.toString() ?? "");
  const [stock, setStock] = useState(existing?.stock?.toString() ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [imageUrl, setImageUrl] = useState(existing?.images[0] ?? "");
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);

  const { data: categories } = useCategories(species);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isPending = createProduct.isPending || updateProduct.isPending;

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      species,
      categoryId,
      price: Number(price),
      stock: Number(stock),
      description: description || undefined,
      images: imageUrl ? [imageUrl] : [],
      isActive,
    };
    const mutation = existing
      ? updateProduct.mutateAsync({ id: existing._id, data: payload })
      : createProduct.mutateAsync(payload);
    mutation
      .then(() => {
        toast.success(existing ? "Product updated" : "Product created");
        onClose();
      })
      .catch((err: Error) => toast.error(err.message));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_20px_48px_rgba(28,25,23,0.16)] max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          {existing ? "Edit product" : "Add product"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Species
            </label>
            <select
              value={species}
              onChange={(e) => {
                setSpecies(e.target.value);
                setCategoryId("");
              }}
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            >
              {SPECIES_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                Price (Rs)
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                Stock
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Image URL
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Real upload arrives in Phase 14 — paste a hosted image URL for
              now.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded accent-[var(--color-primary)]"
            />
            Active (visible in shop)
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-[var(--radius-md)] disabled:opacity-40"
            >
              {isPending ? "Saving..." : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const { data: products, isLoading } = useAdminProducts();
  const deleteProduct = useDeleteProduct();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateProduct = useUpdateProduct();

  const toggleActive = (p: Product) => {
    updateProduct.mutate(
      { id: p._id, data: { isActive: !p.isActive } },
      {
        onSuccess: () =>
          toast.success(
            p.isActive ? "Product deactivated" : "Product activated",
          ),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    deleteProduct.mutate(deletingId, {
      onSuccess: () => toast.success("Product deleted"),
      onError: (err) => toast.error(err.message),
    });
    setDeletingId(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
          Products
        </h1>
        <button
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white"
        >
          <Plus size={16} /> Add product
        </button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Species</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
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
            ) : (
              products?.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)] max-w-[240px] truncate">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 capitalize">{p.species}</td>
                  <td className="px-4 py-3">
                    Rs {p.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.isActive ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]" : "bg-neutral-100 text-[var(--color-text-muted)]"}`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(p)}
                        disabled={updateProduct.isPending}
                        title={p.isActive ? "Deactivate" : "Activate"}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] disabled:opacity-40"
                      >
                        {p.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(p);
                          setFormOpen(true);
                        }}
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeletingId(p._id)}
                        className="text-[var(--color-text-secondary)] hover:text-red-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <ProductFormModal
          key={editing?._id ?? "new"}
          open
          onClose={() => setFormOpen(false)}
          existing={editing}
        />
      )}
      <ConfirmDialog
        open={!!deletingId}
        title="Delete this product?"
        description="This removes it permanently and can't be undone. If you just want to hide it from the shop, use the deactivate toggle instead."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
