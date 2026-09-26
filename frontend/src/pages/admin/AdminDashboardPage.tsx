import { Link } from "react-router";
import { useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  ClipboardList,
  Wallet,
  AlertCircle,
  PackageX,
  ChevronRight,
} from "lucide-react";
import { useAdminDashboardStats } from "../../hooks/useAdminDashboard";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { OrderStatusBadge } from "../../components/order/OrderStatusBadge";
import { PaymentStatusBadge } from "../../components/order/PaymentStatusBadge";

export default function AdminDashboardPage() {
  const { data: stats } = useAdminDashboardStats();
  const { data: recentOrders } = useAdminOrders(
    { limit: 5 },
    { refetchInterval: 20000 },
  );
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

  const previousOrdersToday = useRef<number | null>(null);
  useEffect(() => {
    if (stats === undefined) return;
    if (
      previousOrdersToday.current !== null &&
      stats.ordersToday > previousOrdersToday.current
    ) {
      toast.success("New order received!");
    }
    previousOrdersToday.current = stats.ordersToday;
  }, [stats?.ordersToday]);

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
          Monitor your store sales, pending orders, and inventory metrics.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-[var(--radius-lg)] border p-4 sm:p-5 transition-all shadow-xs ${
              c.accent
                ? "border-amber-200 bg-amber-50/60"
                : "border-[var(--color-border)] bg-[var(--color-surface)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {c.label}
              </span>
              <div
                className={`p-2 rounded-lg ${
                  c.accent
                    ? "bg-amber-100 text-amber-700"
                    : "bg-neutral-100 text-[var(--color-text-secondary)]"
                }`}
              >
                <c.Icon size={18} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mt-3 tracking-tight">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        {/* Recent Orders */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
              <div>
                <h2 className="font-bold text-base text-[var(--color-text-primary)]">
                  Recent Orders
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Latest customer orders placed
                </p>
              </div>
              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline no-underline"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders?.orders.map((o) => (
                <div
                  key={o._id}
                  className="flex flex-col min-[440px]:flex-row min-[440px]:items-center justify-between p-3 rounded-lg border border-[var(--color-border)] hover:bg-neutral-50/50 transition-colors gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[var(--color-text-primary)] truncate">
                      {o.orderNumber}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Rs {o.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <OrderStatusBadge status={o.orderStatus} />
                    <PaymentStatusBadge status={o.paymentStatus} />
                  </div>
                </div>
              ))}
              {recentOrders?.orders.length === 0 && (
                <p className="text-sm text-center py-6 text-[var(--color-text-muted)]">
                  No orders placed yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
              <div>
                <h2 className="font-bold text-base text-[var(--color-text-primary)]">
                  Low Stock Alert
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Items requiring inventory restock
                </p>
              </div>
              <Link
                to="/admin/inventory"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline no-underline"
              >
                <span>Manage</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-2.5">
              {isProductsLoading ? (
                <p className="text-sm text-[var(--color-text-secondary)] py-4 text-center">
                  Loading inventory...
                </p>
              ) : isProductsError ? (
                <p className="text-sm text-red-600 py-4 text-center">
                  {productsError?.message || "Failed to load low stock items."}
                </p>
              ) : lowStockProducts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm font-medium text-emerald-700">
                    All inventory levels healthy!
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    No products below low stock threshold.
                  </p>
                </div>
              ) : (
                lowStockProducts.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between p-3 rounded-lg border border-amber-200/70 bg-amber-50/40 text-sm gap-2"
                  >
                    <span className="text-[var(--color-text-primary)] font-medium text-xs sm:text-sm line-clamp-1 min-w-0">
                      {p.name}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 shrink-0">
                      {p.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
