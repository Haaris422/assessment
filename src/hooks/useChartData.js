import { useMemo } from "react";
import { formatTime } from "../utils/dateUtils";
import { getMetricConfig, metrics } from "../constants/metrics";

export function useChartData(data, selectedMetric, filters) {
  return useMemo(() => {
    let filteredData = selectedMetric !== "all"
      ? data.filter((item) => item.type === selectedMetric)
      : data;

    const grouped = new Map();

    filteredData.forEach((item) => {
      const timeKey = formatTime(item.timestamp);
      const config = getMetricConfig(item.type);

      if (!grouped.has(timeKey)) grouped.set(timeKey, new Map());

      const timeGroup = grouped.get(timeKey);
      if (!timeGroup.has(item.type)) {
        timeGroup.set(item.type, { values: [], config });
      }

      timeGroup.get(item.type).values.push(item.value);
    });

    return Array.from(grouped.entries())
      .map(([timeKey, metricGroups]) => {
        const hour = parseInt(timeKey.split(":")[0]);
        const entry = { timestamp: timeKey, hour };

        metricGroups.forEach((metricData, type) => {
          const avg =
            metricData.values.length > 1
              ? Math.round(
                  (metricData.values.reduce((a, b) => a + b, 0) /
                    metricData.values.length) * 100
                ) / 100
              : metricData.values[0];

          entry[type] = avg;
          entry[`${type}_count`] = metricData.values.length;
          entry[`${type}_values`] = metricData.values;
          entry[`${type}_config`] = metricData.config;
        });

        return entry;
      })
      .sort((a, b) =>
        filters?.sortBy === "timestamp"
          ? filters.sortOrder === "asc"
            ? a.hour - b.hour
            : b.hour - a.hour
          : a.hour - b.hour
      );
  }, [data, selectedMetric, filters]);
}
