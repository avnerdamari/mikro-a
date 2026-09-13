import { useEffect, useRef, useState } from 'react'
import { X, Search, ChevronLeft, BookOpen } from 'lucide-react'
import { useNavigation } from './NavigationContext'
import { CHAPTERS, TOC_TREE, type TocNode } from '@/data/toc'
import { CONTENT_BODIES } from '@/data/contentIndex'
import { cn } from '@/lib/utils'

/* קיפול/פתיחה פר-node, נשמר בין ביקורים — סקיל build-book §2ד׳ (מבוסס
   livestats-il). מפתח ייעודי לספר הזה (כל ספר-origin מפריד את ה-localStorage
   שלו ממילא, אבל שם מפורש עוזר בדיבוג). */
const OPEN_IDS_KEY = 'mikro-a-toc-open-ids'

function loadStoredOpenIds(): Set<string> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(OPEN_IDS_KEY)
    return raw ? new Set(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

/** true רק כשלמכשיר יש עכבר אמיתי (לא טאץ') — סקיל build-book §2ד׳,
    "נוחות שולחן-עבודה": חשיפת תוכן-העניינים בהעברת-עכבר לקצה ימין
    לא אמורה לקרות בטאץ' (אין "hover" אמיתי שם, וזה עלול לתפוס קליקים). */
function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setHoverCapable(mq.matches)
    const handler = (e: MediaQueryListEvent) => setHoverCapable(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return hoverCapable
}

/** מיקום הקצה-הימני (בפיקסלים משמאל-המסך, כרגיל ב-DOM) של עמודת התוכן
    הנוכחית (`#content-root`, מוגדר ב-ChapterLayout.tsx) — כדי שרצועת-החשיפה
    תתחיל **מיד מחוץ לתוכן**, לא רק בשוליים הצרים ביותר של המסך עצמו (סקיל
    build-book §2ד׳, מבוסס livestats-il: `useContentRightEdge`). עוקב אחרי
    `currentChapter` כי `#content-root` מוחלף בכל מעבר-פרק. */
function useContentRightEdge(currentChapter: string) {
  const [right, setRight] = useState<number | null>(null)
  useEffect(() => {
    const el = document.getElementById('content-root')
    if (!el) {
      setRight(null)
      return
    }
    const update = () => setRight(el.getBoundingClientRect().right)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [currentChapter])
  return right
}

function saveStoredOpenIds(ids: Set<string>) {
  try {
    localStorage.setItem(OPEN_IDS_KEY, JSON.stringify([...ids]))
  } catch {
    // localStorage לא זמין (מצב פרטי/חסום) — לא קריטי, פשוט לא נשמר
  }
}

/** שרשרת ה-id-ים מהשורש ועד ה-node שמכיל chapter.id === targetChapterId (כולל עצמו). */
function findPathToChapter(nodes: TocNode[], targetChapterId: string, path: string[] = []): string[] | null {
  for (const node of nodes) {
    const next = [...path, node.id]
    if (node.chapter?.id === targetChapterId) return next
    if (node.children) {
      const found = findPathToChapter(node.children, targetChapterId, next)
      if (found) return found
    }
  }
  return null
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, currentChapter, setCurrentChapter } = useNavigation()
  const hoverCapable = useHoverCapable()
  const contentRightEdge = useContentRightEdge(currentChapter)
  const [q, setQ] = useState('')
  const [resultsOpen, setResultsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navRef = useRef<HTMLElement>(null)

  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const stored = loadStoredOpenIds()
    if (stored) return stored
    // ביקור ראשון (אין מצב שמור) — מרחיבים אוטומטית את מסלול-האבות לפרק הנוכחי
    const path = findPathToChapter(TOC_TREE, currentChapter)
    return new Set(path ?? [])
  })

  useEffect(() => {
    saveStoredOpenIds(openIds)
  }, [openIds])

  // בכל פתיחת הפאנל — לוודא שמסלול-האבות לפריט הפעיל פתוח, ואז לגלול אליו
  useEffect(() => {
    if (!sidebarOpen) return
    const path = findPathToChapter(TOC_TREE, currentChapter)
    if (path) {
      setOpenIds(prev => {
        if (path.every(id => prev.has(id))) return prev
        const next = new Set(prev)
        path.forEach(id => next.add(id))
        return next
      })
    }
    const timer = setTimeout(() => {
      navRef.current?.querySelector(`[data-node-id="${currentChapter}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }, 150)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarOpen])

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  /* החיפוש סורק גם את **גוף** הפרקים (CONTENT_BODIES), לא רק כותרות —
     אחרת ביטוי כמו "עלות אלטרנטיבית" לא נמצא באף מקום. נשאר מחוץ לעץ-
     הקיפול עצמו (סקיל build-book §2ד׳ סעיף 5) — חוויה נפרדת. */
  const filtered = q.trim()
    ? CHAPTERS.filter(c =>
        c.title.includes(q) ||
        c.subtitle.includes(q) ||
        String(c.number).includes(q) ||
        (CONTENT_BODIES[c.id] ?? '').includes(q)
      )
    : []

  useEffect(() => {
    if (sidebarOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [sidebarOpen])

  const go = (id: string, { closeSidebar = true } = {}) => {
    setCurrentChapter(id)
    if (closeSidebar) setSidebarOpen(false)
    setQ('')
  }

  function renderNode(node: TocNode, depth: number) {
    const hasChildren = !!node.children?.length
    const isOpen = openIds.has(node.id)
    const isActive = node.chapter?.id === currentChapter
    const isPractice = node.chapter?.kind === 'practice'
    const label = node.chapter?.title ?? node.label ?? ''

    const handleClick = () => {
      if (hasChildren) {
        toggle(node.id)
        // node שהוא גם קבוצה וגם קישור (כמו פרק תיאוריה עם תרגול תחתיו) —
        // מנווט אבל לא סוגר את הפאנל (סקיל build-book §2ד׳ סעיף 3)
        if (node.chapter) go(node.chapter.id, { closeSidebar: false })
      } else if (node.chapter) {
        go(node.chapter.id)
      }
    }

    return (
      <div key={node.id}>
        <button
          data-node-id={node.chapter?.id ?? node.id}
          onClick={handleClick}
          style={{ paddingInlineStart: `${12 + depth * 16}px` }}
          className={cn(
            'flex w-full items-start gap-2 rounded-lg py-2.5 pl-3 text-right transition-colors',
            isActive ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200' : 'hover:bg-muted/60 hover:text-foreground text-foreground'
          )}
        >
          {/* שברון-קיפול לנתיב עם children בלבד; ל-leaf spacer בלתי-נראה לשמירת יישור */}
          {hasChildren ? (
            <ChevronLeft className={cn('mt-1 h-3.5 w-3.5 shrink-0 opacity-60 transition-transform', isOpen && '-rotate-90')} />
          ) : (
            <span className="mt-1 h-3.5 w-3.5 shrink-0" />
          )}

          {node.chapter ? (
            <>
              <span
                className={cn(
                  'mt-0.5 flex shrink-0 items-center justify-center text-white text-xs font-bold',
                  isPractice ? 'h-5 w-5 rounded-md text-[10px]' : 'h-6 w-6 rounded-full'
                )}
                style={{ backgroundColor: node.chapter.color }}
              >
                {isPractice ? '✎' : node.chapter.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn(
                  depth === 0 ? 'text-sm font-bold' : depth === 1 ? 'text-sm font-semibold' : 'text-xs font-medium',
                  'leading-snug',
                  isActive && 'text-indigo-700 dark:text-indigo-200'
                )}>
                  {label}
                </p>
                {!isPractice && (
                  <span className="mt-0.5 block truncate text-[10px] text-muted-foreground">{node.chapter.examWeight}</span>
                )}
              </div>
            </>
          ) : (
            <span className={cn(depth === 0 ? 'text-xs font-bold uppercase tracking-wider' : 'text-sm font-semibold', 'text-muted-foreground')}>
              {label}
            </span>
          )}
        </button>

        {hasChildren && isOpen && (
          <div>{node.children!.map(child => renderNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  /* חשיפה בהעברת-עכבר לקצה ימין / הסתרה כשהעכבר עוזב — רק במכשיר עם עכבר
     אמיתי (סקיל build-book §2ד׳, מבוסס livestats-il). הרצועה הבלתי-נראית
     קיימת רק כשהפאנל סגור (אחרת אין מה "לחשוף"); הפאנל עצמו נסגר ב-
     onMouseLeave כשהעכבר יוצא ממנו חזרה שמאלה, לתוך התוכן. */
  if (!sidebarOpen) {
    if (!hoverCapable || contentRightEdge == null) return null
    return (
      <div
        /* מתחת לכותרת (top-14, כמו ה-pt-14 של ה-main) — לא inset-y-0 מ-0!
           אחרת הרצועה השקופה יושבת מעל הכותרת (z-30, אותו z כמו TopBar) ותופסת
           קליקים על כפתור "תוכן עניינים" עצמו, כי הכותרת ב-max-w-6xl רחבה
           יותר מ-#content-root שב-max-w-4xl — הכפתור נופל בדיוק בטווח-ה-x
           של הרצועה. קרה בפועל (Mikro-A, 13/9/26). */
        className="fixed top-14 bottom-0 right-0 z-30"
        style={{ left: contentRightEdge }}
        onMouseEnter={() => setSidebarOpen(true)}
        aria-hidden
      />
    )
  }

  return (
    <>
      {/* תפיסת-קליק לסגירה — בלי הכהיה/טשטוש של התוכן שמאחורי הפאנל.
          עם חשיפת-hover (§2ד׳) הכהיית-מסך מלאה על כל ריחוף היא מוגזמת. */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setSidebarOpen(false)}
      />
      {/* Drawer */}
      <aside
        onMouseLeave={() => { if (hoverCapable) setSidebarOpen(false) }}
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

        {/* TOC tree */}
        <nav ref={navRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <button
            data-node-id="home"
            onClick={() => go('home')}
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-sm font-semibold transition-colors',
              currentChapter === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <ChevronLeft className="h-3.5 w-3.5 shrink-0 opacity-50" />
            🏠 דף ראשי
          </button>

          {TOC_TREE.map(node => (
            <div key={node.id} className="pt-1">
              {renderNode(node, 0)}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">מבוא לכלכלה א' | אבנר דמארי</p>
        </div>
      </aside>
    </>
  )
}
