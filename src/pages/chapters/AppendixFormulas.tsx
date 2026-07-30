import { useEffect, useRef } from 'react'
import { MathText } from '@/components/MathText'
import { ChapterLayout } from '@/components/ChapterLayout'
import { useNavigation } from '@/components/NavigationContext'
import { cn } from '@/lib/utils'

/* נספח: דף נוסחאות — הנוסחאות נאספו מתוך 10 פרקי הספר, לפי סדר הפרקים.
   כל נוסחה מקבלת key ייחודי (עוגן) — FormulaLink בפרקי התיאוריה מפנה אליו לפי ה-key הזה. */

type Row = { key: string; label: string; math: string; note?: string }
type Group = { chapter: number; title: string; color: string; rows: Row[] }

const GROUPS: Group[] = [
  {
    chapter: 1, title: 'עקומת התמורה (PPF)', color: '#a855f7',
    rows: [
      { key: 'ppf-max-output', label: 'ייצור מרבי של מוצר', math: 'Q_{\\max} = N \\times q', note: 'N = מספר עובדים · q = תפוקה לעובד' },
      { key: 'ppf-opportunity-cost', label: 'עלות אלטרנטיבית של X', math: '\\text{OC}_X = \\frac{q_Y}{q_X}', note: 'כמה Y מוותרים על יחידת X אחת' },
      { key: 'ppf-comparative-advantage', label: 'יתרון יחסי', math: '\\text{OC}_X^A < \\text{OC}_X^B', note: 'למי שעלותו נמוכה יותר — יתרון יחסי ב-X' },
      { key: 'ppf-optimal-allocation', label: 'הקצאה אופטימלית לפי הכנסה', math: 'q_X \\cdot P_X \\;\\; \\text{מול} \\;\\; q_Y \\cdot P_Y', note: 'כל קבוצה למוצר שבו הכנסתה גבוהה יותר' },
    ],
  },
  {
    chapter: 2, title: 'פונקציית הייצור', color: '#6366f1',
    rows: [
      { key: 'production-mp', label: 'תפוקה שולית', math: 'MP = \\frac{\\Delta Q}{\\Delta L}' },
      { key: 'production-ap', label: 'תפוקה ממוצעת', math: 'AP = \\frac{Q}{L}' },
      { key: 'production-vmp', label: 'ערך התפוקה השולית', math: 'VMP = MP \\times P' },
      { key: 'production-optimal-hiring', label: 'כלל העסקה אופטימלי', math: 'VMP = W', note: 'מעסיקים עוד עובד כל עוד VMP גדול מהשכר' },
    ],
  },
  {
    chapter: 3, title: 'עלויות', color: '#f97316',
    rows: [
      { key: 'costs-tc', label: 'עלות כוללת', math: 'TC = FC + VC' },
      { key: 'costs-mc', label: 'עלות שולית', math: 'MC = \\frac{\\Delta TC}{\\Delta Q}' },
      { key: 'costs-ac', label: 'עלות ממוצעת', math: 'AC = \\frac{TC}{Q}' },
      { key: 'costs-avc', label: 'עלות משתנה ממוצעת', math: 'AVC = \\frac{VC}{Q}' },
      { key: 'costs-profit', label: 'רווח', math: '\\pi = TR - TC = P \\cdot Q - TC' },
      { key: 'costs-shutdown', label: 'תנאי ייצור בטווח הקצר', math: 'P \\ge AVC_{\\min}', note: 'מתחת לזה — עדיף לסגור' },
      { key: 'costs-breakeven', label: 'נקודת איזון (טווח ארוך)', math: 'P = AC_{\\min}' },
    ],
  },
  {
    chapter: 4, title: 'ביקוש', color: '#3b82f6',
    rows: [
      { key: 'demand-function', label: 'פונקציית ביקוש', math: 'Q_d = a - bP', note: 'שיפוע שלילי — חוק הביקוש' },
      { key: 'demand-inverse', label: 'פונקציה הפוכה', math: 'P = \\frac{a - Q_d}{b}' },
      { key: 'demand-tr', label: 'פדיון כולל', math: 'TR = P \\times Q' },
    ],
  },
  {
    chapter: 5, title: 'גמישויות', color: '#94a3b8',
    rows: [
      { key: 'elasticity-price', label: 'גמישות מחיר', math: 'E = \\left|\\frac{\\Delta Q / Q}{\\Delta P / P}\\right|' },
      { key: 'elasticity-income', label: 'גמישות הכנסה', math: 'E_i = \\frac{\\Delta Q / Q}{\\Delta I / I}', note: 'חיובי = מוצר נורמלי · שלילי = נחות' },
      { key: 'elasticity-cross', label: 'גמישות צולבת', math: 'E_{xy} = \\frac{\\Delta Q_x / Q_x}{\\Delta P_y / P_y}', note: 'חיובי = תחליפים · שלילי = משלימים' },
    ],
  },
  {
    chapter: 6, title: 'שיווי משקל במשק סגור', color: '#22c55e',
    rows: [
      { key: 'equilibrium-condition', label: 'תנאי שיווי משקל', math: 'Q_d = Q_s', note: 'הפתרון נותן את P* ו-Q*' },
      { key: 'equilibrium-cs', label: 'עודף הצרכן', math: 'CS = \\tfrac{1}{2}\\,(P_{\\max} - P^{*}) \\cdot Q^{*}' },
      { key: 'equilibrium-ps', label: 'עודף היצרן', math: 'PS = \\tfrac{1}{2}\\,(P^{*} - P_{\\min}) \\cdot Q^{*}' },
      { key: 'equilibrium-welfare', label: 'רווחה כוללת', math: 'W = CS + PS' },
    ],
  },
  {
    chapter: 7, title: 'התערבות ממשלתית — משק סגור', color: '#ef4444',
    rows: [
      { key: 'intervention-tax-producer', label: 'מס על יצרן', math: 'P_s = P_d - t', note: 'היצרן מקבל פחות בגובה המס' },
      { key: 'intervention-subsidy', label: 'סובסידיה', math: 'P_s = P_d + s' },
      { key: 'intervention-tax-revenue', label: 'הכנסות המדינה ממס', math: 'T = t \\times Q^{*}_{\\text{new}}' },
      { key: 'intervention-dwl', label: 'נטל עודף (DWL)', math: 'DWL = \\tfrac{1}{2} \\cdot t \\cdot \\Delta Q' },
    ],
  },
  {
    chapter: 8, title: 'משק פתוח', color: '#0ea5e9',
    rows: [
      { key: 'open-economy-imports', label: 'ייבוא', math: 'M = Q_d(P_w) - Q_s(P_w)', note: 'כאשר המחיר העולמי נמוך מהמקומי' },
      { key: 'open-economy-exports', label: 'ייצוא', math: 'X = Q_s(P_w) - Q_d(P_w)', note: 'כאשר המחיר העולמי גבוה מהמקומי' },
      { key: 'open-economy-local-price', label: 'מחיר מקומי במשק פתוח', math: 'P_{\\text{local}} = P_w' },
    ],
  },
  {
    chapter: 9, title: 'מכס ופרמיית ייצוא', color: '#f59e0b',
    rows: [
      { key: 'tariff-price', label: 'מחיר אחרי מכס', math: 'P = P_w + \\text{tariff}' },
      { key: 'tariff-revenue', label: 'הכנסות המדינה ממכס', math: 'T = \\text{tariff} \\times M_{\\text{new}}' },
      { key: 'tariff-export-premium', label: 'מחיר אחרי פרמיית ייצוא', math: 'P = P_w + \\text{premium}' },
    ],
  },
  {
    chapter: 10, title: 'מונופול', color: '#64748b',
    rows: [
      { key: 'monopoly-mr', label: 'פדיון שולי', math: 'MR = \\frac{\\Delta TR}{\\Delta Q}' },
      { key: 'monopoly-mr-linear', label: 'MR לביקוש ליניארי', math: 'MR = a - 2bQ', note: 'כאשר <span dir="ltr">P = a − bQ</span> — שיפוע כפול' },
      { key: 'monopoly-profit-max', label: 'תנאי מקסימום רווח', math: 'MR = MC' },
      { key: 'monopoly-price', label: 'המחיר נקבע מעקומת הביקוש', math: 'P^{*} = a - bQ^{*}' },
    ],
  },
]

export function AppendixFormulas() {
  const { pendingAnchor, canGoBack, goBack } = useNavigation()
  const highlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (pendingAnchor && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' })
    }
  }, [pendingAnchor])

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
            {g.rows.map((r, i) => {
              const isHighlighted = pendingAnchor === r.key
              return (
                <div
                  key={r.key}
                  id={r.key}
                  ref={isHighlighted ? highlightRef : undefined}
                  className={cn(
                    'flex flex-col gap-2 p-4 md:flex-row md:items-center md:gap-4 transition-colors',
                    i > 0 && 'border-t border-border',
                    isHighlighted && 'bg-cyan-50 ring-2 ring-cyan-500 dark:bg-cyan-950/30'
                  )}
                >
                  <div className="md:w-1/3">
                    <div className="font-semibold">{r.label}</div>
                    {r.note && (
                      <div className="mt-0.5 text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: r.note }} />
                    )}
                    {isHighlighted && canGoBack && (
                      <button
                        onClick={goBack}
                        className="mt-2 rounded-lg bg-cyan-600 px-3 py-1 text-xs font-bold text-white hover:brightness-110"
                      >
                        → חזרה לפרק
                      </button>
                    )}
                  </div>
                  <div className="flex-1 rounded-xl border border-border p-3 text-center" dir="ltr">
                    <MathText math={r.math} display />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </ChapterLayout>
  )
}
