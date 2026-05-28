import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'

/* ── DATA (real exam example) ──────────────── */
const BASE_DATA = [
  { L: 0, TP: 0 },
  { L: 1, TP: 700 },
  { L: 2, TP: 1300 },
  { L: 3, TP: 1800 },
  { L: 4, TP: 2200 },
  { L: 5, TP: 2500 },
  { L: 6, TP: 2700 },
]

function calcTable(data: { L: number; TP: number }[], price: number, wage: number) {
  return data.map((row, i) => {
    const MP = i === 0 ? 0 : row.TP - data[i - 1].TP
    const AP = row.L > 0 ? row.TP / row.L : 0
    const VMP = price * MP
    const hire = i > 0 && VMP >= wage
    const profit = price * row.TP - row.L * wage
    return { ...row, MP, AP, VMP, hire, profit }
  })
}

/* ── SIM 1: Production table ─────────────── */
function ProductionSim() {
  const [price, setPrice] = useState(20)
  const [wage, setWage] = useState(5000)

  const rows = calcTable(BASE_DATA, price, wage)
  const optL = rows.filter(r => r.hire).pop()?.L ?? 0
  const optProfit = rows.find(r => r.L === optL)?.profit ?? 0

  return (
    <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5" dir="rtl">
      <h4 className="font-bold text-indigo-800">🔬 סימולציה 1 — מעסיק חכם</h4>
      <p className="text-sm text-indigo-700">מחשב MP, VMP ומחליט כמה עובדים להעסיק</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-3 border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-700 mb-1">מחיר תפוקה P: {price}₪/ק"ג</p>
          <div dir="ltr"><input type="range" min={5} max={50} value={price} onChange={e => setPrice(+e.target.value)} style={{ width: '100%', accentColor: '#6366f1' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-700 mb-1">שכר W: {wage.toLocaleString()}₪</p>
          <div dir="ltr"><input type="range" min={1000} max={20000} step={500} value={wage} onChange={e => setWage(+e.target.value)} style={{ width: '100%', accentColor: '#6366f1' }} /></div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse">
          <thead>
            <tr className="bg-indigo-100">
              {['L', 'TP', 'MP', 'AP', 'VMP=P×MP', 'W', 'העסק?', 'רווח'].map(h => (
                <th key={h} className="border border-indigo-200 px-2 py-1.5 font-bold text-indigo-800">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map(r => (
              <tr key={r.L} className={r.L === optL ? 'bg-green-100 font-bold' : r.hire ? 'bg-indigo-50' : 'bg-red-50 opacity-70'}>
                <td className="border border-indigo-200 px-2 py-1">{r.L}</td>
                <td className="border border-indigo-200 px-2 py-1">{r.TP.toLocaleString()}</td>
                <td className="border border-indigo-200 px-2 py-1">{r.MP}</td>
                <td className="border border-indigo-200 px-2 py-1">{r.AP.toFixed(0)}</td>
                <td className="border border-indigo-200 px-2 py-1 font-semibold" style={{ color: r.VMP >= wage ? '#16a34a' : '#dc2626' }}>
                  {r.VMP.toLocaleString()}
                </td>
                <td className="border border-indigo-200 px-2 py-1">{wage.toLocaleString()}</td>
                <td className="border border-indigo-200 px-2 py-1">{r.hire ? '✅' : '❌'}</td>
                <td className="border border-indigo-200 px-2 py-1">{r.profit.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        {[['עובדים אופטימליים', optL], ['תפוקה אופטימלית', rows.find(r=>r.L===optL)?.TP.toLocaleString()??0], ['רווח מקסימלי', `${optProfit.toLocaleString()}₪`]].map(([label, val]) => (
          <div key={label} className="rounded-xl bg-indigo-100 p-2">
            <p className="font-bold text-indigo-700 text-sm">{val}</p>
            <p className="text-xs text-indigo-600">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── SIM 2: TP/MP/AP curves ──────────────── */
function CurvesSim() {
  const data = calcTable(BASE_DATA, 20, 5000)
  const mpAp = data.slice(1).map(r => ({ L: r.L, MP: r.MP, AP: +r.AP.toFixed(1) }))

  return (
    <div className="space-y-4 rounded-2xl border border-purple-200 bg-purple-50 p-5" dir="rtl">
      <h4 className="font-bold text-purple-800">🔬 סימולציה 2 — עקומות TP, MP, AP</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-purple-700 mb-2">תפוקה כוללת TP</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="L" label={{ value: 'עובדים (L)', position: 'insideBottom', offset: -5, fontSize: 11 }} />
              <YAxis label={{ value: 'TP', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip />
              <Line dataKey="TP" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4 }} name="TP" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-sm font-semibold text-purple-700 mb-2">MP ו-AP</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mpAp} margin={{ top: 10, right: 20, left: 0, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="L" label={{ value: 'עובדים (L)', position: 'insideBottom', offset: -5, fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Line dataKey="MP" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="MP" />
              <Line dataKey="AP" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} name="AP" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-xs text-purple-700 font-medium text-center">
        שים לב: MP יורד (חוק התפוקה השולית הפוחתת). כשMP&gt;AP — AP עולה; כשMP&lt;AP — AP יורד.
      </p>
    </div>
  )
}

/* ── SIM 3: Minimum wage ─────────────────── */
function MinWageSim() {
  const [price, setPrice] = useState(20)
  const [wage, setWage] = useState(5000)
  const [minWage, setMinWage] = useState(0)

  const effWage = Math.max(wage, minWage)
  const rows = calcTable(BASE_DATA, price, effWage)
  const optFree = calcTable(BASE_DATA, price, wage).filter(r => r.hire).pop()?.L ?? 0
  const optMin = rows.filter(r => r.hire).pop()?.L ?? 0

  return (
    <div className="space-y-4 rounded-2xl border border-orange-200 bg-orange-50 p-5" dir="rtl">
      <h4 className="font-bold text-orange-800">🔬 סימולציה 3 — שכר מינימום ואבטלה</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-orange-200">
          <p className="text-xs font-semibold text-orange-700 mb-1">מחיר P: {price}₪</p>
          <div dir="ltr"><input type="range" min={5} max={50} value={price} onChange={e => setPrice(+e.target.value)} style={{ width: '100%', accentColor: '#f97316' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-orange-200">
          <p className="text-xs font-semibold text-orange-700 mb-1">שכר שוק W: {wage.toLocaleString()}₪</p>
          <div dir="ltr"><input type="range" min={1000} max={15000} step={500} value={wage} onChange={e => setWage(+e.target.value)} style={{ width: '100%', accentColor: '#f97316' }} /></div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-orange-200">
          <p className="text-xs font-semibold text-orange-700 mb-1">שכר מינימום: {minWage.toLocaleString()}₪</p>
          <div dir="ltr"><input type="range" min={0} max={15000} step={500} value={minWage} onChange={e => setMinWage(+e.target.value)} style={{ width: '100%', accentColor: '#f97316' }} /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-white border border-orange-200 p-3 text-center">
          <p className="font-bold text-lg text-orange-700">{optFree}</p>
          <p className="text-xs text-muted-foreground">עובדים ללא מינימום</p>
        </div>
        <div className={`rounded-xl border p-3 text-center ${optMin < optFree ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
          <p className={`font-bold text-lg ${optMin < optFree ? 'text-red-700' : 'text-green-700'}`}>{optMin}</p>
          <p className="text-xs text-muted-foreground">עובדים עם מינימום</p>
          {optMin < optFree && <p className="text-xs text-red-600 font-semibold mt-1">⚠️ {optFree - optMin} אבטלה</p>}
        </div>
      </div>
      <p className="text-xs text-orange-700 text-center font-medium">
        שכר מינימום גורם לאבטלה רק כשהוא <strong>מעל</strong> שכר שיווי המשקל בשוק.
      </p>
    </div>
  )
}

/* ── MCQ ──────────────────────────────────── */
const MCQ: McqQuestion[] = [
  {
    id: 'prod-q1', question: 'עובד 5 מוסיף TP מ-2,200 ל-2,500. P=20₪, W=5,000₪. האם כדאי להעסיק?',
    options: ['כן, VMP=6,000≥W=5,000', 'לא, VMP<W', 'כן, TP גדל', 'לא, רווח שלילי'],
    correct: 0,
    explanation: 'MP=2,500-2,200=300. VMP=20×300=6,000₪. W=5,000₪. VMP(6,000)≥W(5,000) → כדאי להעסיק!',
  },
  {
    id: 'prod-q2', question: 'עובד 6 מוסיף TP מ-2,500 ל-2,700. P=20₪, W=5,000₪. האם כדאי להעסיק?',
    options: ['כן', 'לא, VMP=4,000<W=5,000', 'כן, רווח עולה', 'שאלה לא ניתנת לפתרון'],
    correct: 1,
    explanation: 'MP=2,700-2,500=200. VMP=20×200=4,000₪. W=5,000₪. VMP(4,000)<W(5,000) → לא כדאי.',
  },
  {
    id: 'prod-q3', question: 'חוק התפוקה השולית הפוחתת אומר ש:',
    options: ['TP יורד', 'MP יורד ככל שמוסיפים עובדים', 'AP=MP', 'הפדיון יורד'],
    correct: 1,
    explanation: 'חוק התפוקה הפוחתת: כל עובד נוסף מוסיף פחות ופחות לתפוקה (MP יורד). TP עדיין עולה, רק בקצב פוחת.',
  },
  {
    id: 'prod-q4', question: 'שכר עולה מ-5,000₪ ל-8,000₪. מה קורה למספר העובדים האופטימלי?',
    options: ['עולה', 'יורד', 'לא משתנה', 'עולה ויורד'],
    correct: 1,
    explanation: 'אם W עולה, דרישים ל-VMP≥W קשים יותר. עובדים שהיה VMP≥5,000 אבל VMP<8,000 כבר לא כדאיים. מספר עובדים יורד.',
  },
  {
    id: 'prod-q5', question: 'VMP_L מחושב כ:',
    options: ['W × L', 'P × MP_L', 'TR / L', 'TC / TP'],
    correct: 1,
    explanation: 'VMP_L = ערך התפוקה השולית = P (מחיר תוצר) × MP_L (תפוקה שולית). זה כמה כסף מוסיף עובד נוסף לפדיון.',
  },
]

/* ── EXERCISES ─────────────────────────────── */
const EASY: Exercise[] = [
  { id: 'p2-e1', question: 'L=3 → TP=1,800, L=4 → TP=2,200. מה MP של העובד ה-4?', hint: 'ΔTP = TP(4) - TP(3)', answer: 'MP = 2,200 - 1,800 = 400 יחידות' },
  { id: 'p2-e2', question: 'L=4, TP=2,200. מה AP_L?', answer: 'AP = TP/L = 2,200/4 = 550 יחידות לעובד' },
  { id: 'p2-e3', question: 'MP=300 יחידות, P=20₪. מה VMP_L?', answer: 'VMP = P × MP = 20 × 300 = 6,000₪' },
  { id: 'p2-e4', question: 'VMP=6,000₪, W=5,000₪. האם כדאי להעסיק עובד זה?', answer: 'VMP(6,000) ≥ W(5,000) → כן, כדאי להעסיק!' },
  { id: 'p2-e5', question: 'L=5, TP=2,500, P=20₪, W=5,000₪. מה הרווח?', answer: 'TR = P×TP = 20×2,500 = 50,000₪\nTC = L×W = 5×5,000 = 25,000₪\nרווח = TR-TC = 25,000₪' },
]

const MEDIUM: Exercise[] = [
  { id: 'p2-m1', question: 'P=15₪, W=4,500₪. נתונים: L=1→TP=500, L=2→TP=900, L=3→TP=1,200, L=4→TP=1,400. כמה עובדים להעסיק?', hint: 'חשב MP וVMP לכל עובד', answer: 'L=1: MP=500, VMP=7,500≥4,500 ✅\nL=2: MP=400, VMP=6,000≥4,500 ✅\nL=3: MP=300, VMP=4,500≥4,500 ✅\nL=4: MP=200, VMP=3,000<4,500 ❌\n\nהעסק 3 עובדים.' },
  { id: 'p2-m2', question: 'אותו משק. W עולה ל-6,000₪. כמה עובדים כעת?', answer: 'L=1: VMP=7,500≥6,000 ✅\nL=2: VMP=6,000≥6,000 ✅\nL=3: VMP=4,500<6,000 ❌\n\nהעסק 2 עובדים בלבד (ירידה מ-3). שכר גבוה יותר → פחות עובדים.' },
  { id: 'p2-m3', question: 'אותו משק (P=15₪, W=4,500₪, 3 עובדים). חשב TP, TR, TC ורווח.', answer: 'TP = 1,200 יחידות\nTR = 15 × 1,200 = 18,000₪\nTC = 3 × 4,500 = 13,500₪\nרווח = 18,000 - 13,500 = 4,500₪' },
  { id: 'p2-m4', question: 'מה קורה לרווח אם מעסיקים עובד 4 (לא כדאי)? (P=15₪, W=4,500₪, TP בעובד 4 = 1,400)', answer: 'TR = 15×1,400 = 21,000₪\nTC = 4×4,500 = 18,000₪\nרווח = 3,000₪ (ירד מ-4,500 ל-3,000)\n\nמוסיפים עובד לא כדאי → רווח קטן. זה מוכיח כלל VMP≥W.' },
  { id: 'p2-m5', question: 'הסבר ב-3 שורות: מדוע VMP_L יורד ככל שמוסיפים עובדים?', answer: 'כי MP_L יורד (חוק התפוקה הפוחתת).\nכל עובד נוסף עובד עם אותם כלים/מכונות → פחות יעיל.\nVMP = P × MP — P קבוע אבל MP יורד → VMP יורד.' },
]

const HARD: Exercise[] = [
  { id: 'p2-h1', question: 'P=25₪, W=7,000₪. L=1→TP=600, L=2→TP=1,100, L=3→TP=1,500, L=4→TP=1,800, L=5→TP=2,000. מה רמת הייצור האופטימלית ורווח מקסימלי?', answer: 'L=1: MP=600, VMP=15,000≥7,000 ✅\nL=2: MP=500, VMP=12,500≥7,000 ✅\nL=3: MP=400, VMP=10,000≥7,000 ✅\nL=4: MP=300, VMP=7,500≥7,000 ✅\nL=5: MP=200, VMP=5,000<7,000 ❌\n\nL*=4, TP*=1,800\nTR=25×1,800=45,000₪\nTC=4×7,000=28,000₪\nרווח=17,000₪' },
  { id: 'p2-h2', question: 'P עולה מ-25₪ ל-35₪ (אותו W=7,000₪). כמה עובדים עכשיו? כמה תוספת רווח?', answer: 'L=5: MP=200, VMP=35×200=7,000≥7,000 ✅\n\nL*=5, TP*=2,000\nTR=35×2,000=70,000₪\nTC=5×7,000=35,000₪\nרווח=35,000₪\n\nתוספת רווח: 35,000-17,000=18,000₪' },
  { id: 'p2-h3', question: 'ממשלה מטילה שכר מינימום 9,000₪ (לעומת W=7,000₪ בשוק). מה מספר העובדים ואת מידת האבטלה?', answer: 'בW=9,000₪:\nL=1: VMP=15,000≥9,000 ✅\nL=2: VMP=12,500≥9,000 ✅\nL=3: VMP=10,000≥9,000 ✅\nL=4: VMP=7,500<9,000 ❌\n\nL*=3 (לעומת 4 בשוק חופשי)\nאבטלה: 1 עובד (העובד ה-4 לא נשכר).' },
  { id: 'p2-h4', question: 'ממשלה מעניקה סובסידיה לשכר: מממנת 2,000₪ מתוך כל משכורת (מעסיק משלם רק 5,000₪ מ-7,000₪). כמה עובדים?', answer: 'עלות למעסיק אחרי סובסידיה: 7,000-2,000=5,000₪\nL=5: VMP=5,000≥5,000 ✅\n\nL*=5 (לעומת 4 ללא סובסידיה).\nסובסידיה לשכר → עוד העסקה.' },
  { id: 'p2-h5', question: 'כיצד תשפיע עלייה במחיר תפוקה P מ-25₪ ל-35₪ על עקומת הביקוש לעבודה? הסבר כלכלית.', answer: 'עקומת הביקוש לעבודה = VMP(L) = P × MP(L).\nכשP עולה → VMP עולה בכל רמת L.\nהגרף של VMP(L) זזה למעלה (כלפי חוץ).\n\nכלכלית: תפוקת עובד שווה יותר כשמחיר התוצר גבוה → מעסיק מוכן להעסיק יותר עובדים בכל שכר נתון.' },
]

export function Chapter2Production() {
  return (
    <ChapterLayout number={2} title="פונקציית הייצור והקצאת גורמי ייצור"
      subtitle="MP, VMP, כלל העסקה אופטימלי" color="#6366f1" examWeight="2-3 שאלות במבחן">

      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">2.1 פונקציית הייצור — מבוא</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            פונקציית הייצור מתארת את הקשר בין <strong>כמות גורמי הייצור</strong> (עבודה, הון) ל<strong>תפוקה</strong>.
            בטווח קצר, ההון קבוע (מכונות) — רק כמות העובדים (L) משתנה.
          </p>
          <div className="rounded-xl border border-border p-4 text-center space-y-3">
            <p className="text-sm font-semibold">נוסחאות בסיסיות:</p>
            <MathText math="MP_L = \Delta TP / \Delta L \quad\quad AP_L = TP / L \quad\quad VMP_L = P \times MP_L" display />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['TP', 'תפוקה כוללת', 'סה"כ יחידות שכולם מייצרים'],
              ['MP', 'תפוקה שולית', 'כמה מוסיף עובד נוסף'],
              ['VMP', 'ערך תפוקה שולית', 'כמה ₪ מוסיף עובד נוסף'],
            ].map(([sym, name, desc]) => (
              <div key={sym} className="rounded-xl bg-indigo-50 border border-indigo-200 p-3 text-center">
                <p className="font-extrabold text-indigo-700 text-lg">{sym}</p>
                <p className="font-semibold text-xs">{name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">2.2 חוק התפוקה השולית הפוחתת</h3>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="font-bold text-amber-800 mb-1">📌 חוק יסוד:</p>
            <p className="text-amber-700 text-sm">
              ככל שמוסיפים עובדים נוספים לגורמי ייצור קבועים (כלים, מכונות) —
              כל עובד נוסף מוסיף <strong>פחות ופחות</strong> לתפוקה (MP יורד).
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>למה?</strong> 10 עובדים ב-2 מכונות — עובד ה-11 ימתין לתורו, פחות יעיל.
            100 עובדים ב-2 מכונות — עובד ה-101 כמעט אינו תורם.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">2.3 כלל ההעסקה האופטימלי — VMP ≥ W</h3>
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <p className="font-bold text-green-800 mb-2">📌 כלל ההחלטה:</p>
            <p className="text-green-700 text-sm mb-2">העסק עוד עובד אם ורק אם:</p>
            <div className="text-center">
              <MathText math="VMP_L \geq W \quad\Leftrightarrow\quad P \times MP_L \geq W" display />
            </div>
            <p className="text-green-700 text-xs mt-2">כלומר: הערך שהעובד מוסיף (VMP) גדול מהעלות שלו (W)</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-50 border border-green-200 p-3">
              <p className="font-bold text-green-700 text-sm">✅ VMP ≥ W</p>
              <p className="text-xs text-green-700 mt-1">העסק → מוסיף לרווח</p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-3">
              <p className="font-bold text-red-700 text-sm">❌ VMP &lt; W</p>
              <p className="text-xs text-red-700 mt-1">אל תעסיק → מוריד רווח</p>
            </div>
          </div>
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3">
            <p className="text-sm font-semibold text-indigo-700">חישוב רווח:</p>
            <div className="text-center mt-2">
              <MathText math="\pi = TR - TC = P \times TP - L \times W" display />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות אינטראקטיביות</h2>
        <ProductionSim />
        <CurvesSim />
        <MinWageSim />
      </section>

      <section><McqSection questions={MCQ} topicId="production" /></section>
      <section><ExerciseSection easy={EASY} medium={MEDIUM} hard={HARD} topicId="production" /></section>
    </ChapterLayout>
  )
}
