import { useNavigation } from './NavigationContext'

/** כפתור קטן ליד נוסחה בפרק תיאוריה — קופץ לעוגן שלה בנספח הנוסחאות, עם חזרה מדויקת.
    formulaKey חייב להתאים ל-key של שורה ב-AppendixFormulas.tsx. */
export function FormulaLink({ formulaKey }: { formulaKey: string }) {
  const { navigateToAnchor } = useNavigation()
  return (
    <button
      type="button"
      onClick={() => navigateToAnchor('formulas', formulaKey)}
      className="inline-flex items-center gap-1 rounded-md border border-cyan-300 bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-cyan-700 hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300"
    >
      📐 נוסחה בנספח
    </button>
  )
}
