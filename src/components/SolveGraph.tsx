import { isValidElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { MathText } from './MathText'
import { useNavigation } from './NavigationContext'
import { GROUPS } from '@/pages/chapters/AppendixFormulas'
import { CHAPTERS } from '@/data/toc'
import { clearSolveReturn, LEVEL_ATTR, markSolveReturn, peekSolveReturn, SOLVER_ATTR, solverIndex } from '@/lib/solveReturn'

/* "מפת הפתרון" — מועתק מ-Kalkala-Book (components/SolveGraph.tsx, 24/9/26) ומותאם ל-Mikro-A:
   · שורות הנוסחה בקופסת הפרק — מ-GROUPS של נספח הנוסחאות (AppendixFormulas), לא מ-blackBoxes;
     נוסחה שחסרה שם מתווספת דרך extraRows של המפה (חייבת key).
   · צ'יפ "נלמד" — navigateToAnchor(פרק התיאוריה, src.section); ChapterLayout גולל לאלמנט עם אותו id.
   · בלי מחלקות dark: — ב-Mikro-A המצב הכהה הוא מחלקת ‎.dark‎ עם דריסות ב-index.css, לא media.
   העיקרון (אבנר, 23-24/9/26): התנועה תמיד קדימה — כל צעד הוא בלוק חדש בהמשך העמוד, כל החצים יורדים.
   (א) זיהוי, pre-order: אליפסה עם הנוסחה המבוקשת → בלוק "הצבה בנוסחה" קבוע לכל סימן חסר (נוסחה כללית בלבד).
   (ב) חישוב, post-order: בלוק "הצבה בבלוק N" חדש לכל סימן (העמוק ראשון) → "הצבה בבלוק 1" → תשובה סופית.
   קופסת "פרק X" רק ליד בלוקי-זיהוי; קופסת "נתוני השאלה" ליד בלוקי-החישוב (שם הנתון מוצב בפועל). */

export function M({ children }: { children: string }) {
  return <MathText math={children} />
}

export type Src = { chapter: number; section: string; label: string }
export type Given = { sym: string; plain?: boolean; block?: boolean; value: ReactNode } // block = הערך (טבלה) תופס שורה מלאה, בלי "="
export type Need = { sym: string; plain?: boolean; note?: ReactNode; node: TreeNode }
export type TreeNode = {
  want: string          // הסימן שמחפשים (LaTeX)
  wantPlain?: boolean   // true = טקסט עברי ולא LaTeX
  row: string           // key של שורת נוסחה (GROUPS בנספח הנוסחאות, או extraRows)
  src: Src              // פרק + id של האלמנט המדויק בפרק התיאוריה + תווית — לצ'יפ "נלמד"
  explain?: ReactNode   // משפט אינטואיציה קצר — למה הנוסחה הזו מתאימה כאן
  given?: Given[]       // נתונים שכתובים בשאלה עצמה
  needs?: Need[]        // סימנים שחסרים ← צומת-בן עם הנוסחה שלהם
  partial?: string      // LaTeX אופציונלי: רישום הנוסחה חלקית עם הנתון
  compute: string       // LaTeX של ההצבה והחישוב
  result?: string       // LaTeX של הערך שיוצא מהשלב
  resultText?: string   // או טקסט עברי
}
export type BoxRow = { key: string; label?: string; tex?: string; text?: string }
export type SolveDemo = {
  id: string
  extraRows?: { chapter: number; row: BoxRow }[]
  askFormula?: string   // הנוסחה הראשונית במלואה — מוצגת באליפסה
  root: TreeNode
}

const CHAPTER_NAMES: Record<number, string> = Object.fromEntries(
  CHAPTERS.filter(c => !c.id.endsWith('-practice') && c.number >= 1 && c.number <= 10).map(c => [c.number, c.title]),
)
const theoryId = (n: number) => CHAPTERS.find(c => c.number === n && !c.id.endsWith('-practice'))?.id ?? 'home'

type Flat = { id: string; node: TreeNode; parent: string | null; sym?: string; symPlain?: boolean; note?: ReactNode }
function flatten(n: TreeNode, id: string, parent: string | null, out: Flat[], via?: Need) {
  out.push({ id, node: n, parent, sym: via?.sym, symPlain: via?.plain, note: via?.note })
  n.needs?.forEach((nd, i) => flatten(nd.node, `${id}-${i}`, id, out, nd))
}

/** הטקסט שבתוך ערך-נתון — מפתח לאיחוד נתונים כפולים בקופסת "כל נתוני השאלה" */
function textOf(n: ReactNode): string {
  if (n == null || typeof n === 'boolean') return ''
  if (typeof n === 'string' || typeof n === 'number') return String(n)
  if (Array.isArray(n)) return n.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(n)) return textOf(n.props.children)
  return ''
}

function Sym({ s, plain }: { s: string; plain?: boolean }) {
  return plain ? <b>{s}</b> : <span dir="ltr" className="font-bold"><M>{s}</M></span>
}
function Val({ n }: { n: TreeNode }) {
  return n.result ? <span dir="ltr"><M>{n.result}</M></span> : n.resultText ? <span>{n.resultText}</span> : null
}
/** "השרשרת" — כל התלויות מלמעלה למטה, כדי לראות איפה הכול מתחיל לפני שיורדים לחישוב */
function ChainPreview({ node }: { node: TreeNode }) {
  return (
    <span className="inline">
      <Sym s={node.want} plain={node.wantPlain} />
      {node.needs?.map((n, i) => (
        <span key={i}>
          <span className="mx-1 text-slate-400">תלוי ב-</span>
          <ChainPreview node={n.node} />
        </span>
      ))}
    </span>
  )
}

type Ev = { kind: 'ask' | 'partial' | 'identify' | 'compute' | 'root' | 'answer'; id?: string; caption: ReactNode }
type At = { partial: number; identify: Record<string, number>; compute: Record<string, number>; root: number; answer: number }

type R = { l: number; r: number; t: number; b: number; cx: number; cy: number }
type Pt = { x: number; y: number }
type Kind = 'flow' | 'data' | 'fetch'
type Geo = { key: string; kind: Kind; d: string; at: number; both?: boolean; label?: { x: number; y: number; node: ReactNode } }
type EdgeDef = { key: string; kind: Kind; from: string; to: string; at: number; both?: boolean; label?: ReactNode }

const f1 = (n: number) => n.toFixed(1)
/** חץ אופקי בתוך אותה שורה */
function hPath(a: R, b: R): { d: string; m: Pt } {
  const toLeft = b.cx < a.cx
  const p0 = { x: toLeft ? a.l : a.r, y: a.cy }, p3 = { x: toLeft ? b.r : b.l, y: b.cy }
  const k = Math.max(20, Math.abs(p3.x - p0.x) / 2)
  const s = toLeft ? -1 : 1
  const p1 = { x: p0.x + s * k, y: p0.y }, p2 = { x: p3.x - s * k, y: p3.y }
  const m = { x: 0.125 * p0.x + 0.375 * p1.x + 0.375 * p2.x + 0.125 * p3.x, y: 0.125 * p0.y + 0.375 * p1.y + 0.375 * p2.y + 0.125 * p3.y }
  return { d: `M ${f1(p0.x)} ${f1(p0.y)} C ${f1(p1.x)} ${f1(p1.y)} ${f1(p2.x)} ${f1(p2.y)} ${f1(p3.x)} ${f1(p3.y)}`, m }
}
/** חץ אנכי בשדרה: מתחתית a לראש b (יורד תמיד) */
function vPath(a: R, b: R): { d: string; m: Pt } {
  const x = (a.cx + b.cx) / 2
  return { d: `M ${f1(x)} ${f1(a.b)} L ${f1(x)} ${f1(b.t)}`, m: { x, y: (a.b + b.t) / 2 } }
}

// צבעים מפורשים (לא מחלקות שנבנות דינמית) — אחרת ראשי-החץ יוצאים שחורים וענקיים
const STROKE: Record<Kind, string> = { flow: '#1F3864', data: '#64748b', fetch: '#f59e0b' }
const LABEL_CLS: Record<Kind, string> = { flow: 'text-brand', data: 'text-slate-600', fetch: 'text-amber-700' }

export function SolveGraph({ demo }: { demo: SolveDemo }) {
  const { navigateToAnchor } = useNavigation()
  const flat = useMemo(() => { const o: Flat[] = []; flatten(demo.root, '0', null, o); return o }, [demo])
  const root = flat[0]
  const kids = useMemo(() => {
    const out: Flat[] = []
    const walk = (id: string) => { flat.filter(x => x.parent === id).forEach(c => { walk(c.id); out.push(c) }) }
    walk('0')
    return out
  }, [flat])
  const hasPartial = kids.length > 0 && !!root.node.partial

  const rowsOf = useCallback((n: number): BoxRow[] => {
    const base: BoxRow[] = (GROUPS.find(g => g.chapter === n)?.rows ?? []).map(r => ({ key: r.key, label: r.label, tex: r.math }))
    const extras = (demo.extraRows ?? []).filter(x => x.chapter === n && !base.some(b => b.key === x.row.key)).map(x => x.row)
    return [...base, ...extras]
  }, [demo])
  const rowOf = useCallback((f: Flat) => rowsOf(f.node.src.chapter).find(r => r.key === f.node.row), [rowsOf])
  const FormulaOf = ({ f }: { f: Flat }) => {
    const r = rowOf(f)
    return r?.tex ? <span dir="ltr"><M>{r.tex}</M></span> : r?.text ? <span>{r.text}</span> : <Sym s={f.node.want} plain={f.node.wantPlain} />
  }

  const { evs, at } = useMemo(() => {
    const evs: Ev[] = []
    const at: At = { partial: -1, identify: {}, compute: {}, root: -1, answer: -1 }
    evs.push({ kind: 'ask', caption: <>מבקשים למצוא: <Sym s={root.node.want} plain={root.node.wantPlain} />. הנוסחה שלו (פרק {root.node.src.chapter}) — באליפסה; משם ממשיכים פנימה, סימן-סימן. בצד — כל נתוני השאלה, עוד לפני שמשתמשים בהם.</> })
    if (hasPartial) {
      at.partial = evs.length
      evs.push({ kind: 'partial', caption: <>רושמים את הנוסחה חלקית עם {root.node.given?.length ? <>הנתון שכתוב בשאלה (חץ "נתון")</> : <>מה שכבר ידוע</>}. חסר עדיין: {root.node.needs!.map((n, i) => <span key={i}>{i ? ', ' : ''}<Sym s={n.sym} plain={n.plain} /></span>)}.</> })
    }
    for (const k of flat.slice(1)) {
      at.identify[k.id] = evs.length
      evs.push({ kind: 'identify', id: k.id, caption: <>חסר <Sym s={k.sym ?? k.node.want} plain={k.symPlain} />{k.note ? <> — {k.note}</> : null}. הנוסחה שלו בפרק {k.node.src.chapter}: ממשיכים איתה (חץ "נוסחה").</> })
    }
    for (const k of kids) {
      at.compute[k.id] = evs.length
      const blockNum = at.identify[k.id] + 1
      evs.push({ kind: 'compute', id: k.id, caption: <>פותחים בלוק חדש — הצבה בבלוק {blockNum} (<Sym s={k.sym ?? k.node.want} plain={k.symPlain} />): מציבים בנוסחה{k.node.given?.length ? <> את הנתון מהשאלה</> : null}: <span dir="ltr"><M>{k.node.compute}</M></span>.</> })
    }
    at.root = evs.length
    evs.push({ kind: 'root', caption: <>{kids.length ? <>כל הסימנים ידועים — </> : null}פותחים בלוק חדש — הצבה בבלוק 1 (הנוסחה המקורית): מציבים{!hasPartial && root.node.given?.length ? <> את הנתונים מהשאלה</> : null}: <span dir="ltr"><M>{root.node.compute}</M></span>.</> })
    at.answer = evs.length
    evs.push({ kind: 'answer', caption: <>התשובה הסופית: <Val n={root.node} />.</> })
    return { evs, at }
  }, [root, flat, kids, hasPartial])

  const [step, setStep] = useState(() => { const p = peekSolveReturn(); return p && p.demo === demo.id ? Math.min(p.step, evs.length - 1) : 0 })
  // בחזרה גוללים אל הקופסה שממנה קפצו — אחרי שחזור-הגלילה של goBack (שמניח שאותם פתרונות פתוחים כמו קודם)
  useEffect(() => {
    const p = peekSolveReturn()
    if (p?.demo !== demo.id) return
    clearSolveReturn()
    if (!p.anchor) return
    // בלי cleanup שמבטל את הטיימר: ב-StrictMode ה-effect רץ פעמיים, והריצה השנייה כבר לא מוצאת את הבקשה
    window.setTimeout(() => document.getElementById(p.anchor!)?.scrollIntoView({ behavior: 'instant', block: 'center' }), 150)
  }, [demo.id])
  const last = evs.length - 1
  const cur = evs[step]

  type Row = { key: string; at: number; given?: Given[]; kid?: Flat; kind: 'ellipse' | 'partial' | 'identify' | 'close' | 'closeRoot' | 'answer' }
  const rows = useMemo<Row[]>(() => {
    const seen = new Set<string>()
    const all: Given[] = []
    flat.forEach(f => f.node.given?.forEach(g => {
      const k = `${g.sym}|${textOf(g.value)}`
      if (!seen.has(k)) { seen.add(k); all.push(g) }
    }))
    const s: Row[] = [{ key: 'ellipse', at: 0, kind: 'ellipse', given: all }]
    if (hasPartial) s.push({ key: 'partial', at: at.partial, given: root.node.given, kind: 'partial' })
    flat.slice(1).forEach(k => s.push({ key: `id-${k.id}`, at: at.identify[k.id], kid: k, kind: 'identify' }))
    kids.forEach(k => s.push({ key: `cl-${k.id}`, at: at.compute[k.id], given: k.node.given, kid: k, kind: 'close' }))
    s.push({ key: 'closeRoot', at: at.root, given: !hasPartial ? root.node.given : undefined, kind: 'closeRoot' })
    s.push({ key: 'answer', at: at.answer, kind: 'answer' })
    return s
  }, [hasPartial, flat, kids, at, root])

  const contRef = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<{ w: number; h: number; edges: Geo[] }>({ w: 0, h: 0, edges: [] })

  const defs = useMemo<EdgeDef[]>(() => {
    const out: EdgeDef[] = []
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1], nx = rows[i]
      out.push({ key: `flow-${nx.key}`, kind: 'flow', from: `[data-spine="${prev.key}"]`, to: `[data-spine="${nx.key}"]`, at: nx.at })
    }
    for (const row of rows) {
      if (row.given?.length && row.kind !== 'ellipse') out.push({ key: `data-${row.key}`, kind: 'data', from: `[data-datacar="${row.key}"]`, to: `[data-spine="${row.key}"]`, at: row.at, label: 'נתון' })
      if (row.kind !== 'identify') continue
      if (row.kid) out.push({ key: `fetch-${row.key}`, kind: 'fetch', from: `[data-spine="${row.key}"]`, to: `[data-chcar="${row.key}"]`, at: row.at, both: true, label: 'נוסחה' })
    }
    return out
  }, [rows])

  const measure = useCallback(() => {
    const cont = contRef.current
    if (!cont) return
    const base = cont.getBoundingClientRect()
    const rect = (el: Element | null): R | null => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      const l = r.left - base.left, rr = r.right - base.left, t = r.top - base.top, b = r.bottom - base.top
      return { l, r: rr, t, b, cx: (l + rr) / 2, cy: (t + b) / 2 }
    }
    const q = (sel: string) => rect(cont.querySelector(sel))
    const isNarrow = base.width < 768
    const edges: Geo[] = []
    for (const e of defs) {
      if (isNarrow && e.kind !== 'flow') continue
      const a = q(e.from), b = q(e.to)
      if (!a || !b) continue
      const { d, m } = e.kind === 'flow' ? vPath(a, b) : hPath(a, b)
      edges.push({ key: e.key, kind: e.kind, d, at: e.at, both: e.both, label: e.label ? { x: e.kind === 'flow' ? m.x + 8 : m.x, y: m.y, node: e.label } : undefined })
    }
    setGeo({ w: base.width, h: base.height, edges })
  }, [defs])

  useLayoutEffect(() => { measure() }, [measure, step])
  useEffect(() => {
    const cont = contRef.current
    if (!cont) return
    let raf = 0
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    const ro = new ResizeObserver(on)
    ro.observe(cont)
    window.addEventListener('resize', on)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('resize', on) }
  }, [measure])

  // סרגל הבקרה דביק מתחת לכותרת הקבועה (header) ולשורת-הפילס הדביקה של הסעיפים, אם מוצגת
  const [stickyTop, setStickyTop] = useState(56)
  useEffect(() => {
    const upd = () => {
      const h = document.querySelector('header')?.getBoundingClientRect().bottom ?? 56
      const nav = document.querySelector('[data-section-nav]')?.getBoundingClientRect()
      const stuck = !!nav && nav.height > 0 && nav.top <= h + 2 && nav.bottom > 0
      const t = Math.max(0, Math.round(stuck && nav ? Math.max(h, nav.bottom) : h)) - 1
      setStickyTop(c => (Math.abs(c - t) > 1 ? t : c))
    }
    upd()
    const onScroll = () => { upd(); requestAnimationFrame(upd) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', upd)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', upd) }
  }, [])

  const boxBorder = 'border-brand'
  const chip = 'bg-brand text-white'
  const btn = 'rounded-full px-3 py-1 text-xs font-bold transition active:scale-95'
  const focusKey = cur.kind === 'ask' ? 'ellipse' : cur.kind === 'partial' ? 'partial' : cur.kind === 'root' ? 'closeRoot' : cur.kind === 'answer' ? 'answer' : cur.kind === 'identify' ? `id-${cur.id}` : `cl-${cur.id}`
  const shownCls = (when: number) => (when <= step ? 'opacity-100' : 'pointer-events-none opacity-0 max-md:hidden')
  const emptyCell = <div className="hidden md:block" />

  const stepBox = (key: string, when: number, title: ReactNode, body: ReactNode) => (
    <div
      data-spine={key}
      className={`relative w-full rounded-lg border-2 bg-white px-3 py-2 text-center transition-opacity duration-500 ${shownCls(when)} ${focusKey === key ? 'border-amber-500 ring-2 ring-amber-400' : boxBorder}`}
    >
      <span className={`absolute -top-2.5 start-2 rounded-full px-1.5 text-[10px] font-extrabold leading-4 ${chip}`}>{when + 1}</span>
      <div className="text-[11px] font-bold text-slate-500">{title}</div>
      <div className="mt-0.5 overflow-x-auto py-1.5 text-[13px]">{body}</div>
    </div>
  )
  const learnChip = (f: Flat) => (
    <button
      type="button"
      onClick={e => {
        const host = e.currentTarget.closest(`[${SOLVER_ATTR}]`)
        const level = e.currentTarget.closest(`[${LEVEL_ATTR}]`)?.getAttribute(LEVEL_ATTR) ?? undefined
        if (host) markSolveReturn({ solver: solverIndex(host), demo: demo.id, step, level, anchor: `solve-${demo.id}-${f.id}` })
        navigateToAnchor(theoryId(f.node.src.chapter), f.node.src.section)
      }}
      title="קפיצה למקום בפרק שמלמד את הנוסחה (עם חזרה)"
      className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold transition active:scale-95 ${chip}`}
    >
      נלמד: פרק {f.node.src.chapter} · {f.node.src.label} ←
    </button>
  )

  const dataCar = (rowKey: string, when: number, items?: Given[]) => {
    if (!items?.length) return emptyCell
    const title = rowKey === 'ellipse' ? 'כל נתוני השאלה' : 'נתוני השאלה'
    return (
      <div data-datacar={rowKey} className={`h-fit overflow-hidden rounded-xl border-[3px] border-slate-700 bg-white shadow-lg transition-opacity duration-500 ${shownCls(when)}`}>
        <div className="bg-slate-700 px-2 py-1 text-center text-[12px] font-extrabold text-white">{title}</div>
        <ul className="space-y-1 p-2">
          {items.map((g, i) => (
            <li key={i} className="flex flex-wrap items-baseline gap-x-1.5 rounded bg-slate-100 px-1.5 py-0.5 text-[13px] font-semibold leading-tight">
              <Sym s={g.sym} plain={g.plain} />
              {g.block ? <div className="mt-1 w-full">{g.value}</div> : <><span className="text-slate-500">=</span><span className="text-slate-800">{g.value}</span></>}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  const chapterCar = (row: Row) => {
    const k = row.kid
    if (!k || row.kind !== 'identify') return emptyCell
    const r = rowOf(k)
    const foc = cur.id === k.id && cur.kind === 'identify'
    return (
      <div data-chcar={row.key} className={`h-fit rounded-xl border-2 bg-white px-3 py-2 transition-opacity duration-500 ${boxBorder} ${shownCls(row.at)}`}>
        <div className="mb-1 text-center text-[12px] font-extrabold text-slate-700">פרק {k.node.src.chapter} · {CHAPTER_NAMES[k.node.src.chapter]}</div>
        <div id={`solve-${demo.id}-${k.id}`} className={`scroll-mt-28 rounded px-1.5 py-1 text-[11px] leading-tight transition ${foc ? 'bg-amber-100 ring-2 ring-amber-400' : 'bg-slate-50'}`}>
          {r?.label && <div className="text-[10px] font-semibold text-slate-500">{r.label}</div>}
          <div className="overflow-x-auto py-1.5 text-[12px]"><FormulaOf f={k} /></div>
          {k.node.explain && <div className="mt-1 text-[10px] font-normal leading-snug text-slate-500">💡 {k.node.explain}</div>}
          {learnChip(k)}
        </div>
      </div>
    )
  }

  const closedPill = <span className="mb-0.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">תוצאת חישוב ביניים ✓</span>
  const rowBody = (row: Row): ReactNode => {
    if (row.key === 'ellipse') {
      return (
        <div
          data-spine="ellipse"
          id={`solve-${demo.id}-0`}
          className={`relative mx-auto flex min-w-[10rem] max-w-full flex-col items-center rounded-[50%] border-2 bg-white px-8 py-3 text-center ${focusKey === 'ellipse' ? 'border-amber-500 ring-2 ring-amber-400' : boxBorder}`}
        >
          <span className={`absolute -top-2.5 start-2 rounded-full px-1.5 text-[10px] font-extrabold leading-4 ${chip}`}>1</span>
          <div className="text-[11px] font-bold text-slate-500">נוסחה</div>
          <div className="text-base">{demo.askFormula ? <span dir="ltr"><M>{demo.askFormula}</M></span> : <FormulaOf f={root} />}</div>
          {root.node.explain && <div className="mt-1 max-w-[16rem] text-[11px] leading-snug text-slate-500">💡 {root.node.explain}</div>}
          {kids.length > 0 && (
            <div className="mt-1.5 max-w-[18rem] text-[11px] leading-snug text-slate-600">
              <span className="font-bold text-slate-500">השרשרת המלאה: </span>
              <ChainPreview node={root.node} />
            </div>
          )}
          {learnChip(root)}
        </div>
      )
    }
    if (row.key === 'partial') {
      return stepBox('partial', row.at, 'רישום הנוסחה חלקית עם הנתון', root.node.partial ? <span dir="ltr"><M>{root.node.partial}</M></span> : <FormulaOf f={root} />)
    }
    if (row.key === 'closeRoot') {
      return stepBox('closeRoot', row.at, 'הצבה בבלוק 1 — הנוסחה המקורית',
        <>{closedPill}<div dir="ltr" className="font-semibold text-emerald-700"><M>{root.node.compute}</M></div></>)
    }
    if (row.key === 'answer') {
      return (
        <div
          data-spine="answer"
          className={`relative w-full rounded-lg border-2 border-emerald-600 bg-emerald-50 px-3 py-2 text-center transition-opacity duration-500 ${shownCls(row.at)} ${focusKey === 'answer' ? 'ring-2 ring-amber-400' : ''}`}
        >
          <span className="absolute -top-2.5 start-2 rounded-full bg-emerald-600 px-1.5 text-[10px] font-extrabold leading-4 text-white">{row.at + 1}</span>
          <div className="text-[11px] font-bold text-emerald-800">תשובה סופית</div>
          <div className="text-base font-bold text-emerald-800"><Val n={root.node} /></div>
        </div>
      )
    }
    const k = row.kid!
    if (row.kind === 'identify') {
      return stepBox(row.key, row.at, <>הצבה בנוסחה — <Sym s={k.sym ?? k.node.want} plain={k.symPlain} /></>, <FormulaOf f={k} />)
    }
    const blockNum = at.identify[k.id] + 1
    return stepBox(row.key, row.at, <>הצבה בבלוק {blockNum} — <Sym s={k.sym ?? k.node.want} plain={k.symPlain} /></>,
      <>
        {closedPill}
        <div className="text-[11px] text-slate-500"><FormulaOf f={k} /></div>
        <div dir="ltr" className="mt-0.5 font-semibold text-emerald-700"><M>{k.node.compute}</M></div>
      </>)
  }

  return (
    <div className="space-y-3">
      <div style={{ top: stickyTop }} className="sticky z-20 rounded-xl border border-slate-200 bg-white p-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setStep(s => Math.min(last, s + 1))} disabled={step >= last} className={`${btn} ${chip} disabled:opacity-40`}>הבא ←</button>
          <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step <= 0} className={`${btn} bg-slate-200 text-slate-700 disabled:opacity-40`}>→ הקודם</button>
          <button type="button" onClick={() => setStep(0)} className={`${btn} bg-slate-200 text-slate-700`}>מההתחלה</button>
          <button type="button" onClick={() => setStep(last)} className={`${btn} bg-slate-200 text-slate-700`}>הצג הכול</button>
          <span className="ms-auto text-xs font-semibold text-slate-500">שלב {step + 1} מתוך {last + 1}</span>
        </div>
        <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-slate-800">{cur?.caption}</p>
      </div>

      {/* המפה: כל שורה = נתון (ימין) | שדרה (מרכז) | פרק (שמאל) */}
      <div ref={contRef} className="relative isolate rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[minmax(9rem,13rem)_minmax(12rem,24rem)_minmax(9rem,13rem)] md:items-center md:gap-x-8 md:gap-y-8">
          {rows.map(row => (
            <div key={row.key} className="flex flex-col items-stretch gap-2 md:contents">
              {dataCar(row.key, row.at, row.given)}
              {rowBody(row)}
              {chapterCar(row)}
            </div>
          ))}
        </div>

        <svg className="pointer-events-none absolute inset-0 overflow-visible" width={geo.w} height={geo.h} aria-hidden>
          <defs>
            {(['flow', 'data', 'fetch'] as const).map(k => (
              <marker key={k} id={`sg-${demo.id}-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={STROKE[k]} />
              </marker>
            ))}
          </defs>
          {geo.edges.map(e => e.at <= step && (
            <path
              key={e.key}
              d={e.d}
              fill="none"
              stroke={STROKE[e.kind]}
              opacity={e.at === step ? 1 : 0.75}
              strokeWidth={e.at === step ? 2.6 : 1.8}
              markerEnd={`url(#sg-${demo.id}-${e.kind})`}
              markerStart={e.both ? `url(#sg-${demo.id}-${e.kind})` : undefined}
            />
          ))}
        </svg>
        {geo.edges.map(e => e.at <= step && e.label && (
          <div
            key={`l-${e.key}`}
            className={`pointer-events-none absolute z-10 -translate-y-1/2 whitespace-nowrap rounded bg-white/95 px-1 text-[11px] font-bold leading-4 shadow-sm ${e.kind === 'flow' ? '' : '-translate-x-1/2'} ${LABEL_CLS[e.kind]}`}
            style={{ left: e.label.x, top: e.label.y }}
          >
            {e.label.node}
          </div>
        ))}
      </div>
    </div>
  )
}

/** טבלה קטנה (למשל L/TP או Q/TC) לערך-נתון block בקופסת "נתוני השאלה" */
export function MapTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <table dir="ltr" className="w-full border-collapse text-center text-[11px]">
      <tbody>
        {[head, ...rows].map((cells, i) => (
          <tr key={i} className={i === 0 ? 'bg-slate-200 font-bold' : ''}>
            {cells.map((c, j) => <td key={j} className="border border-slate-300 px-1 py-0.5">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** כרטיס "מפת הפתרון" בתוך הפתרון המלא — מפה אחת, או מפה לכל סעיף (שאלה עם כמה סעיפים) */
export type ExerciseMap = SolveDemo | { label: string; demo: SolveDemo }[]
export function MapSec({ map }: { map: ExerciseMap }) {
  const parts = Array.isArray(map) ? map : [{ label: '', demo: map }]
  return (
    <div className="space-y-4">
      {parts.map(p => (
        <div key={p.demo.id}>
          <p className="mb-1 text-sm font-bold text-emerald-700">🗺️ מפת הפתרון{p.label ? <> — {p.label}</> : null} — איך מגיעים לתשובה בעזרת הפרקים</p>
          <SolveGraph demo={p.demo} />
        </div>
      ))}
    </div>
  )
}
