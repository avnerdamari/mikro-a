import { useState } from 'react'

/* מחשבון רגיל (4 פעולות + אחוזים) — סקיל build-book §0/§2 "מחשבון":
   כשאין ספר-מקור לשכפל ממנו (בניגוד ל-FC-200V הפיננסי), בונים קומפוננטה
   חדשה מאפס, באותו דפוס-כפתור-צף+פאנל כמו שאר הכפתורים בטור. */

type Op = '+' | '-' | '×' | '÷' | null

function formatDisplay(n: number): string {
  if (!isFinite(n)) return 'שגיאה'
  // עד 10 ספרות משמעותיות, בלי אפסים מיותרים אחרי הנקודה
  const s = n.toPrecision(10).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
  return s.length > 14 ? n.toExponential(4) : s
}

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '×': return a * b
    case '÷': return b === 0 ? NaN : a / b
    default: return b
  }
}

export function RegularCalculator() {
  const [open, setOpen] = useState(false)
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState<number | null>(null)
  const [pendingOp, setPendingOp] = useState<Op>(null)
  const [overwrite, setOverwrite] = useState(true)

  const inputDigit = (d: string) => {
    if (overwrite) { setDisplay(d === '.' ? '0.' : d); setOverwrite(false); return }
    if (d === '.' && display.includes('.')) return
    setDisplay(v => (v === '0' && d !== '.' ? d : v + d))
  }

  const applyOp = (op: Op) => {
    const current = Number(display)
    if (stored === null) {
      setStored(current)
    } else if (pendingOp) {
      setStored(compute(stored, current, pendingOp))
    }
    setPendingOp(op)
    setOverwrite(true)
  }

  const equals = () => {
    if (pendingOp === null) return
    const current = Number(display)
    const result = compute(stored ?? 0, current, pendingOp)
    setDisplay(formatDisplay(result))
    setStored(null)
    setPendingOp(null)
    setOverwrite(true)
  }

  const clear = () => { setDisplay('0'); setStored(null); setPendingOp(null); setOverwrite(true) }
  const backspace = () => setDisplay(v => (v.length > 1 ? v.slice(0, -1) : '0'))
  const percent = () => setDisplay(formatDisplay(Number(display) / 100))
  const toggleSign = () => setDisplay(v => (v.startsWith('-') ? v.slice(1) : v === '0' ? v : '-' + v))

  const digitBtn = 'rounded-lg bg-muted/60 py-2.5 text-base font-semibold text-foreground transition hover:bg-muted active:scale-95'
  const opBtn = 'rounded-lg py-2.5 text-base font-bold text-white transition hover:brightness-110 active:scale-95'

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-36 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110 hover:shadow-xl active:scale-95 active:translate-y-0.5"
        style={{ backgroundColor: 'var(--brand-light, #2E5496)' }}
        title="מחשבון רגיל"
      >
        <span aria-hidden>🧮</span>
        <span>מחשבון</span>
      </button>

      {open && (
        <div
          className="fixed bottom-5 left-44 z-50 w-64 rounded-2xl bg-card p-3 shadow-2xl ring-1 ring-border"
          dir="ltr"
        >
          <div className="mb-2 flex items-center justify-between" dir="rtl">
            <span className="text-xs font-bold text-muted-foreground">מחשבון</span>
            <button onClick={() => setOpen(false)} className="rounded-md px-1.5 text-sm text-muted-foreground hover:bg-muted/60" aria-label="סגור מחשבון">✕</button>
          </div>

          <div className="mb-2 rounded-lg bg-muted/40 px-3 py-2 text-left text-2xl font-bold tabular-nums text-foreground overflow-x-auto">
            {display}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button onClick={clear} className={opBtn} style={{ backgroundColor: '#dc2626' }}>C</button>
            <button onClick={toggleSign} className={digitBtn}>±</button>
            <button onClick={percent} className={digitBtn}>%</button>
            <button onClick={() => applyOp('÷')} className={opBtn} style={{ backgroundColor: 'var(--action, #4F46E5)' }}>÷</button>

            {['7', '8', '9'].map(d => <button key={d} onClick={() => inputDigit(d)} className={digitBtn}>{d}</button>)}
            <button onClick={() => applyOp('×')} className={opBtn} style={{ backgroundColor: 'var(--action, #4F46E5)' }}>×</button>

            {['4', '5', '6'].map(d => <button key={d} onClick={() => inputDigit(d)} className={digitBtn}>{d}</button>)}
            <button onClick={() => applyOp('-')} className={opBtn} style={{ backgroundColor: 'var(--action, #4F46E5)' }}>−</button>

            {['1', '2', '3'].map(d => <button key={d} onClick={() => inputDigit(d)} className={digitBtn}>{d}</button>)}
            <button onClick={() => applyOp('+')} className={opBtn} style={{ backgroundColor: 'var(--action, #4F46E5)' }}>+</button>

            <button onClick={backspace} className={digitBtn}>⌫</button>
            <button onClick={() => inputDigit('0')} className={digitBtn}>0</button>
            <button onClick={() => inputDigit('.')} className={digitBtn}>.</button>
            <button onClick={equals} className={opBtn} style={{ backgroundColor: '#1F6F3F' }}>=</button>
          </div>
        </div>
      )}
    </>
  )
}
