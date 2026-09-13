import { useState } from 'react'

/* כפתור "שאל את המורה" פר-תרגיל (סקיל solve-question §6, "עוזר הלמידה — אותה
   שורה כמו כפתורי GuidedSolver") — לא כפתור-הפרק הצף (TutorButton.tsx), אלא
   קישור ממוקד לתרגיל הספציפי. מורה ייעודי: Mikro-Tutor (ראו TutorButton.tsx). */

const TUTOR_BASE = 'https://mikro-tutor.vercel.app'

export function AskTutorButton({ topic, anchorId }: { topic: string; anchorId?: string }) {
  const [showNote, setShowNote] = useState(false)

  const open = () => {
    if (!TUTOR_BASE) { setShowNote(true); return }
    const ret = anchorId ? `${location.href.split('#')[0]}#${anchorId}` : location.href
    const url = `${TUTOR_BASE}/?topic=${encodeURIComponent(topic)}&return=${encodeURIComponent(ret)}`
    window.open(url, '_blank', 'noreferrer')
  }

  return (
    <>
      <button
        onClick={open}
        title="שאל את המורה על התרגיל הזה"
        className="rounded-lg px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110 active:scale-95"
        style={{ backgroundColor: '#1F6F3F' }}
      >
        🎓 שאל את המורה
      </button>

      {showNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowNote(false)}>
          <div className="max-w-sm rounded-2xl bg-card p-5 text-center shadow-xl" onClick={e => e.stopPropagation()} dir="rtl">
            <p className="text-lg font-bold">🎓 עוזר הלמידה — בהכנה</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              בקרוב תוכלו לשאול כאן עוזר AI שאלה ממוקדת על התרגיל הזה בדיוק.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              בינתיים — כפתור <b>וואטסאפ</b> פתוח לכל שאלה.
            </p>
            <button
              onClick={() => setShowNote(false)}
              className="mt-4 rounded-lg px-4 py-2 text-sm font-bold text-white"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </>
  )
}
