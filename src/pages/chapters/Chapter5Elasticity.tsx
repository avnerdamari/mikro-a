import { useState } from 'react'
import { MathText } from '@/components/MathText'
import { McqSection, type McqQuestion } from '@/components/McqSection'
import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'

function ElastCalc() {
  const [p1, setP1] = useState(100)
  const [q1, setQ1] = useState(200)
  const [p2, setP2] = useState(120)
  const [q2, setQ2] = useState(160)

  const E = Math.abs(((q2 - q1) / q1) / ((p2 - p1) / p1))
  const cat = E > 1 ? 'גמיש (E>1)' : E < 1 ? 'קשיח (E<1)' : 'יחידתי (E=1)'
  const catColor = E > 1 ? 'text-green-700' : E < 1 ? 'text-red-700' : 'text-yellow-700'
  const tr1 = p1 * q1, tr2 = p2 * q2

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5" dir="rtl">
      <h4 className="font-bold text-slate-700">🔬 סימולציה 1 — מחשבון גמישות</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['P₁', p1, setP1, 10, 500, 5], ['Q₁', q1, setQ1, 10, 1000, 10],
          ['P₂', p2, setP2, 10, 500, 5], ['Q₂', q2, setQ2, 10, 1000, 10]].map(([label, val, setter, min, max, step]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border border-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-1">{label as string}: {val as number}</p>
            <div dir="ltr"><input type="range" min={min as number} max={max as number} step={step as number} value={val as number}
              onChange={e => (setter as (v: number) => void)(+e.target.value)} style={{ width: '100%', accentColor: '#64748b' }} /></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-slate-100 p-3"><p className="font-extrabold text-2xl text-slate-700">{E.toFixed(2)}</p><p className="text-xs">|E|</p></div>
        <div className="rounded-xl bg-slate-100 p-3"><p className={`font-bold text-lg ${catColor}`}>{cat}</p><p className="text-xs">קטגוריה</p></div>
        <div className="rounded-xl bg-slate-100 p-3">
          <p className={`font-bold text-sm ${tr2 > tr1 ? 'text-green-700' : tr2 < tr1 ? 'text-red-700' : 'text-yellow-700'}`}>
            TR: {tr1.toLocaleString()} → {tr2.toLocaleString()}
          </p>
          <p className="text-xs">שינוי בפדיון</p>
        </div>
      </div>
    </div>
  )
}

const MCQ: McqQuestion[] = [
  { id: 'el-q1', question: 'P עלה מ-100 ל-120 ו-Q ירד מ-200 ל-160. מה |E|?', options: ['1', '2', '0.5', '1.5'], correct: 0, explanation: 'ΔQ/Q=(−40/200)=−0.2. ΔP/P=(20/100)=0.2. |E|=0.2/0.2=1 (גמישות יחידתית).' },
  { id: 'el-q2', question: 'ביקוש גמיש (E>1). המחיר עולה. מה קורה לפדיון הכולל (TR)?', options: ['TR עולה', 'TR יורד', 'TR לא משתנה', 'אי אפשר לדעת'], correct: 1, explanation: 'ביקוש גמיש: ↑P → ירידה גדולה מאוד ב-Q → TR=P×Q יורד. (ירידת הכמות גדולה מעליית המחיר).' },
  { id: 'el-q3', question: 'גמישות הכנסה חיובית (E_i>0). סוג המוצר הוא:',  options: ['נחות', 'נורמלי', 'גמיש', 'משלים'], correct: 1, explanation: 'גמישות הכנסה חיובית = ↑ הכנסה → ↑ ביקוש = מוצר נורמלי. גמישות הכנסה שלילית = מוצר נחות.' },
]

const EASY: Exercise[] = [
  { id: 'el-e1', question: 'P עלה מ-50 ל-60 (20%). Q ירד מ-100 ל-80 (20%). מה E?', answer: '|E| = 20%/20% = 1 (גמישות יחידתית). TR לא משתנה.' },
  { id: 'el-e2', question: 'E=2 (גמיש). P עולה ב-10%. מה השינוי ב-Q?', answer: 'E=ΔQ%/ΔP% → 2=ΔQ%/10% → ΔQ%=20% ירידה.' },
  { id: 'el-e3', question: 'ביקוש קשיח (E=0.3). P עולה ב-10%. מה קורה ל-TR?', answer: 'ΔQ%=0.3×10%=3% ירידה. TR=P×Q: P↑10%, Q↓3% → TR עולה (כי ↑P גדולה מ↓Q).' },
]

export function Chapter5Elasticity() {
  return (
    <ChapterLayout number={5} title="גמישויות הביקוש" subtitle="גמישות מחיר, הכנסה, צולבת" color="#94a3b8" examWeight="לא נבחן בפועל — פרק קצר">
      <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
        <p className="font-bold text-yellow-800">⚠️ שים לב!</p>
        <p className="text-sm text-yellow-700 mt-1">פרק זה בסילבוס אך <strong>לא הופיע באף אחד מ-5 המבחנים שנבדקו</strong>. למד את הבסיסי, אל תשקיע זמן רב — התמקד בפרקים 1, 2, 3, 6, 7, 8.</p>
      </div>
      <section className="space-y-5">
        <h2 className="text-xl font-bold">📖 הסבר תיאורטי</h2>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-bold text-lg">5.1 גמישות מחיר של ביקוש</h3>
          <div className="rounded-xl border border-border p-4 text-center">
            <MathText math="E = \left|\frac{\Delta Q / Q}{\Delta P / P}\right| = \left|\frac{\Delta Q}{\Delta P} \cdot \frac{P}{Q}\right|" display />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              ['E > 1', 'גמיש', 'ירידת Q גדולה מעליית P', 'bg-green-50 border-green-200'],
              ['E < 1', 'קשיח', 'ירידת Q קטנה מעליית P', 'bg-red-50 border-red-200'],
              ['E = 1', 'יחידתי', 'ירידת Q = עליית P', 'bg-yellow-50 border-yellow-200'],
              ['E = 0', 'קשיח מושלם', 'Q לא משתנה בכלל (אינסולין)', 'bg-orange-50 border-orange-200'],
            ].map(([e, name, desc, cls]) => (
              <div key={e} className={`rounded-xl border p-3 ${cls}`}>
                <p className="font-bold text-sm">{e} — {name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-bold text-lg">5.2 גמישות ופדיון כולל (TR)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-50 border border-green-200 p-3">
              <p className="font-bold text-green-700 text-sm">גמיש (E&gt;1): ↑P → ↓TR</p>
              <p className="text-xs text-muted-foreground">הירידה בכמות גדולה מעליית המחיר</p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-3">
              <p className="font-bold text-red-700 text-sm">קשיח (E&lt;1): ↑P → ↑TR</p>
              <p className="text-xs text-muted-foreground">עליית המחיר גדולה מהירידה בכמות</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-bold text-lg">5.3 גמישות הכנסה וגמישות צולבת</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['גמישות הכנסה E_i > 0', 'מוצר נורמלי — ↑ הכנסה → ↑ ביקוש'],
              ['גמישות הכנסה E_i < 0', 'מוצר נחות — ↑ הכנסה → ↓ ביקוש'],
              ['גמישות צולבת E_c > 0', 'תחליפים — ↑ P_Y → ↑ ביקוש ל-X'],
              ['גמישות צולבת E_c < 0', 'משלימים — ↑ P_Y → ↓ ביקוש ל-X'],
            ].map(([e, desc]) => (
              <div key={e} className="rounded-xl bg-muted/40 border border-border p-3">
                <p className="font-semibold text-xs">{e}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="space-y-5">
        <h2 className="text-xl font-bold">🧪 הדמיה</h2>
        <ElastCalc />
      </section>
      <section><McqSection questions={MCQ} topicId="elasticity" /></section>
      <section><ExerciseSection easy={EASY} medium={[]} hard={[]} topicId="elasticity" /></section>
    </ChapterLayout>
  )
}
