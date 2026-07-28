import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* שאלת מבחן + פתרון במבנה 6 הסעיפים (סקיל solve-question).
   השאלה והאופציות מוצגות **כלשונן במקור** — רק הפתרון נכתב על ידינו. */

/** שלב במצב המודרך: שאלה על ה**דרך**, לא על התשובה הסופית. */
export type GuidedStep = {
  ask: string
  choices: ReactNode[]
  correct: number
  /** רמז שמופיע אחרי בחירה שגויה */
  hint: ReactNode
  /** נחשף אחרי בחירה נכונה — התוכן הפתור של השלב */
  reveal: ReactNode
}

/* ⚠️ כל שדות 6 הסעיפים הם **חובה** — במכוון, בלי `?`.
   הסקיל solve-question מחייב את כולם בכל שאלה; אם שדה היה אופציונלי,
   אפשר היה לשכוח אותו והבנייה הייתה עוברת. כך הקומפיילר אוכף את המפרט.
   (קרה בפועל: visual הופיע ב-3 מתוך 20 שאלות ואיש לא שם לב.) */
export type ExamQuestion = {
  n: number
  /** נתונים משותפים לכמה שאלות — מוצגים פעם אחת מעל הראשונה בקבוצה */
  intro?: ReactNode
  question: ReactNode
  /** אופציות א-ד, בסדר המקורי. אין לערבב. */
  options: ReactNode[]
  /** אינדקס התשובה. null = אין תשובה נכונה בין האופציות (מתועד בפתרון). */
  correct: number | null
  guided: GuidedStep[]    // 🧭 מצב מודרך — חובה
  understand: ReactNode   // 🔍
  visual: ReactNode       // 📊 חובה בכל שאלה
  formula: ReactNode      // 📐
  steps: ReactNode        // 🔢
  answer: ReactNode       // ✅ כולל למה כל דיסטרקטור שגוי
  sanity: ReactNode       // 🔄
  /** סיכום תהליך הפתרון בפרוזה — מוצג בסוף המצב המודרך */
  summary: ReactNode      // 🎯
}

const HEB = ['א', 'ב', 'ג', 'ד', 'ה']

function Section({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h4 className="text-sm font-bold" style={{ color: 'var(--brand)' }}>{icon} {title}</h4>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

/** שלב מודרך אחד — שאלה סוקרטית על הדרך. */
function GuidedStepCard({ step, idx, state, onSolve }: {
  step: GuidedStep; idx: number; state: 'done' | 'active'; onSolve: () => void
}) {
  const [wrong, setWrong] = useState<Set<number>>(new Set())
  const pick = (i: number) => {
    if (i === step.correct) onSolve()
    else setWrong(w => new Set(w).add(i))
  }
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: state === 'done' ? 'var(--brand-accent)' : 'var(--brand)' }}
        >
          {state === 'done' ? '✓' : idx + 1}
        </div>
        <p className="min-w-0 flex-1 font-bold" style={{ color: 'var(--brand)' }}>🧭 {step.ask}</p>
      </div>

      {state === 'active' && (
        <div className="mt-3 space-y-2 pr-10">
          {step.choices.map((c, i) => {
            const isWrong = wrong.has(i)
            return (
              <button
                key={i}
                onClick={() => !isWrong && pick(i)}
                disabled={isWrong}
                className={cn(
                  'flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-right text-sm transition',
                  isWrong ? 'border-red-300 bg-red-50 text-red-400 line-through dark:bg-red-950/30' : 'border-border hover:bg-muted/60'
                )}
              >
                <span className="font-bold text-muted-foreground">{HEB[i]}.</span>
                <span className="flex-1">{c}</span>
              </button>
            )
          })}
          {wrong.size > 0 && (
            <div className="rounded-lg border-r-4 border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
              💡 {step.hint}
            </div>
          )}
        </div>
      )}

      {state === 'done' && (
        <div className="mt-3 space-y-2 pr-10 text-sm leading-relaxed text-muted-foreground">{step.reveal}</div>
      )}
    </div>
  )
}

export function ExamQuestionCard({ q }: { q: ExamQuestion }) {
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [showSol, setShowSol] = useState(false)
  const [guiding, setGuiding] = useState(false)
  const [solved, setSolved] = useState(0)

  const isRight = checked && picked !== null && picked === q.correct
  const allDone = solved >= q.guided.length

  return (
    <div className="space-y-3">
      {q.intro && (
        <div className="rounded-xl border-r-4 p-4 text-sm leading-relaxed" style={{ borderColor: 'var(--brand-light)', backgroundColor: 'var(--muted)' }}>
          {q.intro}
        </div>
      )}

      <div className="rounded-2xl border-2 border-border p-4">
        <p className="font-bold" style={{ color: 'var(--brand)' }}>שאלה {q.n}</p>
        <div className="mt-1 text-sm leading-relaxed">{q.question}</div>

        {/* אופציות — במאונך, בסדר המקורי */}
        <ul className="mt-3 space-y-1.5">
          {q.options.map((o, i) => (
            <li key={i}>
              <button
                onClick={() => { setPicked(i); setChecked(false) }}
                className={cn(
                  'flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-right text-sm transition',
                  picked === i ? 'border-transparent ring-2' : 'border-border hover:bg-muted/60'
                )}
                style={picked === i ? { backgroundColor: 'var(--muted)', boxShadow: '0 0 0 2px var(--brand-light)' } : undefined}
              >
                <span className="font-bold text-muted-foreground">{HEB[i]}.</span>
                <span className="flex-1">{o}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setChecked(true)}
            disabled={picked === null}
            className="rounded-lg px-3 py-1.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: 'var(--brand-accent)' }}
          >
            בדוק
          </button>
          {checked && (isRight
            ? <span className="text-sm font-bold text-emerald-600">✓ נכון!</span>
            : <span className="text-sm font-bold text-red-500">✗ נסה שוב</span>)}
          <button
            onClick={() => { setGuiding(g => !g); setShowSol(false); setSolved(0) }}
            className="rounded-lg px-3 py-1.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 active:scale-95"
            style={{ backgroundColor: 'var(--brand)' }}
          >
            {guiding ? 'סגור הנחיות' : '🧭 פתור עם הנחיות'}
          </button>
          <button
            onClick={() => { setShowSol(s => !s); setGuiding(false) }}
            className="rounded-lg border px-3 py-1.5 text-sm font-bold transition hover:bg-muted/60 active:scale-95"
            style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
          >
            {showSol ? 'הסתר פתרון' : '📖 הצג פתרון מלא'}
          </button>
        </div>

        {/* 🧭 מצב מודרך — שלבים נערמים, סיכום בסוף */}
        {guiding && (
          <div className="mt-4 space-y-3">
            {q.guided.slice(0, solved).map((s, i) => (
              <GuidedStepCard key={i} step={s} idx={i} state="done" onSolve={() => {}} />
            ))}
            {!allDone && (
              <GuidedStepCard
                key={solved}
                step={q.guided[solved]}
                idx={solved}
                state="active"
                onSolve={() => setSolved(s => s + 1)}
              />
            )}
            {allDone && (
              <div className="rounded-xl border-2 p-4" style={{ borderColor: 'var(--brand-accent)', backgroundColor: 'var(--muted)' }}>
                <p className="mb-2 font-extrabold" style={{ color: 'var(--brand-accent)' }}>🎯 סיכום תהליך הפתרון</p>
                <div className="text-sm leading-relaxed text-muted-foreground">{q.summary}</div>
              </div>
            )}
          </div>
        )}

        {showSol && (
          <div className="mt-4 space-y-4 rounded-xl border border-border p-4" style={{ backgroundColor: 'var(--muted)' }}>
            <Section icon="🔍" title="הבנת השאלה">{q.understand}</Section>
            <Section icon="📊" title="תיאור גרפי">{q.visual}</Section>
            <Section icon="📐" title="הנוסחה הרלוונטית">{q.formula}</Section>
            <Section icon="🔢" title="פתרון שלב אחר שלב">{q.steps}</Section>
            <Section icon="✅" title="תשובה">{q.answer}</Section>
            <Section icon="🔄" title="בדיקת סבירות">{q.sanity}</Section>
          </div>
        )}
      </div>
    </div>
  )
}

export function ExamSheet({ title, subtitle, questions }: { title: string; subtitle: string; questions: ExamQuestion[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {questions.map(q => <ExamQuestionCard key={q.n} q={q} />)}
    </section>
  )
}
