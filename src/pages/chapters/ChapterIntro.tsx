import { ChapterLayout } from '@/components/ChapterLayout'

/* הקדמה — פתוחה תמיד, לפני כל התוכן (סקיל build-book, סעיף 1). */

export function ChapterIntro() {
  return (
    <ChapterLayout
      number={0}
      navId="intro"
      badge="הקדמה"
      title="ברוכים הבאים — לפני שמתחילים"
      subtitle="איך בנוי הספר ואיך כדאי ללמוד ממנו"
      color="#1F3864"
      examWeight="קריאה קצרה — מומלץ להתחיל כאן"
    >
      <p className="text-sm text-muted-foreground">
        הערה: הפנייה בספר נכתבת בלשון זכר מטעמי נוחות בלבד — הכוונה היא אליך ואלייך, אליכם ואליכן כאחד.
      </p>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-lg font-bold" style={{ color: '#1F3864' }}>1. מטרת הספר</h2>
        <p className="leading-relaxed text-muted-foreground">
          הספר נבנה כדי להכין אתכם לבחינה במבוא לכלכלה א' (מיקרו-כלכלה) — לא רק ללמד תיאוריה,
          אלא לתרגל בדיוק בסגנון ובקושי של הבחינה עצמה.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          לכן כל נושא מלווה בהסבר, בהדמיה אינטראקטיבית, בשאלות הבנה ובתרגילים מדורגים —
          כדי שביום הבחינה תזהו מיד באיזה כלי להשתמש, ולא רק "תדעו את החומר".
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-lg font-bold" style={{ color: '#1F3864' }}>2. איך בנוי הספר</h2>
        <p className="leading-relaxed text-muted-foreground">
          הספר בנוי משלושה חלקים, לפי הסדר שבו הם מופיעים בתוכן העניינים:
        </p>
        <ul className="space-y-2 pr-5 [list-style:disc] text-muted-foreground">
          <li>
            <strong className="text-foreground">10 פרקי תיאוריה</strong> — כל פרק כולל הסבר,
            גרפים והדמיות אינטראקטיביות, ומסתיים ב<strong className="text-foreground">שאלות הבנה</strong>.
          </li>
          <li>
            <strong className="text-foreground">10 פרקי תרגול</strong> — אחרי כל פרק תיאורטי בא
            פרק התרגול המקביל לו (מסומן ב-✎), עם תרגילים בשלוש רמות: קלה, בינונית ומתקדמת.
          </li>
          <li>
            <strong className="text-foreground">נספחים</strong> — מבחני תרגול, דף נוסחאות,
            מושגי מפתח, ופתרונות חוברת התרגילים.
          </li>
        </ul>
        <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: '#1F386411' }}>
          <strong className="text-foreground">ההבחנה החשובה:</strong> שאלות ההבנה שבסוף פרק
          התיאוריה בודקות שהבנתם את <em>הרעיון</em>. התרגילים שבפרק התרגול בודקים
          שאתם יודעים <em>לחשב</em>. שניהם נדרשים בבחינה.
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-lg font-bold" style={{ color: '#1F3864' }}>3. תוכן הקורס לפי פרקים</h2>
        <ol className="space-y-2.5 pr-5 [list-style:decimal] text-muted-foreground">
          <li>
            <strong className="text-foreground">בעיית המחסור ועקומת התמורה</strong>
            <span className="block text-sm">PPF — Production Possibility Frontier, יתרון יחסי והחלטת ייצור</span>
          </li>
          <li>
            <strong className="text-foreground">פונקציית הייצור והקצאת גורמי ייצור</strong>
            <span className="block text-sm">MP, VMP, כלל ההעסקה האופטימלי</span>
          </li>
          <li>
            <strong className="text-foreground">עלויות והיצע היצרן</strong>
            <span className="block text-sm">TC, MC, AC, AVC — החלטת ייצור לפי מחירי שוק</span>
          </li>
          <li>
            <strong className="text-foreground">הביקוש</strong>
            <span className="block text-sm">פונקציית ביקוש, גורמים מסיטים, חוק הביקוש</span>
          </li>
          <li>
            <strong className="text-foreground">גמישויות הביקוש</strong>
            <span className="block text-sm">גמישות מחיר, הכנסה, צולבת</span>
          </li>
          <li>
            <strong className="text-foreground">שיווי משקל במשק סגור</strong>
            <span className="block text-sm">D = S, מחיר וכמות שיווי-משקל, עודפים ורווחה</span>
          </li>
          <li>
            <strong className="text-foreground">התערבות ממשלתית במשק סגור</strong>
            <span className="block text-sm">מס, סובסידיה, גלגול מס, מחיר מינימום/מקסימום</span>
          </li>
          <li>
            <strong className="text-foreground">שיווי משקל במשק פתוח</strong>
            <span className="block text-sm">ייבוא/ייצוא, מחיר עולמי, שער חליפין</span>
          </li>
          <li>
            <strong className="text-foreground">התערבות ממשלתית במשק פתוח</strong>
            <span className="block text-sm">מכס, פרמיית ייצוא, דאמפינג</span>
          </li>
          <li>
            <strong className="text-foreground">שוק לא תחרותי: מונופול</strong>
            <span className="block text-sm">MR, MR=MC, נטל עודף, מונופול טבעי</span>
          </li>
        </ol>
        <p className="text-sm text-muted-foreground">
          אחרי כל פרק תיאוריה בא פרק התרגול שלו (✎). בנוסף — נספח פתרונות
          חוברת התרגילים, נספח מבחני דוגמה, דף נוסחאות, ומילון מושגי מפתח.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-lg font-bold" style={{ color: '#1F3864' }}>4. איך מומלץ ללמוד</h2>
        <ol className="space-y-2 pr-5 [list-style:decimal] text-muted-foreground">
          <li>עברו על פרקי התיאוריה <strong className="text-foreground">לפי הסדר</strong> — כל פרק נשען על הקודם לו.</li>
          <li>שחקו עם <strong className="text-foreground">ההדמיות</strong>: הזזת סליידר מלמדת יותר מקריאה חוזרת.</li>
          <li>ענו על <strong className="text-foreground">שאלות ההבנה</strong> לפני שממשיכים — הן חושפות אי-הבנות מוקדם.</li>
          <li>עברו לפרק התרגול והתחילו ברמה <strong className="text-foreground">הקלה</strong>, גם אם זה נראה טריוויאלי.</li>
          <li>נסו לפתור <strong className="text-foreground">לפני</strong> שאתם פותחים את התשובה. רמז לפני פתרון.</li>
          <li>לקראת הבחינה — <strong className="text-foreground">נספח המבחנים</strong> ו<strong className="text-foreground">דף הנוסחאות</strong>.</li>
        </ol>
      </section>

      <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 space-y-2 dark:border-amber-500/40">
        <h2 className="text-lg font-bold text-amber-800 dark:text-amber-300">5. על מה באמת נבחנים</h2>
        <p className="text-sm text-amber-700 dark:text-amber-200">
          הבחינה: 20 שאלות רב-ברירה, 5 נקודות לשאלה. ציון עובר 60. שלוש שעות, עם דף עזר אישי ומחשבון.
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-200">
          <strong>הנושאים שמופיעים בפועל:</strong> PPF · פונקציית ייצור · עלויות · שיווי משקל סגור ·
          התערבות ממשלתית · משק פתוח — יחד כ-80% מהבחינה. פרקים 5 ו-10 כמעט אינם נבחנים —
          למדו אותם, אך אל תשקיעו בהם את עיקר הזמן.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <h2 className="text-lg font-bold" style={{ color: '#1F3864' }}>6. יצירת קשר</h2>
        <p className="leading-relaxed text-muted-foreground">
          כפתור <strong className="text-foreground">וואטסאפ</strong> שבפינת המסך פתוח לכל דבר:
          טעות בחומר, משהו שלא ברור, או בקשה לתוספת. כל פנייה מגיעה ישירות אליי.
        </p>
        <p className="text-sm text-muted-foreground">אל תהססו — המשוב שלכם הוא מה שמשפר את הספר.</p>
      </section>
    </ChapterLayout>
  )
}
