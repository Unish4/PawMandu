import { Link } from "react-router";
import { ClipboardList, Wallet, AlertCircle, PackageX } from "lucide-react";
import { useAdminDashboardStats } from "../../hooks/useAdminDashboard";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { OrderStatusBadge } from "../../components/order/OrderStatusBadge";
import { PaymentStatusBadge } from "../../components/order/PaymentStatusBadge";

export default function AdminDashboardPage() {
  const { data: stats } = useAdminDashboardStats();
  const { data: recentOrders } = useAdminOrders({ limit: 5 });
  const {
    data: allProducts,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
  } = useAdminProducts();

  const lowStockProducts = (allProducts ?? [])
    .filter((p) => p.isActive && p.stock >= 0 && p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const cards = [
    {
      label: "Orders today",
      value: stats?.ordersToday ?? "—",
      Icon: ClipboardList,
      accent: false,
    },
    {
      label: "Revenue today",
      value: stats ? `Rs ${stats.revenueToday.toLocaleString("en-IN")}` : "—",
      Icon: Wallet,
      accent: false,
    },
    {
      label: "Pending verifications",
      value: stats?.pendingVerifications ?? "—",
      Icon: AlertCircle,
      accent: (stats?.pendingVerifications ?? 0) > 0,
    },
    {
      label: "Low stock items",
      value: stats?.lowStockCount ?? "—",
      Icon: PackageX,
      accent: (stats?.lowStockCount ?? 0) > 0,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-[var(--radius-lg)] border p-4 ${c.accent ? "border-amber-200 bg-amber-50" : "border-[var(--color-border)] bg-[var(--color-surface)]"}`}
          >
            <c.Icon
              size={18}
              className={
                c.accent
                  ? "text-amber-600"
                  : "text-[var(--color-text-secondary)]"
              }
            />
            <p className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
              {c.value}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[3fr_2fr] gap-6">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--color-text-primary)]">
              Recent orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-medium text-[var(--color-primary)]"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders?.orders.map((o) => (
              <div
                key={o._id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {o.orderNumber}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Rs {o.total.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <OrderStatusBadge status={o.orderStatus} />
                  <PaymentStatusBadge status={o.paymentStatus} />
                </div>
              </div>
            ))}
            {recentOrders?.orders.length === 0 && (
              <p className="text-sm text-[var(--color-text-muted)]">
                No orders yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-[var(--color-text-primary)]">
              Low stock
            </h2>
            <Link
              to="/admin/inventory"
              className="text-xs font-medium text-[var(--color-primary)]"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {isProductsLoading ? (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Loading...
              </p>
            ) : isProductsError ? (
              <p className="text-sm text-red-600">
                {productsError?.message || "Failed to load low stock items."}
              </p>
            ) : lowStockProducts.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">
                Nothing low on stock.
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-[var(--color-text-primary)] line-clamp-1">
                    {p.name}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
