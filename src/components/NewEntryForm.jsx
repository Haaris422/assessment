import { useState } from "react";
import { buttonStyle, dropDownStyle, metrics } from "../constants/metrics";
import { IoAdd } from "react-icons/io5";
import { getLocalDateTime } from "../utils/dateUtils";

export function NewEntryForm({ addNewEntry }) {
  const [formData, setFormData] = useState({
    type: "steps",
    value: "",
    timestamp: getLocalDateTime(),
  });
  const metricConfig = metrics.find((m) => m.key === formData.type);

  function onChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  function onSubmit() {
    addNewEntry({
      type: formData.type,
      value: Number(formData.value),
      timestamp: new Date(formData.timestamp),
      unit: metricConfig.unit,
    });
  }

  return (
    <div className="bg-white md:min-w-[350px] lg:min-w-[600px] max-w-[750px] text-black dark:text-white dark:bg-gray-800 p-4 shadow-lg rounded-md">
      <div className="flex justify-between items-center">
        <p className=" text-center w-full sm:text-left text-xl ">
          Add New Metric
        </p>
        <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
          <IoAdd className="text-2xl text-red-400" />
        </div>
      </div>
      <div className="bg-red-100 rounded-md w-full h-1 my-4" />
      <form className="space-y-4">
        <div>
          <label htmlFor="type" className="block">
            Metric
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={onChange}
            className={`${dropDownStyle}`}
          >
            {metrics.map((field) => (
              <option key={field.key} value={field.key}>
                {field.icon} {field.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="value" className="block">
            Value in {metricConfig.unit}
          </label>
          <input
            id="value"
            name="value"
            type="number"
            value={formData.value}
            onChange={onChange}
            className={`${dropDownStyle}`}
          />
        </div>

        <div>
          <label htmlFor="timestamp" className="block">
            Recorded At
          </label>
          <input
            id="timestamp"
            name="timestamp"
            type="datetime-local"
            value={formData.timestamp}
            onChange={onChange}
            className={`${dropDownStyle}`}
          />
        </div>

        <button
          type="button"
          onClick={onSubmit}
          className={buttonStyle}
        >
          Add Record
        </button>
      </form>
    </div>
  );
}
