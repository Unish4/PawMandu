import { useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Package } from "lucide-react";
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
import {
  useDeleteImage,
  type UploadedImage,
} from "../../hooks/useUploadImage";
import { ImageUploadField } from "../../components/admin/ImageUploadField";
import { useEscapeKey } from "../../hooks/useEscapeKey";

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

  const [image, setImage] = useState<UploadedImage | null>(
    existing?.images[0] ?? null,
  );
  const originalPublicId = existing?.images[0]?.publicId ?? null;
  const deleteImage = useDeleteImage();

  const [isActive, setIsActive] = useState(existing?.isActive ?? true);

  const { data: categories } = useCategories(species);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isPending = createProduct.isPending || updateProduct.isPending;

  const handleCancel = useCallback(() => {
    if (image && image.publicId !== originalPublicId) {
      deleteImage.mutate(image.publicId);
    }
    onClose();
  }, [image, originalPublicId, deleteImage, onClose]);

  useEscapeKey(handleCancel, open);

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
      images: image ? [image] : [],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--color-surface)] p-4 sm:p-6 shadow-2xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-[var(--color-primary)]" />
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
              {existing ? "Edit product" : "Add new product"}
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 rounded-lg text-[var(--color-text-secondary)] hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
              Product Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Premium Dog Kibble"
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Species
              </label>
              <select
                value={species}
                onChange={(e) => {
                  setSpecies(e.target.value);
                  setCategoryId("");
                }}
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
              >
                {SPECIES_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
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
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Price (Rs)
              </label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="0"
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min={0}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                placeholder="0"
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Product details, specs, ingredient notes..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
              Product Image
            </label>
            <ImageUploadField
              value={image}
              onChange={setImage}
              originalPublicId={originalPublicId}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded accent-[var(--color-primary)]"
            />
            <span className="font-medium text-xs sm:text-sm">Active in store (visible to customers)</span>
          </label>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-lg disabled:opacity-50 transition-colors shadow-xs"
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            Products Directory
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Manage your catalog items, pricing, inventory stock, and visibility.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white transition-colors shadow-xs shrink-0"
        >
          <Plus size={18} /> Add new product
        </button>
      </div>

      {/* Mobile Card View (< md screens) */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="p-8 text-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm">
            Loading catalog...
          </div>
        ) : products?.length === 0 ? (
          <div className="p-8 text-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] text-sm">
            No products created yet.
          </div>
        ) : (
          products?.map((p) => (
            <div
              key={p._id}
              className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-[var(--color-text-primary)] line-clamp-1">
                    {p.name}
                  </h3>
                  <span className="text-xs capitalize font-medium text-[var(--color-text-muted)]">
                    {p.species} category
                  </span>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                    p.isActive
                      ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                      : "bg-neutral-100 text-[var(--color-text-muted)]"
                  }`}
                >
                  {p.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-2.5 text-sm">
                <div>
                  <span className="text-xs text-[var(--color-text-muted)] block">Price & Stock</span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    Rs {p.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)] ml-2">
                    ({p.stock} in stock)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleActive(p)}
                    disabled={updateProduct.isPending}
                    title={p.isActive ? "Deactivate" : "Activate"}
                    className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-neutral-100 hover:text-[var(--color-primary)] disabled:opacity-40"
                  >
                    {p.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(p);
                      setFormOpen(true);
                    }}
                    className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-neutral-100 hover:text-[var(--color-primary)]"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeletingId(p._id)}
                    className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View (md+ screens) */}
      <div className="hidden md:block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-x-auto shadow-xs">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
            <tr>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-5 py-3.5">Species</th>
              <th className="px-5 py-3.5">Price</th>
              <th className="px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-[var(--color-text-secondary)]"
                >
                  Loading product catalog...
                </td>
              </tr>
            ) : (
              products?.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-neutral-50/60 transition-colors"
                >
                  <td className="px-5 py-4 font-semibold text-[var(--color-text-primary)] max-w-[260px] truncate">
                    {p.name}
                  </td>
                  <td className="px-5 py-4 capitalize font-medium">{p.species}</td>
                  <td className="px-5 py-4 font-medium">
                    Rs {p.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-4">{p.stock}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        p.isActive
                          ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                          : "bg-neutral-100 text-[var(--color-text-muted)]"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(p)}
                        disabled={updateProduct.isPending}
                        title={p.isActive ? "Deactivate" : "Activate"}
                        className="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-neutral-100 hover:text-[var(--color-primary)] disabled:opacity-40"
                      >
                        {p.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditing(p);
                          setFormOpen(true);
                        }}
                        title="Edit product"
                        className="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-neutral-100 hover:text-[var(--color-primary)]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingId(p._id)}
                        title="Delete product"
                        className="p-1.5 rounded-md text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
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
        title="Delete product permanently?"
        description="This removes it permanently from storage and catalog records. If you just want to hide it from customers, deactivate it instead."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
