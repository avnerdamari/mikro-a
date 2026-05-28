import { useState, useRef, useEffect } from 'react'
import { X, Search, ChevronLeft, BookOpen } from 'lucide-react'
import { useNavigation } from './NavigationContext'
import { CHAPTERS } from '@/data/toc'
import { cn } from '@/lib/utils'

const PRIORITY_BADGE: Record<string, { label: string; cls: string }> = {
  high:   { label: 'חשוב', cls: 'bg-red-100 text-red-700' },
  medium: { label: 'בינוני', cls: 'bg-yellow-100 text-yellow-700' },
  low:    { label: 'קצר', cls: 'bg-gray-100 text-gray-500' },
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, currentChapter, setCurrentChapter } = useNavigation()
  const [q, setQ] = useState('')
  const [resultsOpen, setResultsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = q.trim()
    ? CHAPTERS.filter(c =>
        c.title.includes(q) ||
        c.subtitle.includes(q) ||
        String(c.number).includes(q)
      )
    : []

  useEffect(() => {
    if (sidebarOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [sidebarOpen])

  if (!sidebarOpen) return null

  const go = (id: string) => {
    setCurrentChapter(id)
    setSidebarOpen(false)
    setQ('')
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={() => setSidebarOpen(false)}
      />
      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-background border-l border-border shadow-xl flex flex-col"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span className="font-bold text-sm">תוכן עניינים</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-md p-1 hover:bg-muted/60 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-border relative">
          <div className="relative">
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              value={q}
              onChange={e => { setQ(e.target.value); setResultsOpen(true) }}
              onFocus={() => setResultsOpen(true)}
              placeholder="חיפוש בתוכן..."
              className="w-full rounded-lg border border-border/60 bg-background py-2 pr-9 pl-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            {q && (
              <button onClick={() => { setQ(''); setResultsOpen(false) }} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {resultsOpen && filtered.length > 0 && (
            <div className="absolute left-3 right-3 top-full mt-1 z-20 rounded-xl border border-border bg-popover shadow-lg max-h-60 overflow-y-auto">
              {filtered.map(c => (
                <button key={c.id} onClick={() => { go(c.id); setResultsOpen(false) }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-right hover:bg-muted/60 border-b border-border/40 last:border-0">
                  <span className="font-bold text-sm" style={{ color: c.color }}>{c.number}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TOC list */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {/* Home */}
          <button
            onClick={() => go('home')}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-sm font-semibold transition-colors',
              currentChapter === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5 shrink-0 opacity-50" />
            🏠 דף ראשי
          </button>

          <div className="pt-1 pb-0.5">
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">פרקי הקורס</p>
          </div>

          {CHAPTERS.map(c => {
            const isActive = currentChapter === c.id
            const badge = PRIORITY_BADGE[c.priority]
            return (
              <button
                key={c.id}
                onClick={() => go(c.id)}
                className={cn(
                  'flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-right transition-colors',
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-muted/60 hover:text-foreground text-foreground'
                )}
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: c.color }}
                >
                  {c.number}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-semibold leading-snug', isActive ? 'text-indigo-700' : 'text-foreground')}>
                    {c.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold', badge.cls)}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">{c.examWeight}</span>
                  </div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">מבוא לכלכלה א' | אבנר דמארי</p>
        </div>
      </aside>
    </>
  )
}
