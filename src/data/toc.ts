export type ChapterMeta = {
  id: string
  number: number
  title: string
  subtitle: string
  priority: 'high' | 'medium' | 'low'
  examWeight: string
  color: string
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 'ppf',
    number: 1,
    title: 'בעיית המחסור ועקומת התמורה',
    subtitle: 'PPF — Production Possibility Frontier',
    priority: 'high',
    examWeight: 'גבוה — ~4 שאלות',
    color: '#a855f7',
  },
  {
    id: 'production',
    number: 2,
    title: 'פונקציית הייצור והקצאת גורמי ייצור',
    subtitle: 'MP, VMP, כלל העסקה אופטימלי',
    priority: 'high',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#6366f1',
  },
  {
    id: 'costs',
    number: 3,
    title: 'עלויות והיצע היצרן',
    subtitle: 'TC, MC, AC, AVC — החלטת ייצור',
    priority: 'high',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#f97316',
  },
  {
    id: 'demand',
    number: 4,
    title: 'הביקוש',
    subtitle: 'פונקציית ביקוש, גורמים מסיטים, חוק הביקוש',
    priority: 'medium',
    examWeight: 'בינוני — 1-2 שאלות',
    color: '#3b82f6',
  },
  {
    id: 'elasticity',
    number: 5,
    title: 'גמישויות הביקוש',
    subtitle: 'גמישות מחיר, הכנסה, צולבת',
    priority: 'low',
    examWeight: 'נמוך מאוד — לא נבחן בפועל',
    color: '#94a3b8',
  },
  {
    id: 'equilibrium',
    number: 6,
    title: 'שיווי משקל במשק סגור',
    subtitle: 'D = S, P* ו-Q*, עודפים, רווחה',
    priority: 'high',
    examWeight: 'גבוה מאוד — 3-4 שאלות',
    color: '#22c55e',
  },
  {
    id: 'intervention',
    number: 7,
    title: 'התערבות ממשלתית במשק סגור',
    subtitle: 'מס, סובסידיה, גלגול מס, מחיר מינ/מקס',
    priority: 'high',
    examWeight: 'גבוה — 2-3 שאלות',
    color: '#ef4444',
  },
  {
    id: 'open-economy',
    number: 8,
    title: 'שיווי משקל במשק פתוח',
    subtitle: 'ייבוא/ייצוא, מחיר עולמי, שער חליפין',
    priority: 'high',
    examWeight: 'גבוה — 2 שאלות',
    color: '#0ea5e9',
  },
  {
    id: 'tariff',
    number: 9,
    title: 'התערבות ממשלתית במשק פתוח',
    subtitle: 'מכס, פרמיית ייצוא, דאמפינג',
    priority: 'medium',
    examWeight: 'בינוני — 1 שאלה',
    color: '#f59e0b',
  },
  {
    id: 'monopoly',
    number: 10,
    title: 'שוק לא תחרותי: מונופול',
    subtitle: 'MR, MR=MC, נטל עודף, מונופול טבעי',
    priority: 'low',
    examWeight: 'נמוך — לא נבחן בפועל',
    color: '#64748b',
  },
  {
    id: 'solutions',
    number: 11,
    title: 'פתרונות חוברת התרגילים',
    subtitle: 'פתרון מפורט לכל שאלות החוברת + הסבר לרב-ברירה',
    priority: 'high',
    examWeight: 'חיוני לחזרה',
    color: '#10b981',
  },
]
