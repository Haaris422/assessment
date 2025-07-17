import { CiDark, CiLight } from "react-icons/ci";

export function ThemeToggle({ darkMode, toggle }) {
  return <button className="shadow-md duration-300 transition-all ease-in-out
  hover:scale-105 cursor-pointer rounded-md text-2xl 
  text-black dark:text-amber-500 hover:opacity-65
  bg-white dark:bg-gray-800 p-2" onClick={toggle}>{!darkMode ? <CiDark /> : <CiLight />}</button>;
}
