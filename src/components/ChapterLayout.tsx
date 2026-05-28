import type { ReactNode } from 'react'
import { useNavigation } from './NavigationContext'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { CHAPTERS } from '@/data/toc'

interface Props {
  number: number
  title: string
  subtitle: string
  color: string
  examWeight: string
  children: ReactNode
}

export function ChapterLayout({ number, title, subtitle, color, examWeight, children }: Props) {
  const { setCurrentChapter } = useNavigation()
  const idx = CHAPTERS.findIndex(c => c.number === number)
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-6" dir="rtl">
      {/* Header */}
      <div className="mb-8 rounded-2xl border border-border p-6 shadow-sm" style={{ borderColor: `${color}44` }}>
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white text-xl font-extrabold shadow-sm"
            style={{ backgroundColor: color }}
          >
            {number}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            <span className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: color }}>
              🎯 {examWeight}
            </span>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-10">
        {children}
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between gap-4">
        {prev ? (
          <button
            onClick={() => setCurrentChapter(prev.id)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:shadow-md"
          >
            <ChevronRight className="h-4 w-4" />
            <span>פרק {prev.number}: {prev.title}</span>
          </button>
        ) : <div />}

        {next ? (
          <button
            onClick={() => setCurrentChapter(next.id)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:shadow-md"
          >
            <span>פרק {next.number}: {next.title}</span>
            <ChevronLeft className="h-4 w-4" />
          </button>
        ) : <div />}
      </div>
    </div>
  )
}
