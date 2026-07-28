// @ts-check
/**
 * מחולל אינדקס תוכן לחיפוש (סקיל build-book, סעיף 5).
 *
 * סורק את קבצי הפרקים, מחלץ את הטקסט העברי הגלוי, וממפה כל קובץ ל-id של פרק
 * (אותו id שב-CHAPTERS ב-src/data/toc.ts). התוצאה נכתבת ל-src/data/contentIndex.ts
 * ומשמשת את החיפוש בסייד-בר כדי למצוא ביטוי בתוך גוף הפרקים — לא רק בכותרות.
 *
 * הרצה:  npm run gen:search
 * ⚠️ להריץ מחדש בכל פעם שמוסיפים/משנים תוכן פרק.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src", "pages", "chapters");
const OUT = join(ROOT, "src", "data", "contentIndex.ts");

/* מיפוי שם-קובץ → id של פרק. חייב להתאים ל-CHAPTERS ב-toc.ts.
   ⚠️ קובץ פרק חדש שלא נרשם כאן — התוכן שלו פשוט לא ייכנס לחיפוש. */
const FILE_TO_ID = {
  "ChapterIntro.tsx": "intro",
  "Chapter1PPF.tsx": "ppf",
  "Chapter2Production.tsx": "production",
  "Chapter3Costs.tsx": "costs",
  "Chapter4Demand.tsx": "demand",
  "Chapter5Elasticity.tsx": "elasticity",
  "Chapter6Equilibrium.tsx": "equilibrium",
  "Chapter7Intervention.tsx": "intervention",
  "Chapter8OpenEconomy.tsx": "open-economy",
  "Chapter9Tariff.tsx": "tariff",
  "Chapter10Monopoly.tsx": "monopoly",
  "Chapter11Solutions.tsx": "solutions",
  "Chapter1Practice.tsx": "ppf-practice",
  "Chapter2Practice.tsx": "production-practice",
  "Chapter3Practice.tsx": "costs-practice",
  "Chapter4Practice.tsx": "demand-practice",
  "Chapter5Practice.tsx": "elasticity-practice",
  "Chapter6Practice.tsx": "equilibrium-practice",
  "Chapter7Practice.tsx": "intervention-practice",
  "Chapter8Practice.tsx": "open-economy-practice",
  "Chapter9Practice.tsx": "tariff-practice",
  "Chapter10Practice.tsx": "monopoly-practice",
  "AppendixExams.tsx": "exams",
  /* קבצי המבחנים עצמם — התוכן שלהם מצטבר תחת אותו מזהה "exams".
     ⚠️ מבחן חדש חייב להירשם כאן, אחרת שאלותיו לא ייכנסו לחיפוש. */
  "Exam1.tsx": "exams",
  "Exam2.tsx": "exams",
  "AppendixFormulas.tsx": "formulas",
  "AppendixGlossary.tsx": "glossary",
};

/* רצף שמתחיל בתו עברי וממשיך בעברית/לטינית/ספרות —
   כך שראשי-תיבות לועזיים בתוך משפט עברי (PPF, MC, TR) נשמרים ולא נחתכים. */
const HEB_RUN = /[֐-׿][֐-׿ a-zA-Z0-9'"׳״\-.,()/%₪]*/g;

const bodies = {};
let files = 0;

for (const file of readdirSync(DIR)) {
  const id = FILE_TO_ID[file];
  if (!id) continue;
  files++;
  const src = readFileSync(join(DIR, file), "utf8");
  const text = (src.match(HEB_RUN) || [])
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
    .join(" ");
  bodies[id] = (bodies[id] ? bodies[id] + " " : "") + text;
}

const missing = Object.keys(FILE_TO_ID).filter((f) => !readdirSync(DIR).includes(f));
if (missing.length) console.warn("⚠️ קבצים במיפוי שלא נמצאו:", missing.join(", "));

const out = `/* נוצר אוטומטית ע"י scripts/gen-search-index.mjs — אין לערוך ידנית.
   הרצה מחדש: npm run gen:search */
export const CONTENT_BODIES: Record<string, string> = ${JSON.stringify(bodies, null, 2)};
`;
writeFileSync(OUT, out);

const chars = Object.values(bodies).reduce((n, s) => n + s.length, 0);
console.log(`אונדקסו ${files} קבצים · ${Object.keys(bodies).length} פרקים · ${chars.toLocaleString()} תווים`);
