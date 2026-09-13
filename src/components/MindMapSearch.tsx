import { useEffect, useRef, useState } from "react";
import { searchMindNodes, type MindNode } from "../lib/mindMapLayout";

const MAX_RESULTS = 20;

/**
 * חיפוש ייעודי בתוך המפה עצמה — ברמת הכותרות (label) בלבד. סורק את כל עץ
 * הנתונים, כולל ענפים סגורים כרגע, ולא רק מה שגלוי על המסך.
 */
export function MindMapSearch({ roots, onReveal }: { roots: MindNode[]; onReveal: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = q.trim() ? searchMindNodes(roots, q).slice(0, MAX_RESULTS) : [];
  const isOpen = q.trim().length > 0;

  useEffect(() => {
    if (!expanded) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setQ("");
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [expanded]);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  const close = () => {
    setQ("");
    setExpanded(false);
  };

  const pick = (id: string) => {
    onReveal(id);
    close();
  };

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-label="חיפוש בתוך המפה"
        title="חיפוש בתוך המפה (ברמת הכותרות)"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] text-white shadow-sm transition-colors hover:bg-[#4338ca] active:scale-95"
      >
        🔍
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm" dir="rtl">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
          placeholder="חיפוש בתוך המפה..."
          className="w-full rounded-lg border-2 border-[#4F46E5] bg-indigo-50 dark:bg-indigo-950/40 dark:border-indigo-400 py-2 pr-3 pl-8 text-sm text-right text-slate-800 dark:text-white shadow-sm placeholder:text-[#4F46E5]/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="נקה"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[50vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-400">לא נמצאו תוצאות עבור "{q}"</div>
          ) : (
            <div className="py-1">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => pick(r.id)}
                  className="block w-full text-right px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{r.label}</div>
                  {r.breadcrumb.length > 0 && (
                    <div className="text-xs text-slate-400 mt-0.5">{r.breadcrumb.join(" → ")}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
