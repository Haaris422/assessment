import { useMemo, useState } from "react";
import { LuList } from "react-icons/lu";
import {
  buttonStyle,
  cardLayoutStyle,
  validationRules,
} from "../constants/metrics";
import { isWithinToday } from "../utils/dateUtils";
import { Accordian } from "./Accordian";

export const MetricsTable = ({
  data,
  onUpdate,
  onDelete,
  onDeleteGroup,
  showSnackbar,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [tableType, setTableType] = useState("all");
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (id) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const displayedData = useMemo(() => {
    return tableType === "today"
      ? data.filter((entry) => isWithinToday(entry.timestamp))
      : data;
  }, [tableType, data]);

  const handleEdit = (entryId, metricType, currentValue) => {
    setEditingId(`${entryId}-${metricType}`);
    setEditValue(currentValue.toString());
  };

  const handleSave = (entryId, metricType) => {
    const valueStr = editValue.trim();
    const value = Number(valueStr);
    const rules = validationRules[metricType];
      console.log("handleSave: props", valueStr, value, rules);

    if (valueStr === "") {
      setEditingId(null);
      console.log("handleSave: 0 val", valueStr, value);
      showSnackbar("Metric must have some value", "error");
      return;
    }

    if (value < rules.min || value > rules.max) {
      setEditingId(null);
      console.log("handleSave: not in range", valueStr, value);
      showSnackbar(
        `Please enter a valid value for ${metricType} (${rules.min}–${rules.max})`,
        "error"
      );
      return;
    }

    onUpdate(`${entryId}-${metricType}`, { value });
    setEditingId(null);
    setEditValue("");
    showSnackbar("Metric Edited Successfully!",'success');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
        <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <LuList className="text-5xl mx-auto mb-2 opacity-50" />
            <p>No health metrics found for the selected filters</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardLayoutStyle}>
      <div className="flex flex-col gap-4 sm:flex-row justify-between items-center">
        <div className="flex items-center w-full sm:text-left text-xl font-bold">
          <div className="p-2 mr-2 bg-red-50 dark:bg-red-900/30 rounded-md">
            <LuList className="text-2xl text-red-400" />
          </div>
          Health Data ({displayedData.length} entries)
        </div>
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setTableType("all")}
            className={`${buttonStyle} ${
              tableType === "all"
                ? "bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTableType("today")}
            className={`${buttonStyle} ${
              tableType === "today"
                ? "bg-white dark:bg-gray-600 text-red-600 dark:text-red-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Today
          </button>
        </div>
      </div>

      <div className="bg-red-100 rounded-md w-full h-1 my-4" />

      <div className="space-y-6">
        {displayedData.map((entry) => (
          <Accordian
            key={entry.id}
            handleCancel={handleCancel}
            handleEdit={handleEdit}
            handleSave={handleSave}
            entry={entry}
            openGroups={openGroups}
            toggleGroup={toggleGroup}
            editingId={editingId}
            editValue={editValue}
            setEditValue={setEditValue}
            onDelete={onDelete}
            onDeleteGroup={onDeleteGroup}
          />
        ))}
      </div>
    </div>
  );
};
