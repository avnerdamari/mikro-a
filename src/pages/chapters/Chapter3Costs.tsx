import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ChapterLayout } from '@/components/ChapterLayout'
import { LinkedTerm } from '@/components/LinkedTerm'
import { FormulaLink } from '@/components/FormulaLink'
import { Example } from '@/components/Example'

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
                <p className="font-semibold text-xs">
                  {sym === 'FC' ? <LinkedTerm anchorKey="fc">{name}</LinkedTerm>
                    : sym === 'VC' ? <LinkedTerm anchorKey="vc">{name}</LinkedTerm>
                    : sym === 'MC' ? <LinkedTerm anchorKey="mc">{name}</LinkedTerm>
                    : name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                {sym === 'MC' && <div className="mt-1.5"><FormulaLink formulaKey="costs-mc" /></div>}
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

      {/* SOLVED EXAMPLE */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold">📝 דוגמה פתורה</h2>
        <Example
          title="3.5 האם כדאי לייצר? — מכרז לייצור עוגות"
          q={<>
            מאפייה עם עלות קבועה FC=100₪. עלות משתנה כוללת (VC) לפי כמות (Q, בעוגות ליום):
            Q=1→80, Q=2→150, Q=3→210, Q=4→280, Q=5→360, Q=6→460. מחיר שוק לעוגה — P=70₪.
            כמה עוגות לייצר, ומה הרווח?
          </>}
        >
          <p className="text-sm"><strong>שלב 1 — טבלת MC ו-AVC</strong> (<MathText math="MC=\Delta TC/\Delta Q,\; AVC=VC/Q" />):</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse" dir="ltr">
              <thead>
                <tr className="bg-white dark:bg-slate-800">
                  {['Q', 'TC', 'MC', 'AVC'].map(h => <th key={h} className="border border-border px-2 py-1 font-bold">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[
                  { Q: 1, TC: 180, MC: 80, AVC: '80.0' },
                  { Q: 2, TC: 250, MC: 70, AVC: '75.0' },
                  { Q: 3, TC: 310, MC: 60, AVC: '70.0' },
                  { Q: 4, TC: 380, MC: 70, AVC: '70.0' },
                  { Q: 5, TC: 460, MC: 80, AVC: '72.0' },
                  { Q: 6, TC: 560, MC: 100, AVC: '76.7' },
                ].map(r => (
                  <tr key={r.Q} className="bg-white dark:bg-slate-800">
                    <td className="border border-border px-2 py-1">{r.Q}</td>
                    <td className="border border-border px-2 py-1">{r.TC}</td>
                    <td className="border border-border px-2 py-1">{r.MC}</td>
                    <td className="border border-border px-2 py-1">{r.AVC}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <FormulaLink formulaKey="costs-mc" />
          <p className="text-sm">
            <strong>שלב 2 — כלל MC=P:</strong> מחפשים Q שבו MC הכי קרוב ל-P=70. זה קורה ב-Q=3 (MC=60→70) ושוב ב-Q=4 (MC=70).
            מינימום ה-AVC הוא בדיוק 70 (ב-Q=3 וב-Q=4 כאחד) — כלומר <strong>P=AVC המינימלי בדיוק</strong>, נקודת ה-Shut-down עצמה.
          </p>
          <p className="text-sm"><strong>שלב 3 — בדיקת הרווח בפועל</strong> (<MathText math="\pi = P\times Q - TC" />):</p>
          <div className="rounded-lg bg-white px-3 py-2 dark:bg-slate-800 dark:text-slate-100 text-center" dir="ltr">
            <MathText math="Q=3:\; \pi=70\!\times\!3-310=210-310=-100 \qquad Q=4:\; \pi=70\!\times\!4-380=280-380=-100" display />
          </div>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
            תשובה: כדאי לייצר (3 או 4 עוגות — שני הכמויות שקולות), עם הפסד של 100₪ — בדיוק שווה ל-FC.
            זה לא מקרי: כש-P=AVC המינימלי, ההפסד מייצור שווה בדיוק ל-FC, כאילו סגרנו את המפעל — זו בדיוק ההגדרה של נקודת ה-Shut-down: מתחתיה עדיף לסגור, מעליה עדיף לייצר.
          </p>
        </Example>
      </section>

      <section><McqSection questions={MCQ} topicId="costs" /></section>
    </ChapterLayout>
  )
}
