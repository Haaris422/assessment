export function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
        📅 Time: {data.timestamp}
      </p>
      <div className="space-y-2">
        {Object.keys(data)
          .filter((key) => key.endsWith("_config"))
          .map((key) => {
            const metricType = key.replace("_config", "");
            const config = data[key];
            const value = data[metricType];
            const count = data[`${metricType}_count`];
            const values = data[`${metricType}_values`];

            return (
              <div
                key={metricType}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div
                  className="w-3 h-3 rounded-full"
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
                    <>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                        Average: {value} {config.unit}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {count} entries: {values.join(", ")} {config.unit}
                      </p>
                    </>
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
