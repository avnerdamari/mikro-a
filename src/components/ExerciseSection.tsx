import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'

export type Exercise = {
  id: string
  question: string
  answer: string
  hint?: string
  /** התשובה הסופית הקצרה לבדיקה אוטומטית (למשל "350" או "180"). אופציונלי —
      כשלא קיים, נופלים ל"הצג פתרון"+"סמן כבוצע" ידני בלבד. */
  checkAnswer?: string
}

/** משווה קלט חופשי מול checkAnswer: מסיר רווחים/₪/פסיקי-אלפים, לא תלוי רישיות. */
function normalizeAnswer(v: string): string {
  return v.trim().toLowerCase().replace(/[\s₪,]/g, '')
}

/** שורת פתרון: אם רוב התווים (לא-רווח) הם עברית — משפט הסבר, RTL רגיל.
    אחרת — נוסחה/חישוב, חייבת dir="ltr" כדי שהמספרים והאופרטורים לא יתהפכו. */
function AnswerLine({ line }: { line: string }) {
  const chars = line.replace(/\s/g, '')
  const hebrewCount = (chars.match(/[א-ת]/g) ?? []).length
  const isHebrewProse = chars.length > 0 && hebrewCount / chars.length > 0.4
  return isHebrewProse
    ? <div>{line}</div>
    : <div dir="ltr" style={{ textAlign: 'right' }}>{line}</div>
}

interface Props {
  easy: Exercise[]
  medium: Exercise[]
  hard: Exercise[]
  topicId: string
}

type Level = 'easy' | 'medium' | 'hard'

const LEVEL_LABELS: Record<Level, { label: string; color: string; bg: string }> = {
  easy:   { label: 'קלה',    color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  medium: { label: 'בינונית', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  hard:   { label: 'מתקדמת', color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
}

function ExerciseCard({ ex, index }: { ex: Exercise; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [done, setDone] = useState(false)
  const [typed, setTyped] = useState('')
  const [checked, setChecked] = useState(false)

  const hasCheck = !!ex.checkAnswer
  const isRight = checked && ex.checkAnswer !== undefined && normalizeAnswer(typed) === normalizeAnswer(ex.checkAnswer)

  const check = () => {
    setChecked(true)
    if (ex.checkAnswer !== undefined && normalizeAnswer(typed) === normalizeAnswer(ex.checkAnswer)) {
      setDone(true)
    }
  }

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-colors',
      done ? 'bg-green-50 border-green-300' : 'bg-card border-border'
    )}>
      <div className="flex items-start justify-between gap-3">
        <p className="flex-1 text-sm font-medium text-foreground">
          <span className="ml-2 font-bold text-muted-foreground">{index + 1}.</span>
          {ex.question}
        </p>
        {done && <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />}
      </div>

      {hasCheck && (
        <div className="mt-3 flex flex-wrap items-center gap-2" dir="ltr">
          <input
            dir="ltr"
            value={typed}
            onChange={e => { setTyped(e.target.value); setChecked(false) }}
            onKeyDown={e => { if (e.key === 'Enter' && typed.trim()) check() }}
            placeholder="התשובה שלך"
            className="w-32 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            onClick={check}
            disabled={!typed.trim()}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            בדוק
          </button>
          {checked && (isRight
            ? <span className="text-xs font-bold text-green-600">✓ נכון!</span>
            : <span className="text-xs font-bold text-red-500">✗ נסה שוב</span>)}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {ex.hint && !showAnswer && (
          <button
            onClick={() => setShowHint(v => !v)}
            className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            {showHint ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showHint ? 'הסתר רמז' : 'רמז'}
          </button>
        )}
        <button
          onClick={() => setShowAnswer(v => !v)}
          className="flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          {showAnswer ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {showAnswer ? 'הסתר פתרון' : 'הצג פתרון'}
        </button>
        {!hasCheck && (
          <button
            onClick={() => setDone(v => !v)}
            className={cn(
              'flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
              done
                ? 'border-green-300 bg-green-100 text-green-700'
                : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted/70'
            )}
          >
            {done ? '✓ סיימתי' : 'סמן כבוצע'}
          </button>
        )}
      </div>

      {showHint && ex.hint && (
        <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-blue-700">💡 {ex.hint}</p>
        </div>
      )}

      {showAnswer && (
        <div className="mt-3 rounded-lg bg-indigo-50 border border-indigo-200 p-3">
          <p className="text-xs font-bold text-indigo-800 mb-1">פתרון מפורט:</p>
          <div className="text-sm text-indigo-800 space-y-0.5">
            {ex.answer.split('\n').map((line, i) => <AnswerLine key={i} line={line} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export function ExerciseSection({ easy, medium, hard }: Props) {
  const [activeLevel, setActiveLevel] = useState<Level>('easy')

  const map: Record<Level, Exercise[]> = { easy, medium, hard }
  const current = map[activeLevel]

  return (
    <div className="space-y-5" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-bold text-foreground">תרגילים מעשיים</h3>
        <div className="flex rounded-xl border border-border bg-muted/30 p-1 gap-1">
          {(['easy', 'medium', 'hard'] as Level[]).map(level => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                activeLevel === level
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {LEVEL_LABELS[level].label}
            </button>
          ))}
        </div>
      </div>

      <div className={cn('rounded-xl border px-4 py-2 text-sm font-semibold', LEVEL_LABELS[activeLevel].bg, LEVEL_LABELS[activeLevel].color)}>
        רמה {LEVEL_LABELS[activeLevel].label} — {current.length} תרגילים
      </div>

      <div className="space-y-3">
        {current.map((ex, i) => <ExerciseCard key={ex.id} ex={ex} index={i} />)}
      </div>
    </div>
  )
}
