import { useEffect, useState } from "react";
import { AvgStatsCards } from "./AvgStatsCards";
import { NewEntryForm } from "./NewEntryForm";
import { MetricChart } from "./MetricChart";
import { filterByTimeOfDay, isWithinToday } from "../utils/dateUtils";

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
    sortOrder: "desc",
    selectedMetric: "all",
  });

  function addNewEntry(metric) {
    const newMetric = {
      ...metric,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    console.log("➕ Adding new entry:", newMetric);
    setData((prev) => [...prev, newMetric]);
  }

  const getFilteredData = () => {
    let filtered = data.filter((item) => isWithinToday(item.timestamp));

    if (filters.selectedMetric !== "all") {
      filtered = filtered.filter(
        (item) => item.type === filters.selectedMetric
      );
    }

    filtered = filterByTimeOfDay(filtered, filters.timeOfDay);

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

    return filtered;
  };

  const getTodayData = () => {
    return data.filter((item) => isWithinToday(item.timestamp));
  };

  useEffect(() => {
    console.log("Saving to localStorage:", data);
    localStorage.setItem("health-metrics", JSON.stringify(data));
  }, [data]);

  return (
    <div className="space-y-12">
      <AvgStatsCards data={data} />
      <div className="flex gap-4 w-full">
        <NewEntryForm addNewEntry={addNewEntry} />
        <MetricChart
          data={getFilteredData()}
          selectedMetric={filters.selectedMetric}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />
      </div>
    </div>
  );
}
