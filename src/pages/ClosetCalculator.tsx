import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import ProductCallout from '../components/ProductCallout';
import FaqAccordion from '../components/FaqAccordion';
import {
  BREATHING_ROOM,
  CLOSET_ALSO,
  CLOSET_FAQS,
  CLOSET_PRODUCT,
  CLOSET_RELATED,
  CLOSET_SOURCES,
  CLOSET_TOOL_DESCRIPTION,
  CLOSET_TOOL_IMAGE,
  CLOSET_TOOL_PATH,
  HANGERS,
  WARDROBES,
  itemsThatFit,
  type HangerType,
  type WardrobeType,
} from '../data/closetCalculator';

const CM_PER_INCH = 2.54;
const ITEM_COLORS = ['#d6c3a5', '#a8b8a0', '#c9a99b', '#9fb0c4', '#e2d6c2', '#b9a3c4'];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3.5 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
        active
          ? 'bg-stone-900 border-stone-900 text-white'
          : 'bg-white border-stone-200 text-stone-800 hover:border-amber-400'
      }`}
    >
      {children}
    </button>
  );
}

// A picture of the rail: each piece of clothing is drawn at its real share of the rail width.
function RailPicture({ count, perItem, rail }: { count: number; perItem: number; rail: number }) {
  const shown = Math.min(count, 140);
  const share = (perItem / rail) * 100;
  return (
    <div aria-hidden="true" className="mt-5">
      <div className="h-1.5 rounded-full bg-stone-400" />
      <div className="flex items-start h-16 overflow-hidden">
        {Array.from({ length: shown }).map((_, i) => (
          <div key={i} className="flex flex-col items-center shrink-0" style={{ width: `${share}%` }}>
            <div className="w-px h-2 bg-stone-400" />
            <div
              className="w-[80%] h-12 rounded-b-md rounded-t-sm"
              style={{ background: ITEM_COLORS[i % ITEM_COLORS.length] }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-stone-500 font-medium">
        <span>Rail start</span>
        <span>{Math.round((1 - BREATHING_ROOM) * 100)}% left free so clothes don't crush</span>
      </div>
    </div>
  );
}

export default function ClosetCalculator() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [width, setWidth] = useState('36');
  const [hangerId, setHangerId] = useState<HangerType['id']>('plastic');
  const [wardrobeId, setWardrobeId] = useState<WardrobeType['id']>('tops');
  const [wanted, setWanted] = useState('');

  const hanger = HANGERS.find((h) => h.id === hangerId)!;
  const wardrobe = WARDROBES.find((w) => w.id === wardrobeId)!;
  const velvet = HANGERS[0];

  const r = useMemo(() => {
    const raw = parseFloat(width.replace(',', '.'));
    const rail = unit === 'cm' ? raw / CM_PER_INCH : raw;
    const valid = Number.isFinite(rail) && rail >= 6 && rail <= 400;
    const fits = valid ? itemsThatFit(rail, hanger, wardrobe) : 0;
    const all = HANGERS.map((h) => ({ h, n: valid ? itemsThatFit(rail, h, wardrobe) : 0 }));
    const perItem = wardrobe.width + hanger.thickness;
    const want = parseInt(wanted, 10);
    const hasWant = Number.isFinite(want) && want > 0;
    const needInches = hasWant ? Math.max(0, (want * perItem) / BREATHING_ROOM - rail) : 0;
    return { rail, valid, fits, all, perItem, want, hasWant, needInches };
  }, [width, unit, hanger, wardrobe, wanted]);

  const gain = r.valid ? itemsThatFit(r.rail, velvet, wardrobe) - r.fits : 0;
  const maxN = Math.max(1, ...r.all.map((a) => a.n));
  const shortItems = wardrobe.id === 'tops' || wardrobe.id === 'bottoms';
  const fmtLen = (inches: number) =>
    unit === 'cm' ? `${Math.ceil(inches * CM_PER_INCH)} cm` : `${Math.ceil(inches)} inches`;

  const switchUnit = (u: 'in' | 'cm') => {
    if (u === unit) return;
    const n = parseFloat(width);
    if (Number.isFinite(n)) setWidth(String(Math.round(u === 'cm' ? n * CM_PER_INCH : n / CM_PER_INCH)));
    setUnit(u);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-24">
      <SEOHead
        title="Closet Space Calculator: How Many Clothes Fit on Your Rail?"
        description={CLOSET_TOOL_DESCRIPTION}
        canonicalPath={CLOSET_TOOL_PATH}
        ogImage={`https://spacesavvy-olive.vercel.app${CLOSET_TOOL_IMAGE}`}
      />

      <nav className="text-xs text-stone-500 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-amber-700">Home</Link> <span aria-hidden="true">/</span>{' '}
        <span className="text-stone-700 font-semibold">Free Tools</span>
      </nav>

      <span className="text-amber-800 font-extrabold text-xs uppercase tracking-widest block mb-2">Free tool</span>
      <h1 className="font-serif text-[32px] sm:text-5xl font-black text-stone-950 leading-tight">
        Closet Space Calculator: How Many Clothes Fit?
      </h1>
      <p className="mt-4 text-[17px] sm:text-lg text-stone-700 leading-relaxed">
        Enter your closet rail width and the hangers you use. You'll see roughly how many pieces fit, and how many more
        you'd fit by switching hangers.
      </p>

      {/* Calculator */}
      <section className="mt-8 bg-white border border-stone-200/90 rounded-2xl shadow-sm p-5 sm:p-7" aria-label="Closet space calculator">
        <div className="grid gap-6">
          <div>
            <label htmlFor="rail" className="block font-sans font-bold text-stone-900 mb-2">
              1. How wide is your closet rail?
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id="rail"
                type="number"
                inputMode="decimal"
                min={1}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-32 text-2xl font-bold text-stone-900 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
              <div className="inline-flex rounded-xl border border-stone-200 overflow-hidden" role="group" aria-label="Unit">
                {(['in', 'cm'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => switchUnit(u)}
                    aria-pressed={unit === u}
                    className={`px-4 py-2.5 text-sm font-bold cursor-pointer ${unit === u ? 'bg-stone-900 text-white' : 'bg-white text-stone-700'}`}
                  >
                    {u === 'in' ? 'inches' : 'cm'}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2">Measure the rod from wall to wall. Most reach-in closets are 36 to 72 inches.</p>
          </div>

          <div>
            <p className="font-sans font-bold text-stone-900 mb-2">2. Which hangers do you use now?</p>
            <div className="flex flex-wrap gap-2">
              {HANGERS.map((h) => (
                <Chip key={h.id} active={h.id === hangerId} onClick={() => setHangerId(h.id)}>
                  {h.label} <span className="font-normal opacity-70">({h.note.replace('about ', '')})</span>
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="font-sans font-bold text-stone-900 mb-2">3. What do you mostly hang?</p>
            <div className="flex flex-wrap gap-2">
              {WARDROBES.map((w) => (
                <Chip key={w.id} active={w.id === wardrobeId} onClick={() => setWardrobeId(w.id)}>
                  {w.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="wanted" className="block font-sans font-bold text-stone-900 mb-2">
              4. How many pieces do you want to hang? <span className="font-normal text-stone-500">(optional)</span>
            </label>
            <input
              id="wanted"
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="e.g. 40"
              value={wanted}
              onChange={(e) => setWanted(e.target.value)}
              className="w-32 text-lg font-semibold text-stone-900 border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
        </div>

        {/* Result */}
        <div className="mt-7 pt-6 border-t border-stone-200" aria-live="polite">
          {!r.valid ? (
            <p className="text-stone-700 font-medium">Enter a rail width between 6 and 400 {unit === 'in' ? 'inches' : 'cm'} to see your result.</p>
          ) : (
            <>
              <p className="text-sm font-bold uppercase tracking-wider text-amber-800">Your result</p>
              <p className="mt-1 font-serif text-3xl sm:text-4xl font-black text-stone-950 leading-tight">
                Your rail fits about {r.fits} {r.fits === 1 ? 'piece' : 'pieces'}
              </p>
              <p className="mt-1 text-stone-600">
                {wardrobe.label.toLowerCase()} on {hanger.label.toLowerCase()} hangers
              </p>

              <RailPicture count={r.fits} perItem={r.perItem} rail={r.rail} />

              <div className="mt-6 grid gap-2.5">
                <p className="text-sm font-bold text-stone-900">Same rail, different hangers</p>
                {r.all.map(({ h, n }) => (
                  <div key={h.id} className="grid grid-cols-[88px_1fr_40px] sm:grid-cols-[120px_1fr_48px] items-center gap-3">
                    <span className={`text-sm ${h.id === hangerId ? 'font-bold text-stone-900' : 'text-stone-600'}`}>{h.short}</span>
                    <div className="h-3.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${h.id === 'velvet' ? 'bg-amber-600' : h.id === hangerId ? 'bg-stone-800' : 'bg-stone-400'}`}
                        style={{ width: `${(n / maxN) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-stone-900 text-right tabular-nums">{n}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200/80 p-4 text-[15px] sm:text-base text-stone-800 leading-relaxed">
                {hangerId !== 'velvet' && gain > 0 ? (
                  <p>
                    <strong>Switch to slim velvet hangers and you'd fit about {gain} more {gain === 1 ? 'piece' : 'pieces'}</strong> on the
                    same rail{r.fits > 0 ? ` (+${Math.round((gain / r.fits) * 100)}%)` : ''}.
                  </p>
                ) : (
                  <p>
                    <strong>You're already on the slimmest hangers.</strong> To fit more, add a second hanging rod under the first one
                    for shirts and pants.
                  </p>
                )}
                {shortItems && (
                  <p className="mt-2">
                    Add a second hanging rod below and short pieces like these could reach about <strong>{r.fits * 2}</strong> on the
                    same wall.
                  </p>
                )}
                {r.hasWant && (
                  <p className="mt-2">
                    {r.want <= r.fits ? (
                      <>Good news: your {r.want} pieces fit, with room for about {r.fits - r.want} more.</>
                    ) : (
                      <>
                        To hang {r.want} pieces you'd need about <strong>{fmtLen(r.needInches)}</strong> more rail. Slimmer hangers or a
                        second rod are the easiest fixes.
                      </>
                    )}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>
      <p className="mt-3 text-xs text-stone-500">
        This is an estimate. Real clothes vary in thickness, so treat it as a good guide, not an exact count.
      </p>

      <ProductCallout product={CLOSET_PRODUCT} alsoGood={CLOSET_ALSO} />
      <p className="text-xs text-stone-500 -mt-4 text-center">
        As an Amazon Associate I earn from qualifying purchases.{' '}
        <Link to="/affiliate-disclosure" className="underline hover:text-amber-700">Learn more</Link>
      </p>

      {/* How it works */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">How we calculate it</h2>
        <p className="mt-3 text-[17px] text-stone-700 leading-relaxed">
          Every piece takes up its own hanging width plus the thickness of its hanger. We add the two together, then only count
          90% of your rail, because closet designers recommend leaving 10 to 15% free so clothes don't get crushed.
        </p>
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="font-bold text-stone-900 mb-2">Hanger thickness</p>
            <ul className="text-sm text-stone-700 space-y-1">
              {HANGERS.map((h) => (
                <li key={h.id} className="flex justify-between gap-3"><span>{h.label}</span><span className="font-semibold">{h.note.replace('about ', '')}</span></li>
              ))}
            </ul>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="font-bold text-stone-900 mb-2">Clothing width on a rail</p>
            <ul className="text-sm text-stone-700 space-y-1">
              {WARDROBES.filter((w) => w.id !== 'mixed').map((w) => (
                <li key={w.id} className="flex justify-between gap-3"><span>{w.label}</span><span className="font-semibold">{w.range}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-stone-600">
          We use the middle of each range. "A bit of everything" assumes about half tops, a quarter pants and skirts, and the
          rest dresses and jackets.
        </p>
        <p className="mt-4 text-sm font-semibold text-stone-800">Sources</p>
        <ul className="mt-1 text-sm text-stone-600 list-disc pl-5 space-y-1">
          {CLOSET_SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline decoration-amber-400 underline-offset-2 hover:text-amber-800">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Tips */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-950">3 ways to fit more on the same rail</h2>
        <ol className="mt-4 space-y-3 text-[17px] text-stone-700 leading-relaxed list-decimal pl-5">
          <li><strong className="text-stone-900">Use matching slim hangers.</strong> Mixing thin and thick hangers wastes most of the space you'd gain.</li>
          <li><strong className="text-stone-900">Add a second rod for short pieces.</strong> Shirts and folded pants only need half the closet height, so a hanging rod below the first one can double that space.</li>
          <li><strong className="text-stone-900">Fold, don't hang, bulky knits.</strong> Thick sweaters take a lot of rail and stretch on hangers. A shelf or a storage bin suits them better.</li>
        </ol>
      </section>

      <section className="mt-12">
        <FaqAccordion items={CLOSET_FAQS} />
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-black text-stone-950">Keep reading</h2>
        <ul className="mt-4 grid gap-3">
          {CLOSET_RELATED.map((a) => (
            <li key={a.href}>
              <Link to={a.href} className="block bg-white border border-stone-200 rounded-xl px-4 py-3 font-semibold text-stone-900 hover:border-amber-400 hover:text-amber-800 transition-colors">
                {a.title} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
