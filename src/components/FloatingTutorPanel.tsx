import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_W = 320, MIN_H = 360
// גודל-פתיחה כאחוז מהמסך (לא פיקסלים קבועים) — כך שהפאנל תמיד נפתח "גדול
// ונוח" גם על מסכים רחבים/גבוהים, ולא נתקע בגודל-פיקסלים קבוע שנקבע פעם
// אחת עבור מסך צר.
function defaultSize() {
  if (typeof window === 'undefined') return { w: 640, h: 760 }
  return {
    w: Math.max(MIN_W, Math.min(window.innerWidth - 16, window.innerWidth * 0.78)),
    h: Math.max(MIN_H, Math.min(window.innerHeight - 16, window.innerHeight * 0.88)),
  }
}

/**
 * "עוזר למידה" כפאנל צף — גרירה, שינוי-גודל, וכיווץ/הרחבה — במקום window.open
 * לטאב/חלון נפרד. מטרה: אפשר לעבוד במקביל על הספר ועל המורה בו-זמנית, בלי
 * לעזוב את העמוד. iframe נשאר mounted גם כשמכווצים (רק מוסתר), כדי לא לאבד
 * את היסטוריית השיחה. src משתנה (topic/q חדשים) גורם ל-iframe לנווט מחדש —
 * אותה "שימוש-חוזר בטאב קיים" כמו TUTOR_WINDOW_NAME הישן, רק בתוך אותו עמוד.
 * מקור: Corporate-Finance-App (17/9/26).
 */
export default function FloatingTutorPanel({
  open,
  src,
  onClose,
}: {
  open: boolean
  src: string
  onClose: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [size, setSize] = useState(defaultSize)
  // ממורכז (לא צמוד לימין) — כדי לא להסתיר/להיות מוסתר ע"י תוכן-הספר בצד ימין.
  const [pos, setPos] = useState(() => {
    const s = defaultSize()
    return {
      x: typeof window !== 'undefined' ? Math.max(8, (window.innerWidth - s.w) / 2) : 24,
      y: typeof window !== 'undefined' ? Math.max(8, (window.innerHeight - s.h) / 2) : 24,
    }
  })
  const dragRef = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null)
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null)

  // שאלה חדשה (src השתנה) — לוודא שהפאנל גלוי, לא נשאר מכווץ כשמגיעה תשובה חדשה
  useEffect(() => { if (open) setCollapsed(false) }, [src, open])

  const clampPos = useCallback((x: number, y: number, w: number) => ({
    x: Math.min(Math.max(0, x), Math.max(0, window.innerWidth - Math.min(w, 120))),
    y: Math.min(Math.max(0, y), Math.max(0, window.innerHeight - 40)),
  }), [])

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, startLeft: pos.x, startTop: pos.y }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      setPos(clampPos(dragRef.current.startLeft + dx, dragRef.current.startTop + dy, size.w))
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [pos, size, clampPos])

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: size.w, startH: size.h }
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return
      const dx = ev.clientX - resizeRef.current.startX
      const dy = ev.clientY - resizeRef.current.startY
      const maxW = window.innerWidth - pos.x - 8
      const maxH = window.innerHeight - pos.y - 8
      setSize({
        w: Math.min(maxW, Math.max(MIN_W, resizeRef.current.startW - dx)),
        h: Math.min(maxH, Math.max(MIN_H, resizeRef.current.startH + dy)),
      })
    }
    const onUp = () => {
      resizeRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [size, pos])

  if (!open) return null

  return (
    <div
      className="fixed z-50 flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:ring-white/10"
      style={{ left: pos.x, top: pos.y, width: collapsed ? 'auto' : size.w, height: collapsed ? 'auto' : size.h }}
    >
      <div className="flex shrink-0 items-center justify-between gap-2 bg-[#4F46E5] px-3 py-2 text-white select-none">
        {collapsed ? (
          // מכווץ — כל הרצועה (לא רק אייקון קטן) לחיצה אחת שמרחיבה, עם תווית מילולית ברורה.
          <button
            onClick={() => setCollapsed(false)}
            className="flex flex-1 items-center gap-2 rounded-md py-0.5 text-sm font-bold transition hover:bg-white/10 active:scale-[0.98]"
            title="הרחב את עוזר הלמידה"
          >
            <span>🎓 עוזר למידה</span>
            <span className="text-xs font-normal opacity-80">▲ הרחב</span>
          </button>
        ) : (
          <span
            className="flex-1 cursor-grab text-sm font-bold active:cursor-grabbing"
            onMouseDown={onDragStart}
          >
            🎓 עוזר למידה
          </span>
        )}
        <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
          {!collapsed && (
            <>
              {/* ידית שינוי-גודל — בתוך הפס הכחול (לא צפה על גבול התוכן). */}
              <button
                onMouseDown={onResizeStart}
                className="flex h-6 w-6 cursor-nesw-resize items-center justify-center rounded-full transition hover:bg-white/20 active:scale-90"
                title="גרור לשינוי גודל"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                  <path d="M14 2 L2 14 M14 7 L7 14 M14 12 L12 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </button>
              <button
                onClick={() => setCollapsed(true)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold transition hover:bg-white/20 active:scale-90"
                title="כווץ"
              >
                —
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-bold transition hover:bg-red-400 active:scale-90"
            title="סגור"
          >
            ✕
          </button>
        </div>
      </div>

      {!collapsed && (
        // allow="microphone": בלי זה, מדיניות-ההרשאות של iframe חוסמת גישת-מיקרופון
        // כברירת-מחדל — כפתור ההקלטה בתוך המורה "לא עובד" בלי שגיאה גלויה.
        <iframe
          src={src}
          title="עוזר למידה"
          allow="microphone"
          className="min-h-0 flex-1 border-0 bg-white"
        />
      )}
    </div>
  )
}
