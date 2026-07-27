import { useState } from 'react'
import { ChapterLayout } from '@/components/ChapterLayout'

/* נספח: מושגי מפתח — המונחים נאספו מתוך 10 פרקי הספר. */

type Term = { term: string; en?: string; def: string; chapter: number }

const TERMS: Term[] = [
  { term: 'מחסור', en: 'Scarcity', chapter: 1, def: 'הבעיה היסודית בכלכלה: המשאבים מוגבלים בעוד הצרכים אינסופיים. מכאן נובע הצורך לבחור — וכל בחירה כרוכה בוויתור.' },
  { term: 'עקומת התמורה', en: 'PPF', chapter: 1, def: 'כל צירופי הייצור המרביים של שני מוצרים בהינתן המשאבים הקיימים. נקודה על העקומה = ניצול יעיל; מתחתיה = בזבוז/אבטלה; מעליה = בלתי-אפשרי.' },
  { term: 'עלות אלטרנטיבית', en: 'Opportunity Cost', chapter: 1, def: 'מה שמוותרים עליו כדי לייצר יחידה נוספת של מוצר אחר. זהו "המחיר האמיתי" של כל בחירה כלכלית.' },
  { term: 'יתרון יחסי', en: 'Comparative Advantage', chapter: 1, def: 'יכולת לייצר מוצר בעלות אלטרנטיבית נמוכה יותר מהאחר. הוא — ולא היכולת המוחלטת — שקובע מי כדאי שייצר מה.' },
  { term: 'עקומה קעורה', chapter: 1, def: 'צורת PPF כאשר המשאבים אינם זהים ביעילותם: ככל שמייצרים יותר מ-X, נדרש לגייס גורמי ייצור פחות מתאימים — ולכן העלות האלטרנטיבית גוברת.' },

  { term: 'תפוקה שולית', en: 'MP', chapter: 2, def: 'התוספת לתפוקה מהעסקת עובד נוסף אחד. בדרך כלל פוחתת ככל שמוסיפים עובדים (חוק התפוקה השולית הפוחתת).' },
  { term: 'תפוקה ממוצעת', en: 'AP', chapter: 2, def: 'סך התפוקה חלקי מספר העובדים — כמה מייצר עובד ממוצע.' },
  { term: 'ערך התפוקה השולית', en: 'VMP', chapter: 2, def: 'התפוקה השולית כפול מחיר המוצר — כמה כסף מכניס העובד הנוסף. זהו הגודל שמושווה לשכר.' },
  { term: 'כלל העסקה אופטימלי', chapter: 2, def: 'מעסיקים עובדים עד לנקודה שבה ערך התפוקה השולית שווה לשכר. מעבר לה — העובד עולה יותר משהוא מכניס.' },

  { term: 'עלות קבועה', en: 'FC', chapter: 3, def: 'עלות שאינה משתנה עם כמות הייצור (שכירות, ביטוח). קיימת גם כשהייצור אפס.' },
  { term: 'עלות משתנה', en: 'VC', chapter: 3, def: 'עלות שגדלה עם הייצור (חומרי גלם, שכר עבודה).' },
  { term: 'עלות שולית', en: 'MC', chapter: 3, def: 'התוספת לעלות הכוללת מייצור יחידה נוספת. עקומת ההיצע של היצרן היא למעשה עקומת ה-MC.' },
  { term: 'נקודת הסגירה', chapter: 3, def: 'המחיר שמתחתיו עדיף ליצרן להפסיק לייצר בטווח הקצר — כאשר המחיר אינו מכסה אפילו את העלות המשתנה הממוצעת.' },
  { term: 'נקודת האיזון', chapter: 3, def: 'המחיר שבו הרווח הכלכלי אפס — המחיר שווה לעלות הממוצעת המינימלית.' },

  { term: 'חוק הביקוש', chapter: 4, def: 'ככל שהמחיר עולה, הכמות המבוקשת יורדת — ומכאן השיפוע השלילי של עקומת הביקוש.' },
  { term: 'תנועה לאורך העקומה', chapter: 4, def: 'שינוי בכמות המבוקשת כתוצאה משינוי במחיר המוצר עצמו. העקומה לא זזה.' },
  { term: 'הסטת העקומה', chapter: 4, def: 'שינוי בביקוש כתוצאה מגורם שאינו המחיר (הכנסה, טעמים, מחיר תחליף). כאן העקומה כולה זזה.' },
  { term: 'מוצרים תחליפיים', chapter: 4, def: 'מוצרים שממלאים צורך דומה — עליית מחיר האחד מגדילה את הביקוש לאחר.' },
  { term: 'מוצרים משלימים', chapter: 4, def: 'מוצרים שנצרכים יחד — עליית מחיר האחד מקטינה את הביקוש לאחר.' },

  { term: 'גמישות הביקוש', en: 'Elasticity', chapter: 5, def: 'מדד לרגישות הכמות המבוקשת לשינוי במחיר, באחוזים. גדולה מ-1 = גמיש; קטנה מ-1 = קשיח.' },
  { term: 'ביקוש גמיש', chapter: 5, def: 'הכמות מגיבה חזק למחיר. העלאת מחיר דווקא מקטינה את הפדיון הכולל.' },
  { term: 'ביקוש קשיח', chapter: 5, def: 'הכמות כמעט אינה מגיבה למחיר (מוצרי יסוד, תרופות). העלאת מחיר מגדילה את הפדיון.' },
  { term: 'מוצר נחות', chapter: 5, def: 'מוצר שהביקוש לו יורד כשההכנסה עולה — גמישות הכנסה שלילית.' },

  { term: 'שיווי משקל', en: 'Equilibrium', chapter: 6, def: 'המצב שבו הכמות המבוקשת שווה לכמות המוצעת. נקבעים בו מחיר השוק P* והכמות Q*.' },
  { term: 'עודף ביקוש', chapter: 6, def: 'מחסור — כשהמחיר נמוך משיווי המשקל. הלחץ מעלה את המחיר בחזרה.' },
  { term: 'עודף היצע', chapter: 6, def: 'עודף סחורה — כשהמחיר גבוה משיווי המשקל. הלחץ מוריד את המחיר.' },
  { term: 'עודף הצרכן', en: 'CS', chapter: 6, def: 'ההפרש בין מה שהצרכן היה מוכן לשלם לבין מה ששילם בפועל — השטח מתחת לעקומת הביקוש ומעל המחיר.' },
  { term: 'עודף היצרן', en: 'PS', chapter: 6, def: 'ההפרש בין המחיר שהיצרן קיבל לבין המחיר המינימלי שהיה מוכן לקבל.' },

  { term: 'גלגול מס', chapter: 7, def: 'חלוקת נטל המס בין הצרכן ליצרן. הצד הקשיח יותר סופג חלק גדול יותר — לא משנה על מי המס הוטל רשמית.' },
  { term: 'נטל עודף', en: 'DWL', chapter: 7, def: 'אובדן רווחה שנוצר מהתערבות: עסקאות שהיו כדאיות לשני הצדדים ולא מתבצעות בגלל המס.' },
  { term: 'מחיר מינימום', chapter: 7, def: 'רצפת מחיר מעל שיווי המשקל (למשל שכר מינימום) — יוצרת עודף היצע.' },
  { term: 'מחיר מקסימום', chapter: 7, def: 'תקרת מחיר מתחת לשיווי המשקל (למשל פיקוח על שכר דירה) — יוצרת מחסור.' },

  { term: 'משק פתוח', chapter: 8, def: 'משק שסוחר עם העולם. המחיר המקומי מתיישר עם המחיר העולמי.' },
  { term: 'מחיר עולמי', en: 'Pw', chapter: 8, def: 'המחיר בשוק הבינלאומי. נמוך מהמקומי → ייבוא; גבוה ממנו → ייצוא.' },
  { term: 'ייבוא', chapter: 8, def: 'הפער בין הכמות המבוקשת למוצעת מקומית במחיר העולמי, כשהוא נמוך מהמחיר המקומי.' },

  { term: 'מכס', en: 'Tariff', chapter: 9, def: 'מס על ייבוא. מעלה את המחיר המקומי, מגן על היצרן המקומי, ומקטין את הייבוא ואת רווחת הצרכן.' },
  { term: 'פרמיית ייצוא', chapter: 9, def: 'תמיכה ממשלתית ביצואנים. מעלה את המחיר המקומי ופוגעת בצרכן המקומי.' },
  { term: 'דאמפינג', chapter: 9, def: 'מכירה בשוק זר במחיר נמוך מהעלות או מהמחיר בשוק הבית, כדי להשתלט על השוק.' },

  { term: 'מונופול', en: 'Monopoly', chapter: 10, def: 'יצרן יחיד בשוק. בניגוד לתחרות, הוא קובע את המחיר — ולכן מייצר פחות ומוכר ביוקר.' },
  { term: 'פדיון שולי', en: 'MR', chapter: 10, def: 'התוספת לפדיון מיחידה נוספת. אצל מונופול הוא נמוך מהמחיר, כי כדי למכור עוד יחידה עליו להוזיל את כולן.' },
  { term: 'מונופול טבעי', chapter: 10, def: 'ענף שבו יצרן אחד גדול מייצר בעלות נמוכה מכמה קטנים (תשתיות) — ולכן פיצול השוק דווקא מייקר.' },
]

const CHAPTER_COLORS: Record<number, string> = {
  1: '#a855f7', 2: '#6366f1', 3: '#f97316', 4: '#3b82f6', 5: '#94a3b8',
  6: '#22c55e', 7: '#ef4444', 8: '#0ea5e9', 9: '#f59e0b', 10: '#64748b',
}

export function AppendixGlossary() {
  const [q, setQ] = useState('')
  const query = q.trim()
  const shown = query
    ? TERMS.filter(t => t.term.includes(query) || t.def.includes(query) || (t.en ?? '').toLowerCase().includes(query.toLowerCase()))
    : TERMS

  return (
    <ChapterLayout
      number={14}
      navId="glossary"
      badge="נספח"
      title="מושגי מפתח"
      subtitle="מילון מונחי מיקרו-כלכלה"
      color="#d97706"
      examWeight="עזר לבחינה"
    >
      <div className="space-y-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="חיפוש מושג…"
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-400/40"
        />
        <p className="text-sm text-muted-foreground">
          {query ? `${shown.length} מושגים תואמים` : `${TERMS.length} מושגים, לפי סדר הפרקים`}
        </p>

        <div className="space-y-3">
          {shown.map((t) => (
            <div key={t.term} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-base font-bold">{t.term}</span>
                {t.en && <span className="text-sm text-muted-foreground" dir="ltr">{t.en}</span>}
                <span
                  className="mr-auto rounded-full px-2 py-0.5 text-xs font-bold text-white"
                  style={{ backgroundColor: CHAPTER_COLORS[t.chapter] }}
                >
                  פרק {t.chapter}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.def}</p>
            </div>
          ))}
          {shown.length === 0 && (
            <p className="rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground">
              לא נמצא מושג תואם.
            </p>
          )}
        </div>
      </div>
    </ChapterLayout>
  )
}
