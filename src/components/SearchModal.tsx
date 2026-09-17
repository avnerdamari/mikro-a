import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { useNavigation } from './NavigationContext'
import { CHAPTERS } from '@/data/toc'
import { CONTENT_BODIES } from '@/data/contentIndex'

/* מודל "🔍 חיפוש" עצמאי בכותרת (סקיל build-book §2ו) — נפרד מהחיפוש
   המוטמע בפאנל ה-TOC (Sidebar.tsx). לוגיקת הסינון מועתקת משם בכוונה
   (לא לוגיקה חדשה): סורקת גם CONTENT_BODIES, לא רק כותרת/תת-כותרת. */
export function SearchModal() {
  const { setCurrentChapter, setSearchOpen } = useNavigation()
  const [q, setQ] = useState('')

  const close = () => { setSearchOpen(false); setQ('') }

  const filtered = q.trim()
    ? CHAPTERS.filter(c =>
        c.title.includes(q) ||
        c.subtitle.includes(q) ||
        String(c.number).includes(q) ||
        (CONTENT_BODIES[c.id] ?? '').includes(q)
      )
    : []

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20 px-4"
      onClick={close}
      dir="rtl"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-popover p-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <Search className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="חיפוש בכל הספר..."
            className="w-full rounded-lg border border-border/60 bg-background py-2 pr-9 pl-8 text-right text-sm text-foreground outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            onClick={close}
            aria-label="סגור חיפוש"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <ul className="mt-3 max-h-72 space-y-1 overflow-y-auto">
          {q.trim() && filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">לא נמצאו תוצאות</li>
          )}
          {filtered.map(c => (
            <li key={c.id}>
              <button
                onClick={() => { setCurrentChapter(c.id); close() }}
                className="flex w-full items-center gap-3 rounded-lg border-b border-border/40 px-3 py-2 text-right last:border-0 hover:bg-muted/60"
              >
                <span className="text-sm font-bold" style={{ color: c.color }}>{c.number}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.subtitle}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
