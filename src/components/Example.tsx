import { useState, type ReactNode } from 'react'

/* דוגמה פתורה — אותו חוזה חזותי בדיוק כמו Example ב-Finance-App (src/components/ui.tsx):
   כרטיס slate, כותרת בצבע מותג, בדיקת תשובה אופציונלית, ו"הצג פתרון" שחושף
   תיבה ירקרקה עם הפתרון המלא. */

interface Props {
  title: string
  q: ReactNode
  answer?: number
  tol?: number
  unit?: string
  children: ReactNode
}

export function Example({ title, q, answer, tol = 0.5, unit, children }: Props) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState('')
  const [status, setStatus] = useState<null | boolean>(null)

  const check = () => {
    const x = Number(val.replace(/,/g, ''))
    if (!isFinite(x) || answer === undefined) { setStatus(false); return }
    setStatus(Math.abs(x - answer) <= tol)
  }

  return (
    <div className="my-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
      <div className="font-bold text-indigo-700 dark:text-indigo-300">{title}</div>
      <div className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{q}</div>

      {answer !== undefined && (
        <div className="mt-2 flex items-center gap-2" dir="ltr">
          <input
            dir="ltr"
            inputMode="decimal"
            value={val}
            onChange={e => { setVal(e.target.value); setStatus(null) }}
            onKeyDown={e => { if (e.key === 'Enter' && val.trim()) check() }}
            placeholder="התשובה שלך"
            className="w-32 rounded-lg border border-slate-300 px-2 py-1 text-center outline-none focus:ring-1 focus:ring-indigo-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          {unit && <span className="text-sm text-slate-500 dark:text-slate-400">{unit}</span>}
          <button onClick={check} className="rounded-lg bg-indigo-600 px-3 py-1 text-sm font-bold text-white transition hover:brightness-110 active:scale-95">בדוק</button>
          {status === true && <span className="font-bold text-emerald-600">✓ נכון!</span>}
          {status === false && <span className="font-bold text-red-500">✗ נסה שוב</span>}
        </div>
      )}

      <div className="mt-3">
        <button
          onClick={() => setOpen(o => !o)}
          className="rounded-lg bg-indigo-700 px-4 py-1.5 text-sm font-bold text-white transition hover:brightness-110 active:scale-95"
        >
          {open ? 'הסתר פתרון' : 'הצג פתרון'}
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 rounded-lg bg-emerald-50 px-3 py-3 dark:bg-emerald-950/40 dark:text-slate-100">
          {children}
        </div>
      )}
    </div>
  )
}
