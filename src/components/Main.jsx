import { useEffect, useState } from "react";
import { AvgStatsCards } from "./AvgStatsCards";
import { NewEntryForm } from "./NewEntryForm";
import { MetricChart } from "./MetricChart";
import { filterByTimeOfDay, isWithinToday } from "../utils/dateUtils";
import { MetricFilters } from "./MetricFilters";
import { exportToCSV } from "../utils/metricsUtils";
import { MetricsTable } from "./MetricsTable";

export function Main() {
  const [chartType, setChartType] = useState("line");
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("health-metrics");
    const parsed = storedData ? JSON.parse(storedData) : [];
    console.log("Loaded from localStorage:", parsed);
    return parsed;
  });
  const [filters, setFilters] = useState({
    timeOfDay: "all",
    sortBy: "timestamp",
    sortOrder: "asc",
    selectedMetric: "all",
  });

  function addNewEntry(metric) {
    const newMetric = {
      ...metric,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setData((prev) => [...prev, newMetric]);
  }
  const updateMetric = (id, updates) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMetric = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };
  const getFilteredData = () => {
    let filtered = data;

    if (filters.selectedMetric !== "all") {
      filtered = filtered.filter(
        (item) => item.type === filters.selectedMetric
      );
    }

    filtered = filterByTimeOfDay(filtered, filters.timeOfDay);

    if (filters.sortOrder !== "") {
      filtered.sort((a, b) => {
        if (filters.sortBy === "timestamp") {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return filters.sortOrder === "asc" ? timeA - timeB : timeB - timeA;
        } else {
          return filters.sortOrder === "asc"
            ? a.value - b.value
            : b.value - a.value;
        }
      });
    }

    return filtered;
  };

  const filteredData = getFilteredData();
  const chartData = filteredData.filter((item) => isWithinToday(item.timestamp)) ?? [];

  const handleExportCSV = () => {
    exportToCSV(getFilteredData());
  };

  useEffect(() => {
    console.log("Saving to localStorage:", data);
    localStorage.setItem("health-metrics", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    console.log("useEffect: on changing filters: ", getFilteredData());
  }, [filters]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <NewEntryForm addNewEntry={addNewEntry} />
        <AvgStatsCards data={data} />
      </div>
      <MetricFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExportCSV={handleExportCSV}
      />
      <MetricChart
        data={chartData}
        selectedMetric={filters.selectedMetric}
        chartType={chartType}
        onChartTypeChange={setChartType}
        filters={filters}
      />
      <MetricsTable
        data={filteredData}
        onUpdate={updateMetric}
        onDelete={deleteMetric}
      />
    </div>
  );
}
