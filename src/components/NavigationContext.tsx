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
}

const NavigationContext = createContext<NavigationState | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentChapter, setCurrentChapter] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [returnTo, setReturnTo] = useState<ReturnPoint | null>(null)
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null)

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
