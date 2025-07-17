import { metrics } from "../constants/metrics";

export function useActiveMetrics(chartData, selectedMetric) {
  if (selectedMetric !== "all") return [selectedMetric];

  const active = new Set();
  chartData.forEach((point) => {
    metrics.forEach((m) => {
      if (point[m.key] !== undefined) active.add(m.key);
    });
  });

  return Array.from(active);
}
