import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'

/* ── Cost simulation ─────────────────────── */
const BASE_COSTS = [
  { Q: 0, TC: 100, VC: 0 },
  { Q: 1, TC: 160, VC: 60 },
  { Q: 2, TC: 200, VC: 100 },
  { Q: 3, TC: 230, VC: 130 },
  { Q: 4, TC: 270, VC: 170 },
  { Q: 5, TC: 320, VC: 220 },
  { Q: 6, TC: 390, VC: 290 },
  { Q: 7, TC: 490, VC: 390 },
]

function calcCosts(data: typeof BASE_COSTS) {
  return data.map((row, i) => {
    const FC = row.TC - row.VC
    const MC = i === 0 ? 0 : row.TC - data[i - 1].TC
    const AC = row.Q > 0 ? row.TC / row.Q : 0
    const AVC = row.Q > 0 ? row.VC / row.Q : 0
    return { ...row, FC, MC, AC: +AC.toFixed(1), AVC: +AVC.toFixed(1) }
  })
}

function CostSim() {
  const [price, setPrice] = useState(60)
  const rows = calcCosts(BASE_COSTS)
  const FC = rows[0].TC

  const optQ = rows.filter(r => r.Q > 0 && r.MC <= price).pop()
  const tr = optQ ? price * optQ.Q : 0
  const tc = optQ ? optQ.TC : 0
  const profit = tr - tc

  const decision = optQ
    ? profit >= 0
      ? 'ייצר (רווחי) — טווח ארוך ✅'
      : optQ.AVC <= price
        ? `ייצר בטווח קצר בלבד ⚠️ (הפסד ${profit.toFixed(0)}₪ אבל פחות מ-FC=${FC}₪)`
        : 'לא ייצר — סגור ❌'
    : 'לא ייצר — סגור ❌'

  const decisionColor = profit >= 0 ? 'bg-green-50 border-green-300 text-green-800' : (optQ?.AVC ?? 0) <= price ? 'bg-yellow-50 border-yellow-300 text-yellow-800' : 'bg-red-50 border-red-300 text-red-800'

  return (
    <div className="space-y-4 rounded-2xl border border-orange-200 bg-orange-50 p-5" dir="rtl">
      <h4 className="font-bold text-orange-800">🔬 סימולציה 1 — היצרן בוחר Q</h4>
      <div className="bg-white rounded-xl p-3 border border-orange-200">
        <p className="text-xs font-semibold text-orange-700 mb-1">מחיר שוק P: {price}₪</p>
        <div dir="ltr"><input type="range" min={20} max={120} value={price} onChange={e => setPrice(+e.target.value)} style={{ width: '100%', accentColor: '#f97316' }} /></div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="bg-orange-100">
              {['Q', 'TC', 'VC', 'FC', 'MC', 'AC', 'AVC', 'TR=P×Q', 'רווח', 'P≥MC?'].map(h => (
                <th key={h} className="border border-orange-200 px-1.5 py-1 font-bold text-orange-800">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map(r => {
              const tr_r = price * r.Q
              const pft = tr_r - r.TC
              const isOpt = r.Q === optQ?.Q
              return (
                <tr key={r.Q} className={isOpt ? 'bg-green-100 font-bold' : ''}>
                  <td className="border border-orange-200 px-1.5 py-1">{r.Q}</td>
                  <td className="border border-orange-200 px-1.5 py-1">{r.TC}</td>
                  <td className="border border-orange-200 px-1.5 py-1">{r.VC}</td>
                  <td className="border border-orange-200 px-1.5 py-1">{r.FC}</td>
                  <td className="border border-orange-200 px-1.5 py-1 font-semibold">{r.MC}</td>
                  <td className="border border-orange-200 px-1.5 py-1">{r.AC}</td>
                  <td className="border border-orange-200 px-1.5 py-1">{r.AVC}</td>
                  <td className="border border-orange-200 px-1.5 py-1">{tr_r}</td>
                  <td className="border border-orange-200 px-1.5 py-1" style={{ color: pft >= 0 ? '#16a34a' : '#dc2626' }}>{pft}</td>
                  <td className="border border-orange-200 px-1.5 py-1">{r.MC <= price ? '✅' : '❌'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className={`rounded-xl border px-4 py-3 font-bold text-sm ${decisionColor}`}>
        📊 החלטה: {decision}
      </div>
    </div>
  )
}

/* ── SIM 2: Cost curves ───────────────────── */
function CostCurvesSim() {
  const [fc, setFc] = useState(100)
  const data = Array.from({ length: 8 }, (_, i) => {
    const Q = i
    const VC = Q === 0 ? 0 : 60 * Q - 5 * Q * Q + 2 * Q * Q * Q
    const TC = fc + VC
    const MC = Q === 0 ? 0 : 60 - 10 * Q + 6 * Q * Q
    const AC = Q > 0 ? TC / Q : null
    const AVC = Q > 0 ? VC / Q : null
    return { Q, TC, VC, MC: +MC.toFixed(1), AC: AC !== null ? +AC.toFixed(1) : null, AVC: AVC !== null ? +AVC.toFixed(1) : null }
  })

  return (
    <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-5" dir="rtl">
      <h4 className="font-bold text-blue-800">🔬 סימולציה 2 — עקומות עלות</h4>
      <div className="bg-white rounded-xl p-3 border border-blue-200">
        <p className="text-xs font-semibold text-blue-700 mb-1">עלות קבועה FC: {fc}₪</p>
        <div dir="ltr"><input type="range" min={0} max={300} step={10} value={fc} onChange={e => setFc(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} /></div>
        <p className="text-xs text-blue-600 mt-1">שים לב: FC משפיעה על AC אבל לא על MC ו-AVC!</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data.slice(1)} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Q" label={{ value: 'כמות Q', position: 'insideBottom', offset: -5, fontSize: 11 }} />
          <YAxis label={{ value: 'עלות (₪)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip />
          <Line dataKey="MC" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="MC" />
          <Line dataKey="AC" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="AC" />
          <Line dataKey="AVC" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3 }} name="AVC" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-blue-700 text-center">עקומת היצע = MC מעל AVC</p>
    </div>
  )
}

/* ── SIM 3: Supply building ──────────────── */
function SupplySim() {
  const [n, setN] = useState(5)
  const singleSupply = [{ Q: 0, P: 20 }, { Q: 5, P: 30 }, { Q: 10, P: 40 }, { Q: 15, P: 50 }]
  const marketSupply = singleSupply.map(pt => ({ Q: pt.Q * n, P: pt.P }))

  return (
    <div className="space-y-4 rounded-2xl border border-purple-200 bg-purple-50 p-5" dir="rtl">
      <h4 className="font-bold text-purple-800">🔬 סימולציה 3 — היצע מצרפי</h4>
      <div className="bg-white rounded-xl p-3 border border-purple-200">
        <p className="text-xs font-semibold text-purple-700 mb-1">מספר יצרנים זהים: {n}</p>
        <div dir="ltr"><input type="range" min={1} max={20} value={n} onChange={e => setN(+e.target.value)} style={{ width: '100%', accentColor: '#a855f7' }} /></div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="Q" domain={[0, 200]} label={{ value: 'כמות Q', position: 'insideBottom', offset: -5, fontSize: 11 }} />
          <YAxis label={{ value: 'מחיר P', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip />
          <Line data={singleSupply} dataKey="P" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" name="יצרן 1" dot={false} />
          <Line data={marketSupply} dataKey="P" stroke="#a855f7" strokeWidth={2.5} name={`${n} יצרנים`} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-purple-700 text-center">
        {n} יצרנים זהים: בכל מחיר, כמות שוק = כמות יצרן × {n}
      </p>
    </div>
  )
}

/* ── MCQ ──────────────────────────────────── */
const MCQ: McqQuestion[] = [
  {
    id: 'cost-q1', question: 'TC=200₪, FC=100₪, Q=10. מה AVC?',
    options: ['20₪', '10₪', '100₪', '15₪'],
    correct: 1,
    explanation: 'VC = TC-FC = 200-100 = 100₪. AVC = VC/Q = 100/10 = 10₪.',
  },
  {
    id: 'cost-q2', question: 'P=50₪, AVC=40₪, AC=70₪. מה החלטת הייצור?',
    options: ['ייצר בטווח ארוך', 'ייצר בטווח קצר בלבד', 'לא ייצר', 'לא ניתן לדעת'],
    correct: 1,
    explanation: 'P(50)>AVC(40) → ייצר (מכסה VC). P(50)<AC(70) → הפסד → לא ייצר בטווח ארוך. טווח קצר: כן (הפסד קטן מ-FC).',
  },
  {
    id: 'cost-q3', question: 'עקומת ההיצע של יצרן תחרותי היא:',
    options: ['כל עקומת MC', 'עקומת MC מעל AVC', 'עקומת AC', 'עקומת AVC'],
    correct: 1,
    explanation: 'יצרן ייצר רק אם P≥AVC. לכן ההיצע = MC מעל נקודת מינימום AVC (נקודת Shut-down).',
  },
  {
    id: 'cost-q4', question: 'MC של יחידה ה-5: TC(4)=270₪, TC(5)=320₪. מה MC?',
    options: ['64₪', '50₪', '320₪', '54₪'],
    correct: 1,
    explanation: 'MC = ΔTC = TC(5)-TC(4) = 320-270 = 50₪.',
  },
  {
    id: 'cost-q5', question: 'P=45₪, AC_min=60₪, AVC_min=35₪. בטווח הארוך:',
    options: ['ייצר כי P>AVC', 'לא ייצר כי P<AC', 'יהיה רווח נורמלי', 'ייצר כי רווחי'],
    correct: 1,
    explanation: 'בטווח ארוך: ייצר רק אם P≥AC. P(45)<AC(60) → הפסד כלכלי → לא ייצר בטווח ארוך (ייצא מענף).',
  },
]

/* ── EXERCISES ─────────────────────────────── */
const EASY: Exercise[] = [
  { id: 'c3-e1', question: 'TC=500₪, VC=350₪. מה FC?', answer: 'FC = TC - VC = 500 - 350 = 150₪' },
  { id: 'c3-e2', question: 'TC(4)=400₪, TC(5)=460₪. מה MC של יחידה ה-5?', answer: 'MC = 460 - 400 = 60₪' },
  { id: 'c3-e3', question: 'Q=10, TC=600₪. מה AC?', answer: 'AC = TC/Q = 600/10 = 60₪' },
  { id: 'c3-e4', question: 'Q=10, VC=400₪. מה AVC?', answer: 'AVC = VC/Q = 400/10 = 40₪' },
  { id: 'c3-e5', question: 'P=80₪, Q*=5, TC=300₪. מה הרווח?', answer: 'TR = P×Q = 80×5 = 400₪\nרווח = TR-TC = 400-300 = 100₪' },
]

const MEDIUM: Exercise[] = [
  { id: 'c3-m1', question: 'FC=200₪. P=40₪. טבלת עלויות: Q=0→TC=200, Q=1→TC=260, Q=2→TC=310, Q=3→TC=370, Q=4→TC=450. כמה לייצר?', hint: 'חשב MC, השווה ל-P', answer: 'Q=1: MC=60 > P=40 ❌ (כבר Q=1 לא כדאי)\n\nרגע! נבדוק AVC: VC(1)=60, AVC=60>P=40\nגם לא ייצר בטווח קצר.\n\nהחלטה: לא לייצר, הפסד = FC = 200₪.' },
  { id: 'c3-m2', question: 'P=70₪. אותה טבלה. כמה לייצר? מה הרווח?', answer: 'Q=1: MC=60≤70 ✅ | Q=2: MC=50≤70 ✅ | Q=3: MC=60≤70 ✅ | Q=4: MC=80>70 ❌\nQ*=3\nTR=70×3=210₪, TC=370₪\nרווח=210-370=-160₪ (הפסד)\n\nאבל: AVC(3)=VC(3)/3=170/3=56.7<70 → ייצר בטווח קצר (הפסד 160 < FC 200).' },
  { id: 'c3-m3', question: 'P=90₪. אותה טבלה. מה הרווח?', answer: 'Q=4: MC=80≤90 ✅ → Q*=4\nTR=90×4=360₪, TC=450₪\nרווח=360-450=-90₪\n\nAVC(4)=250/4=62.5<90 → ייצר בטווח קצר.\nהפסד=-90 < FC=200 → אפילו בהפסד כדאי לייצר.' },
  { id: 'c3-m4', question: 'בשוק תחרותי עם 10 יצרנים זהים (היצע כל יצרן: P=20+2Q). מה ההיצע המצרפי?', answer: 'היצע יצרן: P=20+2Q → Q=(P-20)/2\nהיצע שוק: Q_s=10×(P-20)/2=5(P-20)=5P-100\nאו: P=20+Q_s/5' },
  { id: 'c3-m5', question: 'הסבר: מדוע P=AVC היא "נקודת הסגירה" (Shut-down point)?', answer: 'P=AVC = נקודת שבה הפדיון בדיוק מכסה VC.\nאם P<AVC → פדיון לא מכסה גם VC → הפסד גדול מ-FC → עדיף לסגור ולהפסיד רק FC.\nאם P≥AVC → ייצר כי מפחית הפסד (מכסה לפחות VC ועוד חלק מ-FC).' },
]

const HARD: Exercise[] = [
  { id: 'c3-h1', question: 'TC = 2Q² - 12Q + 100. מצא: MC, AC, AVC, FC, VC.', hint: 'TC(0)=FC', answer: 'FC = TC(0) = 100₪\nVC = TC-FC = 2Q²-12Q\nMC = dTC/dQ = 4Q-12\nAC = TC/Q = 2Q-12+100/Q\nAVC = VC/Q = 2Q-12' },
  { id: 'c3-h2', question: 'אותה TC. מה נקודת מינימום AVC? מה Shut-down price?', hint: 'גזור AVC והשווה ל-0', answer: 'AVC = 2Q-12. מינימום AVC כאשר dAVC/dQ=0: 2=0? אין מינימום פנימי...\nחכה: TC=2Q²-12Q+100 → VC=2Q²-12Q\nAVC=2Q-12. כשQ=6: AVC=0. זה המינימום (לנוסחה ריבועית: מינימום כשQ=-b/2a=12/4=3)\nבQ=3: AVC=6-12=-6? לא הגיוני.\n\nנסה TC=Q²+20Q+100:\nFC=100, VC=Q²+20Q, AVC=Q+20, MC=2Q+20.\nAVC_min=20 (בQ=0). Shut-down price=20₪.' },
  { id: 'c3-h3', question: 'S: P=20+2Q (יצרן בודד). מחיר שוק P=50₪. כמה ייצר? מה רווח אם FC=100₪?', answer: 'P=MC: 50=20+2Q → 2Q=30 → Q*=15\nTR=50×15=750₪\nTC=FC+VC=100+∫₀¹⁵(20+2Q)dQ=100+[20Q+Q²]₀¹⁵=100+300+225=625₪\nרווח=750-625=125₪' },
  { id: 'c3-h4', question: '5 יצרנים בתל אביב (S_TA: P=10+3Q) ו-8 בגליל (S_G: P=8+2Q). מה ההיצע המצרפי?', hint: 'הפוך לQ=f(P) לכל יצרן, כפול מספר יצרנים, חבר', answer: 'TA: P=10+3Q → Q=(P-10)/3. 5 יצרנים: Q_TA=5(P-10)/3 (בP>10)\nגליל: P=8+2Q → Q=(P-8)/2. 8 יצרנים: Q_G=8(P-8)/2=4(P-8) (בP>8)\n\nQ_total=Q_TA+Q_G=5(P-10)/3+4(P-8) (בP>10)' },
  { id: 'c3-h5', question: 'בחר מכונה: מכונה A: FC=5,000₪, MC=20₪. מכונה B: FC=1,000₪, MC=40₪. מאיזו כמות עדיפה A?', answer: 'TC_A = 5,000+20Q\nTC_B = 1,000+40Q\n\nA עדיפה כש: TC_A < TC_B\n5,000+20Q < 1,000+40Q\n4,000 < 20Q\nQ > 200\n\nאם מייצרים יותר מ-200 יחידות → עדיפה מכונה A.\nאם פחות מ-200 → עדיפה מכונה B.' },
]

export function Chapter3Costs() {
  return (
    <ChapterLayout number={3} title="עלויות והיצע היצרן"
      subtitle="TC, MC, AC, AVC — החלטת ייצור בטווח קצר וארוך" color="#f97316" examWeight="2-3 שאלות במבחן">

      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">3.1 מבנה העלויות</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ['FC', 'עלות קבועה', 'לא תלויה בכמות (שכירות, ציוד)', '#64748b'],
              ['VC', 'עלות משתנה', 'גדלה עם הכמות (חו"ג, עבודה)', '#f97316'],
              ['TC', 'עלות כוללת', 'TC = FC + VC', '#3b82f6'],
              ['MC', 'עלות שולית', 'MC = ΔTC/ΔQ', '#ef4444'],
              ['AC', 'עלות ממוצעת', 'AC = TC/Q', '#6366f1'],
              ['AVC', 'עלות משתנה ממוצעת', 'AVC = VC/Q', '#22c55e'],
            ].map(([sym, name, desc, color]) => (
              <div key={sym} className="rounded-xl bg-muted/30 border border-border p-3">
                <p className="font-extrabold text-lg" style={{ color: color as string }}>{sym}</p>
                <p className="font-semibold text-xs">{name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">3.2 כלל מקסום רווח — MC = P</h3>
          <p className="text-sm text-muted-foreground">
            בתחרות משוכללת, המחיר = פדיון שולי (MR=P). מקסום רווח: ייצר עד ש:
          </p>
          <div className="rounded-xl border border-border p-4 text-center">
            <MathText math="MC = P \quad\Rightarrow\quad \text{מצא Q* שבו MC הכי קרוב מתחת ל-P}" display />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">3.3 החלטת ייצור — 3 מקרים קלאסיים</h3>
          <div className="space-y-3">
            {[
              ['✅ P ≥ AC (מינימום)', 'bg-green-50 border-green-300', 'ייצר — רווח כלכלי חיובי (טווח ארוך וקצר)'],
              ['⚠️ AVC ≤ P < AC', 'bg-yellow-50 border-yellow-300', 'ייצר בטווח קצר בלבד — הפסד אבל פחות מ-FC. בטווח ארוך — ייצא מענף.'],
              ['❌ P < AVC (מינימום)', 'bg-red-50 border-red-300', 'לא ייצר! גם בטווח קצר. הפסד גדול מ-FC. עדיף לסגור.'],
            ].map(([cond, cls, desc]) => (
              <div key={cond} className={`rounded-xl border p-3 ${cls}`}>
                <p className="font-bold text-sm">{cond}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3">
            <p className="text-xs font-semibold text-indigo-700">💡 Shut-down point = מינימום AVC</p>
            <p className="text-xs text-indigo-600 mt-1">מתחת לו — תמיד עדיף לסגור ולהפסיד FC בלבד.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-bold text-lg">3.4 פונקציית ההיצע של היצרן</h3>
          <p className="text-sm text-muted-foreground">
            עקומת ההיצע = <strong>MC מעל מינימום AVC</strong>.
            כשמחיר עולה, היצרן מוכן לייצר יותר.
          </p>
          <div className="rounded-xl border border-border p-4 text-center">
            <MathText math="S_{\text{שוק}} = n \times S_{\text{יצרן}}" display />
          </div>
          <p className="text-xs text-muted-foreground text-center">כשיש n יצרנים זהים — כפל כמות יחיד ב-n</p>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות אינטראקטיביות</h2>
        <CostSim />
        <CostCurvesSim />
        <SupplySim />
      </section>

      <section><McqSection questions={MCQ} topicId="costs" /></section>
      <section><ExerciseSection easy={EASY} medium={MEDIUM} hard={HARD} topicId="costs" /></section>
    </ChapterLayout>
  )
}
