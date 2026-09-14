export type ChapterMeta = {
  id: string
  number: number
  title: string
  subtitle: string
  examWeight: string
  color: string
  /** סוג הפריט: פרק תיאוריה · פרק התרגול המקביל לו · נספח.
      פרק תיאוריה ופרק התרגול שלו חולקים את אותו `number` בכוונה — מבדילים ביניהם ב-id. */
  kind?: 'theory' | 'practice' | 'appendix'
  /** תתי-הנושאים של פרק תיאוריה (סקיל build-book §1 "השלד") — זהים לכותרות
      ה-<h3> הממוספרות (1.1, 1.2...) בפועל בתוך הפרק, כדי שרשימת "פרקי המדריך"
      בהקדמה (ChapterIntro) תציג אותם, לא רק שם-הפרק הבודד. */
  subtopics?: string[]
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'intro',
    number: 0,
    title: 'הקדמה — לפני שמתחילים',
    subtitle: 'איך בנוי הספר ואיך כדאי ללמוד ממנו',
    examWeight: 'קריאה קצרה',
    color: '#1F3864',
    kind: 'theory',
  },
  {
    id: 'ppf',
    number: 1,
    title: 'בעיית המחסור ועקומת התמורה',
    subtitle: 'PPF — Production Possibility Frontier',
    examWeight: 'גבוה — ~4 שאלות',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '1.1 למה אנחנו צריכים כלכלה?',
      '1.2 עלות אלטרנטיבית',
      '1.3 עקומת התמורה — 3 סוגי נקודות',
      '1.4 יתרון יחסי — מי מייצר מה?',
    ],
  },
  {
    id: 'ppf-practice',
    number: 1,
    title: 'תרגול · בעיית המחסור ועקומת התמורה',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'גבוה — ~4 שאלות',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'production',
    number: 2,
    title: 'פונקציית הייצור והקצאת גורמי ייצור',
    subtitle: 'MP, VMP, כלל העסקה אופטימלי',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '2.1 פונקציית הייצור — מבוא',
      '2.2 חוק התפוקה השולית הפוחתת',
      '2.3 כלל ההעסקה האופטימלי — VMP ≥ W',
    ],
  },
  {
    id: 'production-practice',
    number: 2,
    title: 'תרגול · פונקציית הייצור והקצאת גורמי ייצור',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'costs',
    number: 3,
    title: 'עלויות והיצע היצרן',
    subtitle: 'TC, MC, AC, AVC — החלטת ייצור',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '3.1 מבנה העלויות',
      '3.2 כלל מקסום רווח — MC = P',
      '3.3 החלטת ייצור — 3 מקרים קלאסיים',
      '3.4 פונקציית ההיצע של היצרן',
    ],
  },
  {
    id: 'costs-practice',
    number: 3,
    title: 'תרגול · עלויות והיצע היצרן',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'demand',
    number: 4,
    title: 'הביקוש',
    subtitle: 'פונקציית ביקוש, גורמים מסיטים, חוק הביקוש',
    examWeight: 'בינוני — 1-2 שאלות',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '4.1 חוק הביקוש',
      '4.2 ביקוש אישי מול ביקוש שוק',
      '4.3 גורמים המסיטים את עקומת הביקוש',
      '4.4 ההבדל הקריטי — תזוזה לאורך מול הסטה',
    ],
  },
  {
    id: 'demand-practice',
    number: 4,
    title: 'תרגול · הביקוש',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'בינוני — 1-2 שאלות',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'elasticity',
    number: 5,
    title: 'גמישויות הביקוש',
    subtitle: 'גמישות מחיר, הכנסה, צולבת',
    examWeight: 'נמוך מאוד — לא נבחן בפועל',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '5.1 גמישות מחיר של ביקוש',
      '5.2 גמישות ופדיון כולל (TR)',
      '5.3 גמישות הכנסה וגמישות צולבת',
    ],
  },
  {
    id: 'elasticity-practice',
    number: 5,
    title: 'תרגול · גמישויות הביקוש',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'נמוך מאוד — לא נבחן בפועל',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'equilibrium',
    number: 6,
    title: 'שיווי משקל במשק סגור',
    subtitle: 'D = S, P* ו-Q*, עודפים, רווחה',
    examWeight: 'גבוה מאוד — 3-4 שאלות',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '6.1 תנאי שיווי המשקל',
      '6.2 שתי קבוצות צרכנים — הדפוס הכי נפוץ במבחן',
      '6.3 עודפים ורווחה',
      '6.4 שינויים סימולטניים — "לא ניתן לדעת"',
    ],
  },
  {
    id: 'equilibrium-practice',
    number: 6,
    title: 'תרגול · שיווי משקל במשק סגור',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'גבוה מאוד — 3-4 שאלות',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'intervention',
    number: 7,
    title: 'התערבות ממשלתית במשק סגור',
    subtitle: 'מס, סובסידיה, גלגול מס, מחיר מינ/מקס',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '7.1 מס יחידתי על היצרן',
      '7.2 גלגול מס — מי משלם?',
      '7.3 סובסידיה ליצרן',
      '7.4 מחיר מינימום ומחיר מקסימום',
    ],
  },
  {
    id: 'intervention-practice',
    number: 7,
    title: 'תרגול · התערבות ממשלתית במשק סגור',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'open-economy',
    number: 8,
    title: 'שיווי משקל במשק פתוח',
    subtitle: 'ייבוא/ייצוא, מחיר עולמי, שער חליפין',
    examWeight: 'גבוה — 2 שאלות',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '8.1 אוטרקיה מול סחר חופשי',
      '8.2 ניתוח רווחה — מי מרוויח ומי מפסיד?',
      '8.3 יתרון יחסי (Ricardo)',
    ],
  },
  {
    id: 'open-economy-practice',
    number: 8,
    title: 'תרגול · שיווי משקל במשק פתוח',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'גבוה — 2 שאלות',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'tariff',
    number: 9,
    title: 'התערבות ממשלתית במשק פתוח',
    subtitle: 'מכס, פרמיית ייצוא, דאמפינג',
    examWeight: 'בינוני — 1 שאלה',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '9.1 מכס (Tariff) — כיצד עובד?',
      '9.2 ניתוח רווחה — מי מרוויח/מפסיד ממכס?',
      '9.3 מכסת יבוא (Import Quota)',
    ],
  },
  {
    id: 'tariff-practice',
    number: 9,
    title: 'תרגול · התערבות ממשלתית במשק פתוח',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'בינוני — 1 שאלה',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'monopoly',
    number: 10,
    title: 'שוק לא תחרותי: מונופול',
    subtitle: 'MR, MR=MC, נטל עודף, מונופול טבעי',
    examWeight: 'נמוך — לא נבחן בפועל',
    color: '#1F3864',
    kind: 'theory',
    subtopics: [
      '10.1 מונופול — כיצד קובע כמות?',
      '10.2 רווחה: מונופול מול תחרות מושלמת',
      '10.3 אפליית מחירים (Price Discrimination)',
    ],
  },
  {
    id: 'monopoly-practice',
    number: 10,
    title: 'תרגול · שוק לא תחרותי: מונופול',
    subtitle: 'תרגילים מדורגים — קל · בינוני · מתקדם',
    examWeight: 'נמוך — לא נבחן בפועל',
    color: '#1F6F3F',
    kind: 'practice',
  },
  {
    id: 'solutions',
    number: 11,
    title: 'נספח: פתרונות חוברת התרגילים',
    subtitle: 'פתרון מפורט לכל שאלות החוברת + הסבר לרב-ברירה',
    examWeight: 'חיוני לחזרה',
    color: '#2E5496',
    kind: 'appendix',
  },
  {
    id: 'exams',
    number: 12,
    title: 'נספח: מבחנים לדוגמה',
    subtitle: 'מבחני הדוגמה של הקורס — עם פתרון מלא',
    examWeight: 'חזרה מסכמת',
    color: '#2E5496',
    kind: 'appendix',
  },
  {
    id: 'formulas',
    number: 13,
    title: 'נספח: דף נוסחאות',
    subtitle: 'כל הנוסחאות לפי נושא',
    examWeight: 'עזר לבחינה',
    color: '#2E5496',
    kind: 'appendix',
  },
  {
    id: 'glossary',
    number: 14,
    title: 'נספח: מושגי מפתח',
    subtitle: 'מילון מונחי מיקרו-כלכלה',
    examWeight: 'עזר לבחינה',
    color: '#2E5496',
    kind: 'appendix',
  },
]

/* עץ תוכן-העניינים לסיידבר (סקיל build-book §2ד׳ — התנהגות מחייבת מבוססת
   livestats-il: קינון-הורה/ילד מפורש, לא היסק-לפי-סמיכות בתוך JSX).
   נבנה **פעם אחת מ-CHAPTERS עצמו**, לא מקור-נתונים נפרד לתחזק ידנית —
   זה בכוונה שונה מ-livestats-il (ששם יש שני מקורות נפרדים, SECTIONS+TREE,
   ומתועד כגוצ'ה) ומהווה שיפור: מקור-אמת יחיד, אבל עדיין עץ מפורש שה-
   Sidebar צורך, לא סמיכות-במערך מנוחשת ברכיב עצמו. */
export type TocNode = {
  id: string
  /** קבוצה בלי chapter משלה (כמו "פרקי הקורס"/"נספחים") — משתמשת ב-label. */
  label?: string
  chapter?: ChapterMeta
  children?: TocNode[]
}

function buildTocTree(): TocNode[] {
  const theoryAndIntro = CHAPTERS.filter(c => c.kind === 'theory')
  const practiceByNumber = new Map(CHAPTERS.filter(c => c.kind === 'practice').map(c => [c.number, c]))
  const appendices = CHAPTERS.filter(c => c.kind === 'appendix')

  const courseNodes: TocNode[] = theoryAndIntro.map(theory => {
    const practice = practiceByNumber.get(theory.number)
    return practice
      ? { id: theory.id, chapter: theory, children: [{ id: practice.id, chapter: practice }] }
      : { id: theory.id, chapter: theory }
  })

  return [
    { id: 'course-group', label: 'פרקי הקורס', children: courseNodes },
    { id: 'appendix-group', label: 'נספחים', children: appendices.map(a => ({ id: a.id, chapter: a })) },
  ]
}

export const TOC_TREE: TocNode[] = buildTocTree()
