import { useEffect, useState } from 'react'
import { useNavigation } from './NavigationContext'
import { cn } from '@/lib/utils'

/* שורת-פילס דביקה של תתי-הסעיפים בתוך הפרק הנוכחי — סורקת את #content-root
   ל-<h2> בכל שינוי-פרק, ומדווחת את התוויות ל-sectionNavLabels (כדי שכפתור
   ה-☰ בכותרת ידע אם יש בכלל מה להציג/להסתיר לפרק הזה).
   דפוס מבוסס livestats-il (משפחה C) — ראה סקיל build-book §3ג. */

export function ChapterSectionNav() {
  const { currentChapter, sectionNavOpen, sectionNavLabels, setSectionNavLabels } = useNavigation()
  const [activeLabel, setActiveLabel] = useState<string | null>(null)

  useEffect(() => {
    const root = document.getElementById('content-root')
    const headings = root ? Array.from(root.querySelectorAll('h2')).map(h => h.textContent?.trim() ?? '') : []
    setSectionNavLabels(headings.filter(Boolean))
    setActiveLabel(headings[0] ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter])

  /* עוקב-גלילה (scroll-spy) — מדגיש את הפילס של הסעיף שנמצא כרגע בראש
     התצוגה, כדי שיהיה ניגוד-צבע ברור בין "איפה אני" לשאר (סקיל build-book,
     כפתורי-טאב/תגי-ניווט — מצב פעיל מובלט בצבע, לא כולם נראים זהים). */
  useEffect(() => {
    if (!sectionNavOpen || sectionNavLabels.length === 0) return
    const root = document.getElementById('content-root')
    if (!root) return
    const headingEls = Array.from(root.querySelectorAll('h2'))
    if (headingEls.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const label = visible[0]?.target.textContent?.trim()
        if (label) setActiveLabel(label)
      },
      // הרצועה העליונה (100px) מפצה על הכותרת+שורת-הפילס הדביקות שמעל;
      // התחתונה (70%) מבטיחה שרק כותרת קרובה-לראש נחשבת "נוכחית", לא כל
      // כותרת שרק נכנסה לתחתית המסך.
      { rootMargin: '-100px 0px -70% 0px', threshold: 0 }
    )
    headingEls.forEach(h => observer.observe(h))
    return () => observer.disconnect()
  }, [sectionNavOpen, sectionNavLabels, currentChapter])

  if (!sectionNavOpen || sectionNavLabels.length === 0) return null

  const scrollTo = (label: string) => {
    const root = document.getElementById('content-root')
    const el = root && Array.from(root.querySelectorAll('h2')).find(h => h.textContent?.trim() === label)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="no-print sticky top-14 z-20 overflow-x-auto border-b border-border bg-background/95 px-3 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-4xl gap-2" dir="rtl">
        {sectionNavLabels.map(label => {
          const isActive = label === activeLabel
          return (
            <button
              key={label}
              onClick={() => scrollTo(label)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition',
                isActive
                  ? 'text-white shadow-sm'
                  : 'border border-border bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground'
              )}
              style={isActive ? { backgroundColor: '#4F46E5' } : undefined}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
