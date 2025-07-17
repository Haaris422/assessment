import { FaDownload, FaFilter } from "react-icons/fa";
import { submitButtonStyle, cardLayoutStyle, dropDownStyle, metrics } from "../constants/metrics";

export const MetricFilters = ({ filters, onFiltersChange, onExportCSV }) => {
  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
    console.log('updateFilter: ', filters)
  };

  return (
    <div className={cardLayoutStyle}>
      <div className="flex justify-between items-center">
        <p className="w-full text-left text-xl font-bold">
          Filters & Controls
        </p>
        <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
          <FaFilter className="text-xl text-red-400" />
        </div>
      </div>
      <div className="bg-red-100 rounded-md w-full h-1 my-4" />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-4">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Metric Type
          </label>
          <select
            id="type"
            value={filters.selectedMetric}
            onChange={(e) => updateFilter("selectedMetric", e.target.value)}
            className={`${dropDownStyle}`}
          >
            <option value="all">All Metrics</option>
            {metrics.map((metric) => (
              <option key={metric.key} value={metric.key}>
                {metric.icon} {metric.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timestamp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time of Day
          </label>
          <select
          id="timestamp"
            value={filters.timeOfDay}
            onChange={(e) => updateFilter("timeOfDay", e.target.value)}
            className={`${dropDownStyle}`}
          >
            <option value="all">All Day</option>
            <option value="morning">🌅 Morning (6-12)</option>
            <option value="afternoon">☀️ Afternoon (12-18)</option>
            <option value="evening">🌙 Evening (18-24)</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort Order
          </label>
          <select
          id="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => updateFilter("sortOrder", e.target.value)}
            className={`${dropDownStyle}`}
          >
            <option value="">No Sorting</option>

            <option value="desc">⬇️ Descending</option>
            <option value="asc">⬆️ Ascending</option>
          </select>
        </div>
            <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
          id='sortBy'
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className={`${dropDownStyle}`}
          >
            <option value="timestamp">Time</option>
            <option value="value">Value</option>
          </select>
        </div>
        <div>
   
          <button onClick={onExportCSV} className={submitButtonStyle}>
            <FaDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};
