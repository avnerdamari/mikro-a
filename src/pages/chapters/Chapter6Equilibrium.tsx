import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, ReferenceLine, ResponsiveContainer } from 'recharts'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ChapterLayout } from '@/components/ChapterLayout'

function solveEquilibrium(a: number, b: number, c: number, d: number) {
  // D: Q = a - bP  →  P = (a-Q)/b  →  Q = a - bP
  // S: P = c + dQ  →  Q = (P-c)/d
  // a - bP = (P-c)/d  →  d(a-bP) = P-c
  // da - dbP = P - c  →  da + c = P(1 + db)
  const Pstar = (d * a + c) / (1 + d * b)
  const Qstar = a - b * Pstar
  return { Pstar: +Pstar.toFixed(2), Qstar: +Qstar.toFixed(2) }
}

/* SIM 1: live equilibrium */
function EquilibriumSim() {
  const [a, setA] = useState(1400)
  const [b, setB] = useState(5)
  const [c, setC] = useState(40)
  const [d, setD] = useState(0.1)

  const { Pstar, Qstar } = solveEquilibrium(a, b, c, d)

  const demandData = Array.from({ length: 30 }, (_, i) => {
    const Q = (a / 30) * i
    const P = (a - Q) / b
    return P > 0 ? { Q: +Q.toFixed(0), P: +P.toFixed(1) } : null
  }).filter(Boolean) as { Q: number; P: number }[]

  const supplyData = Array.from({ length: 30 }, (_, i) => {
    const Q = (a / 30) * i
    const P = c + d * Q
    return { Q: +Q.toFixed(0), P: +P.toFixed(1) }
  })

  const CS = 0.5 * (a / b - Pstar) * Qstar
  const PS = 0.5 * (Pstar - c) * Qstar

  return (
    <div className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-5" dir="rtl">
      <h4 className="font-bold text-green-800">🔬 סימולציה 1 — שיווי משקל חי</h4>
      <p className="text-sm text-green-700">D: Q=a−bP | S: P=c+dQ</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['a (max Q בD)', a, setA, 200, 3000, 50], ['b (שיפוע D)', b, setB, 1, 15, 0.5],
          ['c (מחיר מינ S)', c, setC, 0, 200, 5], ['d (שיפוע S)', d, setD, 0.01, 0.5, 0.01]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border border-green-200">
            <p className="text-xs font-semibold text-green-700 mb-1">{label as string}: {(val as number).toFixed(2)}</p>
            <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#22c55e' }} /></div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart margin={{ top: 15, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="Q" domain={[0, a * 1.05]} label={{ value: 'כמות Q', position: 'insideBottom', offset: -8, fontSize: 11 }} />
          <YAxis label={{ value: 'מחיר P', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip formatter={(v) => (v as number).toFixed(1)} />
          <Line data={demandData} dataKey="P" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="ביקוש D" />
          <Line data={supplyData} dataKey="P" stroke="#ef4444" strokeWidth={2.5} dot={false} name="היצע S" />
          <ReferenceDot x={Qstar} y={Pstar} r={8} fill="#22c55e" stroke="white" strokeWidth={2} label={{ value: 'E', position: 'top', fontSize: 12 }} />
          <ReferenceLine x={Qstar} stroke="#22c55e" strokeDasharray="4 2" />
          <ReferenceLine y={Pstar} stroke="#22c55e" strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
        {[['P*', `${Pstar}₪`, 'מחיר שיווי משקל'], ['Q*', Qstar, 'כמות שיווי משקל'],
          ['עודף צרכן', `${CS.toFixed(0)}₪`, 'שטח משולש מעל P*'], ['עודף יצרן', `${PS.toFixed(0)}₪`, 'שטח משולש מתחת P*']].map(([label, val, sub]) => (
          <div key={label as string} className="rounded-xl bg-green-100 p-2">
            <p className="font-bold text-green-700">{val as string | number}</p>
            <p className="text-xs text-green-600">{label as string}</p>
            <p className="text-[10px] text-muted-foreground">{sub as string}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* SIM 2: two consumer groups */
function TwoGroupEquilibrium() {
  const [a1, setA1] = useState(800)
  const [b1, setB1] = useState(4)
  const [a2, setA2] = useState(600)
  const [b2, setB2] = useState(1)
  const [c, setC] = useState(40)
  const [d, setD] = useState(0.1)

  const aT = a1 + a2, bT = b1 + b2
  const { Pstar, Qstar } = solveEquilibrium(aT, bT, c, d)
  const Q1 = Math.max(0, a1 - b1 * Pstar)
  const Q2 = Math.max(0, a2 - b2 * Pstar)

  return (
    <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-5" dir="rtl">
      <h4 className="font-bold text-blue-800">🔬 סימולציה 2 — שתי קבוצות צרכנים</h4>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm">
        <strong>📌 שלבי הפתרון:</strong> חבר D₁+D₂ לפי Q → D_total → השווה ל-S → מצא P* → הצב בכל D לקבל Q₁, Q₂.
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[['a₁', a1, setA1, 100, 1500, 50], ['b₁', b1, setB1, 0.5, 10, 0.5], ['a₂', a2, setA2, 100, 1500, 50],
          ['b₂', b2, setB2, 0.5, 10, 0.5], ['c (S min)', c, setC, 0, 100, 5], ['d (S slope)', d, setD, 0.01, 0.5, 0.01]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">{label as string}: {(val as number).toFixed(2)}</p>
            <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
        {[['P*', `${Pstar}₪`], ['Q* כולל', Qstar.toFixed(0)], [`Q₁ (P=${Pstar})`, Q1.toFixed(0)], [`Q₂ (P=${Pstar})`, Q2.toFixed(0)]].map(([label, val]) => (
          <div key={label as string} className="rounded-xl bg-blue-100 p-2">
            <p className="font-bold text-blue-700">{val as string}</p>
            <p className="text-xs text-blue-600">{label as string}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 text-center text-sm">
        {[['הוצאות קבוצה 1', (Pstar * Q1).toFixed(0)], ['הוצאות קבוצה 2', (Pstar * Q2).toFixed(0)]].map(([label, val]) => (
          <div key={label as string} className="rounded-xl bg-white border border-blue-200 p-2">
            <p className="font-bold text-blue-700">{val}₪</p>
            <p className="text-xs text-muted-foreground">{label as string}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* SIM 3: shifts */
function ShiftsSim() {
  const [dShift, setDShift] = useState(0)
  const [sShift, setSShift] = useState(0)

  const a0 = 1400, b0 = 5, c0 = 40, d0 = 0.1
  const { Pstar: P0, Qstar: Q0 } = solveEquilibrium(a0, b0, c0, d0)
  const { Pstar: P1, Qstar: Q1 } = solveEquilibrium(a0 + dShift * 100, b0, c0 + sShift * 10, d0)

  return (
    <div className="space-y-4 rounded-2xl border border-purple-200 bg-purple-50 p-5" dir="rtl">
      <h4 className="font-bold text-purple-800">🔬 סימולציה 3 — הסטת עקומות</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-purple-200">
          <p className="text-xs font-semibold text-purple-700 mb-1">הסטת ביקוש: {dShift > 0 ? `+${dShift*100}` : dShift*100}</p>
          <div dir="ltr"><input type="range" min={-5} max={5} value={dShift} onChange={e => setDShift(+e.target.value)} style={{ width: '100%', accentColor: '#a855f7' }} /></div>
          <p className="text-[10px] text-muted-foreground mt-1">+ = עלייה בביקוש (ימינה)</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-purple-200">
          <p className="text-xs font-semibold text-purple-700 mb-1">הסטת היצע (מינ S): {c0 + sShift * 10}₪</p>
          <div dir="ltr"><input type="range" min={-5} max={5} value={sShift} onChange={e => setSShift(+e.target.value)} style={{ width: '100%', accentColor: '#a855f7' }} /></div>
          <p className="text-[10px] text-muted-foreground mt-1">+ = עלייה בעלויות (שמאלה)</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-white border border-purple-200 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">שיווי משקל מקורי</p>
          <p className="font-bold text-purple-700">P*={P0}₪ | Q*={Q0.toFixed(0)}</p>
        </div>
        <div className="rounded-xl bg-purple-100 border border-purple-300 p-3">
          <p className="text-xs font-semibold text-muted-foreground mb-1">שיווי משקל חדש</p>
          <p className="font-bold text-purple-700">P*={P1}₪ | Q*={Q1.toFixed(0)}</p>
        </div>
      </div>
      <div className="rounded-xl bg-white border border-purple-200 p-3 text-sm">
        {dShift > 0 && sShift === 0 && <p className="text-purple-700">↑ ביקוש: ↑P*, ↑Q*</p>}
        {dShift < 0 && sShift === 0 && <p className="text-purple-700">↓ ביקוש: ↓P*, ↓Q*</p>}
        {sShift > 0 && dShift === 0 && <p className="text-purple-700">↑ עלויות (S שמאלה): ↑P*, ↓Q*</p>}
        {sShift < 0 && dShift === 0 && <p className="text-purple-700">↓ עלויות (S ימינה): ↓P*, ↑Q*</p>}
        {dShift !== 0 && sShift !== 0 && <p className="text-purple-700">שינוי סימולטני — לפעמים "לא ניתן לדעת" את כיוון P* או Q*!</p>}
        {dShift === 0 && sShift === 0 && <p className="text-muted-foreground">הזז סליידר לראות השפעה</p>}
      </div>
    </div>
  )
}

const MCQ: McqQuestion[] = [
  {
    id: 'eq-q1',
    question: 'D₁=800−4P, D₂=600−P, S: P=0.1Q+40. מה P*?',
    options: ['120₪', '140₪', '160₪', '100₪'],
    correct: 1,
    explanation: 'Q_total=(800-4P)+(600-P)=1,400-5P. S: Q=(P-40)/0.1=10P-400.\n1,400-5P=10P-400 → 1,800=15P → P*=120? חישוב מחדש:\nD=S: 1,400-5P=10P-400 → 1,800=15P → P*=120. הצב: Q*=1,400-600=800.\nב-P*=120: Q_S=10×120-400=800 ✓. P*=120₪.',
  },
  {
    id: 'eq-q2',
    question: 'P*=140, Q₁=240 (פרטיים), Q₂=460 (מלון). מה הוצאות המלון?',
    options: ['33,600₪', '64,400₪', '140,000₪', '46,000₪'],
    correct: 1,
    explanation: 'הוצאות מלון = P* × Q₂ = 140 × 460 = 64,400₪.',
  },
  {
    id: 'eq-q3',
    question: 'עודף הצרכן מחושב כ:',
    options: ['P* × Q*', '½ × (P_max - P*) × Q*', '½ × (P* - P_min) × Q*', '(P_max - P*) × Q*'],
    correct: 1,
    explanation: 'עודף צרכן = שטח משולש מעל P* ומתחת לעקומת הביקוש = ½ × (P_מקסימלי - P*) × Q*.',
  },
  {
    id: 'eq-q4',
    question: 'ביקוש עולה (D זזה ימינה) וההיצע לא משתנה. מה קורה?',
    options: ['P* עולה, Q* יורד', 'P* עולה, Q* עולה', 'P* יורד, Q* עולה', 'P* לא משתנה'],
    correct: 1,
    explanation: '↑D → תחרות גדולה יותר → ↑P*. בP* גבוה יותר, יצרנים מספקים יותר → ↑Q*.',
  },
  {
    id: 'eq-q5',
    question: 'שני שינויים סימולטניים: ↑ הכנסה (מוצר נורמלי) + ↑ מחיר חומרי גלם. מה קורה ל-P* ו-Q*?',
    options: ['P*↑ ו-Q*↑', 'P*↑, Q* — לא ניתן לדעת', 'P*↓, Q*↑', 'לא ניתן לדעת כלום'],
    correct: 1,
    explanation: '↑ הכנסה → ↑D (ימינה). ↑ חו"ג → ↑עלויות → ↓S (שמאלה). D↑+S↓: שניהם דוחפים P* למעלה → P* בוודאי עולה. Q*: D↑ מעלה, S↓ מוריד — כיוון לא ידוע.',
  },
]

export function Chapter6Equilibrium() {
  return (
    <ChapterLayout number={6} title="שיווי משקל במשק סגור" subtitle="D=S, P* ו-Q*, עודפים, רווחה" color="#22c55e" examWeight="3-4 שאלות — הכי חשוב!">
      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">6.1 תנאי שיווי המשקל</h3>
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
            <MathText math="D = S \quad\Rightarrow\quad Q_D(P^*) = Q_S(P^*)" display />
          </div>
          <p className="text-sm text-muted-foreground">המחיר שבו הכמות המבוקשת = הכמות המסופקת. פותרים מערכת משוואות לינארית.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">6.2 שתי קבוצות צרכנים — הדפוס הכי נפוץ במבחן!</h3>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3">
            <p className="font-bold text-amber-800">📋 שלבי הפתרון:</p>
            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
              <li>כתוב D₁ ו-D₂ כ-Q=f(P)</li>
              <li>חבר: Q_total = Q₁+Q₂ = (a₁+a₂)-(b₁+b₂)P</li>
              <li>השווה D_total = S → פתור ל-P*</li>
              <li>הצב P* בכל D₁ ו-D₂ בנפרד → Q₁, Q₂</li>
              <li>הוצאות כל קבוצה = P* × Q_i</li>
            </ol>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <p className="font-bold text-green-800 mb-2">📊 דוגמה מחוברת תרגיל 7:</p>
            <p className="text-sm text-green-700">D₁=800−4P (פרטיים) | D₂=600−P (מסעדות) | S: P=0.1Q+40</p>
            <p className="text-sm text-green-700 mt-1">Q_total=1,400−5P. S: Q=10P−400.</p>
            <p className="text-sm text-green-700 mt-1">1,400−5P=10P−400 → <strong>P*=120₪, Q*=800</strong></p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">6.3 עודפים ורווחה</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <p className="font-bold text-blue-700 text-sm">עודף צרכן (CS)</p>
              <div className="text-center mt-2"><MathText math="CS = \frac{1}{2}(P_{max}-P^*)Q^*" /></div>
              <p className="text-xs text-muted-foreground mt-1">מה שצרכנים רצו לשלם — מה שלמדו בפועל</p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-3">
              <p className="font-bold text-red-700 text-sm">עודף יצרן (PS)</p>
              <div className="text-center mt-2"><MathText math="PS = \frac{1}{2}(P^*-P_{min})Q^*" /></div>
              <p className="text-xs text-muted-foreground mt-1">מה שיצרנים קיבלו — מה שהיו מוכנים לקבל</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-bold text-lg">6.4 שינויים סימולטניים — "לא ניתן לדעת"</h3>
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
            <p className="font-bold text-purple-800 mb-2">⚡ כלל חשוב למבחן:</p>
            <p className="text-sm text-purple-700">כשD וS זזים בכיוונים מנוגדים — אחד ממשתני שיווי המשקל (P* או Q*) <strong>לא ניתן לקביעה</strong> ללא נתוני גמישות.</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              {[['↑D + ↓S', 'P*↑ בוודאי | Q* — לא ידוע'], ['↑D + ↑S', 'Q*↑ בוודאי | P* — לא ידוע'],
                ['↓D + ↓S', 'Q*↓ בוודאי | P* — לא ידוע'], ['↓D + ↑S', 'P*↓ בוודאי | Q* — לא ידוע']].map(([cond, res]) => (
                <div key={cond} className="rounded-lg bg-purple-100 p-2">
                  <p className="font-semibold">{cond}</p><p className="text-purple-700">{res}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות אינטראקטיביות</h2>
        <EquilibriumSim />
        <TwoGroupEquilibrium />
        <ShiftsSim />
      </section>
      <section><McqSection questions={MCQ} topicId="equilibrium" /></section>
    </ChapterLayout>
  )
}
