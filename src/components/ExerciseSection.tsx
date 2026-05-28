import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'

export type Exercise = {
  id: string
  question: string
  answer: string
  hint?: string
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
      </div>

      {showHint && ex.hint && (
        <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm text-blue-700">💡 {ex.hint}</p>
        </div>
      )}

      {showAnswer && (
        <div className="mt-3 rounded-lg bg-indigo-50 border border-indigo-200 p-3">
          <p className="text-xs font-bold text-indigo-800 mb-1">פתרון מפורט:</p>
          <div className="text-sm text-indigo-800 whitespace-pre-line">{ex.answer}</div>
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
