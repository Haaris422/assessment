import { FaHeartbeat } from "react-icons/fa";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";

export function Header() {
    const {darkMode, toggle} = useTheme();
  return (
    <div className="flex justify-between w-full items-center">
      <div className="flex items-center gap-2 text-left">
        <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md">
        <FaHeartbeat className="text-2xl md:text-4xl text-red-400" />
        </div>
        <div>
          <p className="text-xl md:text-4xl font-bold text-black dark:text-white">Health Metrics Tracker</p>
          <p className="text-sm sm:text-md md:text-lg text-gray-900 dark:text-gray-100">Your daily health, organized and in control.</p>
        </div>
      </div>
      <ThemeToggle darkMode={darkMode} toggle={toggle}/>
    </div>
  );
}
