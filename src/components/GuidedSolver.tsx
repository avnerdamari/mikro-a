import { useState, type ReactNode } from 'react'

/* GuidedSolver — הרכיב שהפורמט המאוחד (סקיל build-book §1) מצפה לו בכל תרגיל
   מדורג: "🧭 פתור עם הנחיות" (שאלה סוקרטית + רמז + חשיפה) לצד "📖 הצג פתרון
   מלא", בשונה מ-Exercise/ExerciseSection הישן (קלט חופשי + בדוק + הצג-פתרון
   בלבד, בלי שלב-ביניים מודרך). גרסה למשפחה B — אותו חוזה-פרופס כמו ב-
   Advisors-App, מותאם לעיצוב Mikro-A (indigo/var(--brand), בלי MathText/LaTeX
   שלא בשימוש כאן). */

export interface GuidedStep {
  ask: string
  choices: string[]
  correct: number
  hint?: string
  reveal: ReactNode
}

interface Props {
  steps: GuidedStep[]
  summary: ReactNode
  fullSolution: ReactNode
  answer?: number
  tol?: number
  unit?: string
  /** כפתורים נוספים לצד "פתור עם הנחיות"/"הצג פתרון מלא" — למשל AskTutorButton
      (סקיל solve-question §6, "מיקום עוזר הלמידה — אותה שורה"). */
  extraActions?: ReactNode
}

const BUTTON_CLASS = 'rounded-lg px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110 active:scale-95'

function GuidedStepView({ step, onDone }: { step: GuidedStep; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const wrong = picked !== null && picked !== step.correct
  const right = picked === step.correct

  const choose = (i: number) => {
    setPicked(i)
    if (i === step.correct) onDone()
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">{step.ask}</p>
      <div className="flex flex-wrap gap-2">
        {step.choices.map((c, i) => (
          <button
            key={i}
            onClick={() => choose(i)}
            disabled={right}
            className={
              'rounded-lg border px-3 py-1.5 text-xs font-semibold transition ' +
              (picked === i
                ? i === step.correct
                  ? 'border-green-400 bg-green-100 text-green-800'
                  : 'border-red-300 bg-red-50 text-red-700'
                : 'border-border bg-muted/30 text-muted-foreground hover:bg-muted/60')
            }
          >
            {c}
          </button>
        ))}
      </div>
      {wrong && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-red-500">✗ לא בדיוק, נסו שוב</span>
          {step.hint && (
            <button onClick={() => setShowHint(v => !v)} className="text-xs font-semibold text-blue-600 underline">
              {showHint ? 'הסתר רמז' : 'רמז 💡'}
            </button>
          )}
        </div>
      )}
      {wrong && showHint && step.hint && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-blue-700">💡 {step.hint}</div>
      )}
      {right && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-2 text-xs text-green-800">
          ✓ נכון! {step.reveal}
        </div>
      )}
    </div>
  )
}

export function GuidedSolver({ steps, summary, fullSolution, answer, tol = 0.5, unit, extraActions }: Props) {
  const [mode, setMode] = useState<'closed' | 'guided' | 'full'>('closed')
  const [stepIdx, setStepIdx] = useState(0)
  const [val, setVal] = useState('')
  const [status, setStatus] = useState<null | boolean>(null)

  const advance = () => setStepIdx(i => Math.min(i + 1, steps.length))
  const done = stepIdx >= steps.length

  const check = () => {
    const x = Number(val.replace(/,/g, ''))
    if (!isFinite(x) || answer === undefined) { setStatus(false); return }
    setStatus(Math.abs(x - answer) <= tol)
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode(m => (m === 'guided' ? 'closed' : 'guided'))}
          className={BUTTON_CLASS}
          style={{ backgroundColor: 'var(--action, #4F46E5)' }}
        >
          {mode === 'guided' ? 'סגור הנחיות' : '🧭 פתור עם הנחיות'}
        </button>
        <button
          onClick={() => setMode(m => (m === 'full' ? 'closed' : 'full'))}
          className={BUTTON_CLASS + ' bg-indigo-700'}
        >
          {mode === 'full' ? 'הסתר פתרון' : '📖 הצג פתרון מלא'}
        </button>
        {extraActions}
      </div>

      {answer !== undefined && (
        <div className="mt-2 flex items-center gap-2" dir="ltr">
          <input
            dir="ltr"
            inputMode="decimal"
            value={val}
            onChange={e => { setVal(e.target.value); setStatus(null) }}
            onKeyDown={e => { if (e.key === 'Enter' && val.trim()) check() }}
            placeholder="התשובה שלך"
            className="w-28 rounded-lg border border-border px-2 py-1 text-center text-sm outline-none focus:ring-1 focus:ring-indigo-400"
          />
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          <button onClick={check} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white transition hover:brightness-110 active:scale-95">בדוק</button>
          {status === true && <span className="text-xs font-bold text-emerald-600">✓ נכון!</span>}
          {status === false && <span className="text-xs font-bold text-red-500">✗ נסה שוב</span>}
        </div>
      )}

      {mode === 'guided' && (
        <div className="mt-3 space-y-3 rounded-lg border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-500/30 dark:bg-indigo-950/20">
          {steps.slice(0, stepIdx + 1).map((step, i) => (
            <GuidedStepView key={i} step={step} onDone={advance} />
          ))}
          {done && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs font-semibold text-emerald-800">
              🎯 {summary}
            </div>
          )}
        </div>
      )}

      {mode === 'full' && (
        <div className="mt-3 space-y-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm dark:bg-emerald-950/40 dark:text-slate-100">
          {fullSolution}
        </div>
      )}
    </div>
  )
}
