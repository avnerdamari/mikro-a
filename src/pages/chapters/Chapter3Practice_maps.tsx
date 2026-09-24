import { M, MapTable, type BoxRow, type SolveDemo, type Src, type TreeNode } from '@/components/SolveGraph'

/* מפות הפתרון (SolveGraph) של תרגול פרק 3 — מוצגות בפתרון המלא של כל תרגיל (שדה map ב-Exercise).
   המספרים — רק מהפתרון הקיים של התרגיל. שורות הקופסה: GROUPS בנספח הנוסחאות (פרק 3) + EXTRA למטה.
   ⚠️ לכתוב את הקובץ בכלי Write בלבד — סקריפט/heredoc מאבד backslashes בנוסחאות. */

const r = String.raw

const SRC_STRUCT: Src = { chapter: 3, section: 'learn-costs-structure', label: '3.1' }
const SRC_MCP: Src = { chapter: 3, section: 'learn-costs-mcp', label: '3.2' }
const SRC_DEC: Src = { chapter: 3, section: 'learn-costs-decision', label: '3.3' }
const SRC_SHUT: Src = { chapter: 3, section: 'learn-costs-shutdown', label: '3.3' }
const SRC_SUP: Src = { chapter: 3, section: 'learn-costs-supply', label: '3.4' }

const row = (key: string, label: string, tex?: string, text?: string): { chapter: number; row: BoxRow } =>
  ({ chapter: 3, row: { key, label, tex, text } })
const EXTRA = [
  row('c3-mc-diff', 'מפרק 3 (3.1): עלות שולית בין כמויות סמוכות', r`MC_Q = TC_Q - TC_{Q-1}`),
  row('c3-vc', 'מפרק 3 (3.1): עלות משתנה', r`VC = TC - FC`),
  row('c3-tr', 'פדיון', r`TR = P \times Q`),
  row('c3-qstar', 'מפרק 3 (3.2): מייצרים כל עוד MC לא עולה על P', r`Q^{*} = \max\{Q : MC_Q \leq P\}`),
  row('c3-pmc', 'מפרק 3 (3.2): כלל מקסום רווח', r`P = MC`),
  row('c3-supply-n', 'מפרק 3 (3.4): היצע השוק (n יצרנים זהים)', r`Q_s = n \times Q(P)`),
  row('c3-invert', 'מהתרגיל: היפוך היצע היצרן', r`P = a + bQ \ \Rightarrow\ Q = \frac{P - a}{b}`),
  row('c3-sum', 'מפרק 3 (3.4): סכום ההיצעים (בכל מחיר)', r`Q_{total} = Q_{TA} + Q_{G}`),
  row('c3-fc0', 'מהתרגיל: עלות קבועה = העלות כשלא מייצרים', r`FC = TC(0)`),
  row('c3-mc-deriv', 'מפרק 3 (3.1): עלות שולית — השינוי ב-TC ליחידה (כנגזרת)', r`MC = \frac{dTC}{dQ}`),
  row('c3-min', 'מהתרגיל: מינימום של AVC — הנגזרת מתאפסת', r`\frac{dAVC}{dQ} = 0`),
  row('c3-vc-int', 'מהתרגיל: עלות משתנה = השטח מתחת ל-MC', r`VC = \int_0^{Q} MC\,dQ`),
  row('c3-tc-lin', 'מפרק 3 (3.1): TC = FC + VC, וכש-MC קבוע VC = MC·Q', r`TC = FC + MC \times Q`),
  row('c3-compare', 'מהתרגיל: המכונה הזולה יותר בכמות Q', r`TC_A < TC_B`),
]

/* טבלת העלויות של התרגילים הבינוניים 1-3 (FC=200) */
const TC_TABLE = (
  <MapTable head={[<M>Q</M>, 0, 1, 2, 3, 4]} rows={[[<M>TC</M>, 200, 260, 310, 370, 450]]} />
)
const TABLE_GIVEN = { sym: 'טבלת העלויות', plain: true, block: true, value: TC_TABLE }
const MC_TABLE: TreeNode = {
  want: r`MC_Q`, row: 'c3-mc-diff', src: SRC_STRUCT,
  given: [TABLE_GIVEN],
  compute: r`MC_Q:\ 60,\ 50,\ 60,\ 80`,
  result: r`MC_1..MC_4 = 60,\ 50,\ 60,\ 80`,
}
const qstarNode = (p: string, compute: string, result: string): TreeNode => ({
  want: r`Q^{*}`, row: 'c3-qstar', src: SRC_MCP,
  explain: 'מוסיפים יחידה כל עוד היא עולה (MC) לא יותר ממה שמקבלים עליה (P)',
  given: [{ sym: 'P', value: <M>{p}</M> }],
  needs: [{ sym: r`MC_Q`, note: 'בטבלה נתונה רק העלות הכוללת', node: MC_TABLE }],
  compute, result,
})
const TC_FORMULA = { sym: 'TC', value: <M>{r`Q^3 - 12Q^2 + 60Q + 100`}</M> }

/* ── קל ── */

export const E1_MAP: SolveDemo = {
  id: 'c3-e1', extraRows: EXTRA,
  root: {
    want: 'FC', row: 'costs-tc', src: SRC_STRUCT,
    explain: 'העלות הכוללת מורכבת מקבועה ומשתנה — מורידים את המשתנה ונשארת הקבועה',
    given: [{ sym: 'TC', value: <M>500</M> }, { sym: 'VC', value: <M>350</M> }],
    compute: r`FC = TC - VC = 500 - 350 = 150`,
    result: r`FC = 150`,
  },
}

export const E2_MAP: SolveDemo = {
  id: 'c3-e2', extraRows: EXTRA,
  root: {
    want: r`MC_5`, row: 'c3-mc-diff', src: SRC_STRUCT,
    explain: 'עלות שולית = כמה עלתה העלות הכוללת בגלל היחידה האחרונה',
    given: [{ sym: r`TC_4`, value: <M>400</M> }, { sym: r`TC_5`, value: <M>460</M> }],
    compute: r`MC_5 = 460 - 400 = 60`,
    result: r`MC_5 = 60`,
  },
}

export const E3_MAP: SolveDemo = {
  id: 'c3-e3', extraRows: EXTRA,
  root: {
    want: 'AC', row: 'costs-ac', src: SRC_STRUCT,
    explain: 'ממוצע = העלות הכוללת חלקי מספר היחידות',
    given: [{ sym: 'TC', value: <M>600</M> }, { sym: 'Q', value: <M>10</M> }],
    compute: r`AC = \frac{600}{10} = 60`,
    result: r`AC = 60`,
  },
}

export const E4_MAP: SolveDemo = {
  id: 'c3-e4', extraRows: EXTRA,
  root: {
    want: 'AVC', row: 'costs-avc', src: SRC_STRUCT,
    explain: 'כמו AC, אבל רק על החלק המשתנה של העלות',
    given: [{ sym: 'VC', value: <M>400</M> }, { sym: 'Q', value: <M>10</M> }],
    compute: r`AVC = \frac{400}{10} = 40`,
    result: r`AVC = 40`,
  },
}

export const E5_MAP: SolveDemo = {
  id: 'c3-e5', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi`, row: 'costs-profit', src: SRC_DEC,
    explain: 'רווח = מה שנכנס (פדיון) פחות העלות הכוללת',
    given: [{ sym: 'TC', value: <M>300</M> }],
    needs: [
      { sym: 'TR', note: 'הפדיון לא נתון — מחיר כפול כמות', node: {
        want: 'TR', row: 'c3-tr', src: SRC_DEC,
        given: [{ sym: 'P', value: <M>80</M> }, { sym: r`Q^{*}`, value: <M>5</M> }],
        compute: r`TR = 80 \times 5 = 400`, result: r`TR = 400`,
      } },
    ],
    compute: r`\pi = 400 - 300 = 100`,
    result: r`\pi = 100`,
  },
}

/* ── בינוני ── */

/* m1 · P=40 — לא לייצר */
export const M1_MAP: SolveDemo = {
  id: 'c3-m1', extraRows: EXTRA,
  root: {
    want: 'האם לייצר', wantPlain: true, row: 'costs-shutdown', src: SRC_SHUT,
    explain: 'מייצרים רק אם המחיר מכסה לפחות את העלות המשתנה הממוצעת; אחרת סוגרים ומפסידים רק FC',
    given: [{ sym: 'P', value: <M>40</M> }],
    needs: [
      { sym: r`MC_1`, note: 'כמה עולה היחידה הראשונה?', node: {
        want: r`MC_1`, row: 'c3-mc-diff', src: SRC_STRUCT,
        given: [TABLE_GIVEN],
        compute: r`MC_1 = 260 - 200 = 60`, result: r`MC_1 = 60`,
      } },
      { sym: r`AVC_1`, note: 'תנאי הסגירה: משווים את P ל-AVC', node: {
        want: r`AVC_1`, row: 'costs-avc', src: SRC_STRUCT,
        needs: [{ sym: r`VC_1`, note: 'VC לא נתון — TC פחות FC', node: {
          want: r`VC_1`, row: 'c3-vc', src: SRC_STRUCT,
          given: [{ sym: r`TC_1`, value: <M>260</M> }, { sym: 'FC', value: <M>200</M> }],
          compute: r`VC_1 = 260 - 200 = 60`, result: r`VC_1 = 60`,
        } }],
        compute: r`AVC_1 = \frac{60}{1} = 60`, result: r`AVC_1 = 60`,
      } },
    ],
    compute: r`MC_1 = 60 > 40 = P,\quad AVC_1 = 60 > 40 = P`,
    resultText: 'לא לייצר — ההפסד = FC = 200 ₪',
  },
}

/* m2 · P=70 */
const M2_Q: SolveDemo = {
  id: 'c3-m2a', extraRows: EXTRA,
  root: qstarNode('70', r`MC_3 = 60 \leq 70,\quad MC_4 = 80 > 70 \ \Rightarrow\ Q^{*} = 3`, r`Q^{*} = 3`),
}
const M2_PI: SolveDemo = {
  id: 'c3-m2b', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi`, row: 'costs-profit', src: SRC_DEC,
    explain: 'הרווח בכמות שנבחרה: פדיון פחות העלות הכוללת מהטבלה',
    given: [{ sym: r`TC_3`, value: <><M>370</M> (מהטבלה)</> }],
    needs: [
      { sym: 'TR', note: 'מחיר כפול הכמות שנבחרה', node: {
        want: 'TR', row: 'c3-tr', src: SRC_DEC,
        given: [{ sym: 'P', value: <M>70</M> }, { sym: r`Q^{*}`, value: <><M>3</M> (מסעיף א׳)</> }],
        compute: r`TR = 70 \times 3 = 210`, result: r`TR = 210`,
      } },
    ],
    compute: r`\pi = 210 - 370 = -160`,
    result: r`\pi = -160`,
  },
}
const M2_GO: SolveDemo = {
  id: 'c3-m2c', extraRows: EXTRA,
  root: {
    want: 'להמשיך לייצר?', wantPlain: true, row: 'costs-shutdown', src: SRC_SHUT,
    explain: 'גם בהפסד — אם המחיר מכסה את AVC, ההפסד קטן מ-FC ועדיף לייצר',
    given: [{ sym: 'P', value: <M>70</M> }],
    needs: [
      { sym: r`AVC_3`, note: 'העלות המשתנה הממוצעת בכמות שנבחרה', node: {
        want: r`AVC_3`, row: 'costs-avc', src: SRC_STRUCT,
        given: [{ sym: 'Q', value: <><M>3</M> (מסעיף א׳)</> }],
        needs: [{ sym: r`VC_3`, note: 'TC פחות FC', node: {
          want: r`VC_3`, row: 'c3-vc', src: SRC_STRUCT,
          given: [{ sym: r`TC_3`, value: <M>370</M> }, { sym: 'FC', value: <M>200</M> }],
          compute: r`VC_3 = 370 - 200 = 170`, result: r`VC_3 = 170`,
        } }],
        compute: r`AVC_3 = \frac{170}{3} \approx 56.7`, result: r`AVC_3 \approx 56.7`,
      } },
    ],
    compute: r`P = 70 > 56.7 = AVC_3`,
    resultText: 'כן — ההפסד (160) קטן מ-FC (200)',
  },
}
export const M2_MAP = [
  { label: 'סעיף א׳: כמה לייצר', demo: M2_Q },
  { label: 'סעיף ב׳: הרווח', demo: M2_PI },
  { label: 'ובדיקה: האם כדאי לייצר למרות ההפסד', demo: M2_GO },
]

/* m3 · P=90 */
const M3_PI: SolveDemo = {
  id: 'c3-m3a', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi`, row: 'costs-profit', src: SRC_DEC,
    explain: 'קודם מוצאים כמה לייצר, ואז פדיון פחות עלות כוללת',
    given: [{ sym: r`TC_4`, value: <><M>450</M> (מהטבלה)</> }],
    needs: [
      { sym: 'TR', note: 'מחיר כפול הכמות — והכמות עוד לא ידועה', node: {
        want: 'TR', row: 'c3-tr', src: SRC_DEC,
        given: [{ sym: 'P', value: <M>90</M> }],
        needs: [{ sym: r`Q^{*}`, note: 'כמה לייצר במחיר 90?', node: {
          ...qstarNode('90', r`MC_4 = 80 \leq 90 \ \Rightarrow\ Q^{*} = 4`, r`Q^{*} = 4`),
          given: undefined,
        } }],
        compute: r`TR = 90 \times 4 = 360`, result: r`TR = 360`,
      } },
    ],
    compute: r`\pi = 360 - 450 = -90`,
    result: r`\pi = -90`,
  },
}
const M3_GO: SolveDemo = {
  id: 'c3-m3b', extraRows: EXTRA,
  root: {
    want: 'להמשיך לייצר?', wantPlain: true, row: 'costs-shutdown', src: SRC_SHUT,
    explain: 'המחיר מכסה את AVC ⇒ ההפסד קטן מ-FC ועדיף לייצר',
    given: [{ sym: 'P', value: <M>90</M> }],
    needs: [
      { sym: r`AVC_4`, note: 'העלות המשתנה הממוצעת ב-4 יחידות', node: {
        want: r`AVC_4`, row: 'costs-avc', src: SRC_STRUCT,
        needs: [{ sym: r`VC_4`, note: 'TC פחות FC', node: {
          want: r`VC_4`, row: 'c3-vc', src: SRC_STRUCT,
          given: [{ sym: r`TC_4`, value: <M>450</M> }, { sym: 'FC', value: <M>200</M> }],
          compute: r`VC_4 = 450 - 200 = 250`, result: r`VC_4 = 250`,
        } }],
        compute: r`AVC_4 = \frac{250}{4} = 62.5`, result: r`AVC_4 = 62.5`,
      } },
    ],
    compute: r`P = 90 > 62.5 = AVC_4`,
    resultText: 'כן — ההפסד (90) קטן מ-FC (200)',
  },
}
export const M3_MAP = [
  { label: 'הרווח', demo: M3_PI },
  { label: 'ובדיקה: האם כדאי לייצר למרות ההפסד', demo: M3_GO },
]

/* m4 · היצע מצרפי של 10 יצרנים */
export const M4_MAP: SolveDemo = {
  id: 'c3-m4', extraRows: EXTRA,
  root: {
    want: r`Q_s`, row: 'c3-supply-n', src: SRC_SUP,
    explain: 'בכל מחיר, כמות השוק = כמות של יצרן אחד כפול מספר היצרנים',
    given: [{ sym: 'n', value: <M>10</M> }],
    needs: [
      { sym: r`Q(P)`, note: 'ההיצע נתון בצורה P=f(Q) — צריך להפוך ל-Q=f(P)', node: {
        want: r`Q(P)`, row: 'c3-invert', src: SRC_SUP,
        given: [{ sym: 'היצע היצרן', plain: true, value: <M>{r`P = 20 + 2Q`}</M> }],
        compute: r`Q = \frac{P - 20}{2}`, result: r`Q = \frac{P - 20}{2}`,
      } },
    ],
    compute: r`Q_s = 10 \times \frac{P - 20}{2} = 5(P - 20) = 5P - 100`,
    result: r`Q_s = 5P - 100`,
  },
}

/* m5 · מושגית: למה P=AVC היא נקודת הסגירה */
export const M5_MAP: SolveDemo = {
  id: 'c3-m5', extraRows: EXTRA,
  root: {
    want: 'נקודת הסגירה', wantPlain: true, row: 'costs-shutdown', src: SRC_SHUT,
    explain: 'משווים את ההפסד כשמייצרים להפסד כשסוגרים (FC בלבד)',
    given: [{ sym: 'הפסד בסגירה', plain: true, value: 'FC (אין פדיון ואין VC)' }],
    needs: [
      { sym: r`\pi`, note: 'מה הרווח כשמייצרים?', node: {
        want: r`\pi`, row: 'costs-profit', src: SRC_DEC,
        compute: r`\pi = TR - VC - FC = (P - AVC)\,Q - FC`,
        result: r`\pi = (P - AVC)\,Q - FC`,
      } },
    ],
    compute: r`P = AVC \Rightarrow \pi = -FC;\quad P < AVC \Rightarrow \pi < -FC`,
    resultText: 'ב-P=AVC ההפסד בייצור שווה ל-FC; מתחתיו הוא גדול מ-FC ⇒ עדיף לסגור',
  },
}

/* ── מתקדם ── */

/* h1 · חמשת מדדי העלות מ-TC קובית */
const H1_FC: SolveDemo = {
  id: 'c3-h1a', extraRows: EXTRA,
  root: {
    want: 'FC', row: 'c3-fc0', src: SRC_STRUCT,
    explain: 'כשלא מייצרים (Q=0) נשארת רק העלות הקבועה',
    given: [TC_FORMULA],
    compute: r`FC = 0 - 0 + 0 + 100 = 100`, result: r`FC = 100`,
  },
}
const H1_VC: SolveDemo = {
  id: 'c3-h1b', extraRows: EXTRA,
  root: {
    want: 'VC', row: 'c3-vc', src: SRC_STRUCT,
    explain: 'מה שנשאר מ-TC אחרי שמורידים את הקבועה',
    given: [TC_FORMULA, { sym: 'FC', value: <><M>100</M> (מסעיף FC)</> }],
    compute: r`VC = (Q^3 - 12Q^2 + 60Q + 100) - 100 = Q^3 - 12Q^2 + 60Q`,
    result: r`VC = Q^3 - 12Q^2 + 60Q`,
  },
}
const H1_MC: SolveDemo = {
  id: 'c3-h1c', extraRows: EXTRA,
  root: {
    want: 'MC', row: 'c3-mc-deriv', src: SRC_STRUCT,
    explain: 'עלות שולית = קצב השינוי של TC — הנגזרת (הקבוע 100 נעלם)',
    given: [TC_FORMULA],
    compute: r`MC = 3Q^2 - 24Q + 60`, result: r`MC = 3Q^2 - 24Q + 60`,
  },
}
const H1_AC: SolveDemo = {
  id: 'c3-h1d', extraRows: EXTRA,
  root: {
    want: 'AC', row: 'costs-ac', src: SRC_STRUCT,
    explain: 'מחלקים כל איבר ב-TC ב-Q',
    given: [TC_FORMULA],
    compute: r`AC = \frac{Q^3 - 12Q^2 + 60Q + 100}{Q} = Q^2 - 12Q + 60 + \frac{100}{Q}`,
    result: r`AC = Q^2 - 12Q + 60 + \frac{100}{Q}`,
  },
}
const H1_AVC: SolveDemo = {
  id: 'c3-h1e', extraRows: EXTRA,
  root: {
    want: 'AVC', row: 'costs-avc', src: SRC_STRUCT,
    explain: 'כמו AC, אבל רק על VC',
    given: [{ sym: 'VC', value: <><M>{r`Q^3 - 12Q^2 + 60Q`}</M> (מסעיף VC)</> }],
    compute: r`AVC = \frac{Q^3 - 12Q^2 + 60Q}{Q} = Q^2 - 12Q + 60`,
    result: r`AVC = Q^2 - 12Q + 60`,
  },
}
export const H1_MAP = [
  { label: 'FC', demo: H1_FC },
  { label: 'VC', demo: H1_VC },
  { label: 'MC', demo: H1_MC },
  { label: 'AC', demo: H1_AC },
  { label: 'AVC', demo: H1_AVC },
]

/* h2 · מינימום AVC ומחיר הסגירה */
export const H2_MAP: SolveDemo = {
  id: 'c3-h2', extraRows: EXTRA,
  root: {
    want: r`P_{shut}`, row: 'costs-shutdown', src: SRC_SHUT,
    explain: 'מחיר הסגירה = הערך הנמוך ביותר של AVC',
    given: [{ sym: 'AVC', value: <><M>{r`Q^2 - 12Q + 60`}</M> (מהתרגיל הקודם)</> }],
    needs: [
      { sym: r`Q_{\min}`, note: 'באיזו כמות AVC מינימלי?', node: {
        want: r`Q_{\min}`, row: 'c3-min', src: SRC_SHUT,
        compute: r`2Q - 12 = 0 \ \Rightarrow\ Q = 6`, result: r`Q_{\min} = 6`,
      } },
    ],
    compute: r`P_{shut} = AVC(6) = 36 - 72 + 60 = 24`,
    result: r`P_{shut} = 24`,
  },
}

/* h3 · P=50: כמה לייצר, ורווח עם FC=100 */
const H3_Q: SolveDemo = {
  id: 'c3-h3a', extraRows: EXTRA,
  root: {
    want: r`Q^{*}`, row: 'c3-pmc', src: SRC_MCP,
    explain: 'עקומת ההיצע של היצרן היא ה-MC שלו — מייצרים עד שהמחיר שווה ל-MC',
    given: [{ sym: 'P', value: <M>50</M> }, { sym: 'MC', value: <M>{r`20 + 2Q`}</M> }],
    compute: r`50 = 20 + 2Q \ \Rightarrow\ Q^{*} = 15`,
    result: r`Q^{*} = 15`,
  },
}
const H3_PI: SolveDemo = {
  id: 'c3-h3b', extraRows: EXTRA,
  askFormula: r`\pi = TR - TC`,
  root: {
    want: r`\pi`, row: 'costs-profit', src: SRC_DEC,
    explain: 'פדיון פחות עלות כוללת — וה-TC עצמו בנוי מ-FC ו-VC',
    needs: [
      { sym: 'TR', note: 'מחיר כפול כמות', node: {
        want: 'TR', row: 'c3-tr', src: SRC_DEC,
        given: [{ sym: 'P', value: <M>50</M> }, { sym: r`Q^{*}`, value: <><M>15</M> (מסעיף א׳)</> }],
        compute: r`TR = 50 \times 15 = 750`, result: r`TR = 750`,
      } },
      { sym: 'TC', note: 'TC לא נתון — FC ועוד VC', node: {
        want: 'TC', row: 'costs-tc', src: SRC_STRUCT,
        given: [{ sym: 'FC', value: <M>100</M> }],
        needs: [{ sym: 'VC', note: 'נתונה רק עקומת ה-MC', node: {
          want: 'VC', row: 'c3-vc-int', src: SRC_STRUCT,
          given: [{ sym: 'MC', value: <M>{r`20 + 2Q`}</M> }],
          compute: r`VC = [20Q + Q^2]_0^{15} = 300 + 225 = 525`, result: r`VC = 525`,
        } }],
        compute: r`TC = 100 + 525 = 625`, result: r`TC = 625`,
      } },
    ],
    compute: r`\pi = 750 - 625 = 125`,
    result: r`\pi = 125`,
  },
}
export const H3_MAP = [
  { label: 'סעיף א׳: כמה ייצר', demo: H3_Q },
  { label: 'סעיף ב׳: הרווח', demo: H3_PI },
]

/* h4 · היצע מצרפי משני אזורים */
export const H4_MAP: SolveDemo = {
  id: 'c3-h4', extraRows: EXTRA,
  root: {
    want: r`Q_{total}`, row: 'c3-sum', src: SRC_SUP,
    explain: 'בכל מחיר סוכמים את הכמויות של שני האזורים (תקף כששניהם פעילים, P>10)',
    needs: [
      { sym: r`Q_{TA}`, note: 'היצע תל אביב: הופכים וכופלים ב-5', node: {
        want: r`Q_{TA}`, row: 'c3-supply-n', src: SRC_SUP,
        given: [{ sym: r`S_{TA}`, value: <M>{r`P = 10 + 3Q`}</M> }, { sym: r`n_{TA}`, value: <M>5</M> }],
        compute: r`Q_{TA} = 5 \times \frac{P - 10}{3}\quad (P > 10)`, result: r`Q_{TA} = \frac{5(P - 10)}{3}`,
      } },
      { sym: r`Q_{G}`, note: 'היצע הגליל: הופכים וכופלים ב-8', node: {
        want: r`Q_{G}`, row: 'c3-supply-n', src: SRC_SUP,
        given: [{ sym: r`S_{G}`, value: <M>{r`P = 8 + 2Q`}</M> }, { sym: r`n_{G}`, value: <M>8</M> }],
        compute: r`Q_{G} = 8 \times \frac{P - 8}{2} = 4(P - 8)\quad (P > 8)`, result: r`Q_{G} = 4(P - 8)`,
      } },
    ],
    compute: r`Q_{total} = \frac{5(P - 10)}{3} + 4(P - 8)\quad (P > 10)`,
    result: r`Q_{total} = \frac{5(P - 10)}{3} + 4(P - 8)`,
  },
}

/* h5 · מאיזו כמות עדיפה מכונה A */
export const H5_MAP: SolveDemo = {
  id: 'c3-h5', extraRows: EXTRA,
  root: {
    want: 'Q', row: 'c3-compare', src: SRC_STRUCT,
    explain: 'A עדיפה כשהעלות הכוללת שלה נמוכה יותר — כותבים TC לכל מכונה ומשווים',
    needs: [
      { sym: r`TC_A`, note: 'FC גבוה, MC נמוך', node: {
        want: r`TC_A`, row: 'c3-tc-lin', src: SRC_STRUCT,
        given: [{ sym: r`FC_A`, value: <M>{r`5{,}000`}</M> }, { sym: r`MC_A`, value: <M>20</M> }],
        compute: r`TC_A = 5{,}000 + 20Q`, result: r`TC_A = 5{,}000 + 20Q`,
      } },
      { sym: r`TC_B`, note: 'FC נמוך, MC גבוה', node: {
        want: r`TC_B`, row: 'c3-tc-lin', src: SRC_STRUCT,
        given: [{ sym: r`FC_B`, value: <M>{r`1{,}000`}</M> }, { sym: r`MC_B`, value: <M>40</M> }],
        compute: r`TC_B = 1{,}000 + 40Q`, result: r`TC_B = 1{,}000 + 40Q`,
      } },
    ],
    compute: r`5{,}000 + 20Q < 1{,}000 + 40Q \ \Rightarrow\ 4{,}000 < 20Q \ \Rightarrow\ Q > 200`,
    result: r`Q > 200`,
  },
}
