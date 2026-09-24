import { useState } from "react";
import toast from "react-hot-toast";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

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
    <div className="p-8">
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-1">
        Inventory
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Sorted lowest stock first.
      </p>

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Species</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-[var(--color-text-secondary)]"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              sorted.map((p) => (
                <tr
                  key={p._id}
                  className={`border-t border-[var(--color-border)] ${p.stock <= 5 ? "bg-amber-50/50" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)] max-w-[240px] truncate">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 capitalize">{p.species}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.stock === 0
                          ? "text-red-600 font-semibold"
                          : p.stock <= 5
                            ? "text-amber-700 font-semibold"
                            : ""
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => adjustStock(p._id, -1, p.stock)}
                        disabled={adjusting.has(p._id) || p.stock === 0}
                        className="w-7 h-7 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm disabled:opacity-30"
                      >
                        −
                      </button>
                      <button
                        onClick={() => adjustStock(p._id, 1, p.stock)}
                        disabled={adjusting.has(p._id)}
                        className="w-7 h-7 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm disabled:opacity-30"
                      >
                        +
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
