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
} from "recharts";
import { buttonStyle, cardLayoutStyle, getMetricConfig } from "../constants/metrics";
import { useChartData } from "../hooks/useChartData";
import { useActiveMetrics } from "../hooks/useActiveMetrics";
import { ChartTooltip } from "./ChartTooltip";

export function MetricChart({
  data,
  chartType,
  selectedMetric,
  onChartTypeChange,
  filters,
}) {
  const chartData = useChartData(data, selectedMetric, filters);


  const activeMetrics = useActiveMetrics(chartData, selectedMetric);

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
                stroke="#6B7280"
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
              <Tooltip content={<ChartTooltip />} />
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
              <Tooltip content={<ChartTooltip />} />
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
