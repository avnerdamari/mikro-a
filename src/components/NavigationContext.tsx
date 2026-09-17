import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

/* עוזר למידה — Mikro-Tutor, כפאנל צף מוטמע (iframe) במקום window.open לטאב
   נפרד — כדי לעבוד במקביל על הספר והמורה בלי לעזוב את העמוד (build-book
   SKILL.md, "עוזר למידה כפאנל צף מוטמע"; מבוסס Corporate-Finance-App,
   17/9/26). מרוכז כאן (לא ב-App.tsx כמו ההפניה) כדי להתאים למוסכמת-הפרויקט
   הקיימת — כל state-פאנלים אחר (mindMapOpen/searchOpen/sidebarOpen) כבר
   מרוכז ב-NavigationContext, לא מפוזר בין App.tsx לרכיבים. */
const TUTOR_BASE = 'https://mikro-tutor.vercel.app'

interface ReturnPoint {
  chapter: string
  scrollY: number
}

interface NavigationState {
  currentChapter: string
  setCurrentChapter: (chapter: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  /** ניווט לעוגן בפרק אחר (מושג/נוסחה) תוך שמירת המיקום הנוכחי לחזרה. */
  navigateToAnchor: (targetChapter: string, anchorKey: string) => void
  /** העוגן שממתין להיסמן/להיגלל אליו בפרק היעד. הפרק היעד אחראי לצרוך ולאפס אותו. */
  pendingAnchor: string | null
  clearPendingAnchor: () => void
  canGoBack: boolean
  goBack: () => void
  /** מציג/מסתיר את שורת-הפילס הדביקה של תתי-הסעיפים בתוך הפרק הנוכחי (☰ בכותרת). */
  sectionNavOpen: boolean
  toggleSectionNavOpen: () => void
  /** תוויות הסעיפים (H2) שנמצאו בפרק הנוכחי — ריק = אין מה להציג, ה-☰ מוסתר. */
  sectionNavLabels: string[]
  setSectionNavLabels: (labels: string[]) => void
  mindMapOpen: boolean
  setMindMapOpen: (open: boolean) => void
  /** מציג/מסתיר את כל טור הכפתורים הצפים (סקיל build-book §2ו) — נשמר בין ביקורים. */
  floatingButtonsHidden: boolean
  toggleFloatingButtons: () => void
  /** כפתור "🔍 חיפוש" בכותרת (סקיל build-book §2ו) — מודל נפרד מפאנל ה-TOC. */
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  /** "עוזר למידה" — פאנל צף מוטמע (FloatingTutorPanel), לא טאב נפרד. */
  tutorOpen: boolean
  tutorSrc: string
  openTutor: (topic: string, q?: string) => void
  closeTutor: () => void
}

const NavigationContext = createContext<NavigationState | null>(null)

/* חזרה מהמורה (Mikro-Tutor, ?chapter=<id>#<anchorId>) — בלי זה כל חזרה-לספר
   נוחתת תמיד על 'home' (המצב ההתחלתי), בלי קשר לפרק/שאלה שממנה יצא התלמיד,
   כי כל ה-state של האפליקציה הזו הוא בזיכרון בלבד, לא מסונכרן ל-URL בכלל. */
function initialChapterFromUrl(): string {
  if (typeof window === 'undefined') return 'home'
  return new URLSearchParams(window.location.search).get('chapter') || 'home'
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentChapter, setCurrentChapter] = useState(initialChapterFromUrl)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [returnTo, setReturnTo] = useState<ReturnPoint | null>(null)
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null)
  const [sectionNavOpen, setSectionNavOpen] = useState(true)
  const [sectionNavLabels, setSectionNavLabels] = useState<string[]>([])
  const [mindMapOpen, setMindMapOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const [tutorSrc, setTutorSrc] = useState('')
  const openTutor = useCallback((topic: string, q?: string) => {
    const url = `${TUTOR_BASE}/?embedded=1&topic=${encodeURIComponent(topic)}${q ? `&q=${encodeURIComponent(q)}` : ''}`
    setTutorSrc(url)
    setTutorOpen(true)
  }, [])
  const closeTutor = useCallback(() => setTutorOpen(false), [])

  // הודעת-סגירה מה-iframe (Mikro-Tutor, origin שונה) — בדיקת origin כדי לא
  // להגיב להודעות מ-iframe/טאב זר אחר.
  useEffect(() => {
    const tutorOrigin = new URL(TUTOR_BASE).origin
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== tutorOrigin) return
      if ((e.data as { type?: string })?.type === 'closeTutorPanel') closeTutor()
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [closeTutor])
  const [floatingButtonsHidden, setFloatingButtonsHidden] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('mikro-a-floating-hidden') === '1'
  })
  const toggleFloatingButtons = () => {
    setFloatingButtonsHidden(h => {
      const next = !h
      localStorage.setItem('mikro-a-floating-hidden', next ? '1' : '0')
      return next
    })
  }

  const navigateToAnchor = (targetChapter: string, anchorKey: string) => {
    setReturnTo({ chapter: currentChapter, scrollY: window.scrollY })
    setPendingAnchor(anchorKey)
    setCurrentChapter(targetChapter)
  }

  const clearPendingAnchor = () => setPendingAnchor(null)

  const goBack = () => {
    if (!returnTo) return
    const { chapter, scrollY } = returnTo
    setReturnTo(null)
    setPendingAnchor(null)
    setCurrentChapter(chapter)
    // הגלילה חייבת לקרות אחרי שהתוכן של הפרק היעד נרנדר
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, scrollY)))
  }

  return (
    <NavigationContext.Provider value={{
      currentChapter, setCurrentChapter, sidebarOpen, setSidebarOpen,
      navigateToAnchor, pendingAnchor, clearPendingAnchor,
      canGoBack: returnTo !== null, goBack,
      sectionNavOpen, toggleSectionNavOpen: () => setSectionNavOpen(o => !o),
      sectionNavLabels, setSectionNavLabels,
      mindMapOpen, setMindMapOpen,
      floatingButtonsHidden, toggleFloatingButtons,
      searchOpen, setSearchOpen,
      tutorOpen, tutorSrc, openTutor, closeTutor,
    }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be inside NavigationProvider')
  return ctx
}
