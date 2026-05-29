import logo from '@/assets/logo.png'
import { useNavigation } from './NavigationContext'

const INDIGO = '#4F46E5'

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
        <img src={logo} alt="לוגו" className="h-8 w-8 rounded-lg object-contain" />
        <span className="text-base">מיקרו-כלכלה א'</span>
      </button>

      {/* Left: spacer */}
      <div className="w-24" />
    </header>
  )
}
