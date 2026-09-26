import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TopProduct } from "../../hooks/useAdminAnalytics";

interface TopProductsChartProps {
  data: TopProduct[];
  metric: "quantity" | "revenue";
}

export function TopProductsChart({ data, metric }: TopProductsChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] py-8 text-center">
        No sales in this period yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 40)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e7e5e0"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#a8a29e" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (metric === "revenue" ? `Rs ${v}` : v)}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tick={{ fontSize: 12, fill: "#57534e" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(
            value: number | string | ReadonlyArray<number | string> | undefined,
          ) => [
            metric === "revenue"
              ? `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`
              : (value ?? 0),
            metric === "revenue" ? "Revenue" : "Units sold",
          ]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e7e5e0",
            fontSize: 13,
          }}
        />
        <Bar dataKey={metric} fill="#0f766e" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
