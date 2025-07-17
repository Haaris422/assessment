import { useState } from "react";
import { submitButtonStyle, dropDownStyle, metrics, validationRules } from "../constants/metrics";
import { IoAdd } from "react-icons/io5";



export function NewEntryForm({ addNewEntry, showSnackbar }) {
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(metrics.map((m) => [m.key, ""]))
  );
  const [validationErrors, setValidationErrors] = useState({});

  function onChange(e) {
    const { name, value } = e.target;

    if (value === "-" || value.includes("-")) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit() {
    const newErrors = {};
    const metricGroup = metrics
      .map((m) => {
        const valueStr = formData[m.key];
        const value = Number(valueStr);
        const rules = validationRules[m.key];

        if (valueStr === "") {
          newErrors[m.key] = "This field is required.";
          return null;
        }

        if (value < rules.min || value > rules.max) {
          newErrors[m.key] = `Value must be between ${rules.min} and ${rules.max}`;
          return null;
        }

        return {
          type: m.key,
          value,
          unit: m.unit,
        };
      })
      .filter(Boolean); 
    setValidationErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && metricGroup.length > 0) {
      addNewEntry(metricGroup);
      setFormData(() => Object.fromEntries(metrics.map((m) => [m.key, ""])));
      showSnackbar('Entries Added Successfully', 'success')
    }else{
      showSnackbar('Please fix the errors in the form.', 'error')
    }
  }

  return (
    <div className="bg-white w-full lg:min-w-[600px] hover:shadow-xl border border-gray-100 dark:border-gray-700 text-black dark:text-white dark:bg-gray-800 p-4 shadow-lg rounded-xl">
      <div className="flex justify-between items-center">
        <p className="w-full text-left text-xl font-bold">Add New Metrics</p>
        <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-md">
          <IoAdd className="text-2xl text-red-400" />
        </div>
      </div>
      <div className="bg-red-100 rounded-md w-full h-1 my-4" />

      <form className="space-y-4 mb-4">
        {metrics.map((metric) => {
          const error = validationErrors[metric.key];
          return (
            <div key={metric.key}>
              <label htmlFor={metric.key} className="block">
               {metric.icon} {metric.label} ({metric.unit})
              </label>
              <input
                id={metric.key}
                name={metric.key}
                type="number"
                placeholder={`Enter ${metric.label}`}
                value={formData[metric.key]}
                onChange={onChange}
                className={`${dropDownStyle} ${
                  error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
                }`}
                inputMode="decimal"
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
          );
        })}

        <button type="button" onClick={onSubmit} className={submitButtonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
}
