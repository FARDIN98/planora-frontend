"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch -- render nothing until mounted
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-14 h-7" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-7 w-14 items-center rounded-full bg-muted transition-colors duration-300"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Sun className="absolute left-1.5 h-4 w-4 text-amber-500" />
      <Moon className="absolute right-1.5 h-4 w-4 text-blue-400" />
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-background shadow-sm transition-transform duration-300 ${
          isDark ? "translate-x-7.5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
