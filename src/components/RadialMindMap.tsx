import { useMemo, useRef, useState, useEffect, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { layoutTree, isHorizontal, type MindNode, type LayoutNode, type EdgeGroup } from "../lib/mindMapLayout";
import { MindMapSearch } from "./MindMapSearch";

/**
 * child id -> parent id, בנוי פעם אחת מהעץ. משמש לחישוב שרשרת-האבות של צומת
 * שנפתח: פתיחת ענף כלשהו סוגרת את כל השאר, ומשאירה פתוחה רק את שרשרת-האבות
 * שלו + הוא עצמו — כדי שתמיד יהיה ענף פתוח אחד בלבד, וכל המקום פנוי בשבילו.
 */
function buildParentMap(root: MindNode): Record<string, string> {
  const parents: Record<string, string> = {};
  function walk(node: MindNode) {
    if (node.children) {
      for (const child of node.children) {
        parents[child.id] = node.id;
        walk(child);
      }
    }
  }
  walk(root);
  return parents;
}

/** עוקב אחרי class="dark" על document.documentElement. */
function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

/** ה-breakpoint "sm:" של Tailwind (640px) — נגזר מרוחב ה-viewport, לא מרוחב הקונטיינר. */
function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.innerWidth >= 640);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isDesktop;
}

/** גודל הקונטיינר בפועל (px) — כדי לתרגם מיקומי-אחוזים (node.x/y) לפיקסלים אמיתיים. */
function useElementSize(ref: React.RefObject<HTMLElement | null>): { w: number; h: number } {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

/**
 * חצי-רוחב/חצי-גובה משוער בפיקסלים לכל סוג בועה, לפי אותן מחלקות Tailwind
 * מ-bubbleClassFor (w וגם min-h).
 */
function bubbleHalfSizePx(node: LayoutNode, isDesktop: boolean): { hw: number; hh: number } {
  if (node.kind === "action") return isDesktop ? { hw: 92, hh: 15 } : { hw: 64, hh: 15 };
  const byDepth = [
    isDesktop ? { hw: 64, hh: 26 } : { hw: 48, hh: 26 },
    isDesktop ? { hw: 96, hh: 20 } : { hw: 64, hh: 20 },
    isDesktop ? { hw: 64, hh: 22 } : { hw: 48, hh: 22 },
  ];
  return byDepth[Math.min(node.depth, byDepth.length - 1)];
}

type AccentKey = "blue" | "emerald" | "amber" | "violet";

const ACCENT_COLORS: Record<AccentKey, { light: { bg: string; text: string }; dark: { bg: string; text: string } }> = {
  blue: { light: { bg: "#dbeafe", text: "#193cb8" }, dark: { bg: "#1c398e", text: "#dbeafe" } },
  emerald: { light: { bg: "#d0fae5", text: "#005f46" }, dark: { bg: "#004e3b", text: "#d0fae5" } },
  amber: { light: { bg: "#fef3c7", text: "#92400e" }, dark: { bg: "#78350f", text: "#fef3c7" } },
  violet: { light: { bg: "#ede9fe", text: "#5b21b6" }, dark: { bg: "#4c1d95", text: "#ede9fe" } },
};

// עומק 1 (פרקים ישירות מתחת לשורש) וכל עומק 2 (תיאוריה/תרגול בתוכן) מקבלים
// כל אחד צבע-קבוע לפי עומק, כדי שההיררכיה תיקרא במבט אחד. השורש עצמו (עומק 0)
// שומר על accent משלו.
const LEVEL_ACCENTS: Partial<Record<number, AccentKey>> = { 1: "violet", 2: "violet" };

function accentKeyFor(node: LayoutNode): AccentKey | undefined {
  return node.depth === 0 ? node.accent : LEVEL_ACCENTS[node.depth];
}

function accentStyleFor(node: LayoutNode, isDark: boolean): CSSProperties | undefined {
  const key = accentKeyFor(node);
  if (!key) return undefined;
  const colors = ACCENT_COLORS[key][isDark ? "dark" : "light"];
  return { backgroundColor: colors.bg, color: colors.text };
}

function bubbleClassFor(node: LayoutNode): string {
  const shared =
    "rounded-full text-center leading-none text-balance line-clamp-3 flex items-center justify-center absolute z-10 transition-colors cursor-pointer";

  if (node.kind === "action") {
    return `${shared} w-32 sm:w-[184px] min-h-[1.5rem] px-2.5 py-0.5 text-[9px] sm:text-[10px] font-medium border border-[#4F46E5]/50 bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 text-[#312e81] dark:text-indigo-200`;
  }

  const sizeByDepth = [
    "w-24 sm:w-32 min-h-[2.5rem] px-3 py-1.5 text-[11px] sm:text-sm font-bold border-2",
    "w-32 sm:w-48 min-h-[2rem] px-2.5 py-1 text-[10px] sm:text-xs font-semibold border",
    "w-24 sm:w-32 min-h-[2rem] px-2.5 py-1 text-[9px] sm:text-[11px] font-medium border",
  ];
  const size = sizeByDepth[Math.min(node.depth, sizeByDepth.length - 1)];

  const accentKey = accentKeyFor(node);
  if (accentKey) {
    const borderClass =
      accentKey === "blue" ? "border-blue-400/60" :
      accentKey === "emerald" ? "border-emerald-400/60" :
      accentKey === "amber" ? "border-amber-400/60" :
      "border-violet-400/60";
    return `${shared} ${size} ${borderClass}`;
  }
  return `${shared} ${size} border-slate-300/70 dark:border-slate-600/70 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#4F46E5] hover:bg-[#4F46E5]/10`;
}

/**
 * חיבורים בהשראת livestats-il (עקומת-בזייה עבה, סגול-שקוף, ראש-חץ גדול) —
 * "קשת-עץ" אופקית: יוצאת מאמצע קצה-ההורה הפונה לילד ונוחתת בדיוק על אמצע
 * קצה-הילד הפונה לאב, עקומת בזייה קובית עם נקודות-בקרה אופקיות כדי שהמשיק
 * בשני הקצוות אופקי וראש-החץ (orient=auto) תמיד פונה ישר אל תוך הבועה.
 */
const LINE_STROKE_WIDTH = 1.75;
const ARROW_TIP_OVERSHOOT = 0.5 * LINE_STROKE_WIDTH;

function ConnectorLines({
  nodes,
  edges,
  containerSize,
  isDesktop,
}: {
  nodes: LayoutNode[];
  edges: EdgeGroup[];
  containerSize: { w: number; h: number };
  isDesktop: boolean;
}) {
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const { w, h } = containerSize;

  const curves = useMemo(() => {
    if (!w || !h) return [];
    const out: { key: string; d: string }[] = [];
    edges.forEach((group) => {
      const from = byId.get(group.from);
      if (!from) return;
      const fx = (from.x / 100) * w, fy = (from.y / 100) * h;
      const fromSize = bubbleHalfSizePx(from, isDesktop);
      group.to.forEach((toId) => {
        const to = byId.get(toId);
        if (!to) return;
        const tx = (to.x / 100) * w, ty = (to.y / 100) * h;
        const dx = tx - fx;
        const toSize = bubbleHalfSizePx(to, isDesktop);
        if (!isHorizontal(group.dir)) return;
        const sign = dx >= 0 ? 1 : -1;
        const x1 = fx + sign * (fromSize.hw + 4), y1 = fy;
        const x2 = tx - sign * (toSize.hw + ARROW_TIP_OVERSHOOT), y2 = ty;
        if (sign === 1 ? x2 <= x1 + 8 : x2 >= x1 - 8) return;
        const pull = Math.max(20, Math.abs(x2 - x1) * 0.45);
        out.push({
          key: `${group.from}->${toId}`,
          d: `M${x1.toFixed(1)},${y1.toFixed(1)} C${(x1 + sign * pull).toFixed(1)},${y1.toFixed(1)} ${(x2 - sign * pull).toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`,
        });
      });
    });
    return out;
  }, [edges, byId, w, h, isDesktop]);

  if (!w || !h) return null;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <marker id="mind-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0.6 L6.5,3.5 L0,6.4 L1.6,3.5 Z" fill="#4F46E5" fillOpacity="0.7" />
        </marker>
      </defs>
      {curves.map((c) => (
        <path
          key={c.key}
          d={c.d}
          fill="none"
          stroke="#4F46E5"
          strokeOpacity="0.4"
          strokeWidth={LINE_STROKE_WIDTH}
          strokeLinecap="round"
          markerEnd="url(#mind-arrow)"
        />
      ))}
    </svg>
  );
}

type DragOverride = { x: number; y: number };
type DragState = { id: string; startClientX: number; startClientY: number; startX: number; startY: number; moved: boolean };

const DRAG_THRESHOLD_PX = 6;

/* הבועה האחרונה שנפתחה בדאבל-קליק (ניווט לפרק) — נשמרת כדי שבפתיחה הבאה של
   המפה היא תישאר צבועה וענף-האבות שלה יהיה פתוח, במקום לחזור לברירת המחדל. */
const LAST_SELECTED_KEY = "mikroAMindMapLastSelected";

function readLastSelected(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_SELECTED_KEY);
  } catch {
    return null;
  }
}

function writeLastSelected(id: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_SELECTED_KEY, id);
  } catch {
    /* אחסון חסום — לא קריטי */
  }
}

function ancestorChainOf(parentMap: Record<string, string>, id: string): string[] {
  const chain: string[] = [];
  let current = parentMap[id];
  while (current) {
    chain.push(current);
    current = parentMap[current];
  }
  return chain;
}

export function RadialMindMap({
  tree,
  center,
  defaultOpenIds,
  onNavigate,
  onBackgroundDoubleClick,
  heightClass = "min-h-[73vh] sm:min-h-[83vh]",
}: {
  tree: MindNode;
  center: { x: number; y: number };
  defaultOpenIds: string[];
  onNavigate: (chapterId: string) => void;
  onBackgroundDoubleClick?: () => void;
  heightClass?: string;
}) {
  const parentMap = useMemo(() => buildParentMap(tree), [tree]);

  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const last = readLastSelected();
    if (last) return new Set([...defaultOpenIds, ...ancestorChainOf(parentMap, last), last]);
    return new Set(defaultOpenIds);
  });
  const [dragOverrides, setDragOverrides] = useState<Record<string, DragOverride>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(() => readLastSelected());
  const clickTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const isDark = useIsDark();
  const isDesktop = useIsDesktop();
  const containerSize = useElementSize(containerRef);

  function ancestorChain(id: string): string[] {
    return ancestorChainOf(parentMap, id);
  }

  useEffect(() => {
    return () => {
      if (clickTimer.current !== null) window.clearTimeout(clickTimer.current);
    };
  }, []);

  const { nodes: layoutNodes, edges } = useMemo(() => layoutTree(tree, center, openIds), [tree, center, openIds]);

  const nodes = useMemo(
    () =>
      layoutNodes.map((n) => {
        const override = dragOverrides[n.id];
        return override ? { ...n, x: override.x, y: override.y } : n;
      }),
    [layoutNodes, dragOverrides],
  );

  function toggleOpen(id: string) {
    setOpenIds((prev) => {
      if (prev.has(id)) {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      return new Set([...ancestorChain(id), id]);
    });
  }

  /** נקרא כשנבחרת תוצאת-חיפוש — פותח בדיוק את הענף שמוביל אליה ומדגיש אותה. */
  function revealMatch(id: string) {
    if (clickTimer.current !== null) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    setOpenIds(new Set([...ancestorChain(id), id]));
    setHighlightedId(id);
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLButtonElement>, node: LayoutNode) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      id: node.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: node.x,
      startY: node.y,
      moved: false,
    };
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const ds = dragState.current;
    const container = containerRef.current;
    if (!ds || !container) return;
    const dxPx = e.clientX - ds.startClientX;
    const dyPx = e.clientY - ds.startClientY;
    if (!ds.moved && Math.hypot(dxPx, dyPx) < DRAG_THRESHOLD_PX) return;
    ds.moved = true;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ds.startX + (dxPx / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ds.startY + (dyPx / rect.height) * 100));
    setDragOverrides((prev) => ({ ...prev, [ds.id]: { x, y } }));
  }

  function handlePointerUp() {
    const ds = dragState.current;
    dragState.current = null;
    if (ds?.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 300);
    }
  }

  function handleClick(node: LayoutNode) {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (node.kind === "action") return;
    if (clickTimer.current !== null) return;
    clickTimer.current = window.setTimeout(() => {
      clickTimer.current = null;
      toggleOpen(node.id);
    }, 220);
  }

  function handleDoubleClick(node: LayoutNode) {
    if (clickTimer.current !== null) {
      window.clearTimeout(clickTimer.current);
      clickTimer.current = null;
    }
    if (node.chapterId !== undefined) {
      writeLastSelected(node.id);
      setHighlightedId(node.id);
      onNavigate(node.chapterId);
    }
  }

  const searchRoots = useMemo(() => [tree], [tree]);

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <MindMapSearch roots={searchRoots} onReveal={revealMatch} />
      </div>
      <div
        ref={containerRef}
        dir="ltr"
        onDoubleClick={(e) => {
          if (e.target === e.currentTarget) onBackgroundDoubleClick?.();
        }}
        className={`relative w-full ${heightClass} rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-visible touch-none`}
      >
        <ConnectorLines nodes={nodes} edges={edges} containerSize={containerSize} isDesktop={isDesktop} />
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            dir="rtl"
            onClick={() => handleClick(node)}
            onDoubleClick={() => handleDoubleClick(node)}
            onPointerDown={(e) => handlePointerDown(e, node)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%,-50%)",
              touchAction: "none",
              ...accentStyleFor(node, isDark),
            }}
            className={`${bubbleClassFor(node)} cursor-grab active:cursor-grabbing ${
              node.id === highlightedId ? "ring-4 ring-amber-400 ring-offset-2" : ""
            }`}
          >
            {node.label}
          </button>
        ))}
      </div>
    </div>
  );
}
