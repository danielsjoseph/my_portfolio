import { useEffect, useState } from "react";

function getInitialDarkMode(): boolean {
  const stored = localStorage.getItem("theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function DarkModeToggle() {
  const [dark, setDark] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
      className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 sm:px-3 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {dark ? "☀️" : "🌙"} <span className="hidden sm:inline">{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
