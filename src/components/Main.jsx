import { useState } from "react";
import { AvgStatsCards } from "./AvgStatsCards";
import { NewEntryForm } from "./NewEntryForm";
import { MetricChart } from "./MetricChart";
import { MetricFilters } from "./MetricFilters";
import { exportToCSV } from "../utils/metricsUtils";
import { MetricsTable } from "./MetricsTable";
import { Snackbar } from "./Snackbar";
import { useHealthMetrics } from "../hooks/useHealthMetrics";

export function Main() {
  const [snackbar, setSnackbar] = useState({ message: "", type: "", visible: false });

  const showSnackbar = (message, type = "info") => {
    setSnackbar({ message, type, visible: true });
  };

  const {
    chartType,
    setChartType,
    filters,
    setFilters,
    addNewEntry,
    updateMetric,
    deleteMetric,
    deleteGroup,
    filteredFlatData,
    filteredGroupedData,
    chartData,
  } = useHealthMetrics(showSnackbar);

  const handleExportCSV = () => {
    exportToCSV(filteredFlatData);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between gap-12 w-full">
        <NewEntryForm addNewEntry={addNewEntry} showSnackbar={showSnackbar} />
        <AvgStatsCards data={filteredFlatData} />
      </div>

      <div className="relative flex gap-12 flex-col-reverse lg:flex-row">
        <div className="space-y-12 w-full">
          <MetricChart
            data={chartData}
            selectedMetric={filters.selectedMetric}
            chartType={chartType}
            onChartTypeChange={setChartType}
            filters={filters}
          />
          <MetricsTable
            data={filteredGroupedData}
            onUpdate={updateMetric}
            onDelete={deleteMetric}
            onDeleteGroup={deleteGroup}
            showSnackbar={showSnackbar}
          />
        </div>

        <div className="w-full lg:w-[400px] lg:sticky lg:top-6 self-start">
          <MetricFilters
            filters={filters}
            onFiltersChange={setFilters}
            onExportCSV={handleExportCSV}
          />
        </div>

        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          show={snackbar.visible}
          onClose={() => setSnackbar({ ...snackbar, visible: false })}
        />
      </div>
    </div>
  );
}
