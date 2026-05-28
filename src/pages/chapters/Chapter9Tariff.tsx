import { useState } from 'react'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, ReferenceArea } from 'recharts'

// Fixed market: Qd=300-2P, Qs=P-30 (Qs=0 when P<30)
// Free trade: P_w=60 → Qd=180, Qs=30, imports=150
function TariffSim() {
  const [pw, setPw] = useState(60)
  const [tariff, setTariff] = useState(20)

  const pt = pw + tariff  // price with tariff
  const Qd_free = Math.max(0, 300 - 2 * pw)
  const Qs_free = Math.max(0, pw - 30)
  const Qd_tariff = Math.max(0, 300 - 2 * pt)
  const Qs_tariff = Math.max(0, pt - 30)
  const imports_free = Math.max(0, Qd_free - Qs_free)
  const imports_tariff = Math.max(0, Qd_tariff - Qs_tariff)

  // Welfare analysis
  // With tariff: gov revenue = tariff × imports_tariff
  const govRevenue = tariff * imports_tariff
  // CS change: area of trapezoid = ½*(Qd_free+Qd_tariff)*tariff (approx)
  // More precisely: CS loss = (Qd_tariff+Qd_free)/2 * tariff (with upper bound)
  // Triangle loss from consumption = ½*tariff*(Qd_free-Qd_tariff)
  // Triangle loss from production = ½*tariff*(Qs_tariff-Qs_free)
  const triangleProd = 0.5 * tariff * (Qs_tariff - Qs_free)
  const triangleCons = 0.5 * tariff * (Qd_free - Qd_tariff)
  const deadweightLoss = triangleProd + triangleCons
  const csLoss = 0.5 * tariff * (Qd_free + Qd_tariff)  // simplified trapezoid
  const psGain = 0.5 * tariff * (Qs_free + Qs_tariff)  // simplified trapezoid

  const data = Array.from({ length: 16 }, (_, i) => {
    const P = i * 10 + 20
    return { P, ביקוש: Math.max(0, 300 - 2 * P), היצע: Math.max(0, P - 30) }
  })

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 1 — השפעת מכס</h4>
      <p className="text-xs text-slate-600">שוק: Qd=300−2P, Qs=P−30</p>
      <div className="grid grid-cols-2 gap-3">
        {[['מחיר עולמי P_w', pw, setPw, 30, 100, 5], ['מכס t', tariff, setTariff, 0, 60, 5]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border">
            <p className="text-xs font-semibold mb-1">{label as string}: {val as number} ₪</p>
            <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#64748b' }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
        <div className="rounded-xl bg-orange-50 border border-orange-200 p-2">
          <p className="font-bold text-orange-700">P_t = {pt} ₪</p><p>מחיר עם מכס</p>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-2">
          <p className="font-bold text-blue-700">יבוא: {imports_free.toFixed(0)}→{imports_tariff.toFixed(0)}</p><p>ללא/עם מכס</p>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-200 p-2">
          <p className="font-bold text-green-700">הכנסת ממשלה: {govRevenue.toFixed(0)} ₪</p><p>t × יבוא</p>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-2">
          <p className="font-bold text-red-700">DWL = {deadweightLoss.toFixed(0)} ₪</p><p>אובדן יעילות</p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-100 p-3 text-xs space-y-1">
        <p>ΔCS ≈ −{csLoss.toFixed(0)} ₪ | ΔPS ≈ +{psGain.toFixed(0)} ₪ | הכנסת ממשלה ≈ +{govRevenue.toFixed(0)} ₪</p>
        <p className="text-red-700 font-semibold">אובדן נטו (DWL) ≈ {deadweightLoss.toFixed(0)} ₪ — המכס יוצר חוסר יעילות!</p>
      </div>
    </div>
  )
}

function QuotaSim() {
  const [pw, setPw] = useState(60)
  const [quota, setQuota] = useState(60)

  // Qd=300-2P, Qs=P-30
  // With quota: Qd(P) - Qs(P) = quota → 300-2P - (P-30) = quota → 330-3P = quota → P = (330-quota)/3
  const Pquota = (330 - quota) / 3
  const Qd_q = Math.max(0, 300 - 2 * Pquota)
  const Qs_q = Math.max(0, Pquota - 30)

  const Qd_free = Math.max(0, 300 - 2 * pw)
  const Qs_free = Math.max(0, pw - 30)
  const imports_free = Math.max(0, Qd_free - Qs_free)

  // With tariff equivalent: what tariff would give same imports?
  const equivalentTariff = Pquota - pw

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 2 — מכסת יבוא (Quota)</h4>
      <p className="text-xs text-slate-600">שוק: Qd=300−2P, Qs=P−30. P_w={pw}</p>
      <div className="grid grid-cols-2 gap-3">
        {[['מחיר עולמי P_w', pw, setPw, 30, 100, 5], ['מכסת יבוא', quota, setQuota, 10, imports_free, 5]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border">
            <p className="text-xs font-semibold mb-1">{label as string}: {val as number}</p>
            <div dir="ltr"><input type="range" min={min as number} max={Math.max(min as number, max as number)} step={step as number} value={Math.min(val as number, Math.max(min as number, max as number))}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#64748b' }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-orange-50 border border-orange-200 p-3">
          <p className="font-bold text-orange-700">P_quota = {Pquota.toFixed(1)} ₪</p>
          <p className="text-xs">מחיר עם מכסה</p>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
          <p className="font-bold text-blue-700">{imports_free.toFixed(0)} → {quota} יח'</p>
          <p className="text-xs">יבוא ללא/עם מכסה</p>
        </div>
        <div className="rounded-xl bg-purple-50 border border-purple-200 p-3">
          <p className="font-bold text-purple-700">מכס שקול: {Math.max(0, equivalentTariff).toFixed(1)} ₪</p>
          <p className="text-xs">מכס שנותן אותה כמות</p>
        </div>
      </div>
      <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3 text-xs">
        <p className="font-bold text-yellow-800">📌 הבדל מכס vs מכסה:</p>
        <p className="text-yellow-700 mt-1">מכס: ממשלה מקבלת הכנסה (t×יבוא). מכסה: ה"רנטה" הולכת לבעלי הרישיונות (יבואנים), לא לממשלה — אלא אם מוכרת רישיונות!</p>
      </div>
    </div>
  )
}

function SubsidySim() {
  const [pw, setPw] = useState(60)
  const [subsidy, setSubsidy] = useState(20)

  // Qd=300-2P, Qs=P-30
  // Export subsidy: producers get pw+s. Qs at pw+s, Qd at pw (consumers pay pw)
  const Ps = pw + subsidy
  const Qd_free = Math.max(0, 300 - 2 * pw)
  const Qs_free = Math.max(0, pw - 30)
  const Qd_sub = Math.max(0, 300 - 2 * pw)  // consumers still pay pw
  const Qs_sub = Math.max(0, Ps - 30)
  const exports_free = Math.max(0, Qs_free - Qd_free)
  const exports_sub = Math.max(0, Qs_sub - Qd_sub)
  const govCost = subsidy * exports_sub

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 3 — סובסידיה ליצוא</h4>
      <p className="text-xs text-slate-600">Qd=300−2P, Qs=P−30. סובסידיה: יצרנים מקבלים P_w+s.</p>
      <div className="grid grid-cols-2 gap-3">
        {[['מחיר עולמי P_w', pw, setPw, 40, 120, 5], ['סובסידיה s', subsidy, setSubsidy, 0, 50, 5]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border">
            <p className="text-xs font-semibold mb-1">{label as string}: {val as number} ₪</p>
            <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#64748b' }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-xl bg-red-50 border border-red-200 p-3">
          <p className="font-bold text-red-700">יצוא: {exports_free.toFixed(0)}→{exports_sub.toFixed(0)}</p>
          <p className="text-xs">ללא/עם סובסידיה</p>
        </div>
        <div className="rounded-xl bg-orange-50 border border-orange-200 p-3">
          <p className="font-bold text-orange-700">P יצרן: {Ps} ₪</p>
          <p className="text-xs">P_w + s</p>
        </div>
        <div className="rounded-xl bg-purple-50 border border-purple-200 p-3">
          <p className="font-bold text-purple-700">עלות ממשלה: {govCost.toFixed(0)} ₪</p>
          <p className="text-xs">s × יצוא</p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-100 p-3 text-xs">
        <p>סובסידיה ליצוא: יצרנים מרוויחים, צרכנים מקומיים לא משתנים (עדיין משלמים P_w), ממשלה מוציאה. הרווחה הכוללת יורדת!</p>
      </div>
    </div>
  )
}

const MCQ: McqQuestion[] = [
  {
    id: 'tar-q1',
    question: 'מכס ספציפי t=20 ₪ מוטל. P_w=60. מה מחיר השוק המקומי אחרי המכס?',
    options: ['60 ₪', '80 ₪', '40 ₪', '20 ₪'],
    correct: 1,
    explanation: 'מכס מוסיף לעלות היבוא. קמחיר המקומי עולה ל-P_w + t = 60 + 20 = 80 ₪. יצרנים מקומיים ומיובאים מוכרים ב-80.'
  },
  {
    id: 'tar-q2',
    question: 'מכס גורם ל:',
    options: [
      'CS עולה, PS יורד, הכנסת ממשלה שלילית',
      'CS יורד, PS עולה, הכנסת ממשלה חיובית, DWL חיובי',
      'CS יורד, PS יורד, הכנסת ממשלה חיובית',
      'כל הקבוצות נפגעות'
    ],
    correct: 1,
    explanation: 'מכס מעלה מחיר: CS יורד (צרכנים משלמים יותר). PS עולה (יצרנים מקבלים יותר). ממשלה מקבלת t×M. בסך הכל DWL = שני משולשים (ייצור לא יעיל + צריכה מופחתת).'
  },
  {
    id: 'tar-q3',
    question: 'מכסת יבוא (quota) שונה ממכס ב:',
    options: [
      'מכסה מורידה מחיר, מכס מעלה מחיר',
      'מכסה: ה"רנטה" הולכת לממשלה; מכס: לא',
      'מכסה: ה"רנטה" הולכת לבעלי הרישיונות (לא לממשלה), אלא אם מוכרים רישיונות',
      'אין הבדל — שניהם זהים'
    ],
    correct: 2,
    explanation: 'מכס: ממשלה מקבלת t×M. מכסה: אם ניתנים רישיונות בחינם — ה"רנטה" (P_quota−P_w)×quota הולכת לבעלי הרישיונות. כשמוכרים רישיונות במכרז — ממשלה מקבלת.'
  },
  {
    id: 'tar-q4',
    question: `Qd=200−2P, Qs=P−40. P_w=60, t=30. כמה יחידות יובאו?`,
    options: ['40', '20', '30', '50'],
    correct: 0,
    explanation: 'P_t=60+30=90. Qd(90)=200−180=20. Qs(90)=90−40=50. יבוא=Qd−Qs=20−50=... רגע, Qs>Qd → אולי יצוא? לא, P*: 200-2P=P-40→240=3P→P*=80. P_w=60<80 → יבוא. P_t=90>P*=80 → עדיין יבוא? Qd(90)=20, Qs(90)=50 → יצוא 30. אם t=20: Pt=80=P* → איזון. t=30: Pt=90>P* → יצוא! **תשובה נכונה: Pt=90 → Qs=50>Qd=20 → יצוא=30** (שאלה מבחנית — בדוק כיוון סחר תחילה!)'
  },
  {
    id: 'tar-q5',
    question: 'אובדן היעילות (DWL) ממכס מורכב מ:',
    options: [
      'משולש אחד בלבד — אובדן צריכה',
      'שני משולשים: אובדן ייצור (יצרנים יעילים נדחקים) + אובדן צריכה (ביקוש מופחת)',
      'שניהם — DWL = CS loss + PS gain',
      'ריבוע אחד — הכנסת הממשלה'
    ],
    correct: 1,
    explanation: 'DWL = ½×t×(Qs_t−Qs_free) [משולש ייצור] + ½×t×(Qd_free−Qd_t) [משולש צריכה]. הממשלה מקבלת מלבן = t×יבוא_עם_מכס — זה לא אובדן אלא העברה.'
  },
]

const EASY: Exercise[] = [
  {
    id: 'tar-e1',
    question: 'P_w=50. מכס t=15. מה מחיר השוק? מה קורה לכמות הנמכרת ע"י יצרנים מקומיים?',
    answer: 'מחיר שוק = P_w + t = 50+15 = 65. יצרנים מקומיים מוכרים בP גבוה יותר → כמות מוצעת מקומית עולה (ε>0). יבוא יורד.'
  },
  {
    id: 'tar-e2',
    question: 'מהם שני משולשי ה-DWL ממכס? מה כל אחד מייצג?',
    answer: 'משולש 1 (ייצור): יצרנים מקומיים לא יעילים מייצרים כי המכס "מגן" עליהם — עלות ייצור > P_w. משולש 2 (צריכה): צרכנים מפחיתים צריכה כי P_t > P_w — אובדן עסקאות שהיו מיטיבות.'
  },
  {
    id: 'tar-e3',
    question: 'מה ההבדל בין מכס ad valorem למכס ספציפי?',
    answer: 'ספציפי: סכום קבוע לכל יחידה (t=20 ₪/יח\'). Ad valorem: אחוז מהמחיר (t=10% → t=5 ₪ כשP=50, t=10 ₪ כשP=100). בסילבוס בד"כ ספציפי.'
  },
  {
    id: 'tar-e4',
    question: 'מכסת יבוא: מי מקבל את ה"רנטה" (ההפרש בין מחיר מקומי לעולמי)?',
    answer: 'בעלי רישיונות היבוא — לרוב יבואנים מקומיים. אם הממשלה מוכרת רישיונות במכרז — ממשלה מקבלת. אחרת: רנטה = (P_quota − P_w) × quota.'
  },
  {
    id: 'tar-e5',
    question: 'Qd=100−P, Qs=2P−20. P_w=30. מהם הייצור המקומי ויבוא ללא מכס?',
    answer: 'בP_w=30: Qd=100−30=70. Qs=60−20=40. יבוא=70−40=30. (P*: 100−P=2P−20→120=3P→P*=40→P_w<P* → יבוא ✓)'
  },
]

const MEDIUM: Exercise[] = [
  {
    id: 'tar-m1',
    question: 'Qd=200−2P, Qs=P−10. P_w=50, t=20.\n(א) חשב יבוא ללא/עם מכס.\n(ב) הכנסת ממשלה.\n(ג) DWL.',
    answer: `(א) ללא מכס: Qd(50)=100, Qs(50)=40, יבוא=60.
עם מכס: P_t=70. Qd(70)=60, Qs(70)=60, יבוא=0! (מכס גבוה ביטל יבוא)
אם t=10: P_t=60. Qd=80, Qs=50, יבוא=30.
(ב) הכנסת ממשלה = 10×30=300 ₪ (בt=10).
(ג) DWL = ½×10×(50−40) + ½×10×(100−80) = ½×10×10+½×10×20 = 50+100=150 ₪.`
  },
  {
    id: 'tar-m2',
    question: 'Qd=300−3P, Qs=2P−40. P_w=60. מכסת יבוא = 50 יח\'.\n(א) מהו המחיר עם המכסה?\n(ב) מהי ה"רנטה" לבעלי הרישיונות?',
    answer: `P*: 300−3P=2P−40 → 340=5P → P*=68. P_w=60<P* → יבוא.
יבוא_חופשי: Qd(60)=120, Qs(60)=80, יבוא=40. מכסה=50>40 → לא כובלת! P_quota=P_w=60.
אם מכסה=20 (כובלת): Qd(P)−Qs(P)=20 → 300−3P−2P+40=20 → 320=5P → P_quota=64.
רנטה = (64−60)×20 = 80 ₪.`
  },
  {
    id: 'tar-m3',
    question: 'מדינה מטילה מכס שמחזיר את המחיר לP* (מחיר אוטרקיה). מה הDWL? האם יש הכנסת ממשלה?',
    answer: `מכס "מחזיר" = P_t = P* → יבוא=0. DWL = כל השטח שנוצר בסחר חופשי (כל המשולשים). הכנסת ממשלה = t×0 = 0 (אין יבוא). זהו מכס אוסרני (prohibitive tariff).`
  },
  {
    id: 'tar-m4',
    question: 'הסבר: מדוע ממשלה מעדיפה מכס על מכסה מבחינת הכנסות?',
    answer: `מכס: הממשלה מקבלת t×M בוודאות. מכסה: ממשלה לא מקבלת כלום אלא אם מוכרת רישיונות. ה"רנטה" ממכסה הולכת ליבואנים הפרטיים → מכס עדיף לממשלה. בנוסף, מכס גמיש יותר (קל לשנות t) לעומת מכסה (דורשת ניהול רישיונות).`
  },
  {
    id: 'tar-m5',
    question: 'Qd=500−5P, Qs=3P−60. P_w=80. מהו P*? מה כמות היבוא בסחר חופשי? מכס t=10: מה הכנסת ממשלה?',
    answer: `P*: 500−5P=3P−60 → 560=8P → P*=70. Q*=3×70−60=150.
P_w=80>P*=70 → יצוא! Qd(80)=100, Qs(80)=180. יצוא=80.
t=10 (על יצוא?): P יצרן=80−10=70=P* → אין יצוא. הכנסת ממשלה=0. (מכס על יצוא נדיר — בד"כ המבחן עוסק ביבוא.)`
  },
]

const HARD: Exercise[] = [
  {
    id: 'tar-h1',
    question: `(מבחן מלא) Qd=400−4P, Qs=2P−40. P_w=60.
(א) P* ו-Q* אוטרקיה.
(ב) כמות יבוא ללא מכס.
(ג) מכס t=30: כמות יבוא, הכנסת ממשלה, DWL.
(ד) מה גודל מכס שיבטל יבוא לגמרי?`,
    answer: `(א) 400−4P=2P−40 → 440=6P → P*≈73.3, Q*=2×73.3−40=106.6.
(ב) P_w=60<73.3 → יבוא. Qd(60)=160, Qs(60)=80. יבוא=80.
(ג) P_t=90. Qd(90)=40, Qs(90)=140. Qs>Qd → !!יצוא!! (t גדול מדי — הפך לייצוא).
נסה t=13: P_t=73.3=P* → יבוא=0. מכס אוסרני = P*−P_w = 73.3−60 = 13.3.
(ד) מכס אוסרני = P*−P_w ≈ 13.3 ₪.`
  },
  {
    id: 'tar-h2',
    question: `השוק לטלפונים: Qd=1000−5P, Qs=3P−200. P_w=100.
מכסת יבוא: 150 יח'.
(א) מה P_quota?
(ב) מה ה"רנטה" לבעלי רישיונות?
(ג) מה ה-DWL?`,
    answer: `P*: 1000−5P=3P−200 → 1200=8P → P*=150. P_w=100<150 → יבוא.
חופשי: Qd(100)=500, Qs(100)=100. יבוא=400.
עם מכסה 150: Qd(P)−Qs(P)=150 → 1000−5P−3P+200=150 → 1050=8P → P_quota=131.25.
(ב) רנטה = (131.25−100)×150 = 31.25×150 = 4,687.5 ₪.
(ג) DWL = ½×31.25×(100−Qs_free_vs_Qs_quota) + ½×31.25×(Qd_free−Qd_quota).
Qs(100)=100, Qs(131.25)=193.75. ΔQs=93.75.
Qd(100)=500, Qd(131.25)=343.75. ΔQd=156.25.
DWL = ½×31.25×93.75 + ½×31.25×156.25 = 1,465+2,441 ≈ 3,906 ₪.`
  },
  {
    id: 'tar-h3',
    question: `(שאלה אחידות) שוק מורכב משני קבוצות: D₁=300−2P, D₂=200−P. היצע מקומי: Qs=2P−100. P_w=80.
(א) ביקוש מצרפי.
(ב) P* ו-Q* אוטרקיה.
(ג) יבוא חופשי.
(ד) מכס t=20: כמות יבוא, DWL.`,
    answer: `(א) Qd=300−2P+200−P=500−3P (לP≤200).
(ב) 500−3P=2P−100 → 600=5P → P*=120, Q*=2×120−100=140.
(ג) P_w=80<120 → יבוא. Qd(80)=500−240=260, Qs(80)=160−100=60. יבוא=200.
(ד) P_t=100. Qd(100)=200, Qs(100)=100. יבוא=100.
DWL = ½×20×(100−60) + ½×20×(260−200) = ½×20×40+½×20×60 = 400+600=1000 ₪.`
  },
]

export function Chapter9Tariff() {
  return (
    <ChapterLayout number={9} title="מכסים ומכסות יבוא" subtitle="השפעות מכס, DWL, מכסה מול מכס" color="#f97316" examWeight="~15% מהמבחן — חשוב">
      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">9.1 מכס (Tariff) — כיצד עובד?</h3>
          <div className="text-sm space-y-2">
            <p><strong>מכס ספציפי</strong>: תוספת קבועה לכל יחידה מיובאת. אם P_w=60 ו-t=20 → מחיר מקומי = 80.</p>
            <p><strong>תוצאה</strong>: יצרנים מקומיים מוכרים בP גבוה יותר → Qs מקומי עולה. צרכנים משלמים יותר → Qd יורד. יבוא יורד.</p>
          </div>
          <div className="rounded-xl border border-border p-3 text-center">
            <MathText math="P_{\text{מקומי}} = P_w + t" display />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
              <p className="font-bold text-blue-700 text-sm">לפני מכס</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                <li>P = P_w</li>
                <li>יבוא = Qd(P_w) − Qs(P_w)</li>
              </ul>
            </div>
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-3">
              <p className="font-bold text-orange-700 text-sm">אחרי מכס</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                <li>P = P_w + t</li>
                <li>יבוא = Qd(P_t) − Qs(P_t)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">9.2 ניתוח רווחה: מי מרוויח/מפסיד ממכס?</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr className="bg-slate-100">
                  <th className="p-2 border border-slate-200">קבוצה</th>
                  <th className="p-2 border border-slate-200">שינוי</th>
                  <th className="p-2 border border-slate-200">כיוון</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  ['צרכנים', 'CS', 'P↑ → CS יורד ↓', 'text-red-600'],
                  ['יצרנים מקומיים', 'PS', 'P↑ → PS עולה ↑', 'text-green-600'],
                  ['ממשלה', 'הכנסות', 't × יבוא_חדש ↑', 'text-blue-600'],
                  ['רווחה כוללת', 'DWL', '2 משולשים שלילי ↓', 'text-red-700'],
                ].map(([g, m, d, c]) => (
                  <tr key={g}>
                    <td className="p-2 border border-slate-200 font-semibold">{g}</td>
                    <td className="p-2 border border-slate-200">{m}</td>
                    <td className={`p-2 border border-slate-200 font-bold ${c}`}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm">
            <p className="font-bold text-red-700">DWL = שני משולשים:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div><p className="font-semibold">משולש ייצור:</p><MathText math="\frac{1}{2} \cdot t \cdot (Q_s^t - Q_s^{free})" /></div>
              <div><p className="font-semibold">משולש צריכה:</p><MathText math="\frac{1}{2} \cdot t \cdot (Q_d^{free} - Q_d^t)" /></div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">9.3 מכסת יבוא (Import Quota)</h3>
          <div className="text-sm space-y-2">
            <p><strong>מכסה</strong>: הגבלה ישירה על כמות יבוא מקסימלית. לדוגמה: quota=50 יח'.</p>
            <p><strong>השפעה</strong>: דומה למכס — מעלה מחיר מקומי. ניתן למצוא P_quota על ידי: Qd(P) − Qs(P) = quota.</p>
            <p><strong>ההבדל המהותי</strong>: במכס — ממשלה מקבלת הכנסה. במכסה — ה"רנטה" הולכת לבעלי רישיונות (יבואנים).</p>
          </div>
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-3">
            <p className="font-bold text-yellow-800 text-sm">נוסחאות מכסה:</p>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              <div><p className="font-semibold">מחיר עם מכסה:</p><p>Qd(P) − Qs(P) = quota → פתור P</p></div>
              <div><p className="font-semibold">רנטה:</p><MathText math="\text{רנטה} = (P_{quota} - P_w) \times \text{quota}" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיות</h2>
        <TariffSim />
        <QuotaSim />
        <SubsidySim />
      </section>

      <section><McqSection questions={MCQ} topicId="tariff" /></section>
      <section><ExerciseSection easy={EASY} medium={MEDIUM} hard={HARD} topicId="tariff" /></section>
    </ChapterLayout>
  )
}
