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
    /* כותרת המותג — רקע נייבי אחיד (סקיל build-book, סעיף 2א) */
    <header
      className="no-print fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between px-4 shadow-md"
      style={{ backgroundColor: 'var(--brand)' }}
      dir="rtl"
    >
      {/* ימין: תפריט */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95 active:translate-y-0.5"
        style={{ backgroundColor: INDIGO }}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="hidden sm:inline">תוכן עניינים</span>
      </button>

      {/* מרכז: לוגו + שם הספר + תת-כותרת */}
      <button
        onClick={() => setCurrentChapter('')}
        className="flex items-center gap-2 transition hover:opacity-80"
      >
        <div className="flex flex-col items-end">
          <span className="text-base font-extrabold tracking-tight text-white md:text-lg">מבוא לכלכלה א'</span>
          <span className="text-[10px] text-sky-200 md:text-xs">מיקרו-כלכלה · אינטראקטיבי</span>
        </div>
        <img src={logo} alt="לוגו" className="h-10 w-10 rounded-lg bg-white object-contain" />
      </button>

      {/* שמאל: מצב כהה/בהיר */}
      <button
        onClick={toggle}
        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/15 active:scale-95"
      >
        {dark ? 'בהיר' : 'כהה'}
      </button>
    </header>
  )
}
