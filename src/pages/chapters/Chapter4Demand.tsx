import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'

function buildDemand(a: number, b: number, steps = 20) {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const P = (a / b) * (i / steps)
    const Q = Math.max(0, a - b * P)
    return { Q: +Q.toFixed(1), P: +P.toFixed(1) }
  }).filter(pt => pt.Q >= 0)
}

/* SIM 1: demand curve */
function DemandCurveSim() {
  const [a, setA] = useState(800)
  const [b, setB] = useState(4)
  const [P, setP] = useState(100)
  const Q = Math.max(0, a - b * P)
  const data = buildDemand(a, b)
  const maxP = a / b

  return (
    <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-5" dir="rtl">
      <h4 className="font-bold text-blue-800">🔬 סימולציה 1 — עקומת ביקוש</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          ['פרמטר a (מקסימום Q)', a, setA, 100, 2000, 50],
          ['פרמטר b (שיפוע)', b, setB, 1, 20, 0.5],
          ['מחיר P', P, setP, 0, Math.round(maxP), 5],
        ].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 mb-1">{label as string}: <strong>{val as number}</strong></p>
            <div dir="ltr">
              <input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
                onChange={e => (setter as (v: number) => void)(+e.target.value)}
                style={{ width: '100%', accentColor: '#3b82f6' }} />
            </div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Q" type="number" domain={[0, a * 1.05]}
            label={{ value: 'כמות Q', position: 'insideBottom', offset: -8, fontSize: 11 }} />
          <YAxis dataKey="P" type="number" domain={[0, maxP * 1.1]}
            label={{ value: 'מחיר P', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip formatter={(v: number) => v.toFixed(1)} />
          <Line data={data} dataKey="P" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="ביקוש" />
          <ReferenceLine x={Q} stroke="#22c55e" strokeDasharray="4 2" label={{ value: `Q=${Q.toFixed(0)}`, position: 'top', fontSize: 11 }} />
          <ReferenceLine y={P} stroke="#22c55e" strokeDasharray="4 2" label={{ value: `P=${P}`, position: 'right', fontSize: 11 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-blue-100 p-2"><p className="font-bold text-blue-700">{Q.toFixed(0)}</p><p className="text-xs">כמות מבוקשת</p></div>
        <div className="rounded-xl bg-blue-100 p-2"><p className="font-bold text-blue-700">{(P * Q).toFixed(0)}₪</p><p className="text-xs">הוצאות צרכנים</p></div>
        <div className="rounded-xl bg-blue-100 p-2"><p className="font-bold text-blue-700">{maxP.toFixed(0)}₪</p><p className="text-xs">מחיר מקסימלי</p></div>
      </div>
    </div>
  )
}

/* SIM 2: demand shifters */
function ShiftersSim() {
  const [income, setIncome] = useState(0)
  const [subPrice, setSubPrice] = useState(0)
  const [compPrice, setCompPrice] = useState(0)
  const [isNormal, setIsNormal] = useState(true)

  const shift = (isNormal ? income : -income) + subPrice - compPrice
  const a0 = 600
  const aNew = a0 + shift * 3

  const data0 = buildDemand(a0, 4)
  const dataNew = buildDemand(aNew, 4)

  return (
    <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5" dir="rtl">
      <h4 className="font-bold text-indigo-800">🔬 סימולציה 2 — גורמים מסיטים</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-white rounded-xl p-3 border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-700 mb-1">הכנסה: {income > 0 ? `+${income}` : income}</p>
          <div dir="ltr"><input type="range" min={-30} max={30} value={income} onChange={e => setIncome(+e.target.value)} style={{ width: '100%', accentColor: '#6366f1' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-700 mb-1">מחיר תחליף: {subPrice > 0 ? `+${subPrice}` : subPrice}</p>
          <div dir="ltr"><input type="range" min={-30} max={30} value={subPrice} onChange={e => setSubPrice(+e.target.value)} style={{ width: '100%', accentColor: '#6366f1' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-700 mb-1">מחיר משלים: {compPrice > 0 ? `+${compPrice}` : compPrice}</p>
          <div dir="ltr"><input type="range" min={-30} max={30} value={compPrice} onChange={e => setCompPrice(+e.target.value)} style={{ width: '100%', accentColor: '#6366f1' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-700 mb-1">סוג מוצר</p>
          <div className="flex flex-col gap-1">
            <button onClick={() => setIsNormal(true)} className={`rounded px-2 py-0.5 text-xs font-semibold border ${isNormal ? 'bg-indigo-600 text-white' : 'border-indigo-200 text-indigo-700'}`}>נורמלי</button>
            <button onClick={() => setIsNormal(false)} className={`rounded px-2 py-0.5 text-xs font-semibold border ${!isNormal ? 'bg-indigo-600 text-white' : 'border-indigo-200 text-indigo-700'}`}>נחות</button>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="Q" domain={[0, 900]} label={{ value: 'כמות Q', position: 'insideBottom', offset: -8, fontSize: 11 }} />
          <YAxis type="number" dataKey="P" domain={[0, 200]} label={{ value: 'מחיר P', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip />
          <Line data={data0} dataKey="P" stroke="#93c5fd" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="D מקורית" />
          <Line data={dataNew} dataKey="P" stroke="#2563eb" strokeWidth={2.5} dot={false} name="D חדשה" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-center text-xs font-semibold text-indigo-700">
        {shift > 0 ? '→ הביקוש זזה ימינה (עולה)' : shift < 0 ? '← הביקוש זזה שמאלה (יורד)' : 'ביקוש לא השתנה'}
      </p>
    </div>
  )
}

/* SIM 3: two consumer groups */
function TwoGroupSim() {
  const [a1, setA1] = useState(800)
  const [b1, setB1] = useState(4)
  const [a2, setA2] = useState(600)
  const [b2, setB2] = useState(1)
  const [P, setP] = useState(80)

  const Q1 = Math.max(0, a1 - b1 * P)
  const Q2 = Math.max(0, a2 - b2 * P)
  const Qt = Q1 + Q2

  const maxP = Math.min(a1 / b1, a2 / b2)
  const d1 = buildDemand(a1, b1)
  const d2 = buildDemand(a2, b2)
  const dt = buildDemand(a1 + a2, b1 + b2)

  return (
    <div className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-5" dir="rtl">
      <h4 className="font-bold text-green-800">🔬 סימולציה 3 — שתי קבוצות צרכנים</h4>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
        ⚠️ <strong>חשוב מאוד:</strong> חיבור ביקושים לפי Q (לא לפי P)! Q_total = Q₁ + Q₂
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['a₁', a1, setA1, 100, 1500, 50], ['b₁', b1, setB1, 0.5, 10, 0.5],
          ['a₂', a2, setA2, 100, 1500, 50], ['b₂', b2, setB2, 0.5, 10, 0.5]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border border-green-200">
            <p className="text-xs font-semibold text-green-700 mb-1">{label as string}: {val as number}</p>
            <div dir="ltr">
              <input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
                onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#22c55e' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-3 border border-green-200">
        <p className="text-xs font-semibold text-green-700 mb-1">מחיר P: {P}₪</p>
        <div dir="ltr"><input type="range" min={0} max={Math.round(maxP)} value={P} onChange={e => setP(+e.target.value)} style={{ width: '100%', accentColor: '#22c55e' }} /></div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="Q" domain={[0, (a1 + a2) * 1.05]} label={{ value: 'כמות Q', position: 'insideBottom', offset: -8, fontSize: 11 }} />
          <YAxis type="number" dataKey="P" domain={[0, Math.max(a1 / b1, a2 / b2) * 1.1]} label={{ value: 'מחיר P', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip formatter={(v: number) => v.toFixed(1)} />
          <Line data={d1} dataKey="P" stroke="#93c5fd" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="D₁" />
          <Line data={d2} dataKey="P" stroke="#6ee7b7" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="D₂" />
          <Line data={dt} dataKey="P" stroke="#2563eb" strokeWidth={2.5} dot={false} name="D_כולל" />
          <ReferenceLine y={P} stroke="#f97316" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-green-100 p-2"><p className="font-bold text-green-700">{Q1.toFixed(0)}</p><p className="text-xs">Q₁ (קבוצה א)</p></div>
        <div className="rounded-xl bg-green-100 p-2"><p className="font-bold text-green-700">{Q2.toFixed(0)}</p><p className="text-xs">Q₂ (קבוצה ב)</p></div>
        <div className="rounded-xl bg-blue-100 p-2"><p className="font-bold text-blue-700">{Qt.toFixed(0)}</p><p className="text-xs">Q_כולל</p></div>
      </div>
    </div>
  )
}

const MCQ: McqQuestion[] = [
  { id: 'd-q1', question: 'ביקוש: Q=600-2P. בP=100, מה Q?', options: ['400', '600', '200', '800'], correct: 0, explanation: 'Q=600-2×100=600-200=400.' },
  { id: 'd-q2', question: 'מה גורם להסטת עקומת הביקוש (לא תזוזה לאורך)?', options: ['שינוי במחיר העצמי', 'עלייה בהכנסה', 'שינוי בכמות המסופקת', 'שינוי בעלות ייצור'], correct: 1, explanation: 'שינוי במחיר העצמי → תזוזה לאורך העקומה. כל גורם אחר (הכנסה, מחיר תחליפים/משלימים, טעמים) → הסטת העקומה.' },
  { id: 'd-q3', question: 'מחיר קפה עולה. כיצד זה משפיע על ביקוש לתה (תחליף)?', options: ['ביקוש לתה יורד', 'ביקוש לתה עולה', 'אין השפעה', 'מחיר תה עולה'], correct: 1, explanation: 'קפה ותה = תחליפים. ↑ מחיר קפה → צרכנים עוברים לתה → ↑ ביקוש לתה → עקומת הביקוש לתה זזה ימינה.' },
  { id: 'd-q4', question: 'D₁=800-4P, D₂=600-P. בP=100, מה Q_total?', options: ['400', '900', '1,000', '500'], correct: 1, explanation: 'Q₁=800-4×100=400. Q₂=600-100=500. Q_total=400+500=900.' },
  { id: 'd-q5', question: 'הכנסת הצרכן עולה. מוצר "נחות" — מה קורה לביקוש?', options: ['עולה', 'יורד', 'לא משתנה', 'תחילה עולה אחר כך יורד'], correct: 1, explanation: 'מוצר נחות: ↑ הכנסה → צרכנים עוברים למוצרים טובים יותר → ↓ ביקוש למוצר הנחות. דוגמה: נסיעות באוטובוס (כשעשירים עוברים לרכב).' },
]

const EASY: Exercise[] = [
  { id: 'd-e1', question: 'D: Q=500-3P. בP=50, מה Q?', answer: 'Q=500-3×50=500-150=350' },
  { id: 'd-e2', question: 'D: Q=500-3P. באיזה מחיר Q=200?', answer: '200=500-3P → 3P=300 → P=100₪' },
  { id: 'd-e3', question: 'D: Q=500-3P. מה הוצאות הצרכנים בP=80?', answer: 'Q=500-240=260. הוצאות=P×Q=80×260=20,800₪' },
  { id: 'd-e4', question: 'מחיר עוף עולה. עוף ודגים הם תחליפים. מה קורה לביקוש לדגים?', answer: '↑ מחיר עוף → צרכנים עוברים לדגים → ↑ ביקוש לדגים (עקומה זזה ימינה).' },
  { id: 'd-e5', question: 'D₁=300-2P, D₂=200-P. בP=50, מה Q_total?', answer: 'Q₁=300-100=200. Q₂=200-50=150. Q_total=350.' },
]

const MEDIUM: Exercise[] = [
  { id: 'd-m1', question: 'D₁=800-4P (1,000 משפחות), D₂=600-P (500 מסעדות). מה הביקוש המצרפי בשוק?', hint: 'כפל כל D בכמות הצרכנים', answer: 'ביקוש 1,000 משפחות: Q_a=1,000×(800-4P)=800,000-4,000P\nביקוש 500 מסעדות: Q_b=500×(600-P)=300,000-500P\nQ_total=1,100,000-4,500P' },
  { id: 'd-m2', question: 'D: Q=600-2P. S: Q=3P-300. מצא P* ו-Q*.', hint: 'D=S → שווה', answer: '600-2P=3P-300\n900=5P → P*=180₪\nQ*=600-2×180=240 יחידות' },
  { id: 'd-m3', question: 'D₁=800-4P, D₂=600-P. חשב Q₁ ו-Q₂ בP*=140. מה הוצאות כל קבוצה?', answer: 'Q₁=800-4×140=240\nQ₂=600-140=460\nהוצאות קבוצה 1: 140×240=33,600₪\nהוצאות קבוצה 2: 140×460=64,400₪' },
  { id: 'd-m4', question: 'מוצר נורמלי. הכנסת הצרכן עולה ב-20%. מה קורה: (א) לכמות המבוקשת? (ב) לעקומת הביקוש?', answer: '(א) כמות מבוקשת עולה — צרכן קונה יותר.\n(ב) עקומת הביקוש זזה ימינה (הסטה) — בכל מחיר נתון, רוצים לקנות יותר.' },
  { id: 'd-m5', question: 'מחיר חלב עולה ב-10₪. חלב וקפה הם משלימים. תאר את השפעת השרשרת.', answer: '↑ מחיר חלב → ↓ כמות חלב מבוקשת (תזוזה לאורך עקומת חלב)\n→ פחות קפה עם חלב → ↓ ביקוש לקפה (הסטה שמאלה)\n→ ↓ P_קפה, ↓ Q_קפה' },
]

const HARD: Exercise[] = [
  { id: 'd-h1', question: 'D₁=1,000-5P (500 צרכנים), D₂=800-2P (800 צרכנים). S: P=20+0.1Q. מצא P* ו-Q*.', answer: 'Q_total=500(1,000-5P)+800(800-2P)=500,000-2,500P+640,000-1,600P=1,140,000-4,100P\nS: P=20+0.1Q → Q=10P-200\n\nD=S: 1,140,000-4,100P=10P-200\n1,140,200=4,110P → P*≈277.4₪\nQ*=10×277.4-200=2,574' },
  { id: 'd-h2', question: 'D: Q=1,000-4P. S: Q=2P-200. מס 30₪ על יצרן. מצא P_c, Q_new.', hint: 'S חדש: Q=2(P-30)-200=2P-260', answer: 'S_new: Q=2P-260 (S זזה שמאלה ב-t=30)\nD=S_new: 1,000-4P=2P-260\n1,260=6P → P_c=210₪\nQ_new=1,000-4×210=160\nP_p=P_c-30=180₪' },
  { id: 'd-h3', question: 'מוצר X (נורמלי) ומוצר Y (תחליף ל-X). מחיר Y עולה ב-20₪. הכנסה יורדת ב-5%. הסבר מה קורה לשיווי משקל X.', answer: '↑ מחיר Y → ↑ ביקוש ל-X (תחליפים) → D_X זזה ימינה\n↓ הכנסה + מוצר נורמלי → ↓ ביקוש ל-X → D_X זזה שמאלה\n\nהאפקטים מנוגדים — תוצאה תלויה בגודל יחסי. לא ניתן לדעת בוודאות את כיוון P* ו-Q*.' },
  { id: 'd-h4', question: 'D: Q=600-2P. מהו עודף הצרכן כשP*=100₪?', hint: 'שטח משולש: ½×בסיס×גובה', answer: 'Q*=600-200=400\nמחיר מקסימלי (Q=0): P_max=300₪\nעודף צרכן = ½×(P_max-P*)×Q*=½×(300-100)×400=½×200×400=40,000₪' },
  { id: 'd-h5', question: 'שתי קבוצות: D₁=400-P (200 צרכנים), D₂=300-2P (150 צרכנים). מה מחיר שמעליו קבוצה 2 לא קונה כלל? ומתחתיו שתי הקבוצות קונות?', answer: 'קבוצה 2 מפסיקה לקנות כש-Q₂=0:\n300-2P=0 → P=150₪\n\nמעל P=150₪: רק קבוצה 1 קונה (D=200×(400-P))\nמתחת P=150₪: שתי הקבוצות קונות (D=200(400-P)+150(300-2P))' },
]

export function Chapter4Demand() {
  return (
    <ChapterLayout number={4} title="הביקוש" subtitle="פונקציית ביקוש, גורמים מסיטים, חוק הביקוש" color="#3b82f6" examWeight="1-2 שאלות במבחן">
      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">4.1 חוק הביקוש</h3>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <p className="font-bold text-blue-800 mb-1">📌 חוק הביקוש:</p>
            <p className="text-blue-700 text-sm">ככל שמחיר מוצר <strong>עולה</strong> — הכמות המבוקשת <strong>יורדת</strong>. קשר <em>הפוך</em> בין מחיר לכמות.</p>
          </div>
          <div className="rounded-xl border border-border p-4 text-center">
            <MathText math="Q = a - b \cdot P \quad\quad \text{(פונקציה לינארית)}" display />
          </div>
          <p className="text-sm text-muted-foreground">כש-P עולה → Q יורד. כש-P=0 → Q=a (כמות מקסימלית). כש-Q=0 → P=a/b (מחיר מקסימלי).</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">4.2 ביקוש אישי מול ביקוש שוק</h3>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="font-bold text-amber-800 mb-2">⚠️ כלל זהב: חיבור ביקושים לפי Q (לא לפי P!)</p>
            <div className="text-center">
              <MathText math="Q_{total} = Q_1 + Q_2 = (a_1-b_1 P) + (a_2-b_2 P) = (a_1+a_2) - (b_1+b_2)P" display />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">אם יש n צרכנים זהים: Q_שוק = n × Q_יחיד</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">4.3 גורמים המסיטים את עקומת הביקוש</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ['↑ הכנסה (מוצר נורמלי)', '→ ביקוש עולה (ימינה)', 'bg-green-50 border-green-200'],
              ['↑ הכנסה (מוצר נחות)', '→ ביקוש יורד (שמאלה)', 'bg-red-50 border-red-200'],
              ['↑ מחיר תחליף', '→ ביקוש עולה (ימינה)', 'bg-green-50 border-green-200'],
              ['↑ מחיר משלים', '→ ביקוש יורד (שמאלה)', 'bg-red-50 border-red-200'],
            ].map(([cause, effect, cls]) => (
              <div key={cause} className={`rounded-xl border p-3 ${cls}`}>
                <p className="font-semibold text-sm">{cause}</p>
                <p className="text-xs text-muted-foreground">{effect}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-bold text-lg">4.4 ההבדל הקריטי — תזוזה לאורך vs. הסטה</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <p className="font-bold text-blue-700 text-sm">תזוזה לאורך עקומה</p>
              <p className="text-xs text-muted-foreground mt-1">רק כשמחיר <strong>העצמי</strong> משתנה. העקומה לא זזה.</p>
            </div>
            <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3">
              <p className="font-bold text-indigo-700 text-sm">הסטת עקומה</p>
              <p className="text-xs text-muted-foreground mt-1">כשמשתנה הכנסה, תחליף, משלים, טעמים — העקומה עצמה זזה.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות אינטראקטיביות</h2>
        <DemandCurveSim />
        <ShiftersSim />
        <TwoGroupSim />
      </section>
      <section><McqSection questions={MCQ} topicId="demand" /></section>
      <section><ExerciseSection easy={EASY} medium={MEDIUM} hard={HARD} topicId="demand" /></section>
    </ChapterLayout>
  )
}
