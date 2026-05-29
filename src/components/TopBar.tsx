import { useState, useEffect } from 'react'
import { Menu, Sun, Moon } from 'lucide-react'
import { useNavigation } from './NavigationContext'

const INDIGO = '#4F46E5'

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('mikro-a-theme', next ? 'dark' : 'light')
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('mikro-a-theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-muted/60"
      title={dark ? 'מצב בהיר' : 'מצב כהה'}
      aria-label="החלף צבעים"
    >
      {dark ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
    </button>
  )
}

export function TopBar() {
  const { setSidebarOpen, setCurrentChapter } = useNavigation()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4"
      dir="rtl"
    >
      {/* Right: menu */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted/60"
        style={{ color: INDIGO }}
      >
        <Menu className="h-5 w-5" />
        <span className="hidden sm:inline">תוכן עניינים</span>
      </button>

      {/* Center: logo + title */}
      <button
        onClick={() => setCurrentChapter('')}
        className="flex items-center gap-2 font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg text-white text-sm font-extrabold" style={{ backgroundColor: INDIGO }}>מ</span>
        <span className="text-base hidden sm:inline">מיקרו-כלכלה א'</span>
        <span className="text-base sm:hidden">מיקרו א'</span>
      </button>

      {/* Left: theme toggle */}
      <ThemeToggle />
    </header>
  )
}
