/* כריכת ספר מדומה — עותק מותאם של הכריכה ב-Advisors-App (src/LandingPage.tsx),
   "מימון וסטטיסטיקה". כולה CSS/SVG, בלי קובץ תמונה. רק הטקסט הותאם למיקרו-כלכלה. */

export function BookCover() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative" style={{ filter: 'drop-shadow(10px 16px 30px rgba(0,0,0,0.45))' }}>
        <div dir="ltr" className="flex items-stretch">
          {/* שדרה/עובי הספר */}
          <div
            className="relative order-2 w-6 shrink-0 overflow-hidden rounded-tr-lg"
            style={{
              background: 'linear-gradient(to right, #000208 0%, #071638 40%, #163363 75%, #000208 100%)',
              boxShadow: 'inset -6px 0 10px rgba(0,0,0,0.75), inset 2px 0 4px rgba(255,255,255,0.2)',
            }}
          >
            <div
              className="absolute inset-x-[-60%]"
              style={{
                bottom: '16%',
                height: '10px',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(205,208,214,0.65), rgba(255,255,255,0.05))',
                transform: 'rotate(-20deg)',
              }}
            />
          </div>

          <div
            className="relative order-1 flex-1 overflow-hidden px-6 pb-6 pt-8 text-white"
            style={{
              background:
                'radial-gradient(circle at 30% 10%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(160deg, #24476e 0%, #1e3a5f 45%, #0d2036 100%)',
            }}
          >
            {/* גרף דקורטיבי ברקע הכריכה */}
            <svg
              className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-20"
              viewBox="0 0 300 400"
              preserveAspectRatio="none"
              aria-hidden
            >
              {[80, 160, 240, 320].map((y) => (
                <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="white" strokeWidth="0.5" />
              ))}
              <polygon
                points="0,340 40,300 80,320 120,260 160,280 200,200 240,220 260,150 300,170 300,400 0,400"
                fill="white"
                opacity="0.15"
              />
              <polyline
                points="0,340 40,300 80,320 120,260 160,280 200,200 240,220 260,150 300,170"
                fill="none"
                stroke="white"
                strokeWidth="3"
              />
            </svg>

            <div className="mt-2 text-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-300">ספר לימוד דיגיטלי</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">מבוא לכלכלה א'</h1>
              <p className="mt-2 text-sm text-slate-300">מיקרו-כלכלה · המרכז האקדמי פרס</p>
              <div className="mx-auto mt-4 h-px w-24 bg-white/20" />
              <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
                הסבר תיאורטי, הדמיות אינטראקטיביות ותרגול מלא לכל נושאי הקורס
              </p>
            </div>

            <div dir="rtl" className="mt-6 space-y-2.5">
              {[
                { title: '10 פרקים לפי הסילבוס', desc: 'הסברים מפורטים והדמיות אינטראקטיביות לכל נושא' },
                { title: 'תרגילים ב-3 רמות קושי', desc: 'קל · בינוני · מתקדם, עם בדיקת תשובה אמיתית' },
                { title: 'סימולציות חיות', desc: 'גרפים אינטראקטיביים שמראים איך משתנה שיווי המשקל' },
                { title: 'מבנה המבחן', desc: '20 שאלות רב-ברירה, דגש על 6 הפרקים המרכזיים', ribbon: true },
              ].map(({ title, desc, ribbon }) => (
                <div key={title} className="flex items-center gap-3 rounded-xl bg-white/95 px-3 py-2.5 shadow-sm dark:bg-slate-100">
                  <div className="text-right">
                    <p className="text-sm font-bold leading-tight text-[#1e3a5f]">{title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{desc}</p>
                  </div>
                  {ribbon && (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center" aria-hidden>
                      <svg viewBox="0 0 24 24" className="h-12 w-12">
                        <circle cx="12" cy="8" r="5" fill="#dc2626" />
                        <path d="M8.5 12.5 6 21l6-3.5L18 21l-2.5-8.5" fill="#dc2626" />
                      </svg>
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p dir="rtl" className="mt-5 text-center text-xs tracking-[0.3em] text-slate-400">
              אבנר דמארי
            </p>
          </div>
        </div>

        {/* עובי הספר למטה */}
        <div
          className="h-5 w-full rounded-br-lg"
          style={{
            background:
              'linear-gradient(to bottom, #04070f 0%, #04070f 18%, transparent 18%, transparent 82%, #04070f 82%, #04070f 100%), repeating-linear-gradient(to bottom, #eceded 0px, #eceded 2px, #d6d7d9 2px, #d6d7d9 3px)',
            boxShadow: 'inset 0 3px 5px rgba(0,0,0,0.25)',
          }}
        />

        {/* פס עיגולי דק לאורך השפה הימנית */}
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            right: 0,
            top: '2px',
            bottom: '2px',
            width: '8px',
            background: 'linear-gradient(180deg, #24476e 0%, #163363 55%, #0a1830 100%)',
          }}
        />
      </div>
    </div>
  )
}
