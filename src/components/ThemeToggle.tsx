'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Hydration guard: theme preferences are available only in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    setTheme(stored || system)
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(next)
  }

  if (!mounted) return <button aria-label="Toggle color scheme" className="h-11 w-11 rounded-lg" disabled />

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="flex h-11 w-11 items-center justify-center rounded-lg text-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
    </button>
  )
}
