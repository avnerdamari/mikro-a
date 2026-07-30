import type { ReactNode } from 'react'
import { useNavigation } from './NavigationContext'

/** עוטף אזכור ראשון של מושג בפרק — קליק קופץ לנספח המושגים עם הדגשה,
    ושומר את המיקום הנוכחי כדי ש"→ חזרה" יחזיר לכאן בדיוק.
    anchorKey חייב להתאים ל-key של מונח ב-AppendixGlossary.tsx. */
export function LinkedTerm({ anchorKey, children }: { anchorKey: string; children: ReactNode }) {
  const { navigateToAnchor } = useNavigation()
  return (
    <button
      type="button"
      onClick={() => navigateToAnchor('glossary', anchorKey)}
      className="underline decoration-dotted decoration-amber-500 decoration-2 underline-offset-2 text-inherit hover:text-amber-700 dark:hover:text-amber-400"
    >
      {children}
    </button>
  )
}
