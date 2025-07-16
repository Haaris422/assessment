import { useMemo } from "react";
import { IoBarChart, IoTrendingUp } from "react-icons/io5";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { formatTime } from "../utils/dateUtils";
import { buttonStyle, cardLayoutStyle, getMetricConfig, metrics } from "../constants/metrics";

export function MetricChart({
  data,
  chartType,
  selectedMetric,
  onChartTypeChange,
  filters,
}) {
  const chartData = useMemo(() => {
    let filteredData = data;

    if (selectedMetric !== "all") {
      filteredData = data.filter((item) => item.type === selectedMetric);
    }

    const groupedData = new Map();

    filteredData.forEach((item) => {
      const timeKey = formatTime(item.timestamp);
      const metricConfig = getMetricConfig(item.type);

      if (!groupedData.has(timeKey)) {
        groupedData.set(timeKey, new Map());
      }

      const timeGroup = groupedData.get(timeKey);
      if (!timeGroup.has(item.type)) {
        timeGroup.set(item.type, { values: [], config: metricConfig });
      }

      timeGroup.get(item.type).values.push(item.value);
    });

    const processedData = Array.from(groupedData.entries())
      .map(([timeKey, metricGroups]) => {
        const dataPoint = {
          timestamp: timeKey,
          hour: parseInt(timeKey.split(":")[0]),
        };

        metricGroups.forEach((metricData, metricType) => {
          const avgValue =
            metricData.values.length > 1
              ? Math.round(
                  (metricData.values.reduce((sum, val) => sum + val, 0) /
                    metricData.values.length) *
                    100
                ) / 100
              : metricData.values[0];

          dataPoint[metricType] = avgValue;
          dataPoint[`${metricType}_count`] = metricData.values.length;
          dataPoint[`${metricType}_values`] = metricData.values;
          dataPoint[`${metricType}_config`] = metricData.config;
        });

        return dataPoint;
      })
      .sort((a, b) => {
        if (filters?.sortBy === "timestamp") {
          return filters.sortOrder === "asc"
            ? a.hour - b.hour
            : b.hour - a.hour;
        }
        return a.hour - b.hour;
      });

    return processedData;
  }, [data, selectedMetric, filters]);

  const getActiveMetrics = () => {
    if (selectedMetric !== "all") {
      return [selectedMetric];
    }

    const activeMetrics = new Set();
    chartData.forEach((dataPoint) => {
      metrics.forEach((metric) => {
        if (dataPoint[metric.key] !== undefined) {
          activeMetrics.add(metric.key);
        }
      });
    });

    return Array.from(activeMetrics);
  };

  const activeMetrics = getActiveMetrics();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;

      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-2xl backdrop-blur-sm animate-fade-in">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
            📅 Time: {label}
          </p>
          <div className="space-y-2">
            {activeMetrics.map((metricType) => {
              const value = dataPoint[metricType];
              const count = dataPoint[`${metricType}_count`];
              const values = dataPoint[`${metricType}_values`];
              const config = dataPoint[`${metricType}_config`];

              if (value === undefined) return null;

              return (
                <div
                  key={metricType}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{config.icon}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {config.label}
                      </span>
                    </div>
                    {count > 1 ? (
                      <div className="mt-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Average: {value} {config.unit}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {count} entries: {values.join(", ")} {config.unit}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        {value} {config.unit}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
          <div className="text-center animate-pulse-soft">
            <div className="relative">
              <IoBarChart className="text-5xl mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-sm">
              Add some health metrics to see your trends here
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardLayoutStyle}>
      <div className="flex items-center flex-col gap-4 sm:flex-row justify-between mb-6">
        <div className="flex items-center ">
          <div className="p-2 mr-2 bg-red-50 dark:bg-red-900/30 rounded-md">
            <IoTrendingUp className="text-2xl text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              Wellness Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedMetric === "all"
                ? "All metrics"
                : getMetricConfig(selectedMetric).label}{" "}
              • {chartData.length} data points
            </p>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => onChartTypeChange("line")}
            className={`${buttonStyle} ${
              chartType === "line"
                ? "bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <IoTrendingUp className="w-4 h-4" />
            Line
          </button>
          <button
            onClick={() => onChartTypeChange("bar")}
            className={`${buttonStyle} ${
              chartType === "bar"
                ? "bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <IoBarChart className="w-4 h-4" />
            Bar
          </button>
        </div>
      </div>
      <div className="bg-red-100 rounded-md w-full h-1 my-4" />

      {selectedMetric === "all" && activeMetrics.length > 1 && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Active Metrics
          </h4>
          <div className="flex flex-wrap gap-3">
            {activeMetrics.map((metricType) => {
              const config = getMetricConfig(metricType);
              return (
                <div
                  key={metricType}
                  className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-600 rounded-full border border-gray-200 dark:border-gray-500"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {config.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="h-80 my-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50 rounded-lg pointer-events-none" />
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                {activeMetrics.map((metricType) => {
                  const config = getMetricConfig(metricType);
                  return (
                    <linearGradient
                      key={metricType}
                      id={`gradient-${metricType}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={config.color}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={config.color}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                strokeOpacity={0.5}
                className="dark:stroke-gray-600"
              />
              <XAxis
                dataKey="timestamp"
                stroke="#6B7280"
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {selectedMetric === "all" && <Legend />}
              {activeMetrics.map((metricType) => {
                const config = getMetricConfig(metricType);
                return (
                  <Line
                    key={metricType}
                    type="monotone"
                    dataKey={metricType}
                    stroke={config.color}
                    strokeWidth={3}
                    dot={{
                      fill: config.color,
                      strokeWidth: 2,
                      r: 5,
                      className: "drop-shadow-sm",
                    }}
                    activeDot={{
                      r: 7,
                      fill: config.color,
                      stroke: "#fff",
                      strokeWidth: 2,
                      className: "drop-shadow-md animate-pulse",
                    }}
                    name={config.label}
                    connectNulls={false}
                  />
                );
              })}
            </LineChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                strokeOpacity={0.5}
                className="dark:stroke-gray-600"
              />
              <XAxis
                dataKey="timestamp"
                stroke="#6B7280"
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {selectedMetric === "all" && <Legend />}
              {activeMetrics.map((metricType, index) => {
                const config = getMetricConfig(metricType);
                return (
                  <Bar
                    key={metricType}
                    dataKey={metricType}
                    fill={config.color}
                    radius={[4, 4, 0, 0]}
                    name={config.label}
                    className="drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
                    maxBarSize={activeMetrics.length === 1 ? 60 : 40}
                  />
                );
              })}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
