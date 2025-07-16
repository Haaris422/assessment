import { useMemo } from "react";
import { IoBarChart, IoTrendingUp } from "react-icons/io5";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatTime } from "../utils/dateUtils";
import { getMetricConfig } from "../constants/metrics";

export function MetricChart({
  data,
  chartType,
  selectedMetric,
  onChartTypeChange,
}) {
  const chartData = useMemo(() => {
    let filteredData = data;
    if (selectedMetric !== "all") {
      filteredData = data.filter((item) => item.type === selectedMetric);
    }
    const processedData = filteredData
      .map((item) => ({
        timestamp: formatTime(item.timestamp),
        value: item.value,
        hour: new Date(item.timestamp).getHours(),
      }))
      .sort((a, b) => a.hour - b.hour);
    return processedData;
  }, [data, selectedMetric]);

  const metricConfig =
    selectedMetric !== "all" ? getMetricConfig(selectedMetric) : null;

  const color = metricConfig?.color || "#ff6467";

  if (chartData.length === 0) {
    return (
      <div className="bg-white w-full dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <IoBarChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No data available for the selected metric</p>
          </div>
        </div>
      </div>
    );
  }

  const tabClass = `p-1 rounded-md hover:opacity-85 cursor-pointer`;
  return (
    <div className="bg-white w-full text-black dark:text-white dark:bg-gray-800 p-4 shadow-lg rounded-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-center w-full sm:text-left text-xl ">
          <div className="p-2 mr-2 bg-red-50 dark:bg-red-900/30 rounded-md">
            <IoTrendingUp className="text-2xl text-red-400" />
          </div>
          Wellness Visualization
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onChartTypeChange("line")}
            className={`${
              chartType == "line" ? "bg-red-400" : "bg-white dark:bg-gray-900"
            }
            ${tabClass}`}
          >
            Line
          </button>
          <button
            onClick={() => onChartTypeChange("bar")}
            className={`${
              chartType == "bar" ? "bg-red-400" : "bg-white dark:bg-gray-900"
            }
            ${tabClass}`}
          >
            Bar
          </button>
        </div>
      </div>
      <div className="bg-red-100 rounded-md w-full h-1 my-4" />
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value) => [
                  `${value} ${metricConfig?.unit || ''}`,
                  metricConfig?.label || 'Value'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: color }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value) => [
                  `${value} ${metricConfig?.unit || ''}`,
                  metricConfig?.label || 'Value'
                ]}
              />
              <Bar 
                dataKey="value" 
                fill={color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
