"use client"

import { useEffect, useState } from "react"

export type Theme = "dark" | "light"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const stored = localStorage.getItem("hermes-theme")
    const initialTheme = (stored === "light" || stored === "dark" ? stored : "dark") as Theme
    setTheme(initialTheme)

    const root = document.documentElement
    if (initialTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [])

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
