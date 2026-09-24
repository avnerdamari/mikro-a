import { M, type BoxRow, type SolveDemo, type Src } from '@/components/SolveGraph'

/* מפות הפתרון (SolveGraph) של תרגול פרק 4 — מוצגות בפתרון המלא של כל תרגיל (שדה map ב-Exercise).
   המספרים — רק מהפתרון הקיים של התרגיל. חלק מהתרגילים משתמשים בחומר מפרקים מאוחרים יותר
   (שיווי משקל ועודף צרכן — פרק 6; מס — פרק 7), ולכן הצ'יפ "נלמד" שלהם מפנה לשם.
   ⚠️ לכתוב את הקובץ בכלי Write בלבד — סקריפט/heredoc מאבד backslashes בנוסחאות. */

const r = String.raw

const SRC_FN: Src = { chapter: 4, section: 'learn-demand-function', label: '4.1' }
const SRC_MKT: Src = { chapter: 4, section: 'learn-demand-market', label: '4.2' }
const SRC_SHIFT: Src = { chapter: 4, section: 'learn-demand-shifters', label: '4.3' }
const SRC_MOVE: Src = { chapter: 4, section: 'learn-demand-move-shift', label: '4.4' }
const SRC_EQ: Src = { chapter: 6, section: 'learn-equilibrium-condition', label: '6.1' }
const SRC_GROUPS: Src = { chapter: 6, section: 'learn-equilibrium-groups', label: '6.2' }
const SRC_CS: Src = { chapter: 6, section: 'learn-equilibrium-surplus', label: '6.3' }
const SRC_TAX: Src = { chapter: 7, section: 'learn-intervention-tax', label: '7.1' }

const row = (chapter: number, key: string, label: string, tex?: string, text?: string): { chapter: number; row: BoxRow } =>
  ({ chapter, row: { key, label, tex, text } })
const EXTRA = [
  row(4, 'd4-sum', 'מפרק 4 (4.2): ביקוש השוק — חיבור כמויות', r`Q_{total} = Q_1 + Q_2`),
  row(4, 'd4-n', 'מפרק 4 (4.2): n צרכנים זהים', r`Q_{group} = n \times Q_{i}(P)`),
  row(4, 'd4-pmax', 'מפרק 4 (4.1): מחיר מקסימלי — הכמות מתאפסת', r`Q = 0 \ \Rightarrow\ P_{\max} = \frac{a}{b}`),
  row(4, 'd4-spend', 'הוצאות הצרכנים (= פדיון היצרנים)', r`E = P \times Q`),
  row(4, 'd4-substitute', 'מפרק 4 (4.3): מחיר תחליף', undefined, '↑ מחיר תחליף → ביקוש עולה (ימינה)'),
  row(4, 'd4-complement', 'מפרק 4 (4.3): מחיר משלים', undefined, '↑ מחיר משלים → ביקוש יורד (שמאלה)'),
  row(4, 'd4-income', 'מפרק 4 (4.3): הכנסה, מוצר נורמלי', undefined, '↑ הכנסה → ביקוש עולה (ימינה); ↓ הכנסה → יורד (שמאלה)'),
  row(4, 'd4-move', 'מפרק 4 (4.4): תזוזה לאורך העקומה', undefined, 'רק כשהמחיר העצמי משתנה — העקומה לא זזה'),
  row(4, 'd4-shift', 'מפרק 4 (4.4): הסטת העקומה', undefined, 'כשמשתנים הכנסה, תחליף, משלים, טעמים — העקומה עצמה זזה'),
  row(4, 'd4-net', 'מהתרגיל: שתי הסטות בבת אחת', undefined, 'ההסטה נטו = צירוף שתי ההסטות; הכיוון תלוי בגודל היחסי'),
  row(6, 'd4-invert-s', 'מהתרגיל: היפוך ההיצע ל-Q=f(P)', r`P = c + dQ \ \Rightarrow\ Q = \frac{P - c}{d}`),
  row(6, 'd6-spend', 'מפרק 6 (6.2): הוצאות כל קבוצה', r`E_i = P^{*} \times Q_i`),
  row(6, 'd6-back', 'מפרק 6 (6.2): מציבים את P* בחזרה', r`Q^{*} = Q_s(P^{*}) = Q_d(P^{*})`),
  row(7, 'd7-pp', 'מפרק 7 (7.1): המחיר שהיצרן מקבל', r`P_p = P_c - t`),
]

/* ── קל ── */

export const E1_MAP: SolveDemo = {
  id: 'd4-e1', extraRows: EXTRA,
  root: {
    want: 'Q', row: 'demand-function', src: SRC_FN,
    explain: 'נתון מחיר — מציבים אותו בפונקציית הביקוש',
    given: [{ sym: 'D', value: <M>{r`Q = 500 - 3P`}</M> }, { sym: 'P', value: <M>50</M> }],
    compute: r`Q = 500 - 3 \times 50 = 350`,
    result: r`Q = 350`,
  },
}

export const E2_MAP: SolveDemo = {
  id: 'd4-e2', extraRows: EXTRA,
  root: {
    want: 'P', row: 'demand-inverse', src: SRC_FN,
    explain: 'נתונה כמות — פותרים את משוואת הביקוש עבור P',
    given: [{ sym: 'D', value: <M>{r`Q = 500 - 3P`}</M> }, { sym: 'Q', value: <M>200</M> }],
    compute: r`200 = 500 - 3P \ \Rightarrow\ 3P = 300 \ \Rightarrow\ P = 100`,
    result: r`P = 100`,
  },
}

export const E3_MAP: SolveDemo = {
  id: 'd4-e3', extraRows: EXTRA,
  root: {
    want: 'E', row: 'd4-spend', src: SRC_FN,
    explain: 'הוצאה = מחיר כפול כמות — והכמות עוד לא ידועה',
    given: [{ sym: 'P', value: <M>80</M> }],
    needs: [
      { sym: 'Q', note: 'הכמות המבוקשת במחיר 80', node: {
        want: 'Q', row: 'demand-function', src: SRC_FN,
        given: [{ sym: 'D', value: <M>{r`Q = 500 - 3P`}</M> }],
        compute: r`Q = 500 - 3 \times 80 = 260`, result: r`Q = 260`,
      } },
    ],
    compute: r`E = 80 \times 260 = 20{,}800`,
    result: r`E = 20{,}800`,
  },
}

export const E4_MAP: SolveDemo = {
  id: 'd4-e4', extraRows: EXTRA,
  root: {
    want: 'הביקוש לדגים', wantPlain: true, row: 'd4-substitute', src: SRC_SHIFT,
    explain: 'שינוי במחיר של מוצר אחר מזיז את כל עקומת הביקוש — לא רק נקודה עליה',
    given: [{ sym: 'עוף ודגים', plain: true, value: 'תחליפים' }, { sym: 'מחיר העוף', plain: true, value: 'עולה' }],
    compute: r`P_{\text{עוף}} \uparrow \ \Rightarrow\ D_{\text{דגים}} \rightarrow`,
    resultText: 'הביקוש לדגים עולה — העקומה זזה ימינה',
  },
}

export const E5_MAP: SolveDemo = {
  id: 'd4-e5', extraRows: EXTRA,
  root: {
    want: r`Q_{total}`, row: 'd4-sum', src: SRC_MKT,
    explain: 'באותו מחיר מחברים את הכמויות (לא את המחירים)',
    given: [{ sym: 'P', value: <M>50</M> }],
    needs: [
      { sym: r`Q_1`, note: 'הכמות של קבוצה 1 במחיר 50', node: {
        want: r`Q_1`, row: 'demand-function', src: SRC_FN,
        given: [{ sym: r`D_1`, value: <M>{r`300 - 2P`}</M> }],
        compute: r`Q_1 = 300 - 2 \times 50 = 200`, result: r`Q_1 = 200`,
      } },
      { sym: r`Q_2`, note: 'הכמות של קבוצה 2 במחיר 50', node: {
        want: r`Q_2`, row: 'demand-function', src: SRC_FN,
        given: [{ sym: r`D_2`, value: <M>{r`200 - P`}</M> }],
        compute: r`Q_2 = 200 - 50 = 150`, result: r`Q_2 = 150`,
      } },
    ],
    compute: r`Q_{total} = 200 + 150 = 350`,
    result: r`Q_{total} = 350`,
  },
}

/* ── בינוני ── */

export const M1_MAP: SolveDemo = {
  id: 'd4-m1', extraRows: EXTRA,
  root: {
    want: r`Q_{total}`, row: 'd4-sum', src: SRC_MKT,
    explain: 'כל פונקציה היא של צרכן בודד — קודם מכפילים במספר הצרכנים, ואז מחברים',
    needs: [
      { sym: r`Q_a`, note: 'ביקוש 1,000 המשפחות', node: {
        want: r`Q_a`, row: 'd4-n', src: SRC_MKT,
        given: [{ sym: r`D_1`, value: <M>{r`800 - 4P`}</M> }, { sym: r`n_1`, value: <M>{r`1{,}000`}</M> }],
        compute: r`Q_a = 1{,}000 \times (800 - 4P) = 800{,}000 - 4{,}000P`, result: r`Q_a = 800{,}000 - 4{,}000P`,
      } },
      { sym: r`Q_b`, note: 'ביקוש 500 המסעדות', node: {
        want: r`Q_b`, row: 'd4-n', src: SRC_MKT,
        given: [{ sym: r`D_2`, value: <M>{r`600 - P`}</M> }, { sym: r`n_2`, value: <M>500</M> }],
        compute: r`Q_b = 500 \times (600 - P) = 300{,}000 - 500P`, result: r`Q_b = 300{,}000 - 500P`,
      } },
    ],
    compute: r`Q_{total} = 1{,}100{,}000 - 4{,}500P`,
    result: r`Q_{total} = 1{,}100{,}000 - 4{,}500P`,
  },
}

export const M2_MAP: SolveDemo = {
  id: 'd4-m2', extraRows: EXTRA,
  root: {
    want: r`Q^{*}`, row: 'd6-back', src: SRC_GROUPS,
    explain: 'קודם מוצאים את P* מהשוואת ביקוש והיצע, ואז מציבים אותו בביקוש',
    given: [{ sym: 'D', value: <M>{r`Q = 600 - 2P`}</M> }],
    needs: [
      { sym: r`P^{*}`, note: 'המחיר שבו הכמות המבוקשת = הכמות המוצעת', node: {
        want: r`P^{*}`, row: 'equilibrium-condition', src: SRC_EQ,
        given: [{ sym: 'D', value: <M>{r`Q = 600 - 2P`}</M> }, { sym: 'S', value: <M>{r`Q = 3P - 300`}</M> }],
        compute: r`600 - 2P = 3P - 300 \ \Rightarrow\ 900 = 5P \ \Rightarrow\ P^{*} = 180`, result: r`P^{*} = 180`,
      } },
    ],
    compute: r`Q^{*} = 600 - 2 \times 180 = 240`,
    result: r`P^{*} = 180,\ Q^{*} = 240`,
  },
}

const m3Group = (id: string, i: 1 | 2, d: string, qCompute: string, q: string, eCompute: string, e: string): SolveDemo => ({
  id, extraRows: EXTRA,
  root: {
    want: `E_${i}`, row: 'd6-spend', src: SRC_GROUPS,
    explain: 'הוצאה של קבוצה = המחיר כפול הכמות שהקבוצה קונה',
    given: [{ sym: r`P^{*}`, value: <M>140</M> }],
    needs: [
      { sym: `Q_${i}`, note: `הכמות של קבוצה ${i} במחיר 140`, node: {
        want: `Q_${i}`, row: 'demand-function', src: SRC_FN,
        given: [{ sym: `D_${i}`, value: <M>{d}</M> }],
        compute: qCompute, result: `Q_${i} = ${q}`,
      } },
    ],
    compute: eCompute, result: `E_${i} = ${e}`,
  },
})
export const M3_MAP = [
  { label: 'קבוצה 1', demo: m3Group('d4-m3a', 1, r`800 - 4P`, r`Q_1 = 800 - 4 \times 140 = 240`, '240', r`E_1 = 140 \times 240 = 33{,}600`, r`33{,}600`) },
  { label: 'קבוצה 2', demo: m3Group('d4-m3b', 2, r`600 - P`, r`Q_2 = 600 - 140 = 460`, '460', r`E_2 = 140 \times 460 = 64{,}400`, r`64{,}400`) },
]

export const M4_MAP: SolveDemo = {
  id: 'd4-m4', extraRows: EXTRA,
  root: {
    want: 'עקומת הביקוש', wantPlain: true, row: 'd4-income', src: SRC_SHIFT,
    explain: 'מוצר נורמלי: כשההכנסה עולה קונים יותר בכל מחיר',
    given: [{ sym: 'המוצר', plain: true, value: 'נורמלי' }, { sym: 'ההכנסה', plain: true, value: 'עולה ב-20%' }],
    needs: [
      { sym: 'תזוזה או הסטה?', plain: true, note: 'מה השתנה — המחיר העצמי או משהו אחר?', node: {
        want: 'תזוזה או הסטה?', wantPlain: true, row: 'd4-shift', src: SRC_MOVE,
        given: [{ sym: 'מה השתנה', plain: true, value: 'ההכנסה (לא המחיר העצמי)' }],
        compute: r`I \neq P \ \Rightarrow\ \text{הסטה}`, resultText: 'הסטה של העקומה',
      } },
    ],
    compute: r`I \uparrow \ \Rightarrow\ D \rightarrow`,
    resultText: '(א) הכמות המבוקשת עולה בכל מחיר; (ב) העקומה זזה ימינה',
  },
}

export const M5_MAP: SolveDemo = {
  id: 'd4-m5', extraRows: EXTRA,
  root: {
    want: 'שיווי המשקל בקפה', wantPlain: true, row: 'equilibrium-condition', src: SRC_EQ,
    explain: 'השרשרת: מחיר החלב ← כמות החלב ← הביקוש לקפה ← שיווי משקל חדש בשוק הקפה',
    needs: [
      { sym: 'הביקוש לקפה', plain: true, note: 'קפה וחלב נצרכים יחד', node: {
        want: 'הביקוש לקפה', wantPlain: true, row: 'd4-complement', src: SRC_SHIFT,
        given: [{ sym: 'חלב וקפה', plain: true, value: 'משלימים' }],
        needs: [
          { sym: 'כמות החלב', plain: true, note: 'מה קורה בשוק החלב עצמו?', node: {
            want: 'כמות החלב', wantPlain: true, row: 'd4-move', src: SRC_MOVE,
            given: [{ sym: 'מחיר החלב', plain: true, value: 'עולה ב-10 ₪' }],
            compute: r`P_{\text{חלב}} \uparrow \ \Rightarrow\ Q_{\text{חלב}} \downarrow`,
            resultText: 'כמות החלב המבוקשת יורדת (תזוזה לאורך העקומה)',
          } },
        ],
        compute: r`Q_{\text{חלב}} \downarrow \ \Rightarrow\ D_{\text{קפה}} \leftarrow`,
        resultText: 'הביקוש לקפה יורד (הסטה שמאלה)',
      } },
    ],
    compute: r`D_{\text{קפה}} \leftarrow \ \Rightarrow\ P^{*} \downarrow,\ Q^{*} \downarrow`,
    resultText: 'המחיר והכמות של הקפה יורדים',
  },
}

/* ── מתקדם ── */

export const H1_MAP: SolveDemo = {
  id: 'd4-h1', extraRows: EXTRA,
  root: {
    want: r`Q^{*}`, row: 'd6-back', src: SRC_GROUPS,
    explain: 'שלבי 6.2: ביקוש מצרפי ← השוואה להיצע ← P* ← הצבה בחזרה',
    needs: [
      { sym: r`P^{*}`, note: 'משווים ביקוש מצרפי להיצע', node: {
        want: r`P^{*}`, row: 'equilibrium-condition', src: SRC_EQ,
        needs: [
          { sym: r`Q_{total}`, note: 'הביקוש של שתי הקבוצות יחד', node: {
            want: r`Q_{total}`, row: 'd4-n', src: SRC_MKT,
            given: [
              { sym: r`D_1`, value: <><M>{r`1{,}000 - 5P`}</M> (500 צרכנים)</> },
              { sym: r`D_2`, value: <><M>{r`800 - 2P`}</M> (800 צרכנים)</> },
            ],
            compute: r`Q_{total} = 500(1{,}000 - 5P) + 800(800 - 2P) = 1{,}140{,}000 - 4{,}100P`,
            result: r`Q_{total} = 1{,}140{,}000 - 4{,}100P`,
          } },
          { sym: r`Q_s`, note: 'ההיצע נתון בצורה P=f(Q)', node: {
            want: r`Q_s`, row: 'd4-invert-s', src: SRC_EQ,
            given: [{ sym: 'S', value: <M>{r`P = 20 + 0.1Q`}</M> }],
            compute: r`Q_s = \frac{P - 20}{0.1} = 10P - 200`, result: r`Q_s = 10P - 200`,
          } },
        ],
        compute: r`1{,}140{,}000 - 4{,}100P = 10P - 200 \ \Rightarrow\ 1{,}140{,}200 = 4{,}110P \ \Rightarrow\ P^{*} \approx 277.4`,
        result: r`P^{*} \approx 277.4`,
      } },
    ],
    compute: r`Q^{*} = 10 \times 277.4 - 200 \approx 2{,}574`,
    result: r`P^{*} \approx 277.4,\ Q^{*} \approx 2{,}574`,
  },
}

const S_NEW = {
  sym: r`S_{new}`, note: 'המס מזיז את ההיצע: היצרן מקבל P פחות 30', node: {
    want: r`S_{new}`, row: 'intervention-tax-producer', src: SRC_TAX,
    given: [{ sym: 'S', value: <M>{r`Q = 2P - 200`}</M> }, { sym: 't', value: <M>30</M> }],
    compute: r`Q = 2(P - 30) - 200 = 2P - 260`, result: r`S_{new}:\ Q = 2P - 260`,
  },
}
const H2_PC: SolveDemo = {
  id: 'd4-h2a', extraRows: EXTRA,
  root: {
    want: r`P_c`, row: 'equilibrium-condition', src: SRC_EQ,
    explain: 'שיווי המשקל החדש: הביקוש מול ההיצע שאחרי המס',
    given: [{ sym: 'D', value: <M>{r`Q = 1{,}000 - 4P`}</M> }],
    needs: [S_NEW],
    compute: r`1{,}000 - 4P = 2P - 260 \ \Rightarrow\ 1{,}260 = 6P \ \Rightarrow\ P_c = 210`,
    result: r`P_c = 210`,
  },
}
const H2_Q: SolveDemo = {
  id: 'd4-h2b', extraRows: EXTRA,
  root: {
    want: r`Q_{new}`, row: 'demand-function', src: SRC_FN,
    explain: 'הצרכן משלם P_c — מציבים אותו בביקוש',
    given: [{ sym: 'D', value: <M>{r`Q = 1{,}000 - 4P`}</M> }, { sym: r`P_c`, value: <><M>210</M> (מסעיף א׳)</> }],
    compute: r`Q_{new} = 1{,}000 - 4 \times 210 = 160`,
    result: r`Q_{new} = 160`,
  },
}
const H2_PP: SolveDemo = {
  id: 'd4-h2c', extraRows: EXTRA,
  root: {
    want: r`P_p`, row: 'd7-pp', src: SRC_TAX,
    explain: 'היצרן מקבל את מה שהצרכן משלם, פחות המס',
    given: [{ sym: r`P_c`, value: <><M>210</M> (מסעיף א׳)</> }, { sym: 't', value: <M>30</M> }],
    compute: r`P_p = 210 - 30 = 180`,
    result: r`P_p = 180`,
  },
}
export const H2_MAP = [
  { label: 'סעיף א׳: המחיר לצרכן', demo: H2_PC },
  { label: 'סעיף ב׳: הכמות החדשה', demo: H2_Q },
  { label: 'ובנוסף: המחיר שהיצרן מקבל', demo: H2_PP },
]

export const H3_MAP: SolveDemo = {
  id: 'd4-h3', extraRows: EXTRA,
  root: {
    want: r`D_X`, row: 'd4-net', src: SRC_SHIFT,
    explain: 'שני שינויים פועלים על אותה עקומה — בודקים כל אחד בנפרד ואז מצרפים',
    needs: [
      { sym: 'אפקט מחיר Y', plain: true, note: 'Y תחליף ל-X', node: {
        want: 'אפקט מחיר Y', wantPlain: true, row: 'd4-substitute', src: SRC_SHIFT,
        given: [{ sym: 'מחיר Y', plain: true, value: 'עולה ב-20 ₪' }],
        compute: r`P_Y \uparrow \ \Rightarrow\ D_X \rightarrow`, resultText: 'D_X זזה ימינה',
      } },
      { sym: 'אפקט ההכנסה', plain: true, note: 'X מוצר נורמלי', node: {
        want: 'אפקט ההכנסה', wantPlain: true, row: 'd4-income', src: SRC_SHIFT,
        given: [{ sym: 'ההכנסה', plain: true, value: 'יורדת ב-5%' }],
        compute: r`I \downarrow \ \Rightarrow\ D_X \leftarrow`, resultText: 'D_X זזה שמאלה',
      } },
    ],
    compute: r`D_X:\ \rightarrow \ + \ \leftarrow \ = \ ?`,
    resultText: 'לא ניתן לדעת בוודאות את כיוון P* ו-Q* — תלוי בגודל היחסי של שני האפקטים',
  },
}

export const H4_MAP: SolveDemo = {
  id: 'd4-h4', extraRows: EXTRA,
  askFormula: r`CS = \tfrac{1}{2}(P_{\max} - P^{*}) \cdot Q^{*}`,
  root: {
    want: 'CS', row: 'equilibrium-cs', src: SRC_CS,
    explain: 'שטח המשולש בין עקומת הביקוש לקו המחיר',
    given: [{ sym: r`P^{*}`, value: <M>100</M> }],
    needs: [
      { sym: r`Q^{*}`, note: 'הכמות במחיר 100', node: {
        want: r`Q^{*}`, row: 'demand-function', src: SRC_FN,
        given: [{ sym: 'D', value: <M>{r`Q = 600 - 2P`}</M> }],
        compute: r`Q^{*} = 600 - 2 \times 100 = 400`, result: r`Q^{*} = 400`,
      } },
      { sym: r`P_{\max}`, note: 'המחיר שבו הכמות מתאפסת — קודקוד המשולש', node: {
        want: r`P_{\max}`, row: 'd4-pmax', src: SRC_FN,
        compute: r`0 = 600 - 2P \ \Rightarrow\ P_{\max} = 300`, result: r`P_{\max} = 300`,
      } },
    ],
    compute: r`CS = \tfrac{1}{2}(300 - 100)(400) = 40{,}000`,
    result: r`CS = 40{,}000`,
  },
}

export const H5_MAP: SolveDemo = {
  id: 'd4-h5', extraRows: EXTRA,
  root: {
    want: 'P', row: 'd4-pmax', src: SRC_FN,
    explain: 'קבוצה 2 מפסיקה לקנות במחיר שבו הכמות שלה מתאפסת; מעליו רק קבוצה 1 קונה, מתחתיו שתיהן',
    given: [{ sym: r`D_2`, value: <M>{r`300 - 2P`}</M> }],
    compute: r`300 - 2P = 0 \ \Rightarrow\ P = 150`,
    result: r`P = 150`,
  },
}
