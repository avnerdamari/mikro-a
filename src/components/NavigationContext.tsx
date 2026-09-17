import { createContext, useContext, useState, type ReactNode } from 'react'

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
