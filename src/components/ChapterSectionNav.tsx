import { useEffect } from 'react'
import { useNavigation } from './NavigationContext'

/* שורת-פילס דביקה של תתי-הסעיפים בתוך הפרק הנוכחי — סורקת את #content-root
   ל-<h2> בכל שינוי-פרק, ומדווחת את התוויות ל-sectionNavLabels (כדי שכפתור
   ה-☰ בכותרת ידע אם יש בכלל מה להציג/להסתיר לפרק הזה).
   דפוס מבוסס livestats-il (משפחה C) — ראה סקיל build-book §3ג. */

export function ChapterSectionNav() {
  const { currentChapter, sectionNavOpen, sectionNavLabels, setSectionNavLabels } = useNavigation()

  useEffect(() => {
    const root = document.getElementById('content-root')
    const headings = root ? Array.from(root.querySelectorAll('h2')).map(h => h.textContent?.trim() ?? '') : []
    setSectionNavLabels(headings.filter(Boolean))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter])

  if (!sectionNavOpen || sectionNavLabels.length === 0) return null

  const scrollTo = (label: string) => {
    const root = document.getElementById('content-root')
    const el = root && Array.from(root.querySelectorAll('h2')).find(h => h.textContent?.trim() === label)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="no-print sticky top-14 z-20 overflow-x-auto border-b border-border bg-background/95 px-3 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-4xl gap-2" dir="rtl">
        {sectionNavLabels.map(label => (
          <button
            key={label}
            onClick={() => scrollTo(label)}
            className="shrink-0 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
