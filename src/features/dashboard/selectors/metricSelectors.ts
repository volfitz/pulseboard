import { useMetricsStore } from "../store/metricsStore";

export const useMetric = (
  metricName: "cpu" | "memory" | "requests" | "latency",
) => {
  return useMetricsStore((state) => state.metrics[metricName]);
};
