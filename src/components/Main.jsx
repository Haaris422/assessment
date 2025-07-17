import { useEffect, useState } from "react";
import { AvgStatsCards } from "./AvgStatsCards";
import { NewEntryForm } from "./NewEntryForm";
import { MetricChart } from "./MetricChart";
import { filterByTimeOfDay, isWithinToday } from "../utils/dateUtils";
import { MetricFilters } from "./MetricFilters";
import { exportToCSV } from "../utils/metricsUtils";
import { MetricsTable } from "./MetricsTable";
import { Snackbar } from "./Snackbar";

export function Main() {
  const [chartType, setChartType] = useState("line");
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("health-metrics");
    const parsed = storedData ? JSON.parse(storedData) : [];
    console.log("Loaded from localStorage:", parsed);
    return parsed;
  });
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const showSnackbar = (message, type = "info") => {
    console.log('handleSave: showSnackbar:', message, type)
    setSnackbar({ message, type, visible: true });
  };

  const [filters, setFilters] = useState({
    timeOfDay: "all",
    sortBy: "timestamp",
    sortOrder: "desc",
    selectedMetric: "all",
  });

  function addNewEntry(metricGroup) {
    const newGroup = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      entries: metricGroup,
    };
    setData((prev) => [...prev, newGroup]);
  }

  const flattenedData = data.flatMap((group) =>
    group.entries.map((entry) => ({
      ...entry,
      timestamp: group.timestamp,
      id: group.id + "-" + entry.type,
    }))
  );

  const getFilteredFlatData = () => {
    let filtered = flattenedData;

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

  const getGroupedFilteredData = () => {
    let groups = [...data];

    // Filter out entries that don't match selected metric or time of day
    groups = groups
      .map((group) => {
        const filteredEntries = group.entries.filter((entry) => {
          const flatEntry = { ...entry, timestamp: group.timestamp };

          const matchesMetric =
            filters.selectedMetric === "all" ||
            entry.type === filters.selectedMetric;

          const matchesTime =
            filterByTimeOfDay([flatEntry], filters.timeOfDay).length > 0;

          return matchesMetric && matchesTime;
        });

        return filteredEntries.length > 0
          ? { ...group, entries: filteredEntries }
          : null;
      })
      .filter(Boolean);

    // If sorting by value → sort inside each group
    if (filters.sortBy === "value") {
      groups = groups.map((group) => ({
        ...group,
        entries: [...group.entries].sort((a, b) =>
          filters.sortOrder === "asc" ? a.value - b.value : b.value - a.value
        ),
      }));
    }

    // If sorting by timestamp → sort the groups themselves
    if (filters.sortBy === "timestamp") {
      groups.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return filters.sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      });
    }

    return groups;
  };

  const filteredFlatData = getFilteredFlatData();
  const filteredGroupedData = getGroupedFilteredData();
  const chartData =
    filteredFlatData.filter((item) => isWithinToday(item.timestamp)) ?? [];

  const handleExportCSV = () => {
    exportToCSV(filteredFlatData);
  };

  const updateMetric = (id, updates) => {
    setData((prev) =>
      prev.map((group) => {
        if (group.id === id.split("-")[0]) {
          const updatedEntries = group.entries.map((entry) =>
            entry.type === id.split("-")[1] ? { ...entry, ...updates } : entry
          );
          return { ...group, entries: updatedEntries };
        }
        return group;
      })
    );
  };

  const deleteMetric = (id) => {
    const [groupId, type] = id.split("-");
    setData((prev) =>
      prev
        .map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              entries: group.entries.filter((e) => e.type !== type),
            };
          }
          return group;
        })
        .filter((group) => group.entries.length > 0)
    );
    showSnackbar('Entry Deleted Successfully', 'success');
  };

  const deleteGroup = (groupId) => {
    setData((prev) => prev.filter((group) => group.id !== groupId));
    showSnackbar('Entry Group Deleted Successfully', 'success');
  };

  useEffect(() => {
    console.log("Saving to localStorage:", data);
    localStorage.setItem("health-metrics", JSON.stringify(data));
  }, [data]);

  return (
    <div className="space-y-12">
      
      <div className="flex flex-col lg:flex-row justify-between gap-12 w-full">
        <NewEntryForm addNewEntry={addNewEntry} showSnackbar={showSnackbar}/>
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
