import { useEffect } from "react";

export function Snackbar({ message, type = "success", show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed bottom-6 left-6 z-50 transition-transform duration-300 transform ${
      show ? "translate-x-0" : "-translate-x-full"
    }`}>
      <div className={`px-4 py-3 rounded-lg shadow-lg text-white font-medium
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}>
        {message}
      </div>
    </div>
  );
}
