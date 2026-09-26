import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyStat } from "../../hooks/useAdminAnalytics";

export function RevenueChart({ data }: { data: DailyStat[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={formatted}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0f766e" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          tickFormatter={(v) => `Rs ${v}`}
        />
        <Tooltip
          formatter={(
            value: number | string | ReadonlyArray<number | string> | undefined,
          ) => [
            `Rs ${Number(value ?? 0).toLocaleString("en-IN")}`,
            "Revenue",
          ]}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #e7e5e0",
            fontSize: 13,
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#0f766e"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
