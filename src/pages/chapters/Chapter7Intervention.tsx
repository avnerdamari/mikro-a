import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ChapterLayout } from '@/components/ChapterLayout'

// D: P=250-4Q → Q=(250-P)/4
// S: P=100+Q → Q=P-100
function solve(t: number) {
  // S_new: P=100+Q+t → Q=P-100-t (supply shifts left by t)
  // D=S_new: (250-P)/4 = P-100-t
  // 250-P = 4P-400-4t → 650+4t = 5P
  const Pc = (650 + 4 * t) / 5
  const Qnew = (250 - Pc) / 4
  const Pp = Pc - t
  return { Pc: +Pc.toFixed(2), Qnew: +Qnew.toFixed(2), Pp: +Pp.toFixed(2) }
}

function TaxSim() {
  const [t, setT] = useState(0)
  const isSub = t < 0
  const { Pc, Qnew, Pp } = solve(t)
  const { Pc: P0, Qnew: Q0 } = solve(0)

  const demandData = Array.from({ length: 20 }, (_, i) => {
    const P = (i / 19) * 250
    const Q = Math.max(0, (250 - P) / 4)
    return { Q: +Q.toFixed(1), P: +P.toFixed(1) }
  })
  const supplyOrig = Array.from({ length: 20 }, (_, i) => {
    const Q = (i / 19) * 40
    const P = 100 + Q
    return { Q: +Q.toFixed(1), P: +P.toFixed(1) }
  })
  const supplyNew = Array.from({ length: 20 }, (_, i) => {
    const Q = (i / 19) * 40
    const P = 100 + Q + t
    return { Q: +Q.toFixed(1), P: +P.toFixed(1) }
  })

  const govRevenue = Math.abs(t) * Qnew
  const consumerBurden = (Pc - P0) * Qnew
  const producerBurden = (P0 - Pp) * Qnew

  return (
    <div className="space-y-4 rounded-2xl border border-orange-200 bg-orange-50 p-5" dir="rtl">
      <h4 className="font-bold text-orange-800">🔬 סימולציה 1 — מס וסובסידיה</h4>
      <p className="text-sm text-orange-700">D: P=250−4Q | S: P=100+Q</p>
      <div className="bg-white rounded-xl p-3 border border-orange-200">
        <p className="text-xs font-semibold text-orange-700 mb-1">
          {t === 0 ? 'ללא מס/סובסידיה' : t > 0 ? `מס יחידתי: ${t}₪` : `סובסידיה: ${-t}₪`}
        </p>
        <div dir="ltr"><input type="range" min={-60} max={80} value={t} onChange={e => setT(+e.target.value)} style={{ width: '100%', accentColor: '#f97316' }} /></div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>סובסידיה 60₪</span><span>ללא</span><span>מס 80₪</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={230}>
        <LineChart margin={{ top: 15, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="Q" domain={[0, 40]} label={{ value: 'כמות Q', position: 'insideBottom', offset: -8, fontSize: 11 }} />
          <YAxis label={{ value: 'מחיר P', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip formatter={(v) => (v as number).toFixed(1)} />
          <Line data={demandData} dataKey="P" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="ביקוש D" />
          <Line data={supplyOrig} dataKey="P" stroke="#fca5a5" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="S מקורית" />
          <Line data={supplyNew} dataKey="P" stroke="#ef4444" strokeWidth={2.5} dot={false} name="S חדשה" />
          {t !== 0 && <ReferenceLine y={Pc} stroke="#f97316" strokeDasharray="4 2" label={{ value: `P_c=${Pc}`, position: 'right', fontSize: 10, fill: '#f97316' }} />}
          {t !== 0 && <ReferenceLine y={Pp} stroke="#f97316" strokeDasharray="4 2" strokeOpacity={0.6} label={{ value: `P_p=${Pp}`, position: 'right', fontSize: 10, fill: '#9a3412' }} />}
          <ReferenceLine y={P0} stroke="#22c55e" strokeDasharray="3 3" label={{ value: `P*=${P0}`, position: 'left', fontSize: 10, fill: '#16a34a' }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
        {[
          ['P_c (לצרכן)', `${Pc}₪`, isSub ? 'text-green-700' : 'text-orange-700'],
          ['Q_new', Qnew.toFixed(1), 'text-foreground'],
          ['P_p (ליצרן)', `${Pp}₪`, isSub ? 'text-orange-700' : 'text-red-700'],
          [isSub ? 'עלות ממשלה' : 'הכנסות ממשלה', `${govRevenue.toFixed(0)}₪`, 'text-purple-700'],
        ].map(([label, val, cls]) => (
          <div key={label as string} className="rounded-xl bg-white border border-orange-200 p-2">
            <p className={`font-bold ${cls as string}`}>{val as string}</p>
            <p className="text-xs text-muted-foreground">{label as string}</p>
          </div>
        ))}
      </div>
      {t !== 0 && (
        <div className="rounded-xl bg-white border border-orange-200 p-3 text-sm">
          <p className="font-semibold text-orange-800 mb-2">גלגול {isSub ? 'סובסידיה' : 'מס'}:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-blue-50 p-2"><p className="font-bold text-blue-700">נטל צרכן: {Math.abs(consumerBurden).toFixed(0)}₪</p><p className="text-muted-foreground">{isSub ? 'הנחה' : `(P_c-P*)×Q`}</p></div>
            <div className="rounded-lg bg-red-50 p-2"><p className="font-bold text-red-700">נטל יצרן: {Math.abs(producerBurden).toFixed(0)}₪</p><p className="text-muted-foreground">{isSub ? 'תוספת' : `(P*-P_p)×Q`}</p></div>
          </div>
        </div>
      )}
    </div>
  )
}

function PriceSim() {
  const [floor, setFloor] = useState(150)
  const [ceiling, setCeiling] = useState(130)
  const [mode, setMode] = useState<'floor' | 'ceiling'>('floor')

  const { Pc: P0 } = solve(0)
  const Q0 = (250 - P0) / 4

  const P = mode === 'floor' ? floor : ceiling
  const Qd = Math.max(0, (250 - P) / 4)
  const Qs = Math.max(0, P - 100)
  const excess = Qd - Qs

  const isBinding = mode === 'floor' ? P > P0 : P < P0

  return (
    <div className="space-y-4 rounded-2xl border border-purple-200 bg-purple-50 p-5" dir="rtl">
      <h4 className="font-bold text-purple-800">🔬 סימולציה 2 — מחיר מינימום ומקסימום</h4>
      <div className="flex gap-2 mb-2">
        <button onClick={() => setMode('floor')} className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold border ${mode === 'floor' ? 'bg-purple-600 text-white' : 'border-purple-200 text-purple-700'}`}>מחיר מינימום</button>
        <button onClick={() => setMode('ceiling')} className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-semibold border ${mode === 'ceiling' ? 'bg-purple-600 text-white' : 'border-purple-200 text-purple-700'}`}>מחיר מקסימום</button>
      </div>
      <div className="bg-white rounded-xl p-3 border border-purple-200">
        <p className="text-xs font-semibold text-purple-700 mb-1">
          {mode === 'floor' ? `מחיר מינימום: ${floor}₪` : `מחיר מקסימום: ${ceiling}₪`} | P*={P0.toFixed(0)}₪
        </p>
        <div dir="ltr">
          {mode === 'floor'
            ? <input type="range" min={100} max={220} value={floor} onChange={e => setFloor(+e.target.value)} style={{ width: '100%', accentColor: '#a855f7' }} />
            : <input type="range" min={100} max={220} value={ceiling} onChange={e => setCeiling(+e.target.value)} style={{ width: '100%', accentColor: '#a855f7' }} />}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-blue-100 p-2"><p className="font-bold text-blue-700">{Qd.toFixed(1)}</p><p className="text-xs">Q_ביקוש</p></div>
        <div className="rounded-xl bg-red-100 p-2"><p className="font-bold text-red-700">{Qs.toFixed(1)}</p><p className="text-xs">Q_היצע</p></div>
        <div className={`rounded-xl p-2 ${excess > 0 ? 'bg-orange-100' : excess < 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
          <p className={`font-bold ${excess > 0 ? 'text-orange-700' : excess < 0 ? 'text-green-700' : 'text-gray-700'}`}>{Math.abs(excess).toFixed(1)}</p>
          <p className="text-xs">{excess > 0 ? 'עודף ביקוש' : excess < 0 ? 'עודף היצע' : 'שיווי משקל'}</p>
        </div>
      </div>
      <div className={`rounded-xl border p-3 text-sm ${isBinding ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
        {isBinding
          ? mode === 'floor'
            ? '⚠️ מחיר מינימום מעל P* — כובל! גורם לעודף היצע (אבטלה בשוק עבודה / עמילות חקלאית)'
            : '⚠️ מחיר מקסימום מתחת P* — כובל! גורם לעודף ביקוש (תורים, מחסור)'
          : '✅ מחיר לא כובל — שוק מגיע לשיווי משקל טבעי'}
      </div>
    </div>
  )
}

function CrossMarketSim() {
  const [tax, setTax] = useState(0)
  const [type, setType] = useState<'sub' | 'comp'>('sub')

  const effect = tax > 0 ? (type === 'sub' ? 'עולה' : 'יורד') : 'לא משתנה'
  const effectColor = tax > 0 ? (type === 'sub' ? 'text-green-700' : 'text-red-700') : 'text-muted-foreground'

  return (
    <div className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-5" dir="rtl">
      <h4 className="font-bold text-green-800">🔬 סימולציה 3 — השפעות צולבות בין שווקים</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-green-200">
          <p className="text-xs font-semibold text-green-700 mb-1">מס על מוצר Y: {tax}₪</p>
          <div dir="ltr"><input type="range" min={0} max={50} value={tax} onChange={e => setTax(+e.target.value)} style={{ width: '100%', accentColor: '#22c55e' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-green-200">
          <p className="text-xs font-semibold text-green-700 mb-1">קשר בין X ו-Y</p>
          <div className="flex flex-col gap-1">
            <button onClick={() => setType('sub')} className={`rounded px-2 py-0.5 text-xs font-semibold border ${type === 'sub' ? 'bg-green-600 text-white' : 'border-green-200 text-green-700'}`}>תחליפים (X↔Y)</button>
            <button onClick={() => setType('comp')} className={`rounded px-2 py-0.5 text-xs font-semibold border ${type === 'comp' ? 'bg-green-600 text-white' : 'border-green-200 text-green-700'}`}>משלימים (X+Y)</button>
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-white border border-green-200 p-4 space-y-2 text-sm">
        <p className="font-semibold text-green-700">שרשרת ההשפעה:</p>
        <div className="space-y-1 text-sm">
          <p>1. מס על Y → ↑ מחיר Y (P_Y) → ↓ כמות Y נמכרת</p>
          <p>2. {type === 'sub' ? '↑P_Y → צרכנים עוברים ל-X (תחליף) → ↑ ביקוש ל-X' : '↑P_Y → פחות Y → פחות צורך ב-X (משלים) → ↓ ביקוש ל-X'}</p>
          <p className={`font-bold ${effectColor}`}>3. ביקוש X {effect} → P*_X {effect}, Q*_X {effect}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[['דוגמה — תחליפים', 'שקיות ניילון ⟷ שקיות נייר\nמס על ניילון → ↑ ביקוש לנייר', 'bg-blue-50 border-blue-200'],
          ['דוגמה — משלימים', 'חלב ⟷ קפה\nמס על חלב → ↓ ביקוש לקפה', 'bg-orange-50 border-orange-200']].map(([title, desc, cls]) => (
          <div key={title as string} className={`rounded-xl border p-3 text-xs ${cls as string}`}>
            <p className="font-bold mb-1">{title as string}</p>
            <p className="whitespace-pre-line text-muted-foreground">{desc as string}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const MCQ: McqQuestion[] = [
  {
    id: 'int-q1', question: 'D: P=250-4Q. S: P=100+Q. מס t=30₪ על יצרן. מה P_c?',
    options: ['150₪', '156₪', '124₪', '180₪'],
    correct: 1,
    explanation: 'S_new: P=100+Q+30 → Q=P-130. D=S_new: (250-P)/4=P-130 → 250-P=4P-520 → 770=5P → P_c=154₪.\nלחישוב מדויק: (650+4×30)/5=(650+120)/5=770/5=154₪.',
  },
  {
    id: 'int-q2', question: 'P*=150₪, P_c=154₪, P_p=124₪. מה נטל המס על הצרכן (לכל יחידה)?',
    options: ['30₪', '4₪', '26₪', '154₪'],
    correct: 1,
    explanation: 'נטל לצרכן לכל יחידה = P_c-P* = 154-150 = 4₪. נטל ליצרן = P*-P_p = 150-124 = 26₪. סה"כ = 30₪ = המס.',
  },
  {
    id: 'int-q3', question: 'סובסידיה ב-20₪ ניתנת ליצרן. מה קורה ל-P_c ול-P_p?',
    options: ['P_c עולה, P_p יורד', 'P_c יורד, P_p עולה', 'שניהם יורדים', 'שניהם עולים'],
    correct: 1,
    explanation: 'סובסידיה: S זזה ימינה → ↓P_c (צרכנים משלמים פחות). P_p=P_c+sub > P* (יצרנים מקבלים יותר). P_c יורד, P_p עולה.',
  },
  {
    id: 'int-q4', question: 'מחיר מינימום מעל P* גורם ל:',
    options: ['עודף ביקוש', 'עודף היצע', 'שיווי משקל יעיל', 'ירידה בייצור'],
    correct: 1,
    explanation: 'מחיר מינימום > P* → מחיר גבוה מדי → יצרנים רוצים לספק יותר (Q_s↑), צרכנים רוצים לקנות פחות (Q_d↓) → עודף היצע.',
  },
  {
    id: 'int-q5', question: 'ממשלה מטילה מס על שקיות ניילון. שקיות ניילון ונייר הם תחליפים. מה קורה לשוק שקיות הנייר?',
    options: ['P_נייר יורד, Q_נייר יורד', 'P_נייר עולה, Q_נייר עולה', 'אין השפעה', 'Q_נייר יורד בלבד'],
    correct: 1,
    explanation: '↑מס ניילון → ↑P_ניילון → ↓Q_ניילון → צרכנים עוברים לנייר (תחליף) → ↑D_נייר → P_נייר↑, Q_נייר↑.',
  },
]

export function Chapter7Intervention() {
  return (
    <ChapterLayout number={7} title="התערבות ממשלתית במשק סגור" subtitle="מס, סובסידיה, גלגול מס, מחיר מינ/מקס" color="#ef4444" examWeight="2-3 שאלות במבחן">
      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">7.1 מס יחידתי על היצרן</h3>
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 space-y-2">
            <p className="font-bold text-orange-800">📌 מנגנון המס:</p>
            <p className="text-sm text-orange-700">מס t גורם להיצע לזוז <strong>שמאלה</strong> ב-t. S_new: P_p = P_c − t</p>
            <div className="space-y-1">
              <div className="text-center"><MathText math="D(Q) = S_{new}(Q) \Rightarrow \text{מצא } P_c" display /></div>
              <div className="text-center"><MathText math="P_p = P_c - t \quad \text{הכנסות ממשלה} = t \times Q_{new}" display /></div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">7.2 גלגול מס — מי משלם?</h3>
          <p className="text-sm text-muted-foreground">המס משולם ע"י שני הצדדים — חלוקה לפי גמישות עקומות:</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <p className="font-bold text-blue-700 text-sm">נטל צרכן</p>
              <div className="text-center mt-1"><MathText math="(P_c - P^*) \times Q_{new}" /></div>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-3">
              <p className="font-bold text-red-700 text-sm">נטל יצרן</p>
              <div className="text-center mt-1"><MathText math="(P^* - P_p) \times Q_{new}" /></div>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            ⚠️ D קשיח → צרכן נושא יותר. D גמיש → יצרן נושא יותר.
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">7.3 סובסידיה ליצרן</h3>
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-2">
            <p className="font-bold text-green-800">📌 מנגנון הסובסידיה:</p>
            <p className="text-sm text-green-700">סובסידיה sub גורמת ל-S לזוז <strong>ימינה</strong>. P_c יורד, P_p עולה.</p>
            <div className="text-center"><MathText math="P_p = P_c + sub \quad \text{עלות ממשלה} = sub \times Q_{new}" display /></div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">7.4 מחיר מינימום ומחיר מקסימום</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['מחיר מינימום', '> P*', 'עודף היצע', 'bg-yellow-50 border-yellow-300', 'שכר מינימום, מחיר חקלאי'],
              ['מחיר מקסימום', '< P*', 'עודף ביקוש', 'bg-blue-50 border-blue-300', 'שכר דירה מוגבל, דלק'],
            ].map(([name, cond, result, cls, ex]) => (
              <div key={name} className={`rounded-xl border p-3 ${cls}`}>
                <p className="font-bold text-sm">{name} ({cond})</p>
                <p className="text-xs font-semibold mt-1">{result}</p>
                <p className="text-xs text-muted-foreground mt-0.5">דוגמה: {ex}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-muted/40 p-3 text-sm">
            <p className="font-semibold">📌 מחיר שאינו כובל:</p>
            <p className="text-muted-foreground">מינימום &lt; P* → לא כובל (שוק בשיווי משקל).  מקסימום &gt; P* → לא כובל.</p>
          </div>
        </div>
      </section>
      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות אינטראקטיביות</h2>
        <TaxSim />
        <PriceSim />
        <CrossMarketSim />
      </section>
      <section><McqSection questions={MCQ} topicId="intervention" /></section>
    </ChapterLayout>
  )
}
