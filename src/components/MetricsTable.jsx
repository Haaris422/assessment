import { useState } from "react";
import { getMetricConfig } from "../constants/metrics";
import { formatTime, formatDate } from "../utils/dateUtils";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { LuList, LuX } from "react-icons/lu";

export const MetricsTable = ({ data, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.value.toString());
  };

  const handleSave = (id) => {
    const value = Number(editValue);
    if (value > 0) {
      onUpdate(id, { value });
      setEditingId(null);
      setEditValue("");
    }
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
            <LuList className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No health metrics found for the selected filters</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md p-6 transition-colors duration-200">
      <div className="flex justify-between items-center">
        <p className=" text-center w-full sm:text-left text-xl ">
          Health Data ({data.length} entries)
        </p>
        <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
          <LuList className="text-xl text-red-400" />
        </div>
      </div>
      <div className="bg-red-100 rounded-md w-full h-1 my-4" />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                Sr. No.
              </th>

              <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                Type
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                Value
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                Date
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                Time
              </th>
              <th className="text-left py-3 px-2 font-medium text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const config = getMetricConfig(item.type);
              const isEditing = editingId === item.id;

              return (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-150 ease-in-out"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{config.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {config.label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        min="0"
                        step="any"
                      />
                    ) : (
                      <span className="text-gray-900 dark:text-white font-medium">
                        {item.value} {item.unit}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                    {formatDate(item.timestamp)}
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                    {formatTime(item.timestamp)}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(item.id)}
                            className="text-green-600 hover:text-green-800 transition-colors duration-150"
                            title="Save changes"
                          >
                            <FaSave className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-800 transition-colors duration-150"
                            title="Cancel editing"
                          >
                            <LuX className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                            title="Edit entry"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-150"
                            title="Delete entry"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
