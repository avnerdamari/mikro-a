import { useEffect, useRef, useState } from 'react'
import { ChapterLayout } from '@/components/ChapterLayout'
import { useNavigation } from '@/components/NavigationContext'
import { cn } from '@/lib/utils'

/* נספח: מושגי מפתח — המונחים נאספו מתוך 10 פרקי הספר.
   כל מונח מקבל key ייחודי (עוגן) — LinkedTerm בפרקי התיאוריה מפנה אליו לפי ה-key הזה. */

type Term = { key: string; term: string; en?: string; def: string; chapter: number }

const TERMS: Term[] = [
  { key: 'scarcity', term: 'מחסור', en: 'Scarcity', chapter: 1, def: 'הבעיה היסודית בכלכלה: המשאבים מוגבלים בעוד הצרכים אינסופיים. מכאן נובע הצורך לבחור — וכל בחירה כרוכה בוויתור.' },
  { key: 'ppf', term: 'עקומת התמורה', en: 'PPF', chapter: 1, def: 'כל צירופי הייצור המרביים של שני מוצרים בהינתן המשאבים הקיימים. נקודה על העקומה = ניצול יעיל; מתחתיה = בזבוז/אבטלה; מעליה = בלתי-אפשרי.' },
  { key: 'opportunity-cost', term: 'עלות אלטרנטיבית', en: 'Opportunity Cost', chapter: 1, def: 'מה שמוותרים עליו כדי לייצר יחידה נוספת של מוצר אחר. זהו "המחיר האמיתי" של כל בחירה כלכלית.' },
  { key: 'comparative-advantage', term: 'יתרון יחסי', en: 'Comparative Advantage', chapter: 1, def: 'יכולת לייצר מוצר בעלות אלטרנטיבית נמוכה יותר מהאחר. הוא — ולא היכולת המוחלטת — שקובע מי כדאי שייצר מה.' },
  { key: 'ppf-concave', term: 'עקומה קעורה', chapter: 1, def: 'צורת PPF כאשר המשאבים אינם זהים ביעילותם: ככל שמייצרים יותר מ-X, נדרש לגייס גורמי ייצור פחות מתאימים — ולכן העלות האלטרנטיבית גוברת.' },

  { key: 'mp', term: 'תפוקה שולית', en: 'MP', chapter: 2, def: 'התוספת לתפוקה מהעסקת עובד נוסף אחד. בדרך כלל פוחתת ככל שמוסיפים עובדים (חוק התפוקה השולית הפוחתת).' },
  { key: 'ap', term: 'תפוקה ממוצעת', en: 'AP', chapter: 2, def: 'סך התפוקה חלקי מספר העובדים — כמה מייצר עובד ממוצע.' },
  { key: 'vmp', term: 'ערך התפוקה השולית', en: 'VMP', chapter: 2, def: 'התפוקה השולית כפול מחיר המוצר — כמה כסף מכניס העובד הנוסף. זהו הגודל שמושווה לשכר.' },
  { key: 'optimal-hiring-rule', term: 'כלל העסקה אופטימלי', chapter: 2, def: 'מעסיקים עובדים עד לנקודה שבה ערך התפוקה השולית שווה לשכר. מעבר לה — העובד עולה יותר משהוא מכניס.' },

  { key: 'fc', term: 'עלות קבועה', en: 'FC', chapter: 3, def: 'עלות שאינה משתנה עם כמות הייצור (שכירות, ביטוח). קיימת גם כשהייצור אפס.' },
  { key: 'vc', term: 'עלות משתנה', en: 'VC', chapter: 3, def: 'עלות שגדלה עם הייצור (חומרי גלם, שכר עבודה).' },
  { key: 'mc', term: 'עלות שולית', en: 'MC', chapter: 3, def: 'התוספת לעלות הכוללת מייצור יחידה נוספת. עקומת ההיצע של היצרן היא למעשה עקומת ה-MC.' },
  { key: 'shutdown-point', term: 'נקודת הסגירה', chapter: 3, def: 'המחיר שמתחתיו עדיף ליצרן להפסיק לייצר בטווח הקצר — כאשר המחיר אינו מכסה אפילו את העלות המשתנה הממוצעת.' },
  { key: 'breakeven-point', term: 'נקודת האיזון', chapter: 3, def: 'המחיר שבו הרווח הכלכלי אפס — המחיר שווה לעלות הממוצעת המינימלית.' },

  { key: 'law-of-demand', term: 'חוק הביקוש', chapter: 4, def: 'ככל שהמחיר עולה, הכמות המבוקשת יורדת — ומכאן השיפוע השלילי של עקומת הביקוש.' },
  { key: 'movement-along-curve', term: 'תנועה לאורך העקומה', chapter: 4, def: 'שינוי בכמות המבוקשת כתוצאה משינוי במחיר המוצר עצמו. העקומה לא זזה.' },
  { key: 'demand-shift', term: 'הסטת העקומה', chapter: 4, def: 'שינוי בביקוש כתוצאה מגורם שאינו המחיר (הכנסה, טעמים, מחיר תחליף). כאן העקומה כולה זזה.' },
  { key: 'substitute-goods', term: 'מוצרים תחליפיים', chapter: 4, def: 'מוצרים שממלאים צורך דומה — עליית מחיר האחד מגדילה את הביקוש לאחר.' },
  { key: 'complement-goods', term: 'מוצרים משלימים', chapter: 4, def: 'מוצרים שנצרכים יחד — עליית מחיר האחד מקטינה את הביקוש לאחר.' },

  { key: 'elasticity', term: 'גמישות הביקוש', en: 'Elasticity', chapter: 5, def: 'מדד לרגישות הכמות המבוקשת לשינוי במחיר, באחוזים. גדולה מ-1 = גמיש; קטנה מ-1 = קשיח.' },
  { key: 'elastic-demand', term: 'ביקוש גמיש', chapter: 5, def: 'הכמות מגיבה חזק למחיר. העלאת מחיר דווקא מקטינה את הפדיון הכולל.' },
  { key: 'inelastic-demand', term: 'ביקוש קשיח', chapter: 5, def: 'הכמות כמעט אינה מגיבה למחיר (מוצרי יסוד, תרופות). העלאת מחיר מגדילה את הפדיון.' },
  { key: 'inferior-good', term: 'מוצר נחות', chapter: 5, def: 'מוצר שהביקוש לו יורד כשההכנסה עולה — גמישות הכנסה שלילית.' },

  { key: 'equilibrium', term: 'שיווי משקל', en: 'Equilibrium', chapter: 6, def: 'המצב שבו הכמות המבוקשת שווה לכמות המוצעת. נקבעים בו מחיר השוק P* והכמות Q*.' },
  { key: 'excess-demand', term: 'עודף ביקוש', chapter: 6, def: 'מחסור — כשהמחיר נמוך משיווי המשקל. הלחץ מעלה את המחיר בחזרה.' },
  { key: 'excess-supply', term: 'עודף היצע', chapter: 6, def: 'עודף סחורה — כשהמחיר גבוה משיווי המשקל. הלחץ מוריד את המחיר.' },
  { key: 'consumer-surplus', term: 'עודף הצרכן', en: 'CS', chapter: 6, def: 'ההפרש בין מה שהצרכן היה מוכן לשלם לבין מה ששילם בפועל — השטח מתחת לעקומת הביקוש ומעל המחיר.' },
  { key: 'producer-surplus', term: 'עודף היצרן', en: 'PS', chapter: 6, def: 'ההפרש בין המחיר שהיצרן קיבל לבין המחיר המינימלי שהיה מוכן לקבל.' },

  { key: 'tax-incidence', term: 'גלגול מס', chapter: 7, def: 'חלוקת נטל המס בין הצרכן ליצרן. הצד הקשיח יותר סופג חלק גדול יותר — לא משנה על מי המס הוטל רשמית.' },
  { key: 'dwl', term: 'נטל עודף', en: 'DWL', chapter: 7, def: 'אובדן רווחה שנוצר מהתערבות: עסקאות שהיו כדאיות לשני הצדדים ולא מתבצעות בגלל המס.' },
  { key: 'price-floor', term: 'מחיר מינימום', chapter: 7, def: 'רצפת מחיר מעל שיווי המשקל (למשל שכר מינימום) — יוצרת עודף היצע.' },
  { key: 'price-ceiling', term: 'מחיר מקסימום', chapter: 7, def: 'תקרת מחיר מתחת לשיווי המשקל (למשל פיקוח על שכר דירה) — יוצרת מחסור.' },

  { key: 'open-economy', term: 'משק פתוח', chapter: 8, def: 'משק שסוחר עם העולם. המחיר המקומי מתיישר עם המחיר העולמי.' },
  { key: 'world-price', term: 'מחיר עולמי', en: 'Pw', chapter: 8, def: 'המחיר בשוק הבינלאומי. נמוך מהמקומי → ייבוא; גבוה ממנו → ייצוא.' },
  { key: 'imports', term: 'ייבוא', chapter: 8, def: 'הפער בין הכמות המבוקשת למוצעת מקומית במחיר העולמי, כשהוא נמוך מהמחיר המקומי.' },

  { key: 'tariff', term: 'מכס', en: 'Tariff', chapter: 9, def: 'מס על ייבוא. מעלה את המחיר המקומי, מגן על היצרן המקומי, ומקטין את הייבוא ואת רווחת הצרכן.' },
  { key: 'export-subsidy', term: 'פרמיית ייצוא', chapter: 9, def: 'תמיכה ממשלתית ביצואנים. מעלה את המחיר המקומי ופוגעת בצרכן המקומי.' },
  { key: 'dumping', term: 'דאמפינג', chapter: 9, def: 'מכירה בשוק זר במחיר נמוך מהעלות או מהמחיר בשוק הבית, כדי להשתלט על השוק.' },

  { key: 'monopoly', term: 'מונופול', en: 'Monopoly', chapter: 10, def: 'יצרן יחיד בשוק. בניגוד לתחרות, הוא קובע את המחיר — ולכן מייצר פחות ומוכר ביוקר.' },
  { key: 'mr', term: 'פדיון שולי', en: 'MR', chapter: 10, def: 'התוספת לפדיון מיחידה נוספת. אצל מונופול הוא נמוך מהמחיר, כי כדי למכור עוד יחידה עליו להוזיל את כולן.' },
  { key: 'natural-monopoly', term: 'מונופול טבעי', chapter: 10, def: 'ענף שבו יצרן אחד גדול מייצר בעלות נמוכה מכמה קטנים (תשתיות) — ולכן פיצול השוק דווקא מייקר.' },
]

const CHAPTER_COLORS: Record<number, string> = {
  1: '#a855f7', 2: '#6366f1', 3: '#f97316', 4: '#3b82f6', 5: '#94a3b8',
  6: '#22c55e', 7: '#ef4444', 8: '#0ea5e9', 9: '#f59e0b', 10: '#64748b',
}

export function AppendixGlossary() {
  const [q, setQ] = useState('')
  const { pendingAnchor, canGoBack, goBack } = useNavigation()
  const highlightRef = useRef<HTMLDivElement>(null)
  const query = q.trim()
  const shown = query
    ? TERMS.filter(t => t.term.includes(query) || t.def.includes(query) || (t.en ?? '').toLowerCase().includes(query.toLowerCase()))
    : TERMS

  // הגעה מקישור מושג בפרק תיאוריה: לנקות חיפוש קודם ולגלול למונח המודגש
  useEffect(() => {
    if (pendingAnchor) setQ('')
  }, [pendingAnchor])

  useEffect(() => {
    if (pendingAnchor && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' })
    }
  }, [pendingAnchor])

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
          {shown.map((t) => {
            const isHighlighted = pendingAnchor === t.key
            return (
              <div
                key={t.key}
                id={t.key}
                ref={isHighlighted ? highlightRef : undefined}
                className={cn(
                  'rounded-2xl border p-4 transition-colors',
                  isHighlighted ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400 dark:bg-amber-950/30' : 'border-border bg-card'
                )}
              >
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
                {isHighlighted && canGoBack && (
                  <button
                    onClick={goBack}
                    className="mt-2 rounded-lg bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:brightness-110"
                  >
                    → חזרה לפרק
                  </button>
                )}
              </div>
            )
          })}
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
