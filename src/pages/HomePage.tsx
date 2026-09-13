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
            onClick={() => setCurrentChapter('intro')}
            className="inline-flex animate-pulse items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white shadow-md transition hover:animate-none hover:opacity-90 active:scale-95 active:translate-y-0.5"
            style={{ backgroundColor: '#1F6F3F' }}
          >
            <span aria-hidden>📖</span>
            <span>להסבר ראשוני</span>
          </button>
          <button
            onClick={() => setCurrentChapter('ppf')}
            className="inline-flex animate-pulse items-center gap-2 rounded-xl px-8 py-3 text-base font-bold text-white shadow-lg transition hover:animate-none hover:opacity-90 active:scale-95 active:translate-y-0.5"
            style={{ backgroundColor: INDIGO }}
          >
            <span>התחל ללמוד</span>
          </button>
          <a
            href="https://api.whatsapp.com/send?phone=972544242706"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white shadow-md transition hover:opacity-90 active:scale-95 active:translate-y-0.5"
            style={{ backgroundColor: WHATSAPP }}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>שאלות? וואטסאפ</span>
          </a>
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
