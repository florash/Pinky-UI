"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export const THEMES = ["milk", "blush", "cloud"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "pinky-theme";

export const themeScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="blush"||t==="cloud"){document.documentElement.dataset.theme=t}}catch(e){}})()`;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({ theme: "milk", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always "milk" for the first render: the inline script has already painted
  // the real theme onto <html>, and reading it during render would desync
  // hydration for no benefit.
  const [theme, setThemeState] = useState<Theme>("milk");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "blush" || current === "cloud") setThemeState(current);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing modes can refuse storage; the theme still applies.
    }
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
