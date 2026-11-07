import { create } from "zustand";
import type { MetricName } from "../../../protocol/messages";

export interface MetricData {
  current: number;
  history: number[]; // We'll store the array representation for Recharts
}

interface MetricsState {
  metrics: Record<MetricName, MetricData>;
  applyBatch: (updates: Record<MetricName, number[]>) => void;
}

const initialMetrics: Record<MetricName, MetricData> = {
  cpu: { current: 0, history: [] },
  memory: { current: 0, history: [] },
  requests: { current: 0, history: [] },
  latency: { current: 0, history: [] },
};

export const useMetricsStore = create<MetricsState>((set) => ({
  metrics: initialMetrics,
  applyBatch: (updates) =>
    set((state) => {
      const newMetrics = { ...state.metrics };

      for (const [metric, values] of Object.entries(updates) as [
        MetricName,
        number[],
      ][]) {
        if (values.length === 0) continue;

        // Last value is the current value for KPI
        const current = values[values.length - 1]!;
        // Combine old history with new batched values
        const history = [...newMetrics[metric].history, ...values];

        newMetrics[metric] = { current, history };
      }

      return { metrics: newMetrics };
    }),
}));
