import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"
  const saved = localStorage.getItem("theme") as Theme | null
  if (saved === "light" || saved === "dark") return saved
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark"))
  }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
