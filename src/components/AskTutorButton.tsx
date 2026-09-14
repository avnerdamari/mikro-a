import { useState } from 'react'
import { useNavigation } from './NavigationContext'

/* כפתור "שאל את המורה" פר-תרגיל (סקיל solve-question §6, "עוזר הלמידה — אותה
   שורה כמו כפתורי GuidedSolver") — לא כפתור-הפרק הצף (TutorButton.tsx), אלא
   קישור ממוקד לתרגיל הספציפי. מורה ייעודי: Mikro-Tutor (ראו TutorButton.tsx). */

const TUTOR_BASE = 'https://mikro-tutor.vercel.app'
// שם-חלון קבוע — משותף גם עם TutorButton.tsx (הכפתור הצף) — כל לחיצה על כל
// אחד משני כפתורי-המורה משתמשת-מחדש באותו טאב קיים, במקום לפתוח טאב חדש
// בכל שאלה. "_blank" (הישן) תמיד יוצר הקשר-דפדפן חדש — סקיל build-book §2ב,
// מבוסס Advisors-App (מקור-האמת).
export const TUTOR_WINDOW_NAME = 'mikro-tutor-ai'

export function AskTutorButton({ topic, anchorId }: { topic: string; anchorId?: string }) {
  const [showNote, setShowNote] = useState(false)
  const { currentChapter } = useNavigation()

  /* מעתיק את נוסח השאלה עצמה למורה (q=), לא רק נושא כללי — סקיל build-book §2ב,
     "AskTutorButton.tsx — המנגנון המלא". משבט את מיכל-השאלה (anchorId), מסיר ממנו
     כל בקרה אינטראקטיבית (input/button/textarea/select) וכל מה שמסומן .tutor-skip,
     קורא innerText נקי (עד 3,000 תווים). השיבוט חייב להיות מחובר זמנית ל-DOM (לא רק
     ב-מזיכרון) כשקוראים innerText ממנו — אחרת שבירות-השורה בין פסקאות "נבלעות". */
  const extractQuestionText = (): string => {
    if (!anchorId) return ''
    const el = document.getElementById(anchorId)
    if (!el) return ''
    const clone = el.cloneNode(true) as HTMLElement
    clone.querySelectorAll('input, button, textarea, select, .tutor-skip').forEach(n => n.remove())
    clone.style.position = 'fixed'
    clone.style.left = '-99999px'
    clone.style.top = '0'
    document.body.appendChild(clone)
    const text = clone.innerText?.trim().slice(0, 3000) ?? ''
    clone.remove()
    return text
  }

  const open = () => {
    if (!TUTOR_BASE) { setShowNote(true); return }
    // ?chapter=<id> — בלי זה "חזרה לספר" תמיד נוחת על 'home', כי לאפליקציה
    // הזו אין סנכרון-URL בכלל (כל ה-state בזיכרון). NavigationContext קורא
    // את זה ב-mount (initialChapterFromUrl) ומחזיר ישר לפרק+לשאלה (App.tsx
    // גולל אל #anchorId). סקיל build-book §2ב.
    const base = `${location.origin}${location.pathname}?chapter=${encodeURIComponent(currentChapter)}`
    const ret = anchorId ? `${base}#${anchorId}` : base
    const q = extractQuestionText()
    const url = `${TUTOR_BASE}/?topic=${encodeURIComponent(topic)}&q=${encodeURIComponent(q)}&return=${encodeURIComponent(ret)}`
    window.open(url, TUTOR_WINDOW_NAME, 'noreferrer')
  }

  return (
    <>
      <button
        onClick={open}
        title="שאל את המורה על התרגיל הזה"
        className="inline-flex min-w-0 items-center justify-center rounded-lg px-1.5 py-1.5 text-center text-xs font-bold leading-tight text-white transition hover:brightness-110 active:scale-95"
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
