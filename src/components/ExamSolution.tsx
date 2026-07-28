import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/* שאלת מבחן + פתרון במבנה 6 הסעיפים (סקיל solve-question).
   השאלה והאופציות מוצגות **כלשונן במקור** — רק הפתרון נכתב על ידינו. */

export type ExamQuestion = {
  n: number
  /** נתונים משותפים לכמה שאלות — מוצגים פעם אחת מעל הראשונה בקבוצה */
  intro?: ReactNode
  question: ReactNode
  /** אופציות א-ד, בסדר המקורי. אין לערבב. */
  options: ReactNode[]
  /** אינדקס התשובה. null = אין תשובה נכונה בין האופציות (מתועד בפתרון). */
  correct: number | null
  understand: ReactNode   // 🔍
  visual?: ReactNode      // 📊
  formula?: ReactNode     // 📐
  steps: ReactNode        // 🔢
  answer: ReactNode       // ✅ כולל למה כל דיסטרקטור שגוי
  sanity: ReactNode       // 🔄
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

export function ExamQuestionCard({ q }: { q: ExamQuestion }) {
  const [picked, setPicked] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [showSol, setShowSol] = useState(false)

  const isRight = checked && picked !== null && picked === q.correct

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
            onClick={() => setShowSol(s => !s)}
            className="rounded-lg border px-3 py-1.5 text-sm font-bold transition hover:bg-muted/60 active:scale-95"
            style={{ borderColor: 'var(--brand)', color: 'var(--brand)' }}
          >
            {showSol ? 'הסתר פתרון' : '📖 הצג פתרון מלא'}
          </button>
        </div>

        {showSol && (
          <div className="mt-4 space-y-4 rounded-xl border border-border p-4" style={{ backgroundColor: 'var(--muted)' }}>
            <Section icon="🔍" title="הבנת השאלה">{q.understand}</Section>
            {q.visual && <Section icon="📊" title="תיאור גרפי">{q.visual}</Section>}
            {q.formula && <Section icon="📐" title="הנוסחה הרלוונטית">{q.formula}</Section>}
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
