import type { ReactNode } from 'react'
import { M, type BoxRow, type SolveDemo, type Src } from '@/components/SolveGraph'

/* מפות הפתרון (SolveGraph) של תרגול פרק 2 — מוצגות בפתרון המלא של כל תרגיל (שדה map ב-Exercise).
   כל מפה = עץ: הנוסחה שמבקשים ← מה חסר ← הנוסחה שלו בפרק 2. המספרים — רק מהפתרון הקיים של התרגיל.
   שורות הקופסה: GROUPS בנספח הנוסחאות (פרק 2) + EXTRA למטה (נוסחאות שמופיעות בפרק 2 ואין להן שורה בנספח).
   ⚠️ לכתוב את הקובץ בכלי Write בלבד — סקריפט/heredoc מאבד backslashes בנוסחאות. */

const r = String.raw

const SRC_F: Src = { chapter: 2, section: 'learn-production-formulas', label: '2.1' }
const SRC_DIM: Src = { chapter: 2, section: 'learn-production-diminishing', label: '2.2' }
const SRC_HIRE: Src = { chapter: 2, section: 'learn-production-hiring', label: '2.3' }
const SRC_PROFIT: Src = { chapter: 2, section: 'learn-production-profit', label: '2.3' }

const row = (key: string, label: string, tex?: string, text?: string): { chapter: number; row: BoxRow } =>
  ({ chapter: 2, row: { key, label, tex, text } })
const EXTRA = [
  row('p2-mp-diff', 'מפרק 2 (2.1): תפוקה שולית בין רמות סמוכות', r`MP_L = TP_L - TP_{L-1}`),
  row('p2-hire-check', 'מפרק 2 (2.3): כלל ההחלטה', r`VMP_L \geq W`),
  row('p2-lstar', 'מפרק 2 (2.3): מספר העובדים האופטימלי', r`L^{*} = \max\{L : VMP_L \geq W\}`),
  row('p2-profit', 'מפרק 2 (2.3): רווח', r`\pi = TR - TC`),
  row('p2-tr', 'מפרק 2 (2.3): פדיון', r`TR = P \times TP`),
  row('p2-tc', 'מפרק 2 (2.3): עלות העבודה', r`TC = L \times W`),
  row('p2-diminishing', 'מפרק 2 (2.2): חוק התפוקה השולית הפוחתת', undefined, 'כל עובד נוסף (עם אותו הון) מוסיף פחות — MP יורד'),
  row('p2-w-eff', 'מהתרגיל: עלות העובד למעסיק אחרי סובסידיה', r`W_{eff} = W - s`),
  row('p2-unemp', 'מהתרגיל: אבטלה = עובדים שלא נשכרים', r`U = L^{*}_{\text{market}} - L^{*}_{\min}`),
  row('p2-dprofit', 'מהתרגיל: תוספת רווח', r`\Delta\pi = \pi_{new} - \pi_{old}`),
]

/** טבלה קטנה לנתוני L/TP בקופסת "נתוני השאלה" */
function DataTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
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
const tpTable = (ls: number[], tps: string[]) => (
  <DataTable head={[<M>L</M>, ...ls]} rows={[[<M>TP</M>, ...tps]]} />
)
const TP_M = tpTable([1, 2, 3, 4], ['500', '900', '1,200', '1,400'])
const TP_H = tpTable([1, 2, 3, 4, 5], ['600', '1,100', '1,500', '1,800', '2,000'])

/* צמתים חוזרים: שרשרת MP ← VMP לטבלת התרגילים הבינוניים (P=15) ולטבלת המתקדמים (P=25 / P=35) */
const MP_M = {
  want: r`MP_L`, row: 'p2-mp-diff', src: SRC_F,
  given: [{ sym: 'טבלת התפוקה הכוללת', plain: true, block: true, value: TP_M }],
  compute: r`MP_L:\ 500,\ 400,\ 300,\ 200`,
  result: r`MP_1..MP_4 = 500,\ 400,\ 300,\ 200`,
}
const MP_H = {
  want: r`MP_L`, row: 'p2-mp-diff', src: SRC_F,
  given: [{ sym: 'טבלת התפוקה הכוללת', plain: true, block: true, value: TP_H }],
  compute: r`MP_L:\ 600,\ 500,\ 400,\ 300,\ 200`,
  result: r`MP_1..MP_5 = 600,\ 500,\ 400,\ 300,\ 200`,
}
const vmpNode = (p: string, compute: string, mp: typeof MP_M, note?: ReactNode) => ({
  sym: r`VMP_L`, note: note ?? 'צריך את ערך התפוקה השולית בכל רמת תעסוקה',
  node: {
    want: r`VMP_L`, row: 'production-vmp', src: SRC_F,
    given: [{ sym: 'P', value: <M>{p}</M> }],
    needs: [{ sym: r`MP_L`, note: 'בטבלה נתונה רק התפוקה הכוללת', node: mp }],
    compute,
    result: r`VMP_L = ` + compute.split('=').pop()!.trim(),
  },
})

/* ── קל ── */

/* e1 · MP(4)=400 */
export const E1_MAP: SolveDemo = {
  id: 'p2-e1', extraRows: EXTRA,
  root: {
    want: r`MP_4`, row: 'p2-mp-diff', src: SRC_F,
    explain: 'תפוקה שולית = כמה הוסיף העובד האחרון, כלומר ההפרש בין שתי רמות תעסוקה סמוכות',
    given: [{ sym: r`TP_3`, value: <M>{r`1{,}800`}</M> }, { sym: r`TP_4`, value: <M>{r`2{,}200`}</M> }],
    compute: r`MP_4 = TP_4 - TP_3 = 2{,}200 - 1{,}800 = 400`,
    result: r`MP_4 = 400`,
  },
}

/* e2 · AP=550 */
export const E2_MAP: SolveDemo = {
  id: 'p2-e2', extraRows: EXTRA,
  root: {
    want: r`AP_L`, row: 'production-ap', src: SRC_F,
    explain: 'ממוצע = הכול חלקי מספר העובדים',
    given: [{ sym: 'TP', value: <M>{r`2{,}200`}</M> }, { sym: 'L', value: <M>4</M> }],
    compute: r`AP = \frac{2{,}200}{4} = 550`,
    result: r`AP = 550`,
  },
}

/* e3 · VMP=6,000 */
export const E3_MAP: SolveDemo = {
  id: 'p2-e3', extraRows: EXTRA,
  root: {
    want: r`VMP_L`, row: 'production-vmp', src: SRC_F,
    explain: 'מתרגמים את התוספת בכמות לתוספת בשקלים — כופלים במחיר',
    given: [{ sym: 'MP', value: <M>300</M> }, { sym: 'P', value: <M>20</M> }],
    compute: r`VMP = 300 \times 20 = 6{,}000`,
    result: r`VMP = 6{,}000`,
  },
}

/* e4 · VMP ≥ W → להעסיק */
export const E4_MAP: SolveDemo = {
  id: 'p2-e4', extraRows: EXTRA,
  root: {
    want: 'האם להעסיק', wantPlain: true, row: 'p2-hire-check', src: SRC_HIRE,
    explain: 'העובד מכניס VMP ועולה W — מעסיקים אם מה שהוא מכניס לא קטן ממה שהוא עולה',
    given: [{ sym: 'VMP', value: <M>{r`6{,}000`}</M> }, { sym: 'W', value: <M>{r`5{,}000`}</M> }],
    compute: r`VMP = 6{,}000 \geq 5{,}000 = W`,
    resultText: 'כן — כדאי להעסיק',
  },
}

/* e5 · רווח = 25,000 */
export const E5_MAP: SolveDemo = {
  id: 'p2-e5', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi`, row: 'p2-profit', src: SRC_PROFIT,
    explain: 'רווח = מה שנכנס (פדיון) פחות מה שיוצא (שכר העובדים)',
    needs: [
      { sym: 'TR', note: 'הפדיון לא נתון — מחשבים ממחיר ותפוקה', node: {
        want: 'TR', row: 'p2-tr', src: SRC_PROFIT,
        given: [{ sym: 'P', value: <M>20</M> }, { sym: 'TP', value: <M>{r`2{,}500`}</M> }],
        compute: r`TR = 20 \times 2{,}500 = 50{,}000`, result: r`TR = 50{,}000`,
      } },
      { sym: 'TC', note: 'העלות לא נתונה — מחשבים ממספר העובדים ומהשכר', node: {
        want: 'TC', row: 'p2-tc', src: SRC_PROFIT,
        given: [{ sym: 'L', value: <M>5</M> }, { sym: 'W', value: <M>{r`5{,}000`}</M> }],
        compute: r`TC = 5 \times 5{,}000 = 25{,}000`, result: r`TC = 25{,}000`,
      } },
    ],
    compute: r`\pi = 50{,}000 - 25{,}000 = 25{,}000`,
    result: r`\pi = 25{,}000`,
  },
}

/* ── בינוני ── */

/* m1 · L*=3 (P=15, W=4,500) */
export const M1_MAP: SolveDemo = {
  id: 'p2-m1', extraRows: EXTRA,
  root: {
    want: r`L^{*}`, row: 'p2-lstar', src: SRC_HIRE,
    explain: 'מוסיפים עובדים כל עוד כל אחד מכניס (VMP) לפחות את השכר שלו',
    given: [{ sym: 'W', value: <M>{r`4{,}500`}</M> }],
    needs: [vmpNode('15', r`VMP_L = 15 \times MP_L = 7{,}500,\ 6{,}000,\ 4{,}500,\ 3{,}000`, MP_M)],
    compute: r`VMP_3 = 4{,}500 \geq 4{,}500,\quad VMP_4 = 3{,}000 < 4{,}500 \ \Rightarrow\ L^{*} = 3`,
    result: r`L^{*} = 3`,
  },
}

/* m2 · L*=2 (W עולה ל-6,000) */
export const M2_MAP: SolveDemo = {
  id: 'p2-m2', extraRows: EXTRA,
  root: {
    want: r`L^{*}`, row: 'p2-lstar', src: SRC_HIRE,
    explain: 'אותה טבלת VMP, רק קו השכר עלה — בודקים מחדש עד איפה VMP לא יורד מתחתיו',
    given: [{ sym: 'W', value: <M>{r`6{,}000`}</M> }],
    needs: [vmpNode('15', r`VMP_L = 15 \times MP_L = 7{,}500,\ 6{,}000,\ 4{,}500,\ 3{,}000`, MP_M, 'אותו משק כמו בתרגיל הקודם — אותם VMP')],
    compute: r`VMP_2 = 6{,}000 \geq 6{,}000,\quad VMP_3 = 4{,}500 < 6{,}000 \ \Rightarrow\ L^{*} = 2`,
    result: r`L^{*} = 2`,
  },
}

/* m3 · רווח ב-3 עובדים = 4,500 */
export const M3_MAP: SolveDemo = {
  id: 'p2-m3', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi`, row: 'p2-profit', src: SRC_PROFIT,
    explain: 'רווח = פדיון פחות שכר, ברמת התעסוקה שנבחרה (3 עובדים)',
    needs: [
      { sym: 'TR', note: 'צריך את התפוקה ב-3 עובדים ואת המחיר', node: {
        want: 'TR', row: 'p2-tr', src: SRC_PROFIT,
        given: [{ sym: 'P', value: <M>15</M> }, { sym: r`TP_3`, value: <><M>{r`1{,}200`}</M> (מהטבלה)</> }],
        compute: r`TR = 15 \times 1{,}200 = 18{,}000`, result: r`TR = 18{,}000`,
      } },
      { sym: 'TC', note: 'שכר 3 העובדים', node: {
        want: 'TC', row: 'p2-tc', src: SRC_PROFIT,
        given: [{ sym: 'L', value: <M>3</M> }, { sym: 'W', value: <M>{r`4{,}500`}</M> }],
        compute: r`TC = 3 \times 4{,}500 = 13{,}500`, result: r`TC = 13{,}500`,
      } },
    ],
    compute: r`\pi = 18{,}000 - 13{,}500 = 4{,}500`,
    result: r`\pi = 4{,}500`,
  },
}

/* m4 · רווח ב-4 עובדים = 3,000 (ירד) */
export const M4_MAP: SolveDemo = {
  id: 'p2-m4', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi_4`, row: 'p2-profit', src: SRC_PROFIT,
    explain: 'מחשבים את הרווח עם העובד הרביעי ומשווים לרווח עם 3 עובדים',
    given: [{ sym: r`\pi_3`, value: <><M>{r`4{,}500`}</M> (מהתרגיל הקודם)</> }],
    needs: [
      { sym: 'TR', note: 'התפוקה ב-4 עובדים כפול המחיר', node: {
        want: 'TR', row: 'p2-tr', src: SRC_PROFIT,
        given: [{ sym: 'P', value: <M>15</M> }, { sym: r`TP_4`, value: <M>{r`1{,}400`}</M> }],
        compute: r`TR = 15 \times 1{,}400 = 21{,}000`, result: r`TR = 21{,}000`,
      } },
      { sym: 'TC', note: 'שכר 4 העובדים', node: {
        want: 'TC', row: 'p2-tc', src: SRC_PROFIT,
        given: [{ sym: 'L', value: <M>4</M> }, { sym: 'W', value: <M>{r`4{,}500`}</M> }],
        compute: r`TC = 4 \times 4{,}500 = 18{,}000`, result: r`TC = 18{,}000`,
      } },
    ],
    compute: r`\pi_4 = 21{,}000 - 18{,}000 = 3{,}000 < 4{,}500 = \pi_3`,
    resultText: 'הרווח יורד ל-3,000 ₪ (מ-4,500 ₪)',
  },
}

/* m5 · מושגית: למה VMP יורד */
export const M5_MAP: SolveDemo = {
  id: 'p2-m5', extraRows: EXTRA,
  root: {
    want: r`VMP_L`, row: 'production-vmp', src: SRC_F,
    explain: 'VMP הוא מכפלה של שני גורמים — בודקים מה קורה לכל אחד מהם',
    given: [{ sym: 'P', value: 'קבוע (מחיר השוק)' }],
    needs: [
      { sym: r`MP_L`, note: 'איך משתנה התפוקה השולית כשמוסיפים עובדים?', node: {
        want: r`MP_L`, row: 'p2-diminishing', src: SRC_DIM,
        compute: r`MP_1 > MP_2 > MP_3 > \dots`,
        resultText: 'MP יורד',
      } },
    ],
    compute: r`VMP_L = P \times MP_L,\quad P\ \text{const},\ MP_L \downarrow\ \Rightarrow\ VMP_L \downarrow`,
    resultText: 'VMP יורד כי MP יורד (ו-P קבוע)',
  },
}

/* ── מתקדם ── */

const H1_L: SolveDemo = {
  id: 'p2-h1a', extraRows: EXTRA,
  root: {
    want: r`L^{*}`, row: 'p2-lstar', src: SRC_HIRE,
    explain: 'מוסיפים עובדים כל עוד VMP לא יורד מתחת לשכר',
    given: [{ sym: 'W', value: <M>{r`7{,}000`}</M> }],
    needs: [vmpNode('25', r`VMP_L = 25 \times MP_L = 15{,}000,\ 12{,}500,\ 10{,}000,\ 7{,}500,\ 5{,}000`, MP_H)],
    compute: r`VMP_4 = 7{,}500 \geq 7{,}000,\quad VMP_5 = 5{,}000 < 7{,}000 \ \Rightarrow\ L^{*} = 4`,
    result: r`L^{*} = 4`,
  },
}
const H1_PI: SolveDemo = {
  id: 'p2-h1b', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi^{*}`, row: 'p2-profit', src: SRC_PROFIT,
    explain: 'הרווח המקסימלי = הרווח ברמת התעסוקה האופטימלית',
    needs: [
      { sym: 'TR', note: 'התפוקה ב-4 עובדים כפול המחיר', node: {
        want: 'TR', row: 'p2-tr', src: SRC_PROFIT,
        given: [{ sym: 'P', value: <M>25</M> }, { sym: r`TP_4`, value: <M>{r`1{,}800`}</M> }],
        compute: r`TR = 25 \times 1{,}800 = 45{,}000`, result: r`TR = 45{,}000`,
      } },
      { sym: 'TC', note: 'שכר 4 העובדים', node: {
        want: 'TC', row: 'p2-tc', src: SRC_PROFIT,
        given: [{ sym: r`L^{*}`, value: <><M>4</M> (מסעיף א׳)</> }, { sym: 'W', value: <M>{r`7{,}000`}</M> }],
        compute: r`TC = 4 \times 7{,}000 = 28{,}000`, result: r`TC = 28{,}000`,
      } },
    ],
    compute: r`\pi^{*} = 45{,}000 - 28{,}000 = 17{,}000`,
    result: r`\pi^{*} = 17{,}000`,
  },
}
export const H1_MAP = [
  { label: 'סעיף א׳: מספר העובדים האופטימלי', demo: H1_L },
  { label: 'סעיף ב׳: הרווח המקסימלי', demo: H1_PI },
]

const H2_L: SolveDemo = {
  id: 'p2-h2a', extraRows: EXTRA,
  root: {
    want: r`L^{*}`, row: 'p2-lstar', src: SRC_HIRE,
    explain: 'המחיר עלה — כל ה-VMP עולים, ובודקים מחדש מול אותו שכר',
    given: [{ sym: 'W', value: <M>{r`7{,}000`}</M> }],
    needs: [vmpNode('35', r`VMP_L = 35 \times MP_L = 21{,}000,\ 17{,}500,\ 14{,}000,\ 10{,}500,\ 7{,}000`, MP_H, 'אותה טבלת תפוקה, מחיר חדש')],
    compute: r`VMP_5 = 7{,}000 \geq 7{,}000 \ \Rightarrow\ L^{*} = 5`,
    result: r`L^{*} = 5`,
  },
}
const H2_PI: SolveDemo = {
  id: 'p2-h2b', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi_{new}`, row: 'p2-profit', src: SRC_PROFIT,
    explain: 'הרווח ברמת התעסוקה החדשה',
    needs: [
      { sym: 'TR', note: 'התפוקה ב-5 עובדים כפול המחיר החדש', node: {
        want: 'TR', row: 'p2-tr', src: SRC_PROFIT,
        given: [{ sym: 'P', value: <M>35</M> }, { sym: r`TP_5`, value: <M>{r`2{,}000`}</M> }],
        compute: r`TR = 35 \times 2{,}000 = 70{,}000`, result: r`TR = 70{,}000`,
      } },
      { sym: 'TC', note: 'שכר 5 העובדים', node: {
        want: 'TC', row: 'p2-tc', src: SRC_PROFIT,
        given: [{ sym: r`L^{*}`, value: <><M>5</M> (מסעיף א׳)</> }, { sym: 'W', value: <M>{r`7{,}000`}</M> }],
        compute: r`TC = 5 \times 7{,}000 = 35{,}000`, result: r`TC = 35{,}000`,
      } },
    ],
    compute: r`\pi_{new} = 70{,}000 - 35{,}000 = 35{,}000`,
    result: r`\pi_{new} = 35{,}000`,
  },
}
const H2_D: SolveDemo = {
  id: 'p2-h2c', extraRows: EXTRA,
  root: {
    want: r`\Delta\pi`, row: 'p2-dprofit', src: SRC_PROFIT,
    explain: 'תוספת = הרווח החדש פחות הרווח הקודם',
    given: [{ sym: r`\pi_{new}`, value: <><M>{r`35{,}000`}</M> (מסעיף ב׳)</> }, { sym: r`\pi_{old}`, value: <><M>{r`17{,}000`}</M> (מהתרגיל הקודם)</> }],
    compute: r`\Delta\pi = 35{,}000 - 17{,}000 = 18{,}000`,
    result: r`\Delta\pi = 18{,}000`,
  },
}
export const H2_MAP = [
  { label: 'סעיף א׳: כמה עובדים', demo: H2_L },
  { label: 'סעיף ב׳: הרווח החדש', demo: H2_PI },
  { label: 'סעיף ג׳: תוספת הרווח', demo: H2_D },
]

const H3_L: SolveDemo = {
  id: 'p2-h3a', extraRows: EXTRA,
  root: {
    want: r`L^{*}_{\min}`, row: 'p2-lstar', src: SRC_HIRE,
    explain: 'אותו כלל, רק שהשכר הוא עכשיו שכר המינימום',
    given: [{ sym: r`W_{\min}`, value: <M>{r`9{,}000`}</M> }],
    needs: [vmpNode('25', r`VMP_L = 25 \times MP_L = 15{,}000,\ 12{,}500,\ 10{,}000,\ 7{,}500,\ 5{,}000`, MP_H, 'אותה טבלה כמו בתרגיל 1 (P=25)')],
    compute: r`VMP_3 = 10{,}000 \geq 9{,}000,\quad VMP_4 = 7{,}500 < 9{,}000 \ \Rightarrow\ L^{*}_{\min} = 3`,
    result: r`L^{*}_{\min} = 3`,
  },
}
const H3_U: SolveDemo = {
  id: 'p2-h3b', extraRows: EXTRA,
  root: {
    want: 'U', row: 'p2-unemp', src: SRC_HIRE,
    explain: 'משווים כמה הועסקו בשכר השוק לכמה מועסקים בשכר המינימום',
    given: [{ sym: r`L^{*}_{\text{market}}`, value: <><M>4</M> (מתרגיל 1)</> }, { sym: r`L^{*}_{\min}`, value: <><M>3</M> (מסעיף א׳)</> }],
    compute: r`U = 4 - 3 = 1`,
    result: r`U = 1`,
  },
}
export const H3_MAP = [
  { label: 'סעיף א׳: כמה עובדים', demo: H3_L },
  { label: 'סעיף ב׳: מידת האבטלה', demo: H3_U },
]

/* h4 · סובסידיה: L*=5 */
export const H4_MAP: SolveDemo = {
  id: 'p2-h4', extraRows: EXTRA,
  root: {
    want: r`L^{*}`, row: 'p2-lstar', src: SRC_HIRE,
    explain: 'המעסיק משווה את VMP למה שהעובד עולה לו בפועל — השכר פחות הסובסידיה',
    needs: [
      { sym: r`W_{eff}`, note: 'חלק מהשכר משלמת הממשלה', node: {
        want: r`W_{eff}`, row: 'p2-w-eff', src: SRC_HIRE,
        given: [{ sym: 'W', value: <M>{r`7{,}000`}</M> }, { sym: 's', value: <M>{r`2{,}000`}</M> }],
        compute: r`W_{eff} = 7{,}000 - 2{,}000 = 5{,}000`, result: r`W_{eff} = 5{,}000`,
      } },
      vmpNode('25', r`VMP_L = 25 \times MP_L = 15{,}000,\ 12{,}500,\ 10{,}000,\ 7{,}500,\ 5{,}000`, MP_H, 'אותה טבלה כמו בתרגיל 1 (P=25)'),
    ],
    compute: r`VMP_5 = 5{,}000 \geq 5{,}000 = W_{eff} \ \Rightarrow\ L^{*} = 5`,
    result: r`L^{*} = 5`,
  },
}

/* h5 · מושגית: עליית P מזיזה את עקומת הביקוש לעבודה למעלה */
export const H5_MAP: SolveDemo = {
  id: 'p2-h5', extraRows: EXTRA,
  root: {
    want: r`VMP_L`, row: 'production-vmp', src: SRC_F,
    explain: 'עקומת הביקוש לעבודה היא עקומת VMP — בודקים מה עליית P עושה לכל נקודה בה',
    given: [
      { sym: 'P', value: <><M>25</M> ← <M>35</M></> },
      { sym: r`MP_L`, value: 'לא משתנה (אותה טכנולוגיה)' },
    ],
    compute: r`VMP^{new}_L = 35 \times MP_L = \tfrac{35}{25} \times VMP^{old}_L = 1.4 \times VMP^{old}_L`,
    resultText: 'העקומה כולה זזה למעלה — פי 1.4 בכל רמת L',
  },
}
