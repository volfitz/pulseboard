import { MetricChart } from "./MetricChart";

interface KpiCardProps {
  title: string;
  value: number;
  unit: string;
  history: number[];
  color: string;
}

export function KpiCard({ title, value, unit, history, color }: KpiCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-slate-400 text-sm font-medium mb-1">{title}</h2>
        <div className="text-3xl font-bold flex items-baseline gap-1">
          {value.toFixed(2)}
          <span className="text-lg text-slate-500 font-normal">{unit}</span>
        </div>
      </div>
      <MetricChart data={history} color={color} />
    </div>
  );
}
