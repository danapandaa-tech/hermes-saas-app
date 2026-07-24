"use client"

import { useEffect, useState } from "react"

export type Theme = "dark" | "light"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("hermes-theme")
    const initialTheme = (stored === "light" || stored === "dark" ? stored : "dark") as Theme
    setTheme(initialTheme)
    setMounted(true)

    const root = document.documentElement
    if (initialTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("hermes-theme", theme)
  }, [theme, mounted])

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"))

  return { theme, toggle, mounted }
}
