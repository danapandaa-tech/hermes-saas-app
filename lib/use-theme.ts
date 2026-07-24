"use client"

import { useEffect, useState } from "react"

export type Theme = "dark" | "light"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  const stored = localStorage.getItem("hermes-theme")
  if (stored === "light" || stored === "dark") return stored
  return "dark"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply .dark class synchronously whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("hermes-theme", theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return { theme, toggle }
}
