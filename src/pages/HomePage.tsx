import { ChevronLeft } from 'lucide-react'
import { BookCover } from '@/components/BookCover'
import { useNavigation } from '@/components/NavigationContext'
import { CHAPTERS } from '@/data/toc'
import { loadProgress } from '@/lib/progress'

const INDIGO = '#4F46E5'
const WHATSAPP = '#25D366'

export function HomePage() {
  const { setCurrentChapter } = useNavigation()
  const progress = loadProgress()
  const completed = progress.completedTopics.length

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-6" dir="rtl">
      {/* Hero — כריכת ספר (מחקה את הכריכה של Advisors-App, ראה BookCover.tsx) */}
      <div className="text-center space-y-3 py-8">
        <BookCover />

        {/* Progress bar */}
        {completed > 0 && (
          <div className="mx-auto max-w-sm">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>התקדמות</span>
              <span>{completed}/{CHAPTERS.length} פרקים</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(completed / CHAPTERS.length) * 100}%`, backgroundColor: INDIGO }}
              />
            </div>
          </div>
        )}

        {/* CTA — שלושה כפתורים תחת הכריכה (סקיל build-book §2ז): ראשי פועם,
            וואטסאפ באמצע, ומשני פועם שקופץ ישר להקדמה. */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => setCurrentChapter('ppf')}
            className="inline-flex animate-pulse items-center gap-2 rounded-xl px-8 py-3 text-base font-bold text-white shadow-lg transition hover:animate-none hover:opacity-90 active:scale-95 active:translate-y-0.5"
            style={{ backgroundColor: INDIGO }}
          >
            <span>התחל ללמוד</span>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <a
            href="https://api.whatsapp.com/send?phone=972544242706"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white shadow-md transition hover:opacity-90 active:scale-95 active:translate-y-0.5"
            style={{ backgroundColor: WHATSAPP }}
          >
            שאלות? וואטסאפ 💬
          </a>
          <button
            onClick={() => setCurrentChapter('intro')}
            className="inline-flex animate-pulse items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white shadow-md transition hover:animate-none hover:opacity-90 active:scale-95 active:translate-y-0.5"
            style={{ backgroundColor: '#1F6F3F' }}
          >
            <span aria-hidden>📖</span>
            <span>להסבר ראשוני</span>
          </button>
        </div>
      </div>

      {/* Notice — תיבה כהה מלאה-רוחב, הרגעה סטטית שהתוכן פעיל (סקיל build-book §2ז) */}
      <section className="mx-auto mt-8 w-full max-w-sm rounded-2xl p-3 text-center" style={{ backgroundColor: 'var(--brand)' }}>
        <p className="font-semibold text-white">תוכן חדש מתעדכן באופן שוטף</p>
      </section>

      {/* Footer — גרסה גלויה כדי לוודא איזה בילד חי בפועל (§2ז, §9 "לאמת באתר החי") */}
      <footer className="pt-4 text-center text-sm text-muted-foreground">
        © אבנר דמארי ·{' '}
        <a
          href="https://api.whatsapp.com/send?phone=972544242706"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
          style={{ color: '#8a6d2f' }}
        >
          צור קשר
        </a>
        <div dir="ltr" className="mt-1 text-xs opacity-70">v{import.meta.env.VITE_APP_VERSION}</div>
      </footer>
    </div>
  )
}
