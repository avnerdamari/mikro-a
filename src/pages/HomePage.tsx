import { BookOpen, Target, TrendingUp, MessageCircle, ChevronLeft } from 'lucide-react'
import logo from '@/assets/logo.png'
import { useNavigation } from '@/components/NavigationContext'
import { CHAPTERS } from '@/data/toc'
import { loadProgress } from '@/lib/progress'
import { cn } from '@/lib/utils'

const INDIGO = '#4F46E5'
const WHATSAPP = '#25D366'

const PRIORITY_COLOR: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#94a3b8',
}

export function HomePage() {
  const { setCurrentChapter } = useNavigation()
  const progress = loadProgress()
  const completed = progress.completedTopics.length

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-6" dir="rtl">
      {/* Hero */}
      <div className="text-center space-y-3 py-8">
        <div className="mx-auto mb-2">
          <img src={logo} alt="לוגו" className="mx-auto h-32 w-32 rounded-2xl object-contain shadow-lg" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          מבוא לכלכלה א'
        </h1>
        <p className="text-lg text-muted-foreground">
          ספר לימוד אינטראקטיבי — מיקרו-כלכלה
        </p>
        <p className="text-sm text-muted-foreground">
          המרכז האקדמי פרס | B.A. מנהל עסקים | אבנר דמארי
        </p>

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

        <button
          onClick={() => setCurrentChapter('ppf')}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90"
          style={{ backgroundColor: INDIGO }}
        >
          <span>התחל ללמוד — פרק 1</span>
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
        {[
          { icon: BookOpen, title: '10 פרקים', sub: 'מלא עם הסברים מפורטים', color: INDIGO },
          { icon: Target,   title: '15 תרגילים', sub: 'לכל פרק ב-3 רמות קושי', color: '#22c55e' },
          { icon: TrendingUp, title: 'סימולציות', sub: 'גרפים חיים ואינטראקטיביים', color: '#f97316' },
        ].map(({ icon: Icon, title, sub, color }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
            <div
              className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}1A`, color }}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="font-bold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Exam tip */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <p className="font-bold text-amber-800 mb-1">מבנה המבחן — מה חשוב לדעת</p>
            <p className="text-sm text-amber-700">
              המבחן: 20 שאלות רב-ברירה, 5 נקודות לכל שאלה. ציון עובר: 60. 3 שעות + דף עזר אישי + מחשבון.
            </p>
            <p className="text-sm text-amber-700 mt-1">
              <strong>הנושאים שנבחנים בפועל:</strong> PPF, פונקציית ייצור, עלויות, שיווי משקל סגור, התערבות ממשלתית, ומשק פתוח — אחראים על כ-80% מהמבחן.
            </p>
          </div>
        </div>
      </div>

      {/* Chapter grid */}
      <h2 className="text-xl font-bold mb-4">פרקי הקורס</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {CHAPTERS.map(c => {
          const isCompleted = progress.completedTopics.includes(c.id)
          return (
            <button
              key={c.id}
              onClick={() => setCurrentChapter(c.id)}
              className={cn(
                'flex items-start gap-4 rounded-2xl border p-4 text-right shadow-sm transition hover:shadow-md hover:-translate-y-0.5',
                isCompleted ? 'border-green-300 bg-green-50' : 'border-border bg-card'
              )}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white font-bold text-sm shadow-sm"
                style={{ backgroundColor: c.color }}
              >
                {c.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground leading-snug">{c.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.subtitle}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
                    style={{ backgroundColor: PRIORITY_COLOR[c.priority] }}
                  >
                    {c.examWeight}
                  </span>
                  {isCompleted && <span className="text-[10px] text-green-700 font-bold">✓ הושלם</span>}
                </div>
              </div>
              <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground mt-1" />
            </button>
          )
        })}
      </div>

      {/* WhatsApp */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
        <p className="font-semibold mb-2">שאלה? הערה? תקלה?</p>
        <a
          href="https://api.whatsapp.com/send?phone=972544242706"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-90"
          style={{ backgroundColor: WHATSAPP }}
        >
          <MessageCircle className="h-4 w-4" />
          שלח הודעה בוואטסאפ
        </a>
      </div>
    </div>
  )
}
