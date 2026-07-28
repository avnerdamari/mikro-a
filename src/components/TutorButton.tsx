import { useState } from 'react'

/* עוזר למידה — צ'אט AI שמכיר את הפרק שהתלמיד נמצא בו כרגע.
   המורה עצמו הוא **פריסה נפרדת** (כמו advisors-tutor.vercel.app).
   כל עוד TUTOR_BASE ריק — הכפתור מסביר שהוא בהכנה, ולא נשבר. */

const TUTOR_BASE = ''   // ← כשייפרס מורה ייעודי: הכתובת שלו

/** מיפוי פרק → נושא-הוראה אצל המורה. */
const TUTOR_TOPIC: Record<string, string> = {
  intro: 'intro',
  ppf: 'ppf', 'ppf-practice': 'ppf',
  production: 'production', 'production-practice': 'production',
  costs: 'costs', 'costs-practice': 'costs',
  demand: 'demand', 'demand-practice': 'demand',
  elasticity: 'elasticity', 'elasticity-practice': 'elasticity',
  equilibrium: 'equilibrium', 'equilibrium-practice': 'equilibrium',
  intervention: 'intervention', 'intervention-practice': 'intervention',
  'open-economy': 'open-economy', 'open-economy-practice': 'open-economy',
  tariff: 'tariff', 'tariff-practice': 'tariff',
  monopoly: 'monopoly', 'monopoly-practice': 'monopoly',
  exams: 'review', formulas: 'review', glossary: 'review', solutions: 'review',
}

export function TutorButton({ chapterId }: { chapterId: string }) {
  const [showNote, setShowNote] = useState(false)
  const topic = TUTOR_TOPIC[chapterId] ?? 'review'

  const open = () => {
    if (!TUTOR_BASE) { setShowNote(true); return }
    const url = `${TUTOR_BASE}/?topic=${encodeURIComponent(topic)}&return=${encodeURIComponent(location.href)}`
    window.open(url, '_blank', 'noreferrer')
  }

  return (
    <>
      <button
        onClick={open}
        title="עוזר למידה — צ'אט AI על הפרק הנוכחי"
        className="flex w-36 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 hover:shadow-xl active:scale-95 active:translate-y-0.5"
        style={{ backgroundColor: 'var(--action)' }}
      >
        <span aria-hidden>🎓</span>
        <span>עוזר למידה</span>
      </button>

      {showNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowNote(false)}>
          <div className="max-w-sm rounded-2xl bg-card p-5 text-center shadow-xl" onClick={e => e.stopPropagation()} dir="rtl">
            <p className="text-lg font-bold">🎓 עוזר הלמידה — בהכנה</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              בקרוב תוכלו לשוחח כאן עם עוזר AI שמכיר בדיוק את הפרק שאתם נמצאים בו,
              ולשאול אותו כל דבר שלא ברור.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              בינתיים — כפתור <b>וואטסאפ</b> פתוח לכל שאלה, והתשובה מגיעה ישירות מהמחבר.
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
