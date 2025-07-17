import { useState, useEffect } from "react";
import { filterByTimeOfDay, isWithinToday } from "../utils/dateUtils";

export function useHealthMetrics(showSnackbar) {
  const [chartType, setChartType] = useState("line");

  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("health-metrics");
    return storedData ? JSON.parse(storedData) : [];
  });

  const [filters, setFilters] = useState({
    timeOfDay: "all",
    sortBy: "timestamp",
    sortOrder: "desc",
    selectedMetric: "all",
  });

  useEffect(() => {
    localStorage.setItem("health-metrics", JSON.stringify(data));
  }, [data]);

  const addNewEntry = (metricGroup) => {
    const newGroup = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      entries: metricGroup,
    };
    setData((prev) => [...prev, newGroup]);
  };

  const flattenedData = data.flatMap((group) =>
    group.entries.map((entry) => ({
      ...entry,
      timestamp: group.timestamp,
      id: group.id + "-" + entry.type,
    }))
  );

  const getFilteredFlatData = () => {
    let filtered = [...flattenedData];

    if (filters.selectedMetric !== "all") {
      filtered = filtered.filter((item) => item.type === filters.selectedMetric);
    }

    filtered = filterByTimeOfDay(filtered, filters.timeOfDay);

    if (filters.sortOrder) {
      filtered.sort((a, b) => {
        if (filters.sortBy === "timestamp") {
          return filters.sortOrder === "asc"
            ? new Date(a.timestamp) - new Date(b.timestamp)
            : new Date(b.timestamp) - new Date(a.timestamp);
        } else {
          return filters.sortOrder === "asc" ? a.value - b.value : b.value - a.value;
        }
      });
    }

    return filtered;
  };

  const getGroupedFilteredData = () => {
    let groups = [...data];

    groups = groups
      .map((group) => {
        const filteredEntries = group.entries.filter((entry) => {
          const matchesMetric =
            filters.selectedMetric === "all" || entry.type === filters.selectedMetric;
          const matchesTime = filterByTimeOfDay(
            [{ ...entry, timestamp: group.timestamp }],
            filters.timeOfDay
          ).length > 0;

          return matchesMetric && matchesTime;
        });

        return filteredEntries.length ? { ...group, entries: filteredEntries } : null;
      })
      .filter(Boolean);

    if (filters.sortBy === "value") {
      groups = groups.map((group) => ({
        ...group,
        entries: [...group.entries].sort((a, b) =>
          filters.sortOrder === "asc" ? a.value - b.value : b.value - a.value
        ),
      }));
    }

    if (filters.sortBy === "timestamp") {
      groups.sort((a, b) => {
        return filters.sortOrder === "asc"
          ? new Date(a.timestamp) - new Date(b.timestamp)
          : new Date(b.timestamp) - new Date(a.timestamp);
      });
    }

    return groups;
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
    showSnackbar?.("Entry Deleted Successfully", "success");
  };

  const deleteGroup = (groupId) => {
    setData((prev) => prev.filter((group) => group.id !== groupId));
    showSnackbar?.("Entry Group Deleted Successfully", "success");
  };

  return {
    chartType,
    setChartType,
    filters,
    setFilters,
    data,
    addNewEntry,
    updateMetric,
    deleteMetric,
    deleteGroup,
    filteredFlatData: getFilteredFlatData(),
    filteredGroupedData: getGroupedFilteredData(),
    chartData: getFilteredFlatData().filter((item) => isWithinToday(item.timestamp)),
  };
}
