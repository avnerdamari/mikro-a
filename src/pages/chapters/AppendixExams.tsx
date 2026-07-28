import { ChapterLayout } from '@/components/ChapterLayout'
import { ExamSheet } from '@/components/ExamSolution'
import { EXAM1 } from './Exam1'

/* נספח: מבחני הדוגמה הרשמיים של הקורס.
   ⚠️ השאלות מועתקות מהמקור מילה במילה. הפתרונות נכתבו על ידינו —
   למקור לא צורף מפתח תשובות. */

export function AppendixExams() {
  return (
    <ChapterLayout
      number={12}
      navId="exams"
      badge="נספח"
      title="מבחנים לדוגמה"
      subtitle="מבחני הדוגמה של הקורס — עם פתרון מלא לכל שאלה"
      color="#2E5496"
      examWeight="חזרה מסכמת"
    >
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-500/40">
        <p className="font-bold text-amber-800 dark:text-amber-300">⚠️ חשוב לדעת</p>
        <p className="mt-1 text-sm leading-relaxed text-amber-700 dark:text-amber-200">
          <strong>השאלות</strong> הן מבחני הדוגמה הרשמיים של הקורס
          (מבוא לכלכלה א' · תשפ"ו סמסטר א'), מועתקות <strong>מילה במילה</strong>.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-amber-700 dark:text-amber-200">
          <strong>הפתרונות נכתבו על ידינו</strong> — למבחנים לא צורף מפתח תשובות רשמי.
          כל תשובה חושבה ונומקה במלואה, אך אם נתקלתם בפתרון שנראה לכם שגוי —
          כתבו לנו בוואטסאפ ונבדוק.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        <p><strong className="text-foreground">איך לעבוד עם זה:</strong> בחרו תשובה, לחצו "בדוק",
        ורק אחר כך פתחו את הפתרון המלא. הפתרון בנוי ב-6 שלבים קבועים — הבנת השאלה,
        תיאור גרפי, הנוסחה, שלב אחר שלב, התשובה (כולל <strong className="text-foreground">למה כל
        אופציה אחרת שגויה</strong>), ובדיקת סבירות.</p>
      </div>

      <ExamSheet
        title="מבחן לדוגמה 1"
        subtitle="18 שאלות · עקומת התמורה · ייצור · עלויות · שיווי משקל · מס וסובסידיה · משק פתוח"
        questions={EXAM1}
      />

      <div className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">מבחנים 2-4 — בהכנה</p>
        <p className="mt-1">עוד 53 שאלות מהמבחנים הרשמיים, עם אותו פורמט פתרון.</p>
      </div>
    </ChapterLayout>
  )
}
