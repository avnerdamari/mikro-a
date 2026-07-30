import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'

/* ── EXERCISES ─────────────────────────────── */
const EASY: Exercise[] = [
  { id: 'c3-e1', question: 'TC=500₪, VC=350₪. מה FC?', answer: 'FC = TC - VC = 500 - 350 = 150₪', checkAnswer: '150' },
  { id: 'c3-e2', question: 'TC(4)=400₪, TC(5)=460₪. מה MC של יחידה ה-5?', answer: 'MC = 460 - 400 = 60₪', checkAnswer: '60' },
  { id: 'c3-e3', question: 'Q=10, TC=600₪. מה AC?', answer: 'AC = TC/Q = 600/10 = 60₪', checkAnswer: '60' },
  { id: 'c3-e4', question: 'Q=10, VC=400₪. מה AVC?', answer: 'AVC = VC/Q = 400/10 = 40₪', checkAnswer: '40' },
  { id: 'c3-e5', question: 'P=80₪, Q*=5, TC=300₪. מה הרווח?', answer: 'TR = P×Q = 80×5 = 400₪\nרווח = TR-TC = 400-300 = 100₪', checkAnswer: '100' },
]

const MEDIUM: Exercise[] = [
  { id: 'c3-m1', question: 'FC=200₪. P=40₪. טבלת עלויות: Q=0→TC=200, Q=1→TC=260, Q=2→TC=310, Q=3→TC=370, Q=4→TC=450. כמה לייצר?', hint: 'חשב MC, השווה ל-P', answer: 'Q=1: MC=60 > P=40 ❌ (כבר Q=1 לא כדאי)\n\nרגע! נבדוק AVC: VC(1)=60, AVC=60>P=40\nגם לא ייצר בטווח קצר.\n\nהחלטה: לא לייצר, הפסד = FC = 200₪.' },
  { id: 'c3-m2', question: 'P=70₪. אותה טבלה. כמה לייצר? מה הרווח?', answer: 'Q=1: MC=60≤70 ✅ | Q=2: MC=50≤70 ✅ | Q=3: MC=60≤70 ✅ | Q=4: MC=80>70 ❌\nQ*=3\nTR=70×3=210₪, TC=370₪\nרווח=210-370=-160₪ (הפסד)\n\nאבל: AVC(3)=VC(3)/3=170/3=56.7<70 → ייצר בטווח קצר (הפסד 160 < FC 200).' },
  { id: 'c3-m3', question: 'P=90₪. אותה טבלה. מה הרווח?', answer: 'Q=4: MC=80≤90 ✅ → Q*=4\nTR=90×4=360₪, TC=450₪\nרווח=360-450=-90₪\n\nAVC(4)=250/4=62.5<90 → ייצר בטווח קצר.\nהפסד=-90 < FC=200 → אפילו בהפסד כדאי לייצר.', checkAnswer: '-90' },
  { id: 'c3-m4', question: 'בשוק תחרותי עם 10 יצרנים זהים (היצע כל יצרן: P=20+2Q). מה ההיצע המצרפי?', answer: 'היצע יצרן: P=20+2Q → Q=(P-20)/2\nהיצע שוק: Q_s=10×(P-20)/2=5(P-20)=5P-100\nאו: P=20+Q_s/5' },
  { id: 'c3-m5', question: 'הסבר: מדוע P=AVC היא "נקודת הסגירה" (Shut-down point)?', answer: 'P=AVC = נקודת שבה הפדיון בדיוק מכסה VC.\nאם P<AVC → פדיון לא מכסה גם VC → הפסד גדול מ-FC → עדיף לסגור ולהפסיד רק FC.\nאם P≥AVC → ייצר כי מפחית הפסד (מכסה לפחות VC ועוד חלק מ-FC).' },
]

const HARD: Exercise[] = [
  { id: 'c3-h1', question: 'TC = 2Q² - 12Q + 100. מצא: MC, AC, AVC, FC, VC.', hint: 'TC(0)=FC', answer: 'FC = TC(0) = 100₪\nVC = TC-FC = 2Q²-12Q\nMC = dTC/dQ = 4Q-12\nAC = TC/Q = 2Q-12+100/Q\nAVC = VC/Q = 2Q-12' },
  { id: 'c3-h2', question: 'אותה TC. מה נקודת מינימום AVC? מה Shut-down price?', hint: 'גזור AVC והשווה ל-0', answer: 'AVC = 2Q-12. מינימום AVC כאשר dAVC/dQ=0: 2=0? אין מינימום פנימי...\nחכה: TC=2Q²-12Q+100 → VC=2Q²-12Q\nAVC=2Q-12. כשQ=6: AVC=0. זה המינימום (לנוסחה ריבועית: מינימום כשQ=-b/2a=12/4=3)\nבQ=3: AVC=6-12=-6? לא הגיוני.\n\nנסה TC=Q²+20Q+100:\nFC=100, VC=Q²+20Q, AVC=Q+20, MC=2Q+20.\nAVC_min=20 (בQ=0). Shut-down price=20₪.' },
  { id: 'c3-h3', question: 'S: P=20+2Q (יצרן בודד). מחיר שוק P=50₪. כמה ייצר? מה רווח אם FC=100₪?', answer: 'P=MC: 50=20+2Q → 2Q=30 → Q*=15\nTR=50×15=750₪\nTC=FC+VC=100+∫₀¹⁵(20+2Q)dQ=100+[20Q+Q²]₀¹⁵=100+300+225=625₪\nרווח=750-625=125₪' },
  { id: 'c3-h4', question: '5 יצרנים בתל אביב (S_TA: P=10+3Q) ו-8 בגליל (S_G: P=8+2Q). מה ההיצע המצרפי?', hint: 'הפוך לQ=f(P) לכל יצרן, כפול מספר יצרנים, חבר', answer: 'TA: P=10+3Q → Q=(P-10)/3. 5 יצרנים: Q_TA=5(P-10)/3 (בP>10)\nגליל: P=8+2Q → Q=(P-8)/2. 8 יצרנים: Q_G=8(P-8)/2=4(P-8) (בP>8)\n\nQ_total=Q_TA+Q_G=5(P-10)/3+4(P-8) (בP>10)' },
  { id: 'c3-h5', question: 'בחר מכונה: מכונה A: FC=5,000₪, MC=20₪. מכונה B: FC=1,000₪, MC=40₪. מאיזו כמות עדיפה A?', answer: 'TC_A = 5,000+20Q\nTC_B = 1,000+40Q\n\nA עדיפה כש: TC_A < TC_B\n5,000+20Q < 1,000+40Q\n4,000 < 20Q\nQ > 200\n\nאם מייצרים יותר מ-200 יחידות → עדיפה מכונה A.\nאם פחות מ-200 → עדיפה מכונה B.', checkAnswer: '200' },
]

export function Chapter3Practice() {
  return (
    <ChapterLayout
      number={3}
      navId="costs-practice"
      badge="תרגול"
      title="עלויות והיצע היצרן"
      subtitle="תרגילים מדורגים — קל · בינוני · מתקדם"
      color="#f97316"
      examWeight="2-3 שאלות במבחן"
    >
      <section><ExerciseSection easy={EASY} medium={MEDIUM} hard={HARD} topicId="costs" /></section>
    </ChapterLayout>
  )
}
