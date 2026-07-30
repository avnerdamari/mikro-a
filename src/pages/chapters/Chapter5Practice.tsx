import { ExerciseSection, type Exercise } from '@/components/ExerciseSection'
import { ChapterLayout } from '@/components/ChapterLayout'

const EASY: Exercise[] = [
  { id: 'el-e1', question: 'P עלה מ-50 ל-60 (20%). Q ירד מ-100 ל-80 (20%). מה E?', answer: '|E| = 20%/20% = 1 (גמישות יחידתית). TR לא משתנה.', checkAnswer: '1' },
  { id: 'el-e2', question: 'E=2 (גמיש). P עולה ב-10%. מה השינוי ב-Q?', answer: 'E=ΔQ%/ΔP% → 2=ΔQ%/10% → ΔQ%=20% ירידה.', checkAnswer: '20%' },
  { id: 'el-e3', question: 'ביקוש קשיח (E=0.3). P עולה ב-10%. מה קורה ל-TR?', answer: 'ΔQ%=0.3×10%=3% ירידה. TR=P×Q: P↑10%, Q↓3% → TR עולה (כי ↑P גדולה מ↓Q).' },
]

export function Chapter5Practice() {
  return (
    <ChapterLayout
      number={5}
      navId="elasticity-practice"
      badge="תרגול"
      title="גמישויות הביקוש"
      subtitle="תרגילים מדורגים — קל · בינוני · מתקדם"
      color="#94a3b8"
      examWeight="לא נבחן בפועל — פרק קצר"
    >
      <section><ExerciseSection easy={EASY} medium={[]} hard={[]} topicId="elasticity" /></section>
    </ChapterLayout>
  )
}
