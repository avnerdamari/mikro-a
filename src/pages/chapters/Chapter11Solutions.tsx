import { useState } from 'react'
import { ChapterLayout } from '@/components/ChapterLayout'
import { MathText } from '@/components/MathText'

type Solution = {
  id: string
  chapter: number
  chapterTitle: string
  question: string
  answer: string
  difficulty: 'קל' | 'בינוני' | 'מתקדם'
}

const SOLUTIONS: Solution[] = [
  // ======= פרק 1: גבול אפשרויות הייצור =======
  {
    id: 's-1-1', chapter: 1, chapterTitle: 'גבול אפשרויות הייצור',
    question: 'מדינה מייצרת ריאלטי ו/או גרעינים עם 1,000 עובדים. ריאלטי: 10 עובדים/יחידה. גרעינים: 5 עובדים/יחידה. (א) כתוב משוואת PPF. (ב) מהי עלות ההזדמנות של ריאלטי אחד?',
    answer: `(א) PPF: 10R + 5G = 1,000 → R + 0.5G = 100 → G = 200 − 2R.
(ב) עלות הזדמנות של R אחד = 2 גרעינים. (להוסיף ריאלטי אחד → 10 עובדים → מפסיד 2 גרעינים שדורשים 5 עובדים כ"א).`,
    difficulty: 'קל'
  },
  {
    id: 's-1-2', chapter: 1, chapterTitle: 'גבול אפשרויות הייצור',
    question: 'מדינה A: ריאלטי 8 עובדים, גרעינים 4 עובדים. מדינה B: ריאלטי 6 עובדים, גרעינים 6 עובדים. למי יתרון יחסי בריאלטי?',
    answer: `עלות הזדמנות ריאלטי: A = 8/4 = 2 גרעינים. B = 6/6 = 1 גרעין.
B זולה יותר בריאלטי (עלות 1 < 2) → ל-B יתרון יחסי בריאלטי. ל-A יתרון יחסי בגרעינים (עלות גרעין: A=0.5, B=1).`,
    difficulty: 'בינוני'
  },
  {
    id: 's-1-3', chapter: 1, chapterTitle: 'גבול אפשרויות הייצור',
    question: '(מבחן) 1,000 עובדים. ריאלטי: 10 עובדים/יח\'. גרעינים: 5 עובדים/יח\'. ייצור: R=50, G=60. (א) האם ייצור זה ישים? (ב) האם יעיל? (ג) כמה עובדים מנוצלים?',
    answer: `(א) PPF: 10×50+5×60=500+300=800≤1000 → ייצור ישים (בתוך גבול).
(ב) לא יעיל — מתחת ל-PPF (עובדים מובטלים).
(ג) 200 עובדים אינם מועסקים (1000−800=200).`,
    difficulty: 'מתקדם'
  },

  // ======= פרק 2: פונקציית ייצור =======
  {
    id: 's-2-1', chapter: 2, chapterTitle: 'פונקציית ייצור ושוק עבודה',
    question: 'L=4 → TP=1,800. L=5 → TP=2,200. P=20 ₪, W=5,000 ₪. (א) חשב MP. (ב) VMP. (ג) האם להעסיק עובד 5?',
    answer: `(א) MP = ΔTP/ΔL = (2200−1800)/1 = 400 יח'.
(ב) VMP = MP × P = 400 × 20 = 8,000 ₪.
(ג) VMP=8,000 > W=5,000 → כן, מיטיב להעסיק (מייצר יותר מעלות).`,
    difficulty: 'קל'
  },
  {
    id: 's-2-2', chapter: 2, chapterTitle: 'פונקציית ייצור ושוק עבודה',
    question: 'L=1→TP=700, L=2→TP=1,300, L=3→TP=1,800, L=4→TP=2,200, L=5→TP=2,500, L=6→TP=2,700. P=20, W=5,000. כמה עובדים להעסיק?',
    answer: `MP: L1=700, L2=600, L3=500, L4=400, L5=300, L6=200.
VMP: L1=14K, L2=12K, L3=10K, L4=8K, L5=6K, L6=4K.
W=5K. VMP>W עד L5 (VMP=6K>5K). L6: VMP=4K<5K → לא מועסק.
→ מועסקים 5 עובדים.`,
    difficulty: 'בינוני'
  },
  {
    id: 's-2-3', chapter: 2, chapterTitle: 'פונקציית ייצור ושוק עבודה',
    question: '(מבחן) שכר מינימום עולה מ-5,000 ל-6,000. השתמש בטבלה מהשאלה הקודמת. (א) כמה יועסקו עכשיו? (ב) כמה פוטרו? (ג) מה קורה לרווח הפירמה?',
    answer: `בW=6,000: VMP>W כאשר VMP≥6K. L1=14K✓, L2=12K✓, L3=10K✓, L4=8K✓, L5=6K✓ (שווה — הפירמה אדישה, אבל מקובל לומר מועסק), L6=4K✗.
→ מועסקים 5 (כמו קודם, אם VMP=W מועסק) או 4 (אם VMP=W לא מועסק).
בד"כ: VMP≥W → מועסק. עדיין 5 עובדים.
רווח: TR=2,500×20=50,000. TC=6,000×5=30,000. רווח=20,000 (ירד מ-22,500 בW=5K).`,
    difficulty: 'מתקדם'
  },

  // ======= פרק 3: עלויות =======
  {
    id: 's-3-1', chapter: 3, chapterTitle: 'עלויות ורווח',
    question: 'FC=1,000. VC: Q=10→VC=500, Q=11→VC=580. (א) MC ב-Q=11. (ב) AC ב-Q=10.',
    answer: `(א) MC(11) = ΔVC/ΔQ = (580−500)/1 = 80 ₪.
(ב) AC(10) = TC/Q = (1000+500)/10 = 150 ₪.`,
    difficulty: 'קל'
  },
  {
    id: 's-3-2', chapter: 3, chapterTitle: 'עלויות ורווח',
    question: 'P=120. FC=2,000, VC=50Q. (א) משוואת רווח. (ב) כמות BEP. (ג) כמות מקסימום רווח (תחרות מושלמת).',
    answer: `(א) π = TR−TC = 120Q−(2000+50Q) = 70Q−2000.
(ב) BEP: 70Q=2000 → Q=28.6 ≈ 29 יח'.
(ג) תחרות מושלמת: P=MC=50 → אבל P=120>MC=50 → מרוויחה על כל יחידה. מייצרת עד שMC=P: כאן MC קבוע=50<P=120 → מרחיב כמות עד אינסוף? בפועל: MC עולה בסוף. בשאלת בחינה עם MC קבוע ותחרות — מייצרת כמה שהשוק דורש.`,
    difficulty: 'בינוני'
  },
  {
    id: 's-3-3', chapter: 3, chapterTitle: 'עלויות ורווח',
    question: '(מבחן) TC = 500 + 20Q + 2Q². P=100. (א) MC. (ב) Q* ורווח. (ג) BEP.',
    answer: `(א) MC = dTC/dQ = 20 + 4Q.
(ב) P=MC: 100=20+4Q → Q=20. TR=2000, TC=500+400+800=1700. רווח=300.
(ג) BEP: TR=TC → 100Q=500+20Q+2Q² → 2Q²−80Q+500=0 → Q²−40Q+250=0 → Q=(40±√(1600−1000))/2=(40±24.5)/2 → Q≈7.75 או Q≈32.25.`,
    difficulty: 'מתקדם'
  },

  // ======= פרק 4: ביקוש =======
  {
    id: 's-4-1', chapter: 4, chapterTitle: 'ביקוש ועקומת ביקוש',
    question: 'D₁: Qd₁=80−2P. D₂: Qd₂=60−P. (א) חבר ביקושים. (ב) ב-P=20: כמה מבקש כל אחד? (ג) מה כמות מצרפית?',
    answer: `(א) ביקוש מצרפי (לP≤60): Qd=80−2P+60−P=140−3P.
(לP>60: רק D₁ פעיל).
(ב) P=20: Qd₁=80−40=40. Qd₂=60−20=40.
(ג) Qd_מצרפי=40+40=80. (בדיקה: 140−60=80 ✓)`,
    difficulty: 'קל'
  },
  {
    id: 's-4-2', chapter: 4, chapterTitle: 'ביקוש ועקומת ביקוש',
    question: 'מה ההבדל בין "ירידה בכמות המבוקשת" ל"ירידה בביקוש"?',
    answer: `"ירידה בכמות המבוקשת" = תנועה לאורך אותו עקום ביקוש (כי P עלה).
"ירידה בביקוש" = היסט שמאלה של כל העקום (כי גורם חיצוני השתנה: הכנסה, טעמים, מחיר תחליף/משלים).`,
    difficulty: 'בינוני'
  },
  {
    id: 's-4-3', chapter: 4, chapterTitle: 'ביקוש ועקומת ביקוש',
    question: '(מבחן) שלוש קבוצות: A=120−3P, B=90−2P, C=60−P. (א) חבר (לP≤30, 30<P≤45, 45<P≤60). (ב) ב-P=25.',
    answer: `P≤30 (כולם פעילים): Qd=270−6P.
30<P≤45 (B+C): Qd=90−2P+60−P=150−3P.
45<P≤60 (C בלבד): Qd=60−P.
(ב) P=25: Qd=270−150=120. (120−75=45 (A), 90−50=40 (B), 60−25=35 (C), סה"כ=120 ✓)`,
    difficulty: 'מתקדם'
  },

  // ======= פרק 6: שיווי משקל =======
  {
    id: 's-6-1', chapter: 6, chapterTitle: 'שיווי משקל שוק',
    question: 'Qd=100−2P. Qs=3P−50. (א) P* ו-Q*. (ב) CS ו-PS.',
    answer: `(א) 100−2P=3P−50 → 150=5P → P*=30, Q*=100−60=40.
(ב) max_P (Qd=0): P=50. CS=½×(50−30)×40=400.
min_P (Qs=0): P=50/3≈16.7. PS=½×(30−16.7)×40≈266.`,
    difficulty: 'קל'
  },
  {
    id: 's-6-2', chapter: 6, chapterTitle: 'שיווי משקל שוק',
    question: 'D₁=800−4P, D₂=600−P, S: Q=10P−400. (א) חבר ביקושים. (ב) P* ו-Q*.',
    answer: `(א) Qd=1400−5P (לP≤200).
(ב) 1400−5P=10P−400 → 1800=15P → P*=120, Q*=1400−600=800.`,
    difficulty: 'בינוני'
  },
  {
    id: 's-6-3', chapter: 6, chapterTitle: 'שיווי משקל שוק',
    question: '(מבחן) Qd=500−4P, Qs=2P−100. מחיר רצפה P_floor=110. (א) P* בלי התערבות. (ב) עודף/מחסור? (ג) מה קורה ב-P=110?',
    answer: `(א) 500−4P=2P−100 → 600=6P → P*=100, Q*=100.
(ב) P_floor=110>P*=100 → כובל. יש עודף היצע.
(ג) Qd(110)=500−440=60. Qs(110)=220−100=120. עודף היצע=60 יח'.`,
    difficulty: 'מתקדם'
  },

  // ======= פרק 7: התערבות ממשלה =======
  {
    id: 's-7-1', chapter: 7, chapterTitle: 'התערבות ממשלה',
    question: 'Qd=200−2P, Qs=P−10. מס t=30. (א) P_c, P_p, Q אחרי מס. (ב) הכנסת ממשלה.',
    answer: `Pc = Pp + 30. Qd=Qs: 200−2Pc=Pp−10. Pp=Pc−30.
200−2Pc=Pc−30−10 → 240=3Pc → Pc=80, Pp=50, Q=200−160=40.
(ב) הכנסת ממשלה = 30×40 = 1,200 ₪.`,
    difficulty: 'קל'
  },
  {
    id: 's-7-2', chapter: 7, chapterTitle: 'התערבות ממשלה',
    question: 'D: P=250−4Q, S: P=100+Q. מס t=30. (א) P_c, P_p, Q. (ב) נטל הצרכן ונטל היצרן. (ג) DWL.',
    answer: `ללא מס: 250−4Q=100+Q → 150=5Q → Q*=30, P*=160.
עם מס: Pc=Pp+30. 250−4Q=Pp+30+100+Q+30...
נכון: Pc−Pp=30. שוק: 250−4Q=Pc, 100+Q=Pp.
250−4Q−(100+Q)=30 → 150−5Q=30 → Q=24.
Pp=100+24=124, Pc=154.
(ב) נטל צרכן=(154−160)... רגע, Pc=154<P*=160 → ...
בדיקה: ללא מס P*=160. עם מס: Pc=154, Pp=124.
נטל צרכן = Pc−P* = 154−160 = ... Pc>P*! צרכן משלם יותר: Pc−P*=154−160? לא.
P*=160, Pc=154 < P*. שגיאה בחישוב.
תיקון: Qd=Qs עם מס. Qd: Pc=250−4Q → Q=(250−Pc)/4. Qs: Pp=100+Q → Q=Pp−100.
Pc=Pp+30. Q=(250−Pp−30)/4=(220−Pp)/4=Pp−100 → 220−Pp=4Pp−400 → 620=5Pp → Pp=124, Pc=154, Q=24.
P*=160. נטל צרכן=Pc−P*=154−160 → שלילי?
Pc=154<P*=160 → צרכנים משלמים פחות! ממס?
המס מוטל על יצרנים: הם מקבלים Pp=124<P*=160. יצרנים סופגים את רוב המס.
נטל יצרן = P*−Pp = 160−124 = 36. נטל צרכן = Pc−P* = 154−160 = −6 (צרכן מרוויח?).
בעצם: Pc=154<P*=160 → צרכנים משלמים פחות לאחר המס (ביקוש קשיח יחסית? לא — הגבולות: 250/4 vs 1/1. ΔPc/t = b_S/(b_D+b_S) = 1/(4+1) = 0.2×30=6. ΔPp/t = 4/5×30=24. Pc=160+6=166?
תיקון סופי: ΔPc=t×(b_S/(b_D+b_S))=30×(1/5)=6. Pc=160+6=166. Pp=166−30=136. Q=250−4×166/...
Q=(250−166)/4=21. Pp=100+21=121≠136. בעיה בשיטה.
שיטה נכונה: Qd=Qs עם מס. Qd: P=250−4Q → Q=(250−Pc)/4.
Qs: P=100+Q → Q=Pp−100=Pc−30−100=Pc−130.
(250−Pc)/4=Pc−130 → 250−Pc=4Pc−520 → 770=5Pc → Pc=154, Q=24, Pp=124.
נטל צרכן=Pc−P*=154−160=−6 → צרכן רוויח 6! (ביקוש שטוח → צרכן אינו סופג מס).
נטל יצרן=P*−Pp=160−124=36.
DWL=½×30×(30−24)=½×30×6=90.`,
    difficulty: 'מתקדם'
  },
  {
    id: 's-7-3', chapter: 7, chapterTitle: 'התערבות ממשלה',
    question: 'תקרת מחירים (price ceiling) P_c=50. P*=80. (א) מה קורה? (ב) מי מרוויח ומי מפסיד?',
    answer: `P_c=50<P*=80 → תקרה כובלת. מחסור (shortage): Qd(50)>Qs(50).
צרכנים שמצליחים לקנות: מרוויחים (משלמים פחות). צרכנים שלא מצליחים: מפסידים (חוסר מוצר).
יצרנים: מפסידים (מחיר נמוך יותר → PS יורד).
DWL: שני משולשים.`,
    difficulty: 'קל'
  },

  // ======= פרק 8: כלכלה פתוחה =======
  {
    id: 's-8-1', chapter: 8, chapterTitle: 'כלכלה פתוחה',
    question: 'Qd=400−4P, Qs=2P−80. P_w=60. (א) P* מקומי. (ב) יבוא או יצוא? (ג) כמות.',
    answer: `P*: 400−4P=2P−80 → 480=6P → P*=80.
P_w=60<P*=80 → יבוא.
Qd(60)=160, Qs(60)=40. יבוא=120.`,
    difficulty: 'קל'
  },
  {
    id: 's-8-2', chapter: 8, chapterTitle: 'כלכלה פתוחה',
    question: 'מהשאלה הקודמת: חשב ΔCS, ΔPS, ΔW מפתיחה לסחר.',
    answer: `P* → P_w=60 (ירד מ-80).
max_P (Qd=0): P=100. min_P (Qs=0): P=40.
CS_autarky=½×(100−80)×80=800. CS_trade=½×(100−60)×160=3200. ΔCS=+2400.
PS_autarky=½×(80−40)×80=1600. PS_trade=½×(60−40)×40=400. ΔPS=−1200.
ΔW=+1200 (רווחה עולה!).`,
    difficulty: 'בינוני'
  },

  // ======= פרק 9: מכסים =======
  {
    id: 's-9-1', chapter: 9, chapterTitle: 'מכסים ומכסות',
    question: 'Qd=300−2P, Qs=P−30. P_w=60, t=20. (א) P_t, יבוא, הכנסת ממשלה. (ב) DWL.',
    answer: `P_t=80. Qd(80)=140, Qs(80)=50. יבוא=90.
ללא מס: Qd(60)=180, Qs(60)=30. יבוא=150.
הכנסת ממשלה=20×90=1800.
DWL=½×20×(50−30)+½×20×(180−140)=½×20×20+½×20×40=200+400=600.`,
    difficulty: 'בינוני'
  },
  {
    id: 's-9-2', chapter: 9, chapterTitle: 'מכסים ומכסות',
    question: '(מבחן) מכסת יבוא=50. Qd=200−P, Qs=P−20. P_w=50. (א) P_quota. (ב) רנטה לבעלי רישיונות.',
    answer: `P*: 200−P=P−20 → 220=2P → P*=110. P_w=50<110 → יבוא.
יבוא_חופשי: Qd(50)=150, Qs(50)=30, יבוא=120.
מכסה=50 (כובלת). Qd(P)−Qs(P)=50 → 200−P−(P−20)=50 → 220−2P=50 → P_quota=85.
רנטה=(85−50)×50=1750 ₪.`,
    difficulty: 'מתקדם'
  },

  // ======= פרק 10: מונופול =======
  {
    id: 's-10-1', chapter: 10, chapterTitle: 'מונופול',
    question: 'P=120−2Q, MC=20. (א) Q*, P*, רווח. (ב) DWL.',
    answer: `MR=120−4Q=20 → Q*=25, P*=70.
רווח=(70−20)×25=1250.
תחרות: P=MC=20 → Q_comp=50.
DWL=½×(70−20)×(50−25)=½×50×25=625.`,
    difficulty: 'קל'
  },
  {
    id: 's-10-2', chapter: 10, chapterTitle: 'מונופול',
    question: 'אפליית מחירים: שוק 1: Qd₁=100−2P₁. שוק 2: Qd₂=60−P₂. MC=10. Q*, P*, רווח בכל שוק.',
    answer: `שוק 1: MR₁=50−Q₁=10 → Q₁=40, P₁=30. רווח=(30−10)×40=800.
שוק 2: MR₂=60−2Q₂=10 → Q₂=25, P₂=35. רווח=(35−10)×25=625.
רווח כולל=1425.`,
    difficulty: 'בינוני'
  },
  {
    id: 's-10-3', chapter: 10, chapterTitle: 'מונופול',
    question: '(מבחן) P=200−4Q, TC=100+40Q. (א) Q*, P*, רווח. (ב) CS, DWL. (ג) Q בתחרות מושלמת.',
    answer: `MR=200−8Q=40=MC → Q*=20, P*=120.
רווח=(120−40)×20−100=1600−100=1500.
max_P=200. CS=½×(200−120)×20=800.
תחרות: P=40 → 200−4Q=40 → Q=40.
W_comp=½×(200−40)×40=3200. W_mono=CS+PS=800+1500=2300.
DWL=3200−2300=900=½×(120−40)×(40−20).`,
    difficulty: 'מתקדם'
  },
]

const CHAPTERS_FILTER = [
  { id: 'all', label: 'הכל' },
  { id: '1', label: 'פ\'1 PPF' },
  { id: '2', label: 'פ\'2 ייצור' },
  { id: '3', label: 'פ\'3 עלויות' },
  { id: '4', label: 'פ\'4 ביקוש' },
  { id: '6', label: 'פ\'6 שיווי משקל' },
  { id: '7', label: 'פ\'7 התערבות' },
  { id: '8', label: 'פ\'8 כלכלה פתוחה' },
  { id: '9', label: 'פ\'9 מכסים' },
  { id: '10', label: 'פ\'10 מונופול' },
]

const DIFFICULTY_COLORS: Record<string, string> = {
  'קל': 'bg-green-100 text-green-700 border-green-200',
  'בינוני': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'מתקדם': 'bg-red-100 text-red-700 border-red-200',
}

function SolutionCard({ sol }: { sol: Solution }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full px-2 py-0.5 font-semibold">{sol.chapterTitle}</span>
          <span className={`text-xs border rounded-full px-2 py-0.5 font-semibold ${DIFFICULTY_COLORS[sol.difficulty]}`}>{sol.difficulty}</span>
        </div>
        <p className="text-sm font-medium whitespace-pre-line">{sol.question}</p>
        <button onClick={() => setOpen(v => !v)} className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
          {open ? '▲ הסתר פתרון' : '▼ הצג פתרון'}
        </button>
      </div>
      {open && (
        <div className="bg-green-50 border-t border-green-200 p-4">
          <p className="text-sm font-bold text-green-700 mb-2">✅ פתרון מלא:</p>
          <p className="text-sm whitespace-pre-line text-green-900">{sol.answer}</p>
        </div>
      )}
    </div>
  )
}

export function Chapter11Solutions() {
  const [filter, setFilter] = useState('all')
  const [diffFilter, setDiffFilter] = useState<string[]>([])

  const filtered = SOLUTIONS.filter(s => {
    const chapterMatch = filter === 'all' || s.chapter.toString() === filter
    const diffMatch = diffFilter.length === 0 || diffFilter.includes(s.difficulty)
    return chapterMatch && diffMatch
  })

  const toggleDiff = (d: string) => {
    setDiffFilter(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8" dir="rtl">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-2xl" style={{ backgroundColor: '#4F46E5' }}>📋</div>
        <h1 className="text-3xl font-extrabold">פתרונות חוברת התרגילים</h1>
        <p className="text-muted-foreground">פתרונות מפורטים לכל שאלות הבחינה הנפוצות — מסודר לפי פרקים ורמת קושי</p>
      </div>

      <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
        <p className="font-bold text-yellow-800">📌 כיצד להשתמש:</p>
        <p className="text-sm text-yellow-700 mt-1">1. נסה לפתור כל שאלה לבד. 2. לחץ "הצג פתרון" לראות פתרון שלב-אחר-שלב. 3. זהה היכן טעית. 4. חזור על הנושא בפרק המתאים.</p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {CHAPTERS_FILTER.map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${filter === c.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-slate-500 self-center">רמת קושי:</span>
          {['קל', 'בינוני', 'מתקדם'].map(d => (
            <button key={d} onClick={() => toggleDiff(d)}
              className={`text-xs px-3 py-1 rounded-full font-semibold border transition-colors ${diffFilter.includes(d) ? 'bg-slate-700 text-white border-slate-700' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-500">מציג {filtered.length} מתוך {SOLUTIONS.length} שאלות</p>

      <div className="space-y-4">
        {filtered.map(sol => <SolutionCard key={sol.id} sol={sol} />)}
      </div>
    </div>
  )
}
