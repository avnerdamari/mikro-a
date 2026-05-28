import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot, ResponsiveContainer } from 'recharts'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'

/* ── PPF DATA ─────────────────────────────── */
function buildPPF(
  wa: number, pax: number, pay: number,
  wb: number, pbx: number, pby: number
) {
  const slopeA = pay / pax
  const slopeB = pby / pbx
  // Put higher-opportunity-cost group first (they specialize first)
  const [first, second] = slopeA >= slopeB
    ? [{ mx: wa * pax, my: wa * pay }, { mx: wb * pbx, my: wb * pby }]
    : [{ mx: wb * pbx, my: wb * pby }, { mx: wa * pax, my: wa * pay }]
  const totalY = first.my + second.my
  const cornerX = first.mx
  const cornerY = second.my
  return [
    { x: 0, y: totalY },
    { x: cornerX, y: cornerY },
    { x: cornerX + second.mx, y: 0 },
  ]
}

/* ── SIMULATION 1 ─────────────────────────── */
function PPFSimulation() {
  const [wa, setWa] = useState(1000)
  const [wb, setWb] = useState(1000)
  const [pax, setPax] = useState(0.5)
  const [pay, setPay] = useState(2)
  const [pbx, setPbx] = useState(2)
  const [pby, setPby] = useState(4)
  const [alloc, setAlloc] = useState(50)

  const pts = buildPPF(wa, pax, pay, wb, pbx, pby)
  const maxX = pts[pts.length - 1].x
  const maxY = pts[0].y
  const t = alloc / 100
  const curX = pts[0].x + t * (pts[pts.length - 1].x - pts[0].x)
  const curY = pts[0].y + t * (pts[pts.length - 1].y - pts[0].y)

  const S = { width: '100%', accentColor: '#a855f7' }

  return (
    <div className="space-y-4 rounded-2xl border border-purple-200 bg-purple-50 p-5" dir="rtl">
      <h4 className="font-bold text-purple-800 text-base">🔬 סימולציה 1 — בונה PPF</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2 bg-white rounded-xl p-4 border border-purple-200">
          <p className="font-semibold text-purple-700">קבוצה א</p>
          {([
            ['ריאלטי לעובד', pax, setPax, 0.2, 4, 0.1],
            ['גרעינים לעובד', pay, setPay, 1, 8, 0.5],
            ['עובדים', wa, setWa, 200, 3000, 100],
          ] as [string, number, (v: number) => void, number, number, number][]).map(([label, val, setter, min, max, step]) => (
            <label key={label} className="block">
              <span className="text-xs text-muted-foreground">{label}: <strong>{val}</strong></span>
              <div dir="ltr"><input type="range" min={min} max={max} step={step} value={val}
                onChange={e => setter(+e.target.value)} style={S} /></div>
            </label>
          ))}
        </div>
        <div className="space-y-2 bg-white rounded-xl p-4 border border-purple-200">
          <p className="font-semibold text-purple-700">קבוצה ב</p>
          {([
            ['ריאלטי לעובד', pbx, setPbx, 0.2, 4, 0.1],
            ['גרעינים לעובד', pby, setPby, 1, 8, 0.5],
            ['עובדים', wb, setWb, 200, 3000, 100],
          ] as [string, number, (v: number) => void, number, number, number][]).map(([label, val, setter, min, max, step]) => (
            <label key={label} className="block">
              <span className="text-xs text-muted-foreground">{label}: <strong>{val}</strong></span>
              <div dir="ltr"><input type="range" min={min} max={max} step={step} value={val}
                onChange={e => setter(+e.target.value)} style={S} /></div>
            </label>
          ))}
        </div>
      </div>
      <label className="block bg-white rounded-xl p-3 border border-purple-200">
        <span className="text-sm font-semibold text-purple-700">הקצאה: {alloc}% ריאלטי / {100 - alloc}% גרעינים</span>
        <div dir="ltr" className="mt-1">
          <input type="range" min={0} max={100} value={alloc} onChange={e => setAlloc(+e.target.value)} style={S} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>כל הגרעינים</span><span>כל הריאלטי</span>
        </div>
      </label>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={pts} margin={{ top: 15, right: 20, left: 0, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="x" type="number" domain={[0, maxX * 1.1]}
            label={{ value: 'ריאלטי', position: 'insideBottom', offset: -10, fontSize: 12 }} tickCount={6} />
          <YAxis domain={[0, maxY * 1.1]}
            label={{ value: 'גרעינים', angle: -90, position: 'insideLeft', offset: 12, fontSize: 12 }} tickCount={6} />
          <Tooltip formatter={(v: number) => v.toFixed(0)} />
          <Line dataKey="y" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 5, fill: '#a855f7' }} type="linear" name="PPF" />
          <ReferenceDot x={curX} y={curY} r={7} fill="#7c3aed" stroke="white" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        {[['ריאלטי נוכחי', curX.toFixed(0)], ['גרעינים נוכחיים', curY.toFixed(0)], ['מקסימום X/Y', `${maxX.toFixed(0)}/${maxY.toFixed(0)}`]].map(([label, val]) => (
          <div key={label} className="rounded-xl bg-purple-100 p-2">
            <p className="font-bold text-purple-700 text-sm">{val}</p>
            <p className="text-xs text-purple-600">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── SIMULATION 2: SHIFTS ─────────────────── */
function ShiftsSim() {
  const [workers, setWorkers] = useState(2000)
  const [tech, setTech] = useState(1)
  const [event, setEvent] = useState<'none' | 'war' | 'immigration'>('none')

  const eff = event === 'war' ? Math.round(workers * 0.7) : event === 'immigration' ? workers + 500 : workers
  const half = Math.round(eff / 2)
  const base = buildPPF(1000, 0.5, 2, 1000, 2, 4)
  const curr = buildPPF(half, 0.5 * tech, 2, eff - half, 2, 4)
  const domX = Math.max(curr[curr.length - 1].x, base[base.length - 1].x) * 1.15
  const domY = Math.max(curr[0].y, base[0].y) * 1.15

  return (
    <div className="space-y-4 rounded-2xl border border-blue-200 bg-blue-50 p-5" dir="rtl">
      <h4 className="font-bold text-blue-800">🔬 סימולציה 2 — תזוזות PPF</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div className="bg-white rounded-xl p-3 border border-blue-200">
          <p className="text-xs font-semibold text-blue-700 mb-1">שיפור טכנולוגי ×{tech.toFixed(1)}</p>
          <div dir="ltr"><input type="range" min={0.5} max={3} step={0.1} value={tech}
            onChange={e => setTech(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-blue-200">
          <p className="text-xs font-semibold text-blue-700 mb-1">עובדים: {eff.toLocaleString()}</p>
          <div dir="ltr"><input type="range" min={500} max={5000} step={100} value={workers}
            onChange={e => setWorkers(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-blue-200">
          <p className="text-xs font-semibold text-blue-700 mb-1">אירוע</p>
          <div className="flex flex-col gap-1">
            {[['none', 'ללא'], ['war', 'מלחמה −30%'], ['immigration', 'עלייה +500']] .map(([v, l]) => (
              <button key={v} onClick={() => setEvent(v as 'none' | 'war' | 'immigration')}
                className={`rounded px-2 py-0.5 text-xs font-semibold border transition-colors ${event === v ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-200 text-blue-700 hover:bg-blue-100'}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" dataKey="x" domain={[0, domX]}
            label={{ value: 'ריאלטי', position: 'insideBottom', offset: -10, fontSize: 11 }} />
          <YAxis domain={[0, domY]}
            label={{ value: 'גרעינים', angle: -90, position: 'insideLeft', fontSize: 11 }} />
          <Tooltip formatter={(v: number) => v.toFixed(0)} />
          <Line data={base} dataKey="y" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5"
            type="linear" name="מקורית" dot={false} />
          <Line data={curr} dataKey="y" stroke="#3b82f6" strokeWidth={2.5}
            type="linear" name="נוכחית" dot={{ r: 4, fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-blue-600 text-center font-medium">
        {event === 'war' && '⚠️ מלחמה: PPF זזה פנימה'}
        {event === 'immigration' && '✅ עלייה לארץ: PPF זזה החוצה'}
        {event === 'none' && tech > 1 && '✅ שיפור טכנולוגי ריאלטי בלבד: PPF זזה א-סימטרית'}
        {event === 'none' && tech === 1 && 'שנה גורם כדי לראות תזוזה'}
      </p>
    </div>
  )
}

/* ── SIMULATION 3: COMPARATIVE ADVANTAGE ─── */
function CompAdvSim() {
  const [priceReal, setPriceReal] = useState(5)
  const [priceGrain, setPriceGrain] = useState(2)

  const ocA = { real: 2 / 0.5, grain: 0.5 / 2 }
  const ocB = { real: 4 / 2, grain: 2 / 4 }

  const revA = { real: 0.5 * priceReal, grain: 2 * priceGrain }
  const revB = { real: 2 * priceReal, grain: 4 * priceGrain }

  return (
    <div className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-5" dir="rtl">
      <h4 className="font-bold text-green-800">🔬 סימולציה 3 — יתרון יחסי ומחירי שוק</h4>
      <div className="grid grid-cols-2 gap-3">
        {[['מחיר ריאלטי', priceReal, setPriceReal, 1, 20], ['מחיר גרעינים', priceGrain, setPriceGrain, 1, 10]].map(([label, val, setter, min, max]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border border-green-200">
            <p className="text-xs font-semibold text-green-700 mb-1">{label as string}: {val as number}₪</p>
            <div dir="ltr">
              <input type="range" min={min as number} max={max as number} value={val as number}
                onChange={e => (setter as (v: number) => void)(+e.target.value)}
                style={{ width: '100%', accentColor: '#22c55e' }} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[['א (חרוצים): 0.5 ריאלטי | 2 גרעינים', ocA, revA], ['ב (עצלנים): 2 ריאלטי | 4 גרעינים', ocB, revB]].map(([title, oc, rev]) => {
          const o = oc as typeof ocA
          const r = rev as typeof revA
          const bestProd = r.real > r.grain ? 'ריאלטי' : 'גרעינים'
          return (
            <div key={title as string} className="bg-white rounded-xl p-3 border border-green-200 space-y-2">
              <p className="font-semibold text-green-700 text-xs">{title as string}</p>
              <p className="text-xs">עלות ריאלטי: {o.real.toFixed(1)} גרעינים</p>
              <p className="text-xs">עלות גרעינים: {o.grain.toFixed(1)} ריאלטי</p>
              <div className="border-t pt-2">
                <p className="text-xs">הכנסה מריאלטי: {r.real.toFixed(1)}₪/עובד</p>
                <p className="text-xs">הכנסה מגרעינים: {r.grain.toFixed(1)}₪/עובד</p>
              </div>
              <div className="rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-800">
                ✅ עדיף לייצר: {bestProd}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── MCQ ──────────────────────────────────── */
const MCQ: McqQuestion[] = [
  {
    id: 'ppf-q1', question: 'ל-1,000 חרוצים (0.5 ריאלטי או 2 גרעינים לעובד) ו-1,000 עצלנים (2 ריאלטי או 4 גרעינים). לאיזו קבוצה יתרון יחסי בריאלטי?',
    options: ['חרוצים', 'עצלנים', 'לשתיהן שווה', 'אין מספיק מידע'],
    correct: 1,
    explanation: 'עלות ריאלטי אצל חרוצים: 2÷0.5=4 גרעינים. אצל עצלנים: 4÷2=2 גרעינים. לעצלנים עלות נמוכה יותר → יתרון יחסי בריאלטי.',
  },
  {
    id: 'ppf-q2', question: 'נקודה מתחת ל-PPF מייצגת:',
    options: ['שימוש מלא ויעיל', 'אבטלה / חוסר יעילות', 'מצב בלתי אפשרי', 'צמיחה כלכלית'],
    correct: 1,
    explanation: 'מתחת ל-PPF = לא מנצלים את כל המשאבים (יש אבטלה). על PPF = יעיל. מחוץ ל-PPF = בלתי אפשרי.',
  },
  {
    id: 'ppf-q3', question: 'עלייה לארץ של 500 עובדים חדשים תגרום ל-PPF:',
    options: ['לזוז פנימה', 'לזוז החוצה', 'תנועה לאורך PPF', 'לא להשתנות'],
    correct: 1,
    explanation: 'יותר עובדים = יותר גורמי ייצור = PPF זזה החוצה. ניתן לייצר יותר מכל מוצר.',
  },
  {
    id: 'ppf-q4', question: 'שיפור טכנולוגי בייצור ריאלטי בלבד (לא גרעינים) יגרום ל-PPF:',
    options: ['לזוז החוצה אחיד', 'לזוז החוצה רק על ציר ריאלטי (א-סימטרי)', 'לא להשתנות', 'לזוז פנימה'],
    correct: 1,
    explanation: 'שיפור חלקי = תזוזה א-סימטרית. ציר ריאלטי זזה, ציר גרעינים לא משתנה.',
  },
  {
    id: 'ppf-q5', question: 'מחיר ריאלטי 5₪, מחיר גרעינים 2₪. עובד מייצר 0.5 ריאלטי או 2 גרעינים. מה עדיף לייצר?',
    options: ['ריאלטי', 'גרעינים', 'שווה', 'תלוי במספר עובדים'],
    correct: 1,
    explanation: 'ריאלטי: 0.5×5=2.5₪ לעובד. גרעינים: 2×2=4₪ לעובד. גרעינים עדיפים (4₪ > 2.5₪).',
  },
]

/* ── EXERCISES ──────────────────────────────── */
const EASY: Exercise[] = [
  { id: 'ppf-e1', question: '500 עובדים מייצרים 3 עוגות כל אחד לשעה. מה ייצור מרבי של עוגות?', hint: 'עובדים × תפוקה לעובד', answer: '500 × 3 = 1,500 עוגות' },
  { id: 'ppf-e2', question: 'אותם עובדים מייצרים 6 לחמניות לשעה. מה הייצור המרבי של לחמניות?', answer: '500 × 6 = 3,000 לחמניות' },
  { id: 'ppf-e3', question: 'עובד מייצר 3 עוגות או 6 לחמניות. מה העלות האלטרנטיבית של עוגה אחת?', hint: 'לחמניות ÷ עוגות', answer: '6 ÷ 3 = 2 לחמניות לכל עוגה' },
  { id: 'ppf-e4', question: 'מחיר עוגה 10₪, מחיר לחמניה 4₪. עובד: 3 עוגות או 6 לחמניות. מה עדיף?', answer: 'עוגות: 3×10=30₪. לחמניות: 6×4=24₪. ← עדיף עוגות.' },
  { id: 'ppf-e5', question: 'הסבר ב-2 משפטים: מה ההבדל בין נקודה על PPF לנקודה מתחת ל-PPF?', answer: 'על PPF: כל המשאבים מנוצלים ביעילות.\nמתחת ל-PPF: יש אבטלה/בזבוז — ניתן לייצר יותר.' },
]

const MEDIUM: Exercise[] = [
  { id: 'ppf-m1', question: 'קבוצה א: 400 עובדים, 4 תפוחים או 2 בננות לעובד. קבוצה ב: 600 עובדים, 1 תפוח או 3 בננות. מי מחזיק יתרון יחסי בתפוחים?', hint: 'חשב עלות אלטרנטיבית (מה מוותרים על תפוח אחד)', answer: 'א: עלות תפוח = 2÷4 = 0.5 בננות.\nב: עלות תפוח = 3÷1 = 3 בננות.\nלקבוצה א עלות נמוכה יותר → יתרון יחסי בתפוחים.' },
  { id: 'ppf-m2', question: 'מה קורה ל-PPF אם 200 עובדים מקבוצה א עוזבים את הארץ? (תאר את השינוי)', answer: 'PPF זזה פנימה (לשמאל). יש פחות עובדים → פחות ייצור אפשרי.\nמקסימום תפוחים יורד: (200×4)+(600×1)=1,400 תפוחים לעומת (400×4)+(600×1)=2,200 קודם.' },
  { id: 'ppf-m3', question: 'שיפור טכנולוגי מכפיל ×2 את תפוקת קבוצה ב בבננות (מ-3 ל-6). תאר את השפעת ה-PPF.', answer: 'PPF זזה החוצה א-סימטרית:\n- מקסימום תפוחים: לא משתנה (שיפור לא בתפוחים)\n- מקסימום בננות: (400×2)+(600×6)=800+3,600=4,400 (לעומת 400×2+600×3=2,600 קודם)\nציר בננות זזה, ציר תפוחים נשאר.' },
  { id: 'ppf-m4', question: 'מחיר תפוח 6₪, מחיר בננה 5₪. קבוצה א: 4 תפוחים/2 בננות. קבוצה ב: 1 תפוח/3 בננות. מה ההקצאה האופטימלית?', answer: 'א: תפוחים=4×6=24₪ | בננות=2×5=10₪ → א לתפוחים\nב: תפוחים=1×6=6₪ | בננות=3×5=15₪ → ב לבננות\n\nהקצאה אופטימלית: קבוצה א → תפוחים, קבוצה ב → בננות.' },
  { id: 'ppf-m5', question: 'הסבר מדוע PPF קעורה כאשר יש שתי קבוצות עובדים שונות ביעילות.', answer: 'PPF קעורה בגלל עלות אלטרנטיבית גוברת:\nמתחילים לייצר X עם הקבוצה היעילה יותר ב-X (עלות נמוכה).\nכשממשיכים, צריך לגייס את הקבוצה פחות יעילה — כל יחידה X נוספת עולה יותר.\nאם שתי הקבוצות זהות → PPF ישרה (עלות אלטרנטיבית קבועה).' },
]

const HARD: Exercise[] = [
  { id: 'ppf-h1', question: 'קבוצה א: 800 עובדים, 0.25 טלוויזיות או 3 מחשבים לעובד. קבוצה ב: 1,200 עובדים, 0.5 טלוויזיות או 1 מחשב לעובד. מה נקודות הקצה של PPF?', answer: 'מקסימום טלוויזיות: 800×0.25 + 1,200×0.5 = 200+600 = 800\nמקסימום מחשבים: 800×3 + 1,200×1 = 2,400+1,200 = 3,600\nנקודות קצה: (0,800) ו-(3,600,0)' },
  { id: 'ppf-h2', question: 'אותו משק. מי מחזיק יתרון יחסי בטלוויזיות?', answer: 'א: עלות טלוויזיה = 3÷0.25 = 12 מחשבים\nב: עלות טלוויזיה = 1÷0.5 = 2 מחשבים\nקבוצה ב: עלות נמוכה יותר → יתרון יחסי בטלוויזיות.\nקבוצה א: יתרון יחסי במחשבים.' },
  { id: 'ppf-h3', question: 'מחיר טלוויזיה 1,000₪, מחיר מחשב 200₪. מה ההקצאה האופטימלית והכנסה כוללת?', answer: 'א: טלוויזיות=0.25×1,000=250₪ | מחשבים=3×200=600₪ → א למחשבים\nב: טלוויזיות=0.5×1,000=500₪ | מחשבים=1×200=200₪ → ב לטלוויזיות\n\nהכנסה: 800×600 + 1,200×500 = 480,000+600,000 = 1,080,000₪' },
  { id: 'ppf-h4', question: 'שיפור ×2 בתפוקת קבוצה א בטלוויזיות (0.25→0.5). מה קורה ליתרון היחסי?', answer: 'עלות טלוויזיה החדשה של א: 3÷0.5=6 מחשבים (היה 12).\nעלות טלוויזיה של ב: עדיין 2 מחשבים.\nב עדיין מחזיקה יתרון יחסי בטלוויזיות (2<6), אבל הפער קטן.' },
  { id: 'ppf-h5', question: 'אחרי השיפור, מה "מחיר המתג" של טלוויזיה שמעליה כדאי להעביר חלק מקבוצה א לטלוויזיות?', hint: 'הכנסה זהה = תנאי המתג', answer: 'עובד א שווה-ערך כאשר: 0.5×P_tv = 3×200\n0.5P_tv = 600 → P_tv = 1,200₪\n\nאם מחיר טלוויזיה > 1,200₪ → כדאי להעביר גם את קבוצה א לטלוויזיות.\nאם < 1,200₪ → קבוצה א נשארת במחשבים.' },
]

/* ── EXPORT ──────────────────────────────── */
export function Chapter1PPF() {
  return (
    <ChapterLayout number={1} title="בעיית המחסור ועקומת התמורה"
      subtitle="PPF — Production Possibility Frontier" color="#a855f7" examWeight="~4 שאלות במבחן">

      {/* THEORY */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">1.1 למה אנחנו צריכים כלכלה?</h3>
          <p className="text-muted-foreground leading-relaxed">
            כלכלה מתחילה מבעיה יסודית: <strong>המשאבים מוגבלים, הצרכים אינסופיים</strong>.
            כל חברה חייבת לענות על שלוש שאלות יסוד:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              ['מה לייצר?', 'תפוחים? מטוסים? חינוך?'],
              ['איך לייצר?', 'עם הרבה עובדים? עם מכונות?'],
              ['למי לחלק?', 'לפי יכולת תשלום? לפי צורך?'],
            ].map(([q, e]) => (
              <div key={q} className="rounded-xl bg-muted/40 p-4">
                <p className="font-bold text-sm mb-1">{q}</p>
                <p className="text-xs text-muted-foreground">{e}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">1.2 עלות אלטרנטיבית</h3>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="font-bold text-amber-800 mb-1">📌 הגדרה:</p>
            <p className="text-amber-700 text-sm">
              הוויתור הטוב ביותר שוויתרת עליו כשבחרת משהו — <em>מה לא תוכל לעשות</em> בגלל הבחירה.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>דוגמה:</strong> עובד מייצר 0.5 ריאלטי <em>או</em> 2 גרעינים.
            לייצר ריאלטי אחד = לוותר על 4 גרעינים (2÷0.5=4).
            → <strong>עלות אלטרנטיבית של ריאלטי = 4 גרעינים</strong>
          </p>
          <div className="rounded-xl border border-border p-4 text-center">
            <MathText math="\text{עלות אלט' של X} = \frac{\text{תפוקת Y לעובד}}{\text{תפוקת X לעובד}}" display />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">1.3 עקומת התמורה — 3 סוגי נקודות</h3>
          <p className="text-sm text-muted-foreground">ציר X = מוצר ראשון | ציר Y = מוצר שני</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              ['✅ על PPF', 'bg-green-50 border-green-300', 'יעיל — כל המשאבים מנוצלים'],
              ['⚠️ מתחת ל-PPF', 'bg-yellow-50 border-yellow-300', 'לא יעיל — אבטלה / משאבים מבוזבזים'],
              ['❌ מחוץ ל-PPF', 'bg-red-50 border-red-300', 'בלתי אפשרי — מעבר ליכולת הנוכחית'],
            ].map(([pos, cls, desc]) => (
              <div key={pos} className={`rounded-xl border p-3 ${cls}`}>
                <p className="font-bold text-sm">{pos}</p>
                <p className="text-xs mt-1 text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="rounded-xl bg-green-50 border border-green-200 p-3">
              <p className="font-bold text-green-700 text-sm mb-1">🟢 PPF זזה החוצה</p>
              <ul className="text-xs text-green-700 space-y-0.5">
                <li>↑ עובדים / עלייה לארץ</li><li>↑ הון / מכונות</li>
                <li>שיפור טכנולוגי</li><li>סוף שביתה</li>
              </ul>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-3">
              <p className="font-bold text-red-700 text-sm mb-1">🔴 PPF זזה פנימה</p>
              <ul className="text-xs text-red-700 space-y-0.5">
                <li>↓ עובדים / ירידה מהארץ</li><li>מלחמה / אסון טבע</li>
                <li>הרס ציוד</li><li>שביתה כוללת</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3">
            <p className="font-bold text-purple-700 text-sm">⚡ שיפור טכנולוגי חלקי (חשוב!)</p>
            <p className="text-xs text-purple-700 mt-1">
              שיפור רק בייצור מוצר X → PPF זזה <strong>רק על ציר X</strong> (א-סימטרי).
              מקסימום Y נשאר, מקסימום X עולה.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-bold text-lg">1.4 יתרון יחסי — מי מייצר מה?</h3>
          <p className="text-sm text-muted-foreground">
            יתרון יחסי = עלות אלטרנטיבית <strong>נמוכה יותר</strong> ממתחרים.
            כשמחליטים מה לייצר לפי מחירי שוק — בוחרים לפי הכנסה לעובד:
          </p>
          <div className="rounded-xl border border-border p-4 text-center">
            <MathText math="\text{הכנסה לעובד} = \text{תפוקה לעובד} \times \text{מחיר מוצר}" display />
          </div>
          <p className="text-xs text-muted-foreground text-center">בוחרים את המוצר עם הכנסה גבוהה יותר לעובד</p>
        </div>
      </section>

      {/* SIMS */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות אינטראקטיביות</h2>
        <PPFSimulation />
        <ShiftsSim />
        <CompAdvSim />
      </section>

      {/* MCQ */}
      <section>
        <McqSection questions={MCQ} topicId="ppf" />
      </section>

      {/* EXERCISES */}
      <section>
        <ExerciseSection easy={EASY} medium={MEDIUM} hard={HARD} topicId="ppf" />
      </section>
    </ChapterLayout>
  )
}
