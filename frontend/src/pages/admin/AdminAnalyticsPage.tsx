import { useState } from "react";
import { BarChart3, Calendar, RefreshCw } from "lucide-react";
import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";
import { RevenueChart } from "../../components/admin/RevenueChart";
import { OrdersChart } from "../../components/admin/OrdersChart";
import { TopProductsChart } from "../../components/admin/TopProductsChart";
import { ErrorState } from "../../components/ErrorState";

const RANGE_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
];

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState(30);
  const {
    data: analytics,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAdminAnalytics(range);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
              Store Analytics
            </h1>
            {isFetching && !isLoading && (
              <RefreshCw
                size={16}
                className="animate-spin text-[var(--color-primary)]"
              />
            )}
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Track sales performance, order volumes, and top-performing products.
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] p-1 rounded-lg shadow-xs self-start sm:self-auto">
          <Calendar size={15} className="text-[var(--color-text-secondary)] ml-1.5" />
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                range === opt.value
                  ? "bg-[var(--color-primary)] text-white shadow-xs"
                  : "text-[var(--color-text-secondary)] hover:bg-neutral-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[400px] flex items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex flex-col items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <BarChart3 className="animate-pulse text-[var(--color-primary)]" size={32} />
            <span>Loading analytics data...</span>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <ErrorState onRetry={() => refetch()} />
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Revenue Chart */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
              <div>
                <h2 className="font-bold text-base text-[var(--color-text-primary)]">
                  Revenue Over Time
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Daily revenue for the past {range} days
                </p>
              </div>
            </div>
            <RevenueChart data={analytics?.dailyStats ?? []} />
          </div>

          {/* Orders per Day Chart */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
              <div>
                <h2 className="font-bold text-base text-[var(--color-text-primary)]">
                  Orders Per Day
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Volume of orders processed daily
                </p>
              </div>
            </div>
            <OrdersChart data={analytics?.dailyStats ?? []} />
          </div>

          {/* Top Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs">
              <h2 className="font-bold text-base text-[var(--color-text-primary)] mb-1">
                Top Products by Units Sold
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-4 pb-3 border-b border-[var(--color-border)]">
                Most popular items by quantity sold
              </p>
              <TopProductsChart
                data={analytics?.topProductsByQuantity ?? []}
                metric="quantity"
              />
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-xs">
              <h2 className="font-bold text-base text-[var(--color-text-primary)] mb-1">
                Top Products by Revenue
              </h2>
              <p className="text-xs text-[var(--color-text-muted)] mb-4 pb-3 border-b border-[var(--color-border)]">
                Highest grossing items in sales volume
              </p>
              <TopProductsChart
                data={analytics?.topProductsByRevenue ?? []}
                metric="revenue"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
