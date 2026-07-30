import { useState } from 'react'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ChapterLayout } from '@/components/ChapterLayout'
import { LinkedTerm } from '@/components/LinkedTerm'
import { FormulaLink } from '@/components/FormulaLink'
import { Example } from '@/components/Example'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

// Monopoly: P = a - bQ (inverse demand), TR = aQ - bQ², MR = a - 2bQ, MC = c (constant)
// Monopoly optimum: MR=MC → a-2bQ=c → Q*=(a-c)/(2b), P*=a-bQ*
function MonopolySim() {
  const [a, setA] = useState(200)
  const [b, setB] = useState(2)
  const [mc, setMc] = useState(40)

  const Q_mono = (a - mc) / (2 * b)
  const P_mono = a - b * Q_mono
  const TR_mono = P_mono * Q_mono
  const TC_mono = mc * Q_mono
  const profit = TR_mono - TC_mono

  // Competitive: P=MC → a-bQ=mc → Q_comp=(a-mc)/b = 2*Q_mono
  const Q_comp = (a - mc) / b
  const P_comp = mc

  // Welfare
  const maxWTP = a // P when Q=0
  const CS_mono = 0.5 * (maxWTP - P_mono) * Q_mono
  const PS_mono = (P_mono - mc) * Q_mono
  const W_mono = CS_mono + PS_mono

  const CS_comp = 0.5 * (maxWTP - P_comp) * Q_comp
  const W_comp = CS_comp

  const DWL = W_comp - W_mono

  const data = Array.from({ length: Math.ceil(Q_comp * 1.3) + 1 }, (_, i) => {
    const Q = i
    const P = Math.max(0, a - b * Q)
    const MR = Math.max(0, a - 2 * b * Q)
    return { Q, P, MR, MC: mc }
  })

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 1 — מונופול: תפוקה ורווח</h4>
      <p className="text-xs text-slate-600">P = a − b×Q (ביקוש הפוך), MC קבוע</p>
      <div className="grid grid-cols-3 gap-3">
        {[['a (מקסימום P)', a, setA, 100, 400, 10], ['b (שיפוע)', b, setB, 1, 5, 0.5], ['MC (עלות שולית)', mc, setMc, 10, 150, 5]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border">
            <p className="text-xs font-semibold mb-1">{label as string}: {(val as number).toFixed(1)}</p>
            <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#64748b' }} /></div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Q" label={{ value: 'Q', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: 'P', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <ReferenceLine x={Q_mono} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" label={{ value: `Q*=${Q_mono.toFixed(1)}`, position: 'top', fill: '#8b5cf6', fontSize: 11 }} />
          <ReferenceLine y={P_mono} stroke="#8b5cf6" strokeWidth={1} strokeDasharray="4 4" />
          <Line type="monotone" dataKey="P" stroke="#3b82f6" dot={false} strokeWidth={2} name="ביקוש (P)" />
          <Line type="monotone" dataKey="MR" stroke="#ef4444" dot={false} strokeWidth={2} name="MR" />
          <Line type="monotone" dataKey="MC" stroke="#22c55e" dot={false} strokeWidth={2} name="MC" />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded-xl bg-purple-50 border border-purple-200 p-2">
          <p className="font-bold text-purple-700">Q* = {Q_mono.toFixed(1)}</p><p>כמות מונופול</p>
        </div>
        <div className="rounded-xl bg-purple-50 border border-purple-200 p-2">
          <p className="font-bold text-purple-700">P* = {P_mono.toFixed(1)}</p><p>מחיר מונופול</p>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-200 p-2">
          <p className="font-bold text-green-700">רווח = {profit.toFixed(0)}</p><p>(P−MC)×Q</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-2">
          <p className="font-bold text-red-700">DWL = {DWL.toFixed(0)}</p><p>אובדן יעילות</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded-xl p-3 border">
        <div>
          <p className="font-semibold text-blue-700">תחרות מושלמת:</p>
          <p>Q={Q_comp.toFixed(1)}, P={P_comp}, רווח=0</p>
        </div>
        <div>
          <p className="font-semibold text-purple-700">מונופול:</p>
          <p>Q={Q_mono.toFixed(1)}, P={P_mono.toFixed(1)}, DWL={DWL.toFixed(0)}</p>
        </div>
      </div>
    </div>
  )
}

function PriceDiscriminationSim() {
  const [a1, setA1] = useState(200)
  const [a2, setA2] = useState(140)
  const [b, setB] = useState(2)
  const [mc, setMc] = useState(40)

  // Group 1: P1=a1-bQ1, MR1=a1-2bQ1=MC → Q1=(a1-mc)/(2b), P1=a1-bQ1
  const Q1 = (a1 - mc) / (2 * b)
  const P1 = a1 - b * Q1
  const profit1 = (P1 - mc) * Q1

  // Group 2: P2=a2-bQ2, MR2=a2-2bQ2=MC → Q2=(a2-mc)/(2b), P2=a2-bQ2
  const Q2 = Math.max(0, (a2 - mc) / (2 * b))
  const P2 = a2 - b * Q2
  const profit2 = Math.max(0, (P2 - mc) * Q2)

  // Without discrimination: single market, combined demand
  // Assume: Qd=Qd1+Qd2=(a1-bP)+(a2-bP)=(a1+a2)-2bP → inverse: P=(a1+a2-Q)/(2b)
  // MR = (a1+a2)/(2b) - Q/b = MC → Q_uni = (a1+a2-2*b*mc)/2... complex
  // Simpler approach: just show the benefit of discrimination
  const totalProfitDiscrimination = profit1 + profit2

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 2 — אפליית מחירים מדרגה שלישית</h4>
      <p className="text-xs text-slate-600">שני שווקים עם אלסטיות שונה. MC קבוע. MR₁=MR₂=MC.</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="font-semibold text-xs text-blue-700">קבוצה 1 (ביקוש גבוה)</p>
          {[['a₁ (מקס P)', a1, setA1, 100, 300, 10]].map(([label, val, setter, min, max, step]) => (
            <div key={label as string} className="bg-white rounded-xl p-2 border">
              <p className="text-xs font-semibold mb-1">{label as string}: {val as number}</p>
              <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
                onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} /></div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-xs text-red-700">קבוצה 2 (ביקוש נמוך)</p>
          {[['a₂ (מקס P)', a2, setA2, 50, 200, 10]].map(([label, val, setter, min, max, step]) => (
            <div key={label as string} className="bg-white rounded-xl p-2 border">
              <p className="text-xs font-semibold mb-1">{label as string}: {val as number}</p>
              <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
                onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#ef4444' }} /></div>
            </div>
          ))}
        </div>
      </div>
      {[['MC', mc, setMc, 10, 100, 5]].map(([label, val, setter, min, max, step]) => (
        <div key={label as string} className="bg-white rounded-xl p-2 border">
          <p className="text-xs font-semibold mb-1">{label as string}: {val as number}</p>
          <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
            onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#22c55e' }} /></div>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
          <p className="font-bold text-blue-700 text-xs mb-1">קבוצה 1</p>
          <p className="text-xs">Q₁={Q1.toFixed(1)}, P₁={P1.toFixed(1)}</p>
          <p className="text-xs font-semibold text-blue-600">רווח: {profit1.toFixed(0)}</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3">
          <p className="font-bold text-red-700 text-xs mb-1">קבוצה 2</p>
          {Q2 > 0 ? <>
            <p className="text-xs">Q₂={Q2.toFixed(1)}, P₂={P2.toFixed(1)}</p>
            <p className="text-xs font-semibold text-red-600">רווח: {profit2.toFixed(0)}</p>
          </> : <p className="text-xs text-red-500">a₂ &lt; MC — לא ממכרת!</p>}
        </div>
      </div>
      <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
        <p className="font-bold text-green-700">רווח כולל עם אפליה: {totalProfitDiscrimination.toFixed(0)}</p>
        <p className="text-xs mt-1">המונופול מגדיל רווח ע"י גביית מחיר שונה לכל קבוצה (MR₁=MR₂=MC)</p>
      </div>
      <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-xs">
        <p className="font-bold text-yellow-800">📌 כלל אפליה:</p>
        <p className="text-yellow-700 mt-1">קבוצה עם ביקוש קשיח יותר (E קטן יותר) → מחיר גבוה יותר. P גבוה לקבוצה 1 (ביקוש גמיש פחות).</p>
      </div>
    </div>
  )
}

function WelfareSim() {
  const [a, setA] = useState(200)
  const [mc, setMc] = useState(40)

  const b = 2
  const Q_mono = (a - mc) / (2 * b)
  const P_mono = a - b * Q_mono
  const Q_comp = (a - mc) / b
  const maxWTP = a

  const CS_mono = 0.5 * (maxWTP - P_mono) * Q_mono
  const PS_mono = (P_mono - mc) * Q_mono
  const W_mono = CS_mono + PS_mono

  const CS_comp = 0.5 * (maxWTP - mc) * Q_comp
  const W_comp = CS_comp

  const DWL = W_comp - W_mono

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 3 — רווחה: מונופול vs תחרות</h4>
      <p className="text-xs text-slate-600">P = a−2Q, MC קבוע. הזזת פרמטרים.</p>
      <div className="grid grid-cols-2 gap-3">
        {[['a (מקסימום P)', a, setA, 100, 400, 10], ['MC', mc, setMc, 10, 150, 5]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border">
            <p className="text-xs font-semibold mb-1">{label as string}: {val as number}</p>
            <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#64748b' }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-2">
          <p className="font-semibold text-purple-700">מונופול</p>
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-xs space-y-1">
            <p>Q* = {Q_mono.toFixed(1)}, P* = {P_mono.toFixed(1)}</p>
            <p>CS = {CS_mono.toFixed(0)}</p>
            <p>PS (רווח) = {PS_mono.toFixed(0)}</p>
            <p>W = {W_mono.toFixed(0)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-blue-700">תחרות מושלמת</p>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs space-y-1">
            <p>Q = {Q_comp.toFixed(1)}, P = {mc} (=MC)</p>
            <p>CS = {CS_comp.toFixed(0)}</p>
            <p>PS = 0</p>
            <p>W = {W_comp.toFixed(0)}</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
        <p className="font-bold text-red-700">DWL (אובדן יעילות ממונופול) = {DWL.toFixed(0)}</p>
        <p className="text-xs mt-1">= ½ × (P*−MC) × (Q_comp−Q_mono) = ½ × {(P_mono-mc).toFixed(0)} × {(Q_comp-Q_mono).toFixed(0)}</p>
      </div>
    </div>
  )
}

const MCQ: McqQuestion[] = [
  {
    id: 'mon-q1',
    question: 'מונופול מחליט כמות לפי:',
    options: ['P = MC', 'MR = MC', 'TR מקסימלי', 'ATC מינימלי'],
    correct: 1,
    explanation: 'מונופול (כמו כל פירמה) ממקסם רווח כאשר MR = MC. ההבדל: מחיר P > MR כי עקום הביקוש יורד → P > MR = MC → P > MC.'
  },
  {
    id: 'mon-q2',
    question: 'P = 120 − 2Q. מה פונקציית ה-MR?',
    options: ['MR = 120 − 2Q', 'MR = 120 − 4Q', 'MR = 60 − Q', 'MR = 120'],
    correct: 1,
    explanation: 'לפונקציית ביקוש לינארית P = a − bQ: MR = a − 2bQ. כאן: MR = 120 − 2×2×Q = 120 − 4Q. השיפוע של MR כפול משיפוע הביקוש!'
  },
  {
    id: 'mon-q3',
    question: 'P = 100 − Q, MC = 20. מה Q* ו-P* של המונופול?',
    options: ['Q*=40, P*=60', 'Q*=80, P*=20', 'Q*=50, P*=50', 'Q*=40, P*=80'],
    correct: 0,
    explanation: 'MR = 100 − 2Q = MC = 20 → 80 = 2Q → Q* = 40. P* = 100 − 40 = 60. רווח = (60−20)×40 = 1600.'
  },
  {
    id: 'mon-q4',
    question: 'מהו DWL ממונופול?',
    options: [
      'שטח המלבן (P−MC)×Q*',
      'משולש: ½×(P*−MC)×(Q_comp−Q*)',
      'כל עודף הצרכן',
      'הכנסות הממשלה'
    ],
    correct: 1,
    explanation: 'DWL = ½×(P*−MC)×(Q_comp−Q_mono). זה המשולש בין נקודת המונופול לנקודת התחרות. הוא מייצג עסקאות שלא בוצעו למרות שערכן לצרכן > MC.'
  },
  {
    id: 'mon-q5',
    question: 'אפליית מחירים מדרגה שלישית: לאיזה שוק יגבה המונופול מחיר גבוה יותר?',
    options: [
      'לשוק עם ביקוש גמיש יותר (E גדול)',
      'לשוק עם ביקוש קשיח יותר (E קטן)',
      'לשוק הגדול יותר',
      'זהה בשני השווקים'
    ],
    correct: 1,
    explanation: 'כלל: MR=MC בכל שוק. MR=P×(1−1/E). שוק עם E קטן (קשיח) → ניתן לגבות P גבוה יותר בלי לאבד לקוחות. לכן: P גבוה = ביקוש קשיח.'
  },
]

export function Chapter10Monopoly() {
  return (
    <ChapterLayout number={10} title="מונופול" subtitle="MR=MC, DWL, אפליית מחירים" color="#8b5cf6" examWeight="~20% מהמבחן — חשוב מאוד">
      <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
        <p className="font-bold text-purple-800">⭐ פרק חשוב!</p>
        <p className="text-sm text-purple-700 mt-1">ה<LinkedTerm anchorKey="monopoly">מונופול</LinkedTerm> הוא אחד מנושאי הבחינה הנפוצים ביותר. שלוט ב-MR=MC, DWL, ואפליית מחירים.</p>
      </div>
      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">10.1 מונופול — כיצד קובע כמות?</h3>
          <div className="text-sm space-y-2">
            <p>מונופול = יצרן יחיד בשוק. עקום ביקוש הוא עקום ביקוש השוק (יורד). מונופול הוא <strong>price maker</strong>.</p>
            <p>כדי למכור יחידה נוספת → חייב להוריד מחיר לכולם → MR &lt; P.</p>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3">
            <p className="font-bold text-sm text-purple-700">📌 כלל מונופול:</p>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="text-center">
                <MathText math="MR = MC \Rightarrow Q^*" display />
                <p className="text-xs">קובע כמות</p>
                <FormulaLink formulaKey="monopoly-profit-max" />
              </div>
              <div className="text-center">
                <MathText math="P^* = P(Q^*)" display />
                <p className="text-xs">מחיר מעקום ביקוש</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 border p-3">
            <p className="font-bold text-sm mb-2">פונקציית MR לביקוש לינארי:</p>
            <div className="text-center">
              <p className="text-sm mb-2">אם P = a − bQ:</p>
              <MathText math="MR = a - 2bQ" display />
              <p className="text-xs text-slate-500 mt-1">שיפוע MR = כפול שיפוע הביקוש</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">10.2 רווחה: מונופול vs תחרות מושלמת</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              ['כמות', 'Q_mono < Q_comp', 'מונופול מייצר פחות'],
              ['מחיר', 'P_mono > MC', 'מונופול גובה יותר'],
              ['DWL', '½×(P−MC)×ΔQ', 'אובדן יעילות'],
            ].map(([t, f, d]) => (
              <div key={t} className="rounded-xl bg-slate-50 border p-3">
                <p className="font-bold text-purple-700">{t}</p>
                <p className="font-semibold text-sm mt-1">{f}</p>
                <p className="text-slate-500 mt-1">{d}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border p-3 text-center">
            <p className="font-semibold text-sm mb-1">DWL ממונופול:</p>
            <MathText math="DWL = \frac{1}{2}(P^* - MC)(Q_{comp} - Q^*)" display />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">10.3 אפליית מחירים (Price Discrimination)</h3>
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <p className="font-bold text-blue-700">מדרגה ראשונה: אפליה מושלמת</p>
              <p className="text-xs mt-1">גובה מכל צרכן את נכונות התשלום המקסימלית. DWL=0 אבל כל CS הופך ל-PS.</p>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-200 p-3">
              <p className="font-bold text-green-700">מדרגה שלישית: שווקים נפרדים</p>
              <p className="text-xs mt-1">מחיר שונה לכל קבוצה. כלל: MR₁=MR₂=MC. קבוצה קשיחה יותר → P גבוה יותר.</p>
            </div>
          </div>
          <div className="rounded-xl border border-border p-3 text-center">
            <p className="font-semibold text-xs mb-1">כלל אפליה (מדרגה שלישית):</p>
            <MathText math="MR_1 = MR_2 = MC" display />
            <p className="text-xs text-slate-500 mt-1">כמות בכל שוק: MR_i = a_i − 2b_i·Q_i = MC → Q_i, P_i</p>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות</h2>
        <MonopolySim />
        <PriceDiscriminationSim />
        <WelfareSim />
      </section>

      {/* SOLVED EXAMPLE */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">📝 דוגמה פתורה</h2>
        <Example
          title="10.5 מונופול קובע מחיר וכמות למקסום רווח"
          q={<>
            מונופול ניצב מול ביקוש הפוך <MathText math="P=150-3Q" />, ועלות שולית קבועה MC=30₪.
            מה הכמות והמחיר שהמונופול יבחר, ומה הרווח שלו?
          </>}
          answer={20}
          tol={0}
          unit="יחידות (Q*)"
        >
          <p className="text-sm"><strong>שלב 1 — נגזרת ה-MR מהביקוש ההפוך</strong> (כשהביקוש ליניארי, MR פי 2 בשיפוע):</p>
          <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800 dark:text-slate-100 text-center" dir="ltr">
            <MathText math="P=150-3Q \;\Rightarrow\; MR=150-6Q" display />
          </div>
          <FormulaLink formulaKey="monopoly-mr-linear" />
          <p className="text-sm"><strong>שלב 2 — תנאי מקסום רווח MR=MC:</strong></p>
          <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800 dark:text-slate-100 text-center" dir="ltr">
            <MathText math="150-6Q=30 \;\Rightarrow\; 120=6Q \;\Rightarrow\; Q^{*}=20" display />
          </div>
          <FormulaLink formulaKey="monopoly-profit-max" />
          <p className="text-sm"><strong>שלב 3 — המחיר, מהעקומה המקורית:</strong></p>
          <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800 dark:text-slate-100 text-center" dir="ltr">
            <MathText math="P^{*}=150-3(20)=90" display />
          </div>
          <p className="text-sm"><strong>שלב 4 — הרווח</strong> (המרווח על כל יחידה, כפול הכמות):</p>
          <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800 dark:text-slate-100 text-center" dir="ltr">
            <MathText math="\pi=(P^{*}-MC)\times Q^{*}=(90-30)\times20=1{,}200" display />
          </div>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            תשובה: Q*=20 יחידות, P*=90₪, רווח=1,200₪. שימו לב ש-P*(90) גבוה בהרבה מ-MC(30) — זו בדיוק התוצאה של כוח שוק מונופוליסטי.
          </p>
        </Example>
      </section>

      <section><McqSection questions={MCQ} topicId="monopoly" /></section>
    </ChapterLayout>
  )
}
