import { useNavigation } from './NavigationContext'

/* כפתור "שאל את המורה" פר-תרגיל (סקיל solve-question §6, "עוזר הלמידה — אותה
   שורה כמו כפתורי GuidedSolver") — לא כפתור-הפרק הצף (TutorButton.tsx), אלא
   בקשה ממוקדת לתרגיל הספציפי. נפתח כפאנל צף מוטמע (FloatingTutorPanel) —
   לא טאב נפרד — כדי לעבוד במקביל על הספר והמורה. מורה ייעודי: Mikro-Tutor
   (ראו TutorButton.tsx). */

export function AskTutorButton({ topic, anchorId }: { topic: string; anchorId?: string }) {
  const { openTutor } = useNavigation()

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
    openTutor(topic, extractQuestionText())
  }

  return (
    <button
      onClick={open}
      title="שאל את המורה על התרגיל הזה"
      className="inline-flex min-w-0 items-center justify-center gap-1 rounded-full px-2 py-2 text-center text-xs font-bold leading-tight text-white transition hover:brightness-110 active:scale-95 sm:px-4 sm:py-2.5 sm:text-sm"
      style={{ backgroundColor: '#1F6F3F' }}
    >
      שאל את המורה
    </button>
  )
}
