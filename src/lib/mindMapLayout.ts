export type MindNode = {
  id: string;
  label: string;
  /** קיים בעלה (בלי children משלו) שממנו נובעת בועת-פעולה אחת/שתיים. */
  chapterId?: string;
  /** בועת "✏️ תרגול" נוספת (לצד "📖 תיאוריה") כשמוגדר יחד עם chapterId. */
  practiceChapterId?: string;
  /** דורס את תווית בועת-הפעולה היחידה כש-practiceChapterId לא מוגדר. */
  actionLabel?: string;
  /** מוסיף 🔒 לתווית בועת-הפעולה (לתרגול/נספח נעולים). */
  locked?: boolean;
  accent?: "blue" | "emerald" | "amber";
  children?: MindNode[];
};

export type NodeKind = "book" | "group" | "chapter" | "action";

export type LayoutNode = {
  id: string;
  label: string;
  kind: NodeKind;
  depth: number;
  x: number;
  y: number;
  chapterId?: string;
  hasChildrenToShow: boolean;
  accent?: "blue" | "emerald" | "amber";
};

export type Direction = "right" | "left" | "up" | "down";
/** כל הילדים של אב אחד, שנפרסו יחד בקו ישר לכיוון dir — קבוצה אחת, לא קו נפרד
 *  לכל ילד, כדי שהרינדור יוכל לצייר "גזע" משותף במרווח שבין האב לילדים
 *  (ראו ConnectorLines ב-RadialMindMap.tsx) במקום צרור קווים אלכסוניים חוצים. */
export type EdgeGroup = { from: string; to: string[]; dir: Direction };
export function isHorizontal(dir: Direction): boolean {
  return dir === "right" || dir === "left";
}
export type LayoutResult = { nodes: LayoutNode[]; edges: EdgeGroup[] };

export type MindMapSearchResult = {
  id: string;
  label: string;
  chapterId?: string;
  /** אבות מהשורש כלפי מטה — לא כולל את התווית של הצומת עצמו. */
  breadcrumb: string[];
};

/**
 * חיפוש ברמת הכותרות בלבד על עץ הנתונים הגולמי — עצמאי ממצב פתוח/סגור, כך
 * שמוצא גם ענפים סגורים כרגע. הולך על node.children ולא על getDisplayChildren(),
 * כדי לא להציף תוצאות בבועות "תיאוריה/תרגול" הסינתטיות.
 */
export function searchMindNodes(roots: MindNode[], query: string): MindMapSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: MindMapSearchResult[] = [];
  function walk(node: MindNode, ancestors: string[]) {
    if (node.label.toLowerCase().includes(q)) {
      results.push({ id: node.id, label: node.label, chapterId: node.chapterId, breadcrumb: ancestors });
    }
    node.children?.forEach((c) => walk(c, [...ancestors, node.label]));
  }
  roots.forEach((r) => walk(r, []));
  return results;
}

type DisplayChild =
  | { kind: "group" | "chapter"; node: MindNode }
  | { kind: "action"; id: string; label: string; chapterId: string };

/** עלה (בלי children משלו) עם chapterId מתפרק לבועת/בועות-פעולה סינתטיות. */
function getDisplayChildren(node: MindNode): DisplayChild[] {
  if (node.children && node.children.length > 0) {
    return node.children.map((c) =>
      c.children && c.children.length > 0 ? { kind: "group", node: c } : { kind: "chapter", node: c },
    );
  }
  if (node.chapterId === undefined) return [];
  const chapterId = node.chapterId;
  if (node.practiceChapterId !== undefined) {
    return [
      { kind: "action", id: `${node.id}::theory`, label: "📖 תיאוריה", chapterId },
      { kind: "action", id: `${node.id}::practice`, label: node.locked ? "🔒 תרגול" : "✏️ תרגול", chapterId: node.practiceChapterId },
    ];
  }
  const base = node.actionLabel ?? "📖 פתח את הפרק";
  return [{ kind: "action", id: `${node.id}::go`, label: node.locked ? `🔒 ${base}` : base, chapterId }];
}

// ---------------------------------------------------------------------------
// פריסת עץ בכיוון-אדפטיבי: כל צומת פתוח בוחר כיוון קרדינלי אחד (לפי איפה יש
// הכי הרבה מקום פנוי ממנו) ומציב את ילדיו בקו ישר לאותו כיוון. צומת יורש את
// כיוון-ההתרחבות של האב שלו כל עוד יש לו שם עדיין מקום שמיש, כדי ששרשרת
// שלמה של פתיחות תתפרש באופן עקבי החוצה ולא תתנגש בעמודה שכנה.
// ---------------------------------------------------------------------------

const DIRECTION_PRIORITY: Direction[] = ["right", "down", "left", "up"];
const TREE_STEP = 24;
const TREE_MIN_GAP = 9;
const CLAMP_MIN = 6;
const CLAMP_MAX = 90;

function clampVal(v: number): number {
  return Math.min(CLAMP_MAX, Math.max(CLAMP_MIN, v));
}

function room(pos: { x: number; y: number }, dir: Direction): number {
  if (dir === "right") return CLAMP_MAX - pos.x;
  if (dir === "left") return pos.x - CLAMP_MIN;
  if (dir === "down") return CLAMP_MAX - pos.y;
  return pos.y - CLAMP_MIN; // "up"
}

function bestDirection(pos: { x: number; y: number }, candidates: Direction[]): Direction {
  return candidates.reduce((best, d) => (room(pos, d) > room(pos, best) ? d : best), candidates[0]);
}

// לצומת שכבר יש לו כיוון-הורשה (לא ילד ישיר של השורש) — ממשיכים תמיד באותו
// כיוון, בלי לפנות לציר ניצב.
function pickDirection(pos: { x: number; y: number }, arrivedFrom?: Direction): Direction {
  if (!arrivedFrom) return bestDirection(pos, DIRECTION_PRIORITY);
  return arrivedFrom;
}

/** מפזר n ילדים בקו ישר במרחק TREE_STEP אחד מ-parent, בכיוון dir. */
function placeChildren(parent: { x: number; y: number }, dir: Direction, n: number): { x: number; y: number }[] {
  const horizontal = dir === "right" || dir === "left";
  const axisPos = clampVal(horizontal ? parent.x + (dir === "right" ? TREE_STEP : -TREE_STEP) : parent.y + (dir === "down" ? TREE_STEP : -TREE_STEP));
  const perpCenter = horizontal ? parent.y : parent.x;

  const avail = CLAMP_MAX - CLAMP_MIN;
  const idealSpan = TREE_MIN_GAP * (n - 1);
  const gap = n <= 1 ? 0 : idealSpan <= avail ? TREE_MIN_GAP : avail / (n - 1);
  const totalSpan = gap * (n - 1);
  let start = perpCenter - totalSpan / 2;
  if (start < CLAMP_MIN) start = CLAMP_MIN;
  if (start + totalSpan > CLAMP_MAX) start = CLAMP_MAX - totalSpan;

  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const perp = clampVal(n === 1 ? perpCenter : start + gap * i);
    positions.push(horizontal ? { x: axisPos, y: perp } : { x: perp, y: axisPos });
  }
  return positions;
}

function walkTree(
  id: string,
  label: string,
  kind: NodeKind,
  depth: number,
  pos: { x: number; y: number },
  arrivedFrom: Direction | undefined,
  openIds: Set<string>,
  originalNode: MindNode | undefined,
  chapterId: string | undefined,
  accent: "blue" | "emerald" | "amber" | undefined,
  out: LayoutNode[],
  edges: EdgeGroup[],
): void {
  const isOpen = openIds.has(id);
  const children = isOpen && originalNode ? getDisplayChildren(originalNode) : [];

  out.push({ id, label, kind, depth, x: pos.x, y: pos.y, chapterId, hasChildrenToShow: children.length > 0, accent });

  if (children.length === 0) return;

  const dir = pickDirection(pos, arrivedFrom);
  const positions = placeChildren(pos, dir, children.length);

  edges.push({ from: id, to: children.map((c) => (c.kind === "action" ? c.id : c.node.id)), dir });

  children.forEach((child, i) => {
    const childPos = positions[i];
    if (child.kind === "action") {
      walkTree(child.id, child.label, "action", depth + 1, childPos, dir, openIds, undefined, child.chapterId, undefined, out, edges);
    } else {
      walkTree(child.node.id, child.node.label, child.kind, depth + 1, childPos, dir, openIds, child.node, child.node.chapterId, child.node.accent, out, edges);
    }
  });
}

/** פורס עץ אחד עם שורש קבוע, כשכל צומת פתוח מתרחב לכיוון עם הכי הרבה מקום. */
export function layoutTree(root: MindNode, rootPos: { x: number; y: number }, openIds: Set<string>): LayoutResult {
  const nodes: LayoutNode[] = [];
  const edges: EdgeGroup[] = [];
  walkTree(root.id, root.label, "book", 0, rootPos, undefined, openIds, root, root.chapterId, root.accent, nodes, edges);
  return { nodes, edges };
}
