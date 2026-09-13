import { CHAPTERS } from './toc'
import type { MindNode } from '../lib/mindMapLayout'

/*
 * העץ נבנה אוטומטית מתוך CHAPTERS (אותו מקור-אמת שמזין את תוכן העניינים
 * ב-Sidebar/TopBar) — כדי שהמפה לעולם לא תתנתק מהניווט האמיתי.
 * אין TOC_ITEMS פר-פרק במיקרו-א' (בניגוד למשפחה A) — כל פרק תיאוריה מתפרק
 * לבועת "📖 תיאוריה" + "✏️ תרגול" אחת, לא לרשימת-סעיפים.
 */

const byNumber = new Map<number, typeof CHAPTERS>()
for (const c of CHAPTERS) {
  if (c.kind === 'appendix') continue
  const arr = byNumber.get(c.number) ?? []
  arr.push(c)
  byNumber.set(c.number, arr)
}

const intro = CHAPTERS.find((c) => c.id === 'intro')!
const THEORY_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/** פרק תיאורטי עם תרגול-בת יחיד תחתיו, ממוספר "N · שם הפרק". */
function buildPairedNode(num: number): MindNode {
  const pair = byNumber.get(num) ?? []
  const theory = pair.find((c) => c.kind === 'theory')!
  const practice = pair.find((c) => c.kind === 'practice')
  return {
    id: `c-${theory.id}`,
    label: `${num} · ${theory.title}`,
    chapterId: theory.id,
    practiceChapterId: practice?.id,
  }
}

const appendices = CHAPTERS.filter((c) => c.kind === 'appendix')

export const MIKRO_MINDMAP_TREE: MindNode = {
  id: 'mikro-root',
  label: "מבוא לכלכלה א'",
  accent: 'blue',
  children: [
    { id: `c-${intro.id}`, label: intro.title, chapterId: intro.id },
    ...THEORY_NUMBERS.map(buildPairedNode),
    {
      id: 'h-appendices',
      label: 'נספחים',
      children: appendices.map((a) => ({
        id: `c-${a.id}`,
        label: a.title.replace(/^נספח:\s*/, ''),
        chapterId: a.id,
      })),
    },
  ],
}

export const MIKRO_MINDMAP_DEFAULT_OPEN = ['mikro-root']
export const MIKRO_MINDMAP_CENTER = { x: 9, y: 50 }
