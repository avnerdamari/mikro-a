import { useEffect, useRef, useState } from 'react'
import { RadialMindMap } from './RadialMindMap'
import { MIKRO_MINDMAP_TREE, MIKRO_MINDMAP_CENTER, MIKRO_MINDMAP_DEFAULT_OPEN } from '../data/mindMapTree'

/* רוחב הפאנל דינמי לפי רוחב החלון (עד תקרה) — כדי שלעמודת-הפעולות (תיאוריה/
   תרגול) יהיה מקום אמיתי במקום להימחץ לקצה הפאנל. */
const MAX_PANEL_WIDTH = 1400
function fullPanelWidth(): number {
  if (typeof window === 'undefined') return 1150
  return Math.min(MAX_PANEL_WIDTH, window.innerWidth - 32)
}

/**
 * חלון צף וניתן-לגרירה עם מפת ההתמצאות — אותו דפוס בדיוק כמו שאר החלונות
 * הצפים בפורמט (סקיל build-book §2ג): לא מכסה את שאר המסך (אין backdrop),
 * לא נסגר בלחיצה מחוצה לו. נסגר רק ב-"✕ סגור". לחיצה כפולה על בועה מנווטת
 * לפרק וגם מכווצת את הפאנל לריבוע קטן מעל טור הכפתורים הצפים.
 */
export function MindMapPanel({ onNavigate, onClose }: {
  onNavigate: (chapterId: string) => void
  onClose: () => void
}) {
  const getInitialPos = () => {
    if (typeof window === 'undefined') return { x: 40, y: 80 }
    return { x: Math.max(16, (window.innerWidth - fullPanelWidth()) / 2), y: 72 }
  }
  const [pos, setPos] = useState(getInitialPos)
  const [fullWidth, setFullWidth] = useState(fullPanelWidth)
  useEffect(() => {
    const onResize = () => setFullWidth(fullPanelWidth())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)
  const [dragging, setDragging] = useState(false)

  const MINI_SIZE = '2cm'
  const MINI_LEFT = 20 // תואם bottom-5/left-5 של מארז הכפתורים הצפים ב-App.tsx
  const MINI_GAP = 12
  const MINI_BOTTOM_FALLBACK = 140
  const [collapsed, setCollapsed] = useState(false)
  const [miniBottom, setMiniBottom] = useState(MINI_BOTTOM_FALLBACK)
  useEffect(() => {
    if (!collapsed) return
    const stack = document.querySelector('[data-floating-stack]')
    const measure = () => {
      if (!stack) { setMiniBottom(MINI_BOTTOM_FALLBACK); return }
      const r = stack.getBoundingClientRect()
      setMiniBottom(Math.round(window.innerHeight - r.top + MINI_GAP))
    }
    measure()
    window.addEventListener('resize', measure)
    const ro = stack ? new ResizeObserver(measure) : null
    if (stack && ro) ro.observe(stack)
    return () => { window.removeEventListener('resize', measure); ro?.disconnect() }
  }, [collapsed])
  const panelWidth = fullWidth
  const restoreFull = () => setCollapsed(false)
  const minimize = () => setCollapsed(true)
  const handleNavigate = (chapterId: string) => {
    minimize()
    onNavigate(chapterId)
  }

  const onHeaderPointerDown = (e: React.PointerEvent) => {
    dragState.current = { startX: e.clientX, startY: e.clientY, originX: pos.x, originY: pos.y }
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onHeaderPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    const maxX = window.innerWidth - 80
    const maxY = window.innerHeight - 40
    setPos({
      x: Math.min(maxX, Math.max(-panelWidth + 80, dragState.current.originX + dx)),
      y: Math.min(maxY, Math.max(0, dragState.current.originY + dy)),
    })
  }
  const onHeaderPointerUp = () => {
    dragState.current = null
    setDragging(false)
  }

  if (collapsed) {
    return (
      <div
        onClick={restoreFull}
        title="לחיצה להחזרת מפת ההתמצאות לגודלה המלא"
        aria-label="מפת התמצאות מכווצת — לחיצה לשחזור"
        className="no-print fixed z-[10000] flex cursor-pointer select-none items-center justify-center rounded-xl bg-brand text-white shadow-2xl transition-all duration-300 ease-out hover:brightness-110"
        style={{ left: MINI_LEFT, bottom: miniBottom, width: MINI_SIZE, height: MINI_SIZE }}
      >
        <span className="text-2xl" aria-hidden>🗺️</span>
      </div>
    )
  }

  return (
    <div
      className={`no-print fixed z-[10000] flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xl ${dragging ? '' : 'transition-all duration-300 ease-out'}`}
      style={{ left: pos.x, top: pos.y, width: panelWidth, maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100vh - 32px)' }}
      dir="rtl"
    >
      <div
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={onHeaderPointerUp}
        className={`flex shrink-0 items-center justify-between gap-2 bg-brand px-4 py-2.5 text-white ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ touchAction: 'none' }}
      >
        <span className="text-sm font-semibold select-none">מפת התמצאות — גררו כדי להזיז</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="סגור"
          className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold hover:bg-white/25 transition-colors"
        >
          ✕ סגור
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <RadialMindMap
          tree={MIKRO_MINDMAP_TREE}
          center={MIKRO_MINDMAP_CENTER}
          defaultOpenIds={MIKRO_MINDMAP_DEFAULT_OPEN}
          onNavigate={handleNavigate}
          heightClass="h-[calc(100vh-110px)]"
        />
      </div>
    </div>
  )
}
