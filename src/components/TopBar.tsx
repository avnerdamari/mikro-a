import { useEffect, useState } from 'react'
import logo from '@/assets/logo.png'
import { useNavigation } from './NavigationContext'

const INDIGO = '#4F46E5'

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('mikro-a-theme') === 'dark' ||
      document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('mikro-a-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('mikro-a-theme', 'light')
    }
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}

export function TopBar() {
  const { setSidebarOpen, setCurrentChapter } = useNavigation()
  const { dark, toggle } = useDarkMode()

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
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">תוכן עניינים</span>
      </button>

      {/* Center: logo + title */}
      <button
        onClick={() => setCurrentChapter('')}
        className="flex items-center gap-2 font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
      >
        <img src={logo} alt="לוגו" className="h-10 w-10 rounded-lg object-contain bg-white" />
        <span className="text-base">מיקרו-כלכלה א'</span>
      </button>

      {/* Left: dark/light toggle */}
      <button
        onClick={toggle}
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
      >
        {dark ? 'בהיר' : 'כהה'}
      </button>
    </header>
  )
}
