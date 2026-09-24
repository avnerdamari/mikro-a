/* חזרה אל מפת הפתרון (מקור: Kalkala-Book). צ'יפ "נלמד" קופץ לפרק התיאוריה, ופרק התרגול מתפרק — ואיתו
   רמת-הקושי שנבחרה, הפתרון המלא הפתוח ושלב המפה. לכן לפני הקפיצה נשמרים: הרמה, איזה פותר (לפי סדרו
   בעמוד), איזו מפה ובאיזה שלב. בחזרה ExerciseSection פותח את אותה רמה, GuidedSolver באותו סדר נפתח
   שוב במצב "full" ו-SolveGraph חוזר לשלב. */
export type SolveReturn = { solver: number; demo: string; step: number; level?: string; anchor?: string }

let pending: SolveReturn | null = null

export const markSolveReturn = (p: SolveReturn) => { pending = p }
export const peekSolveReturn = () => pending
export const clearSolveReturn = () => { pending = null }

export const SOLVER_ATTR = 'data-guided-solver'
export const LEVEL_ATTR = 'data-exercise-level'
export const solverIndex = (el: Element) => Array.from(document.querySelectorAll(`[${SOLVER_ATTR}]`)).indexOf(el)
