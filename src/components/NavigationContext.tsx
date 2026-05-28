import { createContext, useContext, useState, type ReactNode } from 'react'

interface NavigationState {
  currentChapter: string
  setCurrentChapter: (chapter: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const NavigationContext = createContext<NavigationState | null>(null)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentChapter, setCurrentChapter] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <NavigationContext.Provider value={{ currentChapter, setCurrentChapter, sidebarOpen, setSidebarOpen }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error('useNavigation must be inside NavigationProvider')
  return ctx
}
