import { useRef } from "react";
import { LuChevronDown, LuChevronUp, LuX } from "react-icons/lu";
import { formatDate, formatTime } from "../utils/dateUtils";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import { getMetricConfig } from "../constants/metrics";

export function Accordian({
  openGroups,
  entry,
  toggleGroup,
  editingId,
  handleSave,
  handleEdit,
  handleCancel,
  editValue,
  setEditValue,
  onDeleteGroup,
  onDelete
}) {
  const isOpen = openGroups[entry.id] ?? false;

  const contentRef = useRef(null);

  return (
    <div
    
      className="bg-gray-100 dark:bg-gray-900 rounded-xl shadow-md transition-all"
    >
      <div
      style={{
        borderBottom:isOpen ? '0.5px solid #f3f4f6':'none'
      }}
        className="flex justify-between items-center px-4 py-3  dark:border-gray-700 cursor-pointer"
        onClick={() => toggleGroup(entry.id)}
      >
        <div className="flex items-center gap-2">
          {!isOpen ? (
            <LuChevronDown className="text-xl text-gray-600 dark:text-gray-300" />
          ) : (
            <LuChevronUp className="text-xl text-gray-600 dark:text-gray-300" />
          )}
          <div>
            <p className="text-lg font-semibold text-black dark:text-white">
              {formatTime(entry.timestamp)}
            </p>
            <p className="text-sm text-gray-400">
              {formatDate(entry.timestamp)} • {entry.entries.length} metrics
            </p>
          </div>
        </div>
        <button
          title="Delete full entry"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteGroup(entry.id);
          }}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <FaTrash className="text-xl cursor-pointer" />
        </button>
      </div>

      <div
        ref={contentRef}
        className={`transition-all duration-500 ease-in-out overflow-hidden`}
        style={{
          maxHeight: isOpen
            ? `${contentRef.current?.scrollHeight + 40}px`
            : "0px",
          padding: isOpen ? "1rem" : "0 1rem",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {entry.entries.map((metric) => {
            const config = getMetricConfig(metric.type);
            const isEditing = editingId === `${entry.id}-${metric.type}`;

            return (
              <div
                key={metric.type}
                className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {config.label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(entry.id, metric.type)}
                          className="text-green-500 hover:text-green-700"
                          title="Save"
                        >
                          <FaSave className="text-lg cursor-pointer" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-500 hover:text-gray-700"
                          title="Cancel"
                        >
                          <LuX className="text-lg cursor-pointer" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleEdit(entry.id, metric.type, metric.value)
                          }
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit className="text-lg cursor-pointer" />
                        </button>
                        <button
                          onClick={() => onDelete(`${entry.id}-${metric.type}`)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash className="text-lg cursor-pointer" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  {isEditing ? (
                    <input
                    id={'editField'}
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      min="0"
                      step="any"
                    />
                  ) : (
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {metric.value} {metric.unit}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
