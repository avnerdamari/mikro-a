import { useNavigation } from './NavigationContext'

/* עוזר למידה — צ'אט AI שמכיר את הפרק שהתלמיד נמצא בו כרגע. נפתח כפאנל צף
   מוטמע (FloatingTutorPanel, ר' App.tsx/NavigationContext) — לא טאב נפרד —
   כדי לעבוד במקביל על הספר והמורה. המורה עצמו הוא **פריסה נפרדת**:
   Mikro-Tutor (C:\ClaudeProjects\Mikro-Tutor), מזלג ייעודי של Advisors-Tutor
   עם 12 פרומפטים למיקרו-כלכלה (לא Advisors-Tutor עצמו — הוא נעול לתוכן
   מימון/השקעות ולא יבין נושאי מיקרו-כלכלה). */

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
  const { openTutor } = useNavigation()
  const topic = TUTOR_TOPIC[chapterId] ?? 'review'

  return (
    <button
      onClick={() => openTutor(topic)}
      title="עוזר למידה — צ'אט AI על הפרק הנוכחי"
      className="flex w-36 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 hover:shadow-xl active:scale-95 active:translate-y-0.5"
      style={{ backgroundColor: 'var(--action)' }}
    >
      <span aria-hidden>🎓</span>
      <span>עוזר למידה</span>
    </button>
  )
}
