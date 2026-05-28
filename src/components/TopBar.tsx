import { Menu, MessageCircle } from 'lucide-react'
import { useNavigation } from './NavigationContext'

const WHATSAPP = '#25D366'
const INDIGO = '#4F46E5'

export function TopBar() {
  const { setSidebarOpen } = useNavigation()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4"
      dir="rtl"
    >
      <button
        onClick={() => setSidebarOpen(true)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted/60"
        style={{ color: INDIGO }}
      >
        <Menu className="h-5 w-5" />
        <span className="hidden sm:inline">תוכן עניינים</span>
      </button>

      <button
        onClick={() => { window.location.hash = '' ; window.location.pathname = '/' }}
        className="text-base font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
      >
        📊 מיקרו-כלכלה א'
      </button>

      <a
        href="https://api.whatsapp.com/send?phone=972544242706"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: WHATSAPP }}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">וואטסאפ</span>
      </a>
    </header>
  )
}
