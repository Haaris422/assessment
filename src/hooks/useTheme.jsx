import { useEffect, useState } from "react";

export function useTheme() {
  const [darkMode, setDarkmode] = useState(() => {
    const isDark = localStorage.getItem("darkMode");
    return isDark !== null ? JSON.parse(isDark) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle(
      "dark",
      darkMode || (!("darkMode" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

  }, [darkMode]);

  const toggle = () => {
    setDarkmode(prev => !prev);
  }

  return {darkMode, toggle};
}
