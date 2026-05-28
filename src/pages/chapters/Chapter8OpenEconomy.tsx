import { useState } from 'react'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Area, AreaChart } from 'recharts'

function OpenEconomySim() {
  const [pw, setPw] = useState(60)
  const [intercept, setIntercept] = useState(200)
  const [slopeD, setSlopeD] = useState(2)
  const [slopeS, setSlopeS] = useState(1)

  // Qd = intercept - slopeD * P
  // Qs = slopeS * P
  const Qd = Math.max(0, intercept - slopeD * pw)
  const Qs = Math.max(0, slopeS * pw)
  const isImport = Qd > Qs
  const isExport = Qs > Qd
  const tradeVol = Math.abs(Qd - Qs)

  // Domestic equilibrium (no trade)
  const Peq = intercept / (slopeD + slopeS)
  const Qeq = slopeS * Peq

  const data = Array.from({ length: 21 }, (_, i) => {
    const P = i * 10
    return {
      P,
      ביקוש: Math.max(0, intercept - slopeD * P),
      היצע: Math.max(0, slopeS * P),
    }
  })

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 1 — כלכלה פתוחה: יבוא ויצוא</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          ['מחיר עולמי P_w', pw, setPw, 10, 190, 5],
          ['מקסימום ביקוש', intercept, setIntercept, 100, 400, 10],
          ['שיפוע ביקוש', slopeD, setSlopeD, 1, 4, 0.5],
          ['שיפוע היצע', slopeS, setSlopeS, 0.5, 3, 0.5],
        ].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-1">{label as string}: {(val as number).toFixed(1)}</p>
            <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#64748b' }} /></div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ביקוש" hide />
          <YAxis label={{ value: 'P', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <ReferenceLine y={pw} stroke="#f97316" strokeWidth={2} strokeDasharray="6 3" label={{ value: `P_w=${pw}`, position: 'right', fill: '#f97316', fontSize: 12 }} />
          <ReferenceLine y={Peq} stroke="#22c55e" strokeWidth={1} strokeDasharray="4 4" label={{ value: `P*=${Peq.toFixed(0)}`, position: 'left', fill: '#22c55e', fontSize: 11 }} />
          <Line type="monotone" dataKey="ביקוש" stroke="#3b82f6" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="היצע" stroke="#ef4444" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
          <p className="font-bold text-blue-700">Qd = {Qd.toFixed(0)}</p><p className="text-xs">כמות מבוקשת</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3">
          <p className="font-bold text-red-700">Qs = {Qs.toFixed(0)}</p><p className="text-xs">כמות מוצעת</p>
        </div>
        <div className={`rounded-xl p-3 border ${isImport ? 'bg-orange-50 border-orange-200' : isExport ? 'bg-purple-50 border-purple-200' : 'bg-green-50 border-green-200'}`}>
          <p className={`font-bold ${isImport ? 'text-orange-700' : isExport ? 'text-purple-700' : 'text-green-700'}`}>
            {isImport ? `יבוא: ${tradeVol.toFixed(0)}` : isExport ? `יצוא: ${tradeVol.toFixed(0)}` : 'שוויון'}
          </p>
          <p className="text-xs">מצב הסחר</p>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-200 p-3">
          <p className="font-bold text-green-700">P* = {Peq.toFixed(1)}</p><p className="text-xs">שיווי משקל מקומי</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 bg-white rounded-lg p-2 border">
        כלל: P_w &lt; P* → יבוא (ביקוש מקומי &gt; היצע המקומי). P_w &gt; P* → יצוא (היצע מקומי &gt; ביקוש מקומי).
      </p>
    </div>
  )
}

function WelfareSim() {
  const [pw, setPw] = useState(50)

  // Fixed demand: Qd = 200 - 2P, supply: Qs = P - 10 (so Qs=0 when P<10)
  const Qd = Math.max(0, 200 - 2 * pw)
  const Qs = Math.max(0, pw - 10)
  const isImport = Qd > Qs
  const importVol = Math.max(0, Qd - Qs)
  const exportVol = Math.max(0, Qs - Qd)

  // Autarky equilibrium: 200-2P = P-10 → 210 = 3P → P*=70, Q*=60
  const Peq = 70, Qeq = 60

  // CS under autarky: ½*(max_P - P*)*Q* ... max_P from Qd=0 → P=100
  const maxP = 100
  const CS_autarky = 0.5 * (maxP - Peq) * Qeq
  const PS_autarky = 0.5 * (Peq - 10) * Qeq

  // Under trade (import): CS = ½*(maxP - pw)*Qd, PS = ½*(pw-10)*Qs
  const CS_trade = isImport ? 0.5 * (maxP - pw) * Qd : 0.5 * (maxP - pw) * Qd
  const PS_trade = isImport ? (Qs > 0 ? 0.5 * (pw - 10) * Qs : 0) : 0.5 * (pw - 10) * Qs

  const deltaCS = CS_trade - CS_autarky
  const deltaPS = PS_trade - PS_autarky
  const deltaW = deltaCS + deltaPS

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 2 — רווחה: מגולגד לסחר חופשי</h4>
      <p className="text-xs text-slate-600">פונקציות קבועות: Qd = 200−2P, Qs = P−10. P* = 70, Q* = 60</p>
      <div className="bg-white rounded-xl p-3 border border-slate-200">
        <p className="text-xs font-semibold text-slate-700 mb-1">מחיר עולמי P_w: {pw}</p>
        <div dir="ltr"><input type="range" min={15} max={100} step={5} value={pw}
          onChange={e => setPw(+e.target.value)} style={{ width: '100%', accentColor: '#64748b' }} /></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
          <p className="font-bold text-blue-700">ΔRCS = {deltaCS.toFixed(0)} ₪</p>
          <p className="text-xs">{deltaCS >= 0 ? '↑ צרכנים מרוויחים' : '↓ צרכנים מפסידים'}</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3">
          <p className="font-bold text-red-700">ΔPS = {deltaPS.toFixed(0)} ₪</p>
          <p className="text-xs">{deltaPS >= 0 ? '↑ יצרנים מרוויחים' : '↓ יצרנים מפסידים'}</p>
        </div>
        <div className={`rounded-xl p-3 border ${deltaW >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`font-bold ${deltaW >= 0 ? 'text-green-700' : 'text-red-700'}`}>ΔW = {deltaW.toFixed(0)} ₪</p>
          <p className="text-xs">שינוי ברווחה כוללת</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-100 p-3">
          <p className="font-semibold text-xs mb-1">מצב: {isImport ? `יבוא = ${importVol.toFixed(0)} יח'` : `יצוא = ${exportVol.toFixed(0)} יח'`}</p>
          <p className="text-xs text-slate-500">P_w={pw} vs P*={Peq} → {pw < Peq ? 'P_w < P* = יבוא' : pw > Peq ? 'P_w > P* = יצוא' : 'P_w = P* = אוטרקיה'}</p>
        </div>
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3">
          <p className="text-xs font-semibold text-yellow-800">📌 כלל מפתח</p>
          <p className="text-xs text-yellow-700 mt-1">סחר חופשי תמיד מגדיל ΔW כולל — גם אם קבוצה אחת מפסידה!</p>
        </div>
      </div>
    </div>
  )
}

function ComparativeAdvantageSim() {
  const [laborA_X, setLaborA_X] = useState(2)
  const [laborA_Y, setLaborA_Y] = useState(6)
  const [laborB_X, setLaborB_X] = useState(3)
  const [laborB_Y, setLaborB_Y] = useState(4)

  // Opportunity cost: for country A producing X, give up Y
  const ocA_X = laborA_X / laborA_Y // workers for X per Y unit
  const ocA_Y = laborA_Y / laborA_X
  const ocB_X = laborB_X / laborB_Y
  const ocB_Y = laborB_Y / laborB_X

  // Comparative advantage: lower opportunity cost
  const A_advantageX = ocA_X < ocB_X
  const A_advantageY = ocA_Y < ocB_Y

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 3 — יתרון יחסי</h4>
      <p className="text-xs text-slate-600">כמה עובדים נדרשים לייצור יחידה אחת?</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="font-semibold text-sm text-blue-700">מדינה A</p>
          {[['X (עובדים)', laborA_X, setLaborA_X], ['Y (עובדים)', laborA_Y, setLaborA_Y]].map(([label, val, setter]) => (
            <div key={label as string} className="bg-white rounded-xl p-2 border">
              <p className="text-xs font-semibold mb-1">{label as string}: {val as number}</p>
              <div dir="ltr"><input type="range" min={1} max={10} step={1} value={val as number}
                onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#3b82f6' }} /></div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-sm text-red-700">מדינה B</p>
          {[['X (עובדים)', laborB_X, setLaborB_X], ['Y (עובדים)', laborB_Y, setLaborB_Y]].map(([label, val, setter]) => (
            <div key={label as string} className="bg-white rounded-xl p-2 border">
              <p className="text-xs font-semibold mb-1">{label as string}: {val as number}</p>
              <div dir="ltr"><input type="range" min={1} max={10} step={1} value={val as number}
                onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#ef4444' }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-white border p-3">
          <p className="font-bold text-sm mb-2">עלויות הזדמנות</p>
          <div className="space-y-1 text-xs">
            <p>A: עלות X = {(laborA_X/laborA_Y).toFixed(2)} יח' Y | עלות Y = {(laborA_Y/laborA_X).toFixed(2)} יח' X</p>
            <p>B: עלות X = {(laborB_X/laborB_Y).toFixed(2)} יח' Y | עלות Y = {(laborB_Y/laborB_X).toFixed(2)} יח' X</p>
          </div>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-200 p-3">
          <p className="font-bold text-sm text-green-700 mb-2">יתרון יחסי</p>
          <div className="space-y-1 text-xs text-green-800">
            <p>X: {A_advantageX ? 'מדינה A' : A_advantageX === false ? 'מדינה B' : 'שווה'} (עלות נמוכה יותר)</p>
            <p>Y: {A_advantageY ? 'מדינה A' : 'מדינה B'} (עלות נמוכה יותר)</p>
            {A_advantageX === A_advantageY && <p className="text-orange-700 font-semibold">⚠️ אותה מדינה — בדוק ערכים!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

const MCQ: McqQuestion[] = [
  {
    id: 'oe-q1',
    question: 'המחיר העולמי P_w = 40. שיווי משקל מקומי P* = 70. מה יקרה כשהמדינה תפתח לסחר?',
    options: ['המדינה תייצא', 'המדינה תייבא', 'אין סחר — שוויון מחירים', 'לא ניתן לדעת'],
    correct: 1,
    explanation: 'P_w = 40 < P* = 70. המחיר העולמי נמוך ממחיר השיווי משקל המקומי → מוצר זול יותר בחו"ל → נייבא. Qd מקומי > Qs מקומי בP_w.'
  },
  {
    id: 'oe-q2',
    question: 'פתיחה לסחר חופשי (יבוא): מה קורה לעודף הצרכן ולעודף היצרן?',
    options: ['שניהם עולים', 'שניהם יורדים', 'עודף צרכן עולה, עודף יצרן יורד', 'עודף צרכן יורד, עודף יצרן עולה'],
    correct: 2,
    explanation: 'יבוא מוריד מחיר. מחיר נמוך → צרכנים מרוויחים יותר (CS↑). מחיר נמוך → יצרנים מקבלים פחות (PS↓). אבל הרווחה הכוללת CS+PS עולה!'
  },
  {
    id: 'oe-q3',
    question: "מדינה A מייצרת יח' X ב-2 שעות ויח' Y ב-6 שעות. מדינה B: X ב-3 שעות, Y ב-4 שעות. למי יתרון יחסי בX?",
    options: ['מדינה A (עלות 2/6=1/3 Y)', 'מדינה B (עלות 3/4=0.75 Y)', 'לשתיהן יתרון שווה', 'אי אפשר לדעת'],
    correct: 0,
    explanation: 'עלות הזדמנות של X: A = 2/6 = 0.33Y, B = 3/4 = 0.75Y. A זולה יותר → ל-A יתרון יחסי בX. B תתמחה ב-Y (עלות Y: B=4/3=1.33X < A=6/2=3X).'
  },
  {
    id: 'oe-q4',
    question: 'כמות היבוא היא:',
    options: ['Qd + Qs', 'Qd - Qs (כאשר Qd > Qs)', 'Qs - Qd', 'P_w × Qd'],
    correct: 1,
    explanation: 'יבוא = Qd − Qs. כאשר המחיר העולמי נמוך, הצרכנים מבקשים יותר (Qd) מהיצרנים המקומיים מוכנים להציע (Qs). ההפרש מגיע מיבוא.'
  },
  {
    id: 'oe-q5',
    question: 'איזה מהבאים נכון לגבי סחר חופשי?',
    options: [
      'הרווחה הכוללת תמיד יורדת',
      'הרווחה הכוללת עולה — גם אם קבוצה מפסידה',
      'כל הקבוצות מרוויחות',
      'רק קבוצת היצרנים מרוויחה'
    ],
    correct: 1,
    explanation: 'סחר חופשי יוצר "עלייה נטו" ברווחה — הרווח של המרוויחים גדול מהפסד המפסידים. אבל בפועל כן יש מפסידים (יצרנים ביבוא, צרכנים ביצוא).'
  },
]

const EASY: Exercise[] = [
  {
    id: 'oe-e1',
    question: 'P* מקומי = 80. P_w = 60. האם המדינה תייבא או תייצא? למה?',
    answer: 'תייבא. P_w = 60 < P* = 80 → מוצר זול יותר בחו"ל. בP_w הביקוש המקומי גדול מההיצע המקומי → הפרש = יבוא.'
  },
  {
    id: 'oe-e2',
    question: 'בשוק פתוח: P_w=50. Qd=300, Qs=100. מה כמות היבוא?',
    answer: 'יבוא = Qd − Qs = 300 − 100 = 200 יחידות.'
  },
  {
    id: 'oe-e3',
    question: 'פתיחה לסחר מורידה מחיר מ-100 ל-70. מה קורה לעודף הצרכן?',
    answer: 'עודף הצרכן עולה — מחיר נמוך יותר טוב לצרכנים. שטח מתחת לעקום הביקוש ומעל המחיר גדל.'
  },
  {
    id: 'oe-e4',
    question: 'מהו יתרון יחסי? תן דוגמה פשוטה.',
    answer: 'יתרון יחסי = יכולת לייצר מוצר בעלות הזדמנות נמוכה יותר. דוגמה: ישראל מוותרת על פחות כדי לייצר תוכנה, פורטוגל מוותרת על פחות כדי לייצר יין → כל אחת מתמחה במה שעלות ההזדמנות שלה נמוכה יותר.'
  },
  {
    id: 'oe-e5',
    question: 'מדינה פותחת לסחר ומייצאת. מה קורה למחיר המקומי? מי מרוויח ומי מפסיד?',
    answer: 'יצוא → P מקומי עולה ל-P_w. יצרנים מרוויחים (מוכרים בP גבוה יותר). צרכנים מפסידים (משלמים יותר). הרווחה הכוללת עולה.'
  },
]

const MEDIUM: Exercise[] = [
  {
    id: 'oe-m1',
    question: 'Qd = 200 − 2P, Qs = P − 20. P_w = 50. חשב: P*, Q*, כמות יבוא, שינוי ב-CS ו-PS.',
    answer: `שוויון משקל: 200−2P = P−20 → 220=3P → P*≈73.3, Q*≈53.3.
בP_w=50: Qd=200−100=100, Qs=50−20=30. יבוא=70.
ΔCS: מחיר ירד מ-73.3 ל-50 → CS עולה. ΔPS: P ירד → PS יורד.
(חישוב מדויק: CS=½×(maxP−P)×Qd, PS=½×(P−20)×Qs)`
  },
  {
    id: 'oe-m2',
    question: "A מייצרת: X ב-3ש' וY ב-9ש'. B מייצרת: X ב-2ש' וY ב-4ש'. למי יתרון יחסי בכל מוצר?",
    answer: `עלות הזדמנות X: A=3/9=1/3Y, B=2/4=0.5Y. A זולה יותר ב-X → A מתמחה ב-X.
עלות הזדמנות Y: A=9/3=3X, B=4/2=2X. B זולה יותר ב-Y → B מתמחה ב-Y.
שים לב: לB יתרון מוחלט בשניהם (פחות שעות) אבל לא יתרון יחסי בX.`
  },
  {
    id: 'oe-m3',
    question: 'מדינה עם Qd=300−3P, Qs=2P−50. P_w=80. חשב יצוא/יבוא.',
    answer: `P*: 300−3P=2P−50 → 350=5P → P*=70, Q*=90.
P_w=80 > P*=70 → יצוא.
בP_w=80: Qd=300−240=60, Qs=160−50=110. יצוא=110−60=50 יח'.`
  },
  {
    id: 'oe-m4',
    question: 'הסבר מדוע סחר חופשי מגדיל רווחה כוללת גם כאשר יצרנים מפסידים.',
    answer: `סחר מוריד מחיר (יבוא): עלייה ב-CS > ירידה ב-PS. ה"טריז" של רווחה כוללת נטו = עלייה נטו.
כמויות מיובאות מוצרכות ביעילות: מחיר שוק = ערך שולי לצרכן.
גרפית: שטח הרווח החדש לצרכנים גדול מהשטח שנלקח מהיצרנים (משולש Harberger חיובי).`
  },
  {
    id: 'oe-m5',
    question: 'מה ההבדל בין יתרון מוחלט ליתרון יחסי? מדוע הסחר מתבסס על יחסי?',
    answer: `יתרון מוחלט: מייצר יותר באותם משאבים. יחסי: עלות הזדמנות נמוכה יותר (מוותר על פחות).
הסחר מתבסס על יחסי: גם מדינה נחשלת בכל מוצר (אין יתרון מוחלט) תוכל לסחור — היא מתמחה במה שה"הפסד" שלה קטן יותר. דוגמה: ריקארדו (אנגליה/פורטוגל).`
  },
]

const HARD: Exercise[] = [
  {
    id: 'oe-h1',
    question: `(מבחן) שוק מקומי: Qd=400−4P, Qs=2P−80. מחיר עולמי P_w=60.
(א) מה שיווי משקל ללא סחר?
(ב) האם תהיה יבוא או יצוא?
(ג) חשב כמות יבוא/יצוא.
(ד) חשב שינוי ב-CS ו-PS.`,
    answer: `(א) 400−4P=2P−80 → 480=6P → P*=80, Q*=2×80−80=80.
(ב) P_w=60 < P*=80 → יבוא.
(ג) בP_w=60: Qd=400−240=160, Qs=2×60−80=40. יבוא=160−40=120 יח'.
(ד) CS_autarky=½×(100−80)×80=800. CS_trade=½×(100−60)×160=3200. ΔCS=+2400.
PS_autarky=½×(80−40)×80=1600. PS_trade=½×(60−40)×40=400. ΔPS=−1200.
ΔW=2400−1200=+1200 (רווחה עולה).`
  },
  {
    id: 'oe-h2',
    question: `A מייצרת יחידות: (L=1 → X=5,Y=0), (L=2 → X=0,Y=8). B: (L=1 → X=3,Y=0), (L=2 → X=0,Y=6).
(א) חשב עלויות הזדמנות.
(ב) מי מתמחה במה?
(ג) מה יהיה מחיר יחסי של X לY בסחר?`,
    answer: `A עם 2 עובדים: X=5, Y=8. עלות X (ב-A) = 8/5=1.6Y. עלות X (ב-B) = 6/3=2Y.
A: עלות X = 1.6Y < B: 2Y → A יתרון יחסי ב-X.
B: עלות Y = 3/6=0.5X < A: 5/8=0.625X → B יתרון יחסי ב-Y.
A מתמחה ב-X, B ב-Y.
מחיר יחסי בסחר (P_x/P_y): בין 1.6 ל-2 (בין עלויות שתי המדינות).`
  },
  {
    id: 'oe-h3',
    question: `(אחידות) הביקוש הכולל בשוק מורכב משני סוגי צרכנים: A: Qd_A=120−2P, B: Qd_B=80−P (כשP≤80). ההיצע: Qs=3P−30. P_w=50.
(א) בנה ביקוש מצרפי.
(ב) P* ו-Q* ללא סחר.
(ג) יבוא/יצוא עם סחר.`,
    answer: `(א) ביקוש מצרפי (לP≤80): Qd=120−2P+80−P=200−3P.
(ב) 200−3P=3P−30 → 230=6P → P*=38.3, Q*=200−115=85 (בערך).
(ג) P_w=50 > P*=38.3 → יצוא.
בP_w=50: Qd=200−150=50, Qs=150−30=120. יצוא=120−50=70 יח'.`
  },
]

export function Chapter8OpenEconomy() {
  return (
    <ChapterLayout number={8} title="כלכלה פתוחה וסחר חופשי" subtitle="יבוא, יצוא, יתרון יחסי, רווחה" color="#a855f7" examWeight="~15% מהמבחן — חשוב">
      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">8.1 אוטרקיה מול סחר חופשי</h3>
          <div className="text-sm space-y-2">
            <p><strong>אוטרקיה</strong> = כלכלה סגורה. שיווי משקל: P* ו-Q* נקבעים אך ורק מהביקוש וההיצע המקומי.</p>
            <p><strong>כלכלה פתוחה</strong>: המדינה לוקחת את המחיר העולמי P_w כנתון (price taker). המדינה קטנה → לא משפיעה על P_w.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <p className="font-bold text-blue-700 text-sm">יבוא: P_w &lt; P*</p>
              <p className="text-xs mt-1">המחיר העולמי נמוך מהמקומי → מוצר זול בחו"ל → מייבאים.</p>
              <p className="text-xs mt-1 font-semibold">יבוא = Qd(P_w) − Qs(P_w)</p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-3">
              <p className="font-bold text-red-700 text-sm">יצוא: P_w &gt; P*</p>
              <p className="text-xs mt-1">המחיר העולמי גבוה מהמקומי → יצרנים מעדיפים למכור בחו"ל.</p>
              <p className="text-xs mt-1 font-semibold">יצוא = Qs(P_w) − Qd(P_w)</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">8.2 ניתוח רווחה: מי מרוויח ומי מפסיד?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-blue-700">מקרה יבוא (P_w &lt; P*):</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>מחיר יורד ל-P_w</li>
                <li>צרכנים: CS עולה גדול</li>
                <li>יצרנים: PS יורד</li>
                <li>ΔW = ΔCS + ΔPS &gt; 0 (רווחה עולה!)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-red-700">מקרה יצוא (P_w &gt; P*):</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>מחיר עולה ל-P_w</li>
                <li>יצרנים: PS עולה גדול</li>
                <li>צרכנים: CS יורד</li>
                <li>ΔW = ΔCS + ΔPS &gt; 0 (רווחה עולה!)</li>
              </ul>
            </div>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-200 p-3">
            <p className="font-bold text-green-700 text-sm">📌 מסקנה חשובה</p>
            <p className="text-xs mt-1">סחר חופשי תמיד מגדיל את הרווחה הכוללת (CS+PS) — גם אם קבוצה מסוימת מפסידה. הרווח של המרוויחים גדול מהפסד המפסידים.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">8.3 יתרון יחסי (Ricardo)</h3>
          <div className="text-sm space-y-3">
            <p><strong>יתרון מוחלט</strong>: מדינה שמייצרת <em>יותר</em> מאותם משאבים (לא רלוונטי לסחר).</p>
            <p><strong>יתרון יחסי</strong>: מדינה שמייצרת מוצר בעלות הזדמנות <em>נמוכה יותר</em> — זה הבסיס לסחר!</p>
            <div className="rounded-xl bg-slate-50 border p-3">
              <p className="font-semibold text-xs mb-2">דוגמה — שעות עבודה ליחידה:</p>
              <table className="w-full text-xs text-center">
                <thead><tr className="font-bold"><th>מדינה</th><th>יין (שעות)</th><th>בד (שעות)</th></tr></thead>
                <tbody>
                  <tr><td className="py-1">פורטוגל</td><td>80</td><td>90</td></tr>
                  <tr><td className="py-1">אנגליה</td><td>120</td><td>100</td></tr>
                </tbody>
              </table>
              <p className="text-xs mt-2">עלות יין בפורטוגל = 80/90 = 0.89 בד. בסחר: פורטוגל → יין, אנגליה → בד.</p>
            </div>
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-xs font-semibold mb-1">עלות הזדמנות של מוצר X במדינה A:</p>
              <MathText math="\text{OC}_X^A = \frac{\text{שעות לX}}{\text{שעות לY}}" display />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות</h2>
        <OpenEconomySim />
        <WelfareSim />
        <ComparativeAdvantageSim />
      </section>

      <section><McqSection questions={MCQ} topicId="open-economy" /></section>
      <section><ExerciseSection easy={EASY} medium={MEDIUM} hard={HARD} topicId="open-economy" /></section>
    </ChapterLayout>
  )
}
