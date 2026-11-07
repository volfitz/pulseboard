import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MetricChartProps {
  data: number[];
  color: string;
}

export function MetricChart({ data, color }: MetricChartProps) {
  // Generate a sliding window. We use the length of data as the X-axis index.
  // This ensures the chart always shifts to the left as new data arrives.
  const chartData = data.map((value, index) => ({
    time: index,
    value: value,
  }));

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          {/* XAxis is hidden, but giving it a domain tells Recharts to slide the window */}
          <XAxis dataKey="time" hide domain={["dataMin", "dataMax"]} />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
            }}
            itemStyle={{ color: "#e2e8f0" }}
            labelStyle={{ display: "none" }}
            formatter={(value: number) => [value.toFixed(2), "Value"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} // Critical for real-time data
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
