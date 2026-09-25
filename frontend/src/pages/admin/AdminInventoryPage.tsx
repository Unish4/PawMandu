import { useState } from "react";
import toast from "react-hot-toast";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { Boxes, Plus, Minus } from "lucide-react";

export default function AdminInventoryPage() {
  const { data: products, isLoading } = useAdminProducts();
  const [adjusting, setAdjusting] = useState<Set<string>>(new Set());

  const sorted = [...(products ?? [])].sort((a, b) => a.stock - b.stock);

  const queryClient = useQueryClient();
  const adjustStock = async (
    id: string,
    delta: number,
    currentStock: number,
  ) => {
    const nextStock = currentStock + delta;
    if (nextStock < 0) return;
    setAdjusting((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    try {
      await api.patch(`/admin/products/${id}/stock`, { delta });
      await queryClient.refetchQueries({ queryKey: ["admin-products"] });
      toast.success("Stock updated");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setAdjusting((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <Boxes size={24} className="text-[var(--color-primary)]" />
          Inventory Control
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
          Adjust product stock quantities in real time (sorted lowest stock first).
        </p>
      </div>

      {/* Mobile Card List View (< sm screens) */}
      <div className="block sm:hidden space-y-3">
        {isLoading ? (
          <div className="p-8 text-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm">
            Loading inventory items...
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-8 text-center bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] text-sm">
            No products found in inventory.
          </div>
        ) : (
          sorted.map((p) => (
            <div
              key={p._id}
              className={`p-4 rounded-xl border shadow-xs flex items-center justify-between gap-3 ${
                p.stock <= 5
                  ? "bg-amber-50/60 border-amber-200"
                  : "bg-[var(--color-surface)] border-[var(--color-border)]"
              }`}
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-[var(--color-text-primary)] line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] capitalize mt-0.5">
                  {p.species}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                    p.stock === 0
                      ? "bg-red-100 text-red-700"
                      : p.stock <= 5
                        ? "bg-amber-100 text-amber-800"
                        : "bg-neutral-100 text-[var(--color-text-primary)]"
                  }`}
                >
                  {p.stock}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => adjustStock(p._id, -1, p.stock)}
                    disabled={adjusting.has(p._id) || p.stock === 0}
                    aria-label="Decrease stock"
                    className="w-8 h-8 rounded-lg border border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-bold text-[var(--color-text-primary)] hover:bg-neutral-100 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => adjustStock(p._id, 1, p.stock)}
                    disabled={adjusting.has(p._id)}
                    aria-label="Increase stock"
                    className="w-8 h-8 rounded-lg border border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-bold text-[var(--color-text-primary)] hover:bg-neutral-100 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop & Tablet Table View (sm+ screens) */}
      <div className="hidden sm:block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-x-auto shadow-xs">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 border-b border-[var(--color-border)] text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
            <tr>
              <th className="px-5 py-3.5">Product Name</th>
              <th className="px-5 py-3.5">Species</th>
              <th className="px-5 py-3.5">Current Stock</th>
              <th className="px-5 py-3.5 text-right">Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-[var(--color-text-secondary)]"
                >
                  Loading inventory stock...
                </td>
              </tr>
            ) : sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-8 text-center text-[var(--color-text-muted)]"
                >
                  No products in inventory.
                </td>
              </tr>
            ) : (
              sorted.map((p) => (
                <tr
                  key={p._id}
                  className={`transition-colors ${
                    p.stock <= 5 ? "bg-amber-50/50 hover:bg-amber-50" : "hover:bg-neutral-50/60"
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-[var(--color-text-primary)] max-w-[280px] truncate">
                    {p.name}
                  </td>
                  <td className="px-5 py-4 capitalize font-medium">{p.species}</td>
                  <td className="px-5 py-4 font-bold">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                        p.stock === 0
                          ? "bg-red-100 text-red-700 font-bold"
                          : p.stock <= 5
                            ? "bg-amber-100 text-amber-800 font-bold"
                            : "text-[var(--color-text-primary)]"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => adjustStock(p._id, -1, p.stock)}
                        disabled={adjusting.has(p._id) || p.stock === 0}
                        aria-label="Decrease stock"
                        className="w-8 h-8 rounded-lg border border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-bold hover:bg-neutral-100 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        onClick={() => adjustStock(p._id, 1, p.stock)}
                        disabled={adjusting.has(p._id)}
                        aria-label="Increase stock"
                        className="w-8 h-8 rounded-lg border border-[var(--color-border)] bg-white flex items-center justify-center text-sm font-bold hover:bg-neutral-100 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
