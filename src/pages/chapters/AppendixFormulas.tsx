import { MathText } from '@/components/MathText'
import { ChapterLayout } from '@/components/ChapterLayout'

/* נספח: דף נוסחאות — הנוסחאות נאספו מתוך 10 פרקי הספר, לפי סדר הפרקים. */

type Row = { label: string; math: string; note?: string }
type Group = { chapter: number; title: string; color: string; rows: Row[] }

const GROUPS: Group[] = [
  {
    chapter: 1, title: 'עקומת התמורה (PPF)', color: '#a855f7',
    rows: [
      { label: 'ייצור מרבי של מוצר', math: 'Q_{\\max} = N \\times q', note: 'N = מספר עובדים · q = תפוקה לעובד' },
      { label: 'עלות אלטרנטיבית של X', math: '\\text{OC}_X = \\frac{q_Y}{q_X}', note: 'כמה Y מוותרים על יחידת X אחת' },
      { label: 'יתרון יחסי', math: '\\text{OC}_X^A < \\text{OC}_X^B', note: 'למי שעלותו נמוכה יותר — יתרון יחסי ב-X' },
      { label: 'הקצאה אופטימלית לפי הכנסה', math: 'q_X \\cdot P_X \\;\\; \\text{מול} \\;\\; q_Y \\cdot P_Y', note: 'כל קבוצה למוצר שבו הכנסתה גבוהה יותר' },
    ],
  },
  {
    chapter: 2, title: 'פונקציית הייצור', color: '#6366f1',
    rows: [
      { label: 'תפוקה שולית', math: 'MP = \\frac{\\Delta Q}{\\Delta L}' },
      { label: 'תפוקה ממוצעת', math: 'AP = \\frac{Q}{L}' },
      { label: 'ערך התפוקה השולית', math: 'VMP = MP \\times P' },
      { label: 'כלל העסקה אופטימלי', math: 'VMP = W', note: 'מעסיקים עוד עובד כל עוד VMP גדול מהשכר' },
    ],
  },
  {
    chapter: 3, title: 'עלויות', color: '#f97316',
    rows: [
      { label: 'עלות כוללת', math: 'TC = FC + VC' },
      { label: 'עלות שולית', math: 'MC = \\frac{\\Delta TC}{\\Delta Q}' },
      { label: 'עלות ממוצעת', math: 'AC = \\frac{TC}{Q}' },
      { label: 'עלות משתנה ממוצעת', math: 'AVC = \\frac{VC}{Q}' },
      { label: 'רווח', math: '\\pi = TR - TC = P \\cdot Q - TC' },
      { label: 'תנאי ייצור בטווח הקצר', math: 'P \\ge AVC_{\\min}', note: 'מתחת לזה — עדיף לסגור' },
      { label: 'נקודת איזון (טווח ארוך)', math: 'P = AC_{\\min}' },
    ],
  },
  {
    chapter: 4, title: 'ביקוש', color: '#3b82f6',
    rows: [
      { label: 'פונקציית ביקוש', math: 'Q_d = a - bP', note: 'שיפוע שלילי — חוק הביקוש' },
      { label: 'פונקציה הפוכה', math: 'P = \\frac{a - Q_d}{b}' },
      { label: 'פדיון כולל', math: 'TR = P \\times Q' },
    ],
  },
  {
    chapter: 5, title: 'גמישויות', color: '#94a3b8',
    rows: [
      { label: 'גמישות מחיר', math: 'E = \\left|\\frac{\\Delta Q / Q}{\\Delta P / P}\\right|' },
      { label: 'גמישות הכנסה', math: 'E_i = \\frac{\\Delta Q / Q}{\\Delta I / I}', note: 'חיובי = מוצר נורמלי · שלילי = נחות' },
      { label: 'גמישות צולבת', math: 'E_{xy} = \\frac{\\Delta Q_x / Q_x}{\\Delta P_y / P_y}', note: 'חיובי = תחליפים · שלילי = משלימים' },
    ],
  },
  {
    chapter: 6, title: 'שיווי משקל במשק סגור', color: '#22c55e',
    rows: [
      { label: 'תנאי שיווי משקל', math: 'Q_d = Q_s', note: 'הפתרון נותן את P* ו-Q*' },
      { label: 'עודף הצרכן', math: 'CS = \\tfrac{1}{2}\\,(P_{\\max} - P^{*}) \\cdot Q^{*}' },
      { label: 'עודף היצרן', math: 'PS = \\tfrac{1}{2}\\,(P^{*} - P_{\\min}) \\cdot Q^{*}' },
      { label: 'רווחה כוללת', math: 'W = CS + PS' },
    ],
  },
  {
    chapter: 7, title: 'התערבות ממשלתית — משק סגור', color: '#ef4444',
    rows: [
      { label: 'מס על יצרן', math: 'P_s = P_d - t', note: 'היצרן מקבל פחות בגובה המס' },
      { label: 'סובסידיה', math: 'P_s = P_d + s' },
      { label: 'הכנסות המדינה ממס', math: 'T = t \\times Q^{*}_{\\text{new}}' },
      { label: 'נטל עודף (DWL)', math: 'DWL = \\tfrac{1}{2} \\cdot t \\cdot \\Delta Q' },
    ],
  },
  {
    chapter: 8, title: 'משק פתוח', color: '#0ea5e9',
    rows: [
      { label: 'ייבוא', math: 'M = Q_d(P_w) - Q_s(P_w)', note: 'כאשר המחיר העולמי נמוך מהמקומי' },
      { label: 'ייצוא', math: 'X = Q_s(P_w) - Q_d(P_w)', note: 'כאשר המחיר העולמי גבוה מהמקומי' },
      { label: 'מחיר מקומי במשק פתוח', math: 'P_{\\text{local}} = P_w' },
    ],
  },
  {
    chapter: 9, title: 'מכס ופרמיית ייצוא', color: '#f59e0b',
    rows: [
      { label: 'מחיר אחרי מכס', math: 'P = P_w + \\text{tariff}' },
      { label: 'הכנסות המדינה ממכס', math: 'T = \\text{tariff} \\times M_{\\text{new}}' },
      { label: 'מחיר אחרי פרמיית ייצוא', math: 'P = P_w + \\text{premium}' },
    ],
  },
  {
    chapter: 10, title: 'מונופול', color: '#64748b',
    rows: [
      { label: 'פדיון שולי', math: 'MR = \\frac{\\Delta TR}{\\Delta Q}' },
      { label: 'MR לביקוש ליניארי', math: 'MR = a - 2bQ', note: 'כאשר <span dir="ltr">P = a − bQ</span> — שיפוע כפול' },
      { label: 'תנאי מקסימום רווח', math: 'MR = MC' },
      { label: 'המחיר נקבע מעקומת הביקוש', math: 'P^{*} = a - bQ^{*}' },
    ],
  },
]

export function AppendixFormulas() {
  return (
    <ChapterLayout
      number={13}
      navId="formulas"
      badge="נספח"
      title="דף נוסחאות"
      subtitle="כל הנוסחאות של הספר, לפי נושא"
      color="#0891b2"
      examWeight="עזר לבחינה"
    >
      <div className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        הנוסחאות מסודרות לפי סדר הפרקים. כל נוסחה מופיעה ומוסברת במלואה בפרק שממנו היא נלקחה.
      </div>

      {GROUPS.map((g) => (
        <section key={g.chapter} className="space-y-3">
          <h2 className="text-lg font-bold" style={{ color: g.color }}>
            פרק {g.chapter} · {g.title}
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            {g.rows.map((r, i) => (
              <div
                key={r.label}
                className={`flex flex-col gap-2 p-4 md:flex-row md:items-center md:gap-4 ${i > 0 ? 'border-t border-border' : ''}`}
              >
                <div className="md:w-1/3">
                  <div className="font-semibold">{r.label}</div>
                  {r.note && (
                    <div className="mt-0.5 text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: r.note }} />
                  )}
                </div>
                <div className="flex-1 rounded-xl border border-border p-3 text-center" dir="ltr">
                  <MathText math={r.math} display />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </ChapterLayout>
  )
}
