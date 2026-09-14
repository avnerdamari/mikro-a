import { useNavigation } from './NavigationContext'
import { CHAPTERS } from '@/data/toc'

/* שורת-הקשר — קישור הדדי תיאוריה↔תרגול, שני הכיוונים (סקיל build-book §2ו).
   מוצגת רק כשרלוונטי: פרק תיאוריה/תרגול עם בן-זוג מאותו number. */
export function ChapterLinkRow() {
  const { currentChapter, setCurrentChapter } = useNavigation()
  const self = CHAPTERS.find(c => c.id === currentChapter)
  if (!self || (self.kind !== 'theory' && self.kind !== 'practice')) return null

  const counterpart = CHAPTERS.find(
    c => c.number === self.number && c.id !== self.id && (c.kind === 'theory' || c.kind === 'practice')
  )
  if (!counterpart) return null

  return (
    <div className="no-print border-b border-border py-1.5 text-center" style={{ backgroundColor: 'var(--brand)' }}>
      <div className="mx-auto flex max-w-4xl justify-center">
        <button
          onClick={() => setCurrentChapter(counterpart.id)}
          className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white/25 active:scale-95"
        >
          {self.kind === 'theory' ? `✏️ תרגול על פרק זה` : `📖 חזרה לחלק התיאורטי`}
        </button>
      </div>
    </div>
  )
}
