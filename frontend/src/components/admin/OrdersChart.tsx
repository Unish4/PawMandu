import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyStat } from "../../hooks/useAdminAnalytics";

export function OrdersChart({ data }: { data: DailyStat[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={formatted}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e7e5e0"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#a8a29e" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#a8a29e" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e7e5e0",
            fontSize: 13,
          }}
        />
        <Bar dataKey="orders" fill="#d97706" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
