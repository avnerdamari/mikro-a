import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'

export type McqQuestion = {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface Props {
  questions: McqQuestion[]
  topicId: string
}

export function McqSection({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [showAll, setShowAll] = useState(false)

  const score = questions.filter(q => answers[q.id] === q.correct).length
  const answered = Object.values(answers).filter(v => v !== null).length
  const allAnswered = answered === questions.length

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">תרגילי רב-ברירה</h3>
        {allAnswered && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-700">{score}/{questions.length} נכון</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {questions.map((q, qi) => {
          const selected = answers[q.id] ?? null
          const submitted = selected !== null
          const isCorrect = selected === q.correct

          return (
            <div key={q.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="mb-4 font-semibold text-foreground">
                <span className="ml-2 text-muted-foreground">{qi + 1}.</span>
                {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi
                  const isAnswer = q.correct === oi
                  let bg = 'hover:bg-muted/60 border-border'
                  if (submitted) {
                    if (isAnswer) bg = 'bg-green-50 border-green-400 text-green-800'
                    else if (isSelected && !isCorrect) bg = 'bg-red-50 border-red-400 text-red-800'
                    else bg = 'border-border opacity-60'
                  } else if (isSelected) {
                    bg = 'bg-indigo-50 border-indigo-400'
                  }
                  return (
                    <button
                      key={oi}
                      disabled={submitted}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-right text-sm transition-colors',
                        bg
                      )}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current font-bold text-xs">
                        {String.fromCharCode(0x05D0 + oi)}
                      </span>
                      <span className="flex-1">{opt}</span>
                      {submitted && isAnswer && <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />}
                      {submitted && isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0 text-red-500" />}
                    </button>
                  )
                })}
              </div>
              {(submitted || showAll) && (
                <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">הסבר:</p>
                  <p className="text-sm text-blue-700">{q.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allAnswered && (
        <button
          onClick={() => {
            setAnswers({})
            setShowAll(false)
          }}
          className="w-full rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground hover:bg-muted/50 transition-colors"
        >
          נסה שוב
        </button>
      )}
    </div>
  )
}
