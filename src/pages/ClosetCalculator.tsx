import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import ProductCallout from '../components/ProductCallout';
import FaqAccordion from '../components/FaqAccordion';
import ArticleCard from '../components/ArticleCard';
import { posts, type Post } from '../data/posts';
import {
  BREATHING_ROOM,
  CLOSET_ALSO,
  CLOSET_FAQS,
  CLOSET_PRODUCT,
  CLOSET_QUICK_ANSWER,
  CLOSET_RELATED,
  CLOSET_SOURCES,
  CLOSET_TOOL_DESCRIPTION,
  CLOSET_TOOL_H1,
  CLOSET_TOOL_IMAGE,
  CLOSET_TOOL_PATH,
  CLOSET_TOOL_TITLE,
  HANGERS,
  WARDROBES,
  itemsThatFit,
  perFoot,
  railNeeded,
  type HangerType,
  type WardrobeType,
} from '../data/closetCalculator';

// Design notes: uses the site's own look (photo hero, amber-600 pills, sand #F4EFE6 panels,
// warm #FFF4E6 -> #FDE8D0 gradient boxes, Cormorant + Plus Jakarta). The live closet drawing is the hero moment.
const OAK = '#A87B4F';
const WALL = '#F4EFE6';
const GARMENT = ['#C9B79C', '#8E9E83', '#B98F7F', '#8FA3B8', '#D9CBB4', '#6F6A63', '#E4D9C6', '#A4927F'];
const HANGER_INK: Record<HangerType['id'], string> = { velvet: '#1C1917', plastic: '#F5F2EC', wood: '#9A6B3F' };
const GARMENT_H: Record<WardrobeType['id'], number> = { tops: 92, bottoms: 84, dresses: 150, jackets: 118, mixed: 104 };
const CM = 2.54;
const PACK = 50;

type Mode = 'fit' | 'need';

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  layout = 'grid',
}: {
  value: T;
  options: { id: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
  label: string;
  layout?: 'list' | 'grid';
}) {
  // 'list' = full-width rows (name left, detail right). 'grid' = two even columns, last odd item spans both.
  return (
    <div role="radiogroup" aria-label={label} className={layout === 'list' ? 'grid gap-2' : 'grid grid-cols-2 gap-2'}>
      {options.map((o, i) => {
        const on = o.id === value;
        const spanAll = layout === 'grid' && options.length % 2 === 1 && i === options.length - 1;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.id)}
            className={`min-w-0 rounded-2xl border px-3 sm:px-4 py-2.5 text-[15px] leading-tight transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
              layout === 'list' ? 'flex items-center justify-between gap-3 text-left' : 'text-center'
            } ${spanAll ? 'col-span-2' : ''} ${
              on ? 'bg-amber-600 border-amber-600 text-white shadow-sm' : 'bg-white border-stone-200 text-stone-800 hover:border-amber-400'
            }`}
          >
            <span className="font-semibold">{o.label}</span>
            {o.hint && <span className={`text-sm whitespace-nowrap ${on ? 'text-amber-100' : 'text-stone-500'}`}>{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

// The live closet: a wooden rod with hangers and clothes drawn at their real share of the rod.
function Closet({
  count,
  perItem,
  rail,
  hanger,
  wardrobe,
  double,
}: {
  count: number;
  perItem: number;
  rail: number;
  hanger: HangerType;
  wardrobe: WardrobeType;
  double: boolean;
}) {
  const VW = 560;
  const inner = VW - 60;
  const step = Math.max(2.2, (perItem / rail) * inner);
  const shown = Math.min(count, Math.floor(inner / step));
  const gh = GARMENT_H[wardrobe.id];
  const rodY = [44, ...(double ? [44 + gh + 52] : [])];
  const VH = rodY[rodY.length - 1] + gh + 34;
  const hookColor = '#8A8580';
  const ink = HANGER_INK[hanger.id];
  const thick = hanger.id === 'wood' ? 5 : hanger.id === 'plastic' ? 3.2 : 2;
  const garmentW = Math.max(4, Math.min(step * 0.86, 46));

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full h-auto block" role="img"
      aria-label={`Drawing of a ${Math.round(rail)}-inch closet rod holding about ${count} pieces${double ? ' on each of two rods' : ''}`}>
      <rect x="0" y="0" width={VW} height={VH} rx="14" fill={WALL} />
      <rect x="10" y="10" width={VW - 20} height={VH - 20} rx="8" fill="none" stroke="#DDD1BE" strokeWidth="2" />
      {rodY.map((ry, r) => (
        <g key={r}>
          <rect x="22" y={ry - 7} width={VW - 44} height="12" rx="6" fill={OAK} />
          <rect x="22" y={ry - 7} width={VW - 44} height="4" rx="2" fill="#C49A6C" opacity="0.7" />
          <rect x="16" y={ry - 12} width="10" height="22" rx="3" fill="#8B6542" />
          <rect x={VW - 26} y={ry - 12} width="10" height="22" rx="3" fill="#8B6542" />
          {Array.from({ length: shown }).map((_, i) => {
            const cx = 30 + step * i + step / 2;
            const c = GARMENT[(i * 3 + r) % GARMENT.length];
            const top = ry + 22;
            const hw = garmentW / 2;
            const sh = Math.min(10, hw * 0.9);
            const body = `M${cx} ${top - 3} L${cx + hw} ${top + sh} L${cx + hw} ${top + gh} L${cx - hw} ${top + gh} L${cx - hw} ${top + sh} Z`;
            return (
              <g key={i}>
                <path d={`M${cx} ${ry - 2} q 0 -7 4 -7`} stroke={hookColor} strokeWidth="1.4" fill="none" />
                <line x1={cx} y1={ry - 2} x2={cx} y2={top - 3} stroke={hookColor} strokeWidth="1.4" />
                <path d={body} fill={c} />
                <path d={`M${cx - hw - 1} ${top + sh + 1} L${cx} ${top - 3} L${cx + hw + 1} ${top + sh + 1}`} fill="none" stroke={ink}
                  strokeWidth={thick} strokeLinejoin="round" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

export default function ClosetCalculator() {
  const [mode, setMode] = useState<Mode>('fit');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [width, setWidth] = useState('36');
  const [pieces, setPieces] = useState('40');
  const [hangerId, setHangerId] = useState<HangerType['id']>('plastic');
  const [wardrobeId, setWardrobeId] = useState<WardrobeType['id']>('tops');
  const [double, setDouble] = useState(false);

  const hanger = HANGERS.find((h) => h.id === hangerId)!;
  const wardrobe = WARDROBES.find((w) => w.id === wardrobeId)!;
  const velvet = HANGERS[0];
  const canDouble = wardrobe.id === 'tops' || wardrobe.id === 'bottoms';
  const rods = double && canDouble ? 2 : 1;

  const fmt = (inches: number) => {
    if (unit === 'cm') return `${Math.ceil(inches * CM)} cm`;
    const ft = inches / 12;
    return `${Math.ceil(inches)} inches (${ft.toFixed(1).replace('.0', '')} ft)`;
  };

  const calc = useMemo(() => {
    const raw = parseFloat(width.replace(',', '.'));
    const rail = unit === 'cm' ? raw / CM : raw;
    const railOk = Number.isFinite(rail) && rail >= 6 && rail <= 400;
    const n = parseInt(pieces, 10);
    const piecesOk = Number.isFinite(n) && n > 0 && n <= 2000;
    const perItem = wardrobe.width + hanger.thickness;
    const fitsPerRod = railOk ? itemsThatFit(rail, hanger, wardrobe) : 0;
    const compare = HANGERS.map((h) => ({
      h,
      fit: railOk ? itemsThatFit(rail, h, wardrobe) * rods : 0,
      need: piecesOk ? railNeeded(n, h, wardrobe) / rods : 0,
    }));
    const need = piecesOk ? railNeeded(n, hanger, wardrobe) / rods : 0;
    return { rail, railOk, n, piecesOk, perItem, fits: fitsPerRod * rods, fitsPerRod, compare, need };
  }, [width, unit, pieces, hanger, wardrobe, rods]);

  const ok = mode === 'fit' ? calc.railOk : calc.piecesOk;
  const hangersToBuy = mode === 'fit' ? calc.fits : calc.n;
  const packs = Math.max(1, Math.ceil(hangersToBuy / PACK));
  const gain = mode === 'fit' && calc.railOk ? itemsThatFit(calc.rail, velvet, wardrobe) * rods - calc.fits : 0;
  const saved = mode === 'need' && calc.piecesOk ? calc.need - railNeeded(calc.n, velvet, wardrobe) / rods : 0;
  const maxBar = Math.max(1, ...calc.compare.map((c) => (mode === 'fit' ? c.fit : c.need)));
  const drawRail = mode === 'fit' ? calc.rail : Math.max(calc.need, 12);
  const drawCount = mode === 'fit' ? calc.fitsPerRod : Math.ceil(calc.n / rods);

  const switchUnit = (u: 'in' | 'cm') => {
    if (u === unit) return;
    const v = parseFloat(width);
    if (Number.isFinite(v)) setWidth(String(Math.round(u === 'cm' ? v * CM : v / CM)));
    setUnit(u);
  };

  const inputCls =
    'w-24 sm:w-28 text-2xl font-bold text-stone-900 bg-white border border-stone-200 rounded-2xl px-4 py-2.5 tabular-nums shadow-inner focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200';

  const pinUrl = (() => {
    const params = new URLSearchParams({
      url: `https://spacesavvy-olive.vercel.app${CLOSET_TOOL_PATH}`,
      media: 'https://spacesavvy-olive.vercel.app/images/tools/closet-calculator-pin.jpg',
      description: 'Closet rod calculator: how many hangers fit per foot, and how many hangers you need. Free tool by SpaceSavvy.',
    });
    return `https://www.pinterest.com/pin/create/button/?${params.toString()}`;
  })();

  const related = CLOSET_RELATED.map((r) => posts.find((p) => `/blog/${p.slug}` === r.href)).filter(Boolean) as Post[];

  return (
    <div className="pb-24">
      <SEOHead
        title={CLOSET_TOOL_TITLE}
        description={CLOSET_TOOL_DESCRIPTION}
        canonicalPath={CLOSET_TOOL_PATH}
        ogImage={`https://spacesavvy-olive.vercel.app${CLOSET_TOOL_IMAGE}`}
      />

      {/* Hero: same treatment as the homepage (photo, dark fade, amber pill) */}
      <section className="px-4 sm:px-8 pt-4 sm:pt-6">
        <div className="max-w-6xl mx-auto relative rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 shadow-lg bg-stone-900 min-h-[440px] sm:min-h-[460px] flex items-end">
          <img src="/images/tools/closet-calculator-hero.webp" alt="Small closet with slim velvet hangers and a tape measure along the closet rod"
            className="absolute inset-0 w-full h-full object-cover object-[50%_35%]" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/55 to-stone-950/10" />
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
            <nav className="text-sm text-white/70 mb-4" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white">Home</Link>
              <span aria-hidden="true" className="mx-1.5">/</span>
              <span className="text-white/90">Free tools</span>
            </nav>
            <span className="bg-amber-600/90 text-white text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full inline-block">
              Free tool
            </span>
            <h1 className="mt-4 font-serif text-[38px] leading-[1.05] sm:text-6xl font-bold text-white tracking-tight">
              {CLOSET_TOOL_H1}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed">{CLOSET_QUICK_ANSWER}</p>
            <a href="#calculator" className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-md transition inline-flex items-center justify-center gap-2">
              Try the calculator
            </a>
          </div>
        </div>
      </section>

      {/* Calculator on a sand panel, like the homepage feature blocks */}
      <section id="calculator" className="px-4 sm:px-8 mt-8 sm:mt-12 scroll-mt-24" aria-label="Closet rod calculator">
        <div className="max-w-6xl mx-auto bg-[#F4EFE6] rounded-3xl border border-stone-200/60 p-3 sm:p-6 lg:p-8">
          <div className="flex justify-center">
            <div className="grid grid-cols-2 w-full sm:w-auto gap-1 bg-white/80 border border-stone-200 rounded-full p-1" role="tablist" aria-label="Calculator mode">
              {([
                ['fit', 'How many fit on my rod?', 'How many fit?'],
                ['need', 'How many hangers do I need?', 'Hangers I need'],
              ] as [Mode, string, string][]).map(([m, l, short]) => (
                <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => setMode(m)}
                  className={`min-w-0 px-2 sm:px-6 py-2.5 rounded-full text-[14px] sm:text-[15px] font-bold whitespace-nowrap text-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
                    mode === m ? 'bg-amber-600 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
                  }`}>
                  <span className="sm:hidden">{short}</span>
                  <span className="hidden sm:inline">{l}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-6 grid lg:grid-cols-12 gap-4 sm:gap-6">
            {/* Inputs */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 sm:p-7 grid gap-6 content-start">
              {mode === 'fit' ? (
                <div>
                  <label htmlFor="rail" className="block font-bold text-stone-900 mb-2">Rod width, wall to wall</label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input id="rail" type="number" inputMode="decimal" min={1} value={width} onChange={(e) => setWidth(e.target.value)} className={inputCls} />
                    <div className="inline-flex rounded-full border border-stone-200 bg-stone-50 p-1" role="group" aria-label="Unit">
                      {(['in', 'cm'] as const).map((u) => (
                        <button key={u} type="button" onClick={() => switchUnit(u)} aria-pressed={unit === u}
                          className={`px-3.5 py-1.5 rounded-full text-sm font-bold cursor-pointer ${unit === u ? 'bg-stone-900 text-white' : 'text-stone-600'}`}>
                          {u === 'in' ? 'inches' : 'cm'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-stone-500 mt-2">Most reach-in closets are 36 to 72 inches.</p>
                </div>
              ) : (
                <div>
                  <label htmlFor="pieces" className="block font-bold text-stone-900 mb-2">Pieces you want to hang</label>
                  <input id="pieces" type="number" inputMode="numeric" min={1} value={pieces} onChange={(e) => setPieces(e.target.value)} className={inputCls} />
                  <p className="text-sm text-stone-500 mt-2">Count the shirts, pants, dresses and jackets you hang today.</p>
                </div>
              )}

              <div>
                <p className="font-bold text-stone-900 mb-2">{mode === 'fit' ? 'Hangers you use now' : 'Hangers you plan to use'}</p>
                <Segmented label="Hanger type" layout="list" value={hangerId} onChange={setHangerId}
                  options={HANGERS.map((h) => ({ id: h.id, label: h.label, hint: h.note.replace('about ', '') }))} />
              </div>

              <div>
                <p className="font-bold text-stone-900 mb-2">What you mostly hang</p>
                <Segmented label="Clothing type" value={wardrobeId} onChange={setWardrobeId}
                  options={WARDROBES.map((w) => ({ id: w.id, label: w.label }))} />
              </div>

              <label className={`flex items-start gap-3 rounded-2xl border p-4 ${canDouble ? 'cursor-pointer border-amber-200 bg-amber-50/60' : 'opacity-50 cursor-not-allowed border-stone-200'}`}>
                <input type="checkbox" checked={double && canDouble} disabled={!canDouble} onChange={(e) => setDouble(e.target.checked)}
                  className="mt-0.5 w-5 h-5 accent-amber-600" />
                <span>
                  <span className="font-bold text-stone-900 block">Add a second rod below</span>
                  <span className="text-sm text-stone-600">
                    {canDouble ? 'Shirts and pants only need half the closet height, so a second rod can double your space.' : 'Only for shirts or pants. Longer pieces need the full height.'}
                  </span>
                </span>
              </label>
            </div>

            {/* Result */}
            <div className="lg:col-span-7 rounded-2xl border border-amber-300/60 shadow-sm p-5 sm:p-7 bg-gradient-to-br from-[#FFF4E6] via-[#FAF3EA] to-[#FDE8D0]" aria-live="polite">
              {!ok ? (
                <p className="text-stone-700 text-lg">
                  {mode === 'fit'
                    ? `Enter a rod width between 6 and 400 ${unit === 'in' ? 'inches' : 'cm'}.`
                    : 'Enter how many pieces you want to hang (1 to 2,000).'}
                </p>
              ) : (
                <>
                  <p className="text-stone-700 text-[15px] font-medium">
                    {wardrobe.label} on {hanger.label.toLowerCase()} hangers{rods === 2 ? ', two rods' : ''}
                  </p>
                  {mode === 'fit' ? (
                    <p className="mt-1 font-serif leading-none text-stone-950">
                      <span className="text-7xl sm:text-8xl font-bold [font-variant-numeric:lining-nums_tabular-nums] text-amber-700">{calc.fits}</span>
                      <span className="text-2xl sm:text-3xl font-bold ml-3">pieces fit</span>
                    </p>
                  ) : (
                    <p className="mt-1 font-serif leading-tight text-stone-950">
                      <span className="text-5xl sm:text-6xl font-bold [font-variant-numeric:lining-nums_tabular-nums] text-amber-700">{fmt(calc.need).split(' (')[0]}</span>
                      <span className="block text-2xl sm:text-3xl font-bold mt-1">of rod{rods === 2 ? ' on each of two rods' : ''}{unit === 'in' ? ` (${(calc.need / 12).toFixed(1).replace('.0', '')} ft)` : ''}</span>
                    </p>
                  )}

                  <div className="mt-5 rounded-2xl overflow-hidden border border-white/80 shadow-sm">
                    <Closet count={drawCount} perItem={calc.perItem} rail={drawRail} hanger={hanger} wardrobe={wardrobe} double={rods === 2} />
                  </div>

                  <div className="mt-6 bg-white/70 rounded-2xl p-4 sm:p-5">
                    <p className="text-sm font-bold text-stone-900 mb-3">
                      {mode === 'fit' ? 'Same rod, other hangers' : 'Rod needed with other hangers'}
                    </p>
                    <div className="grid gap-2.5">
                      {calc.compare.map(({ h, fit, need }) => {
                        const v = mode === 'fit' ? fit : need;
                        const label = mode === 'fit' ? String(fit) : fmt(need).split(' (')[0];
                        return (
                          <div key={h.id} className="grid grid-cols-[96px_1fr_auto] items-center gap-3">
                            <span className={`text-sm ${h.id === hangerId ? 'font-bold text-stone-950' : 'text-stone-600'}`}>{h.short}</span>
                            <div className="h-3 rounded-full bg-stone-200/80 overflow-hidden">
                              <div className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                                style={{ width: `${(v / maxBar) * 100}%`, background: h.id === 'velvet' ? '#D97706' : h.id === hangerId ? '#44403C' : '#A8A29E' }} />
                            </div>
                            <span className="text-sm font-bold text-stone-900 tabular-nums text-right min-w-[3.5rem]">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 text-[15px] sm:text-base text-stone-800 leading-relaxed space-y-2">
                    {mode === 'fit' &&
                      (hangerId !== 'velvet' && gain > 0 ? (
                        <p>Swap to slim velvet hangers and the same rod holds about <strong>{gain} more</strong>{calc.fits > 0 ? ` (+${Math.round((gain / calc.fits) * 100)}%)` : ''}.</p>
                      ) : (
                        <p>You're already on the slimmest hangers.{canDouble && rods === 1 ? ' A second rod is the next easy win.' : ''}</p>
                      ))}
                    {mode === 'need' && hangerId !== 'velvet' && saved > 0.5 && (
                      <p>Slim velvet hangers would save about <strong>{fmt(saved).split(' (')[0]}</strong> of rod for the same clothes.</p>
                    )}
                    <p>
                      Hangers to buy: <strong>{hangersToBuy}</strong>
                      {hangersToBuy > 0 ? `, so ${packs === 1 ? 'one 50-pack covers it' : `${packs} packs of 50`}.` : '.'}
                    </p>
                  </div>
                  <a href={CLOSET_PRODUCT.affiliateUrl} target="_blank" rel="sponsored nofollow noopener noreferrer"
                    className="mt-5 w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-md transition flex sm:inline-flex items-center justify-center text-center gap-2">
                    <span className="sm:hidden">Check prices on Amazon</span>
                    <span className="hidden sm:inline">Check velvet hanger prices on Amazon</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm text-stone-600 text-center">An estimate, not an exact count. Real clothes vary in thickness.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <ProductCallout product={CLOSET_PRODUCT} alsoGood={CLOSET_ALSO} />
        <p className="text-sm text-stone-500 -mt-4 text-center">
          As an Amazon Associate I earn from qualifying purchases.{' '}
          <Link to="/affiliate-disclosure" className="underline hover:text-amber-800">Learn more</Link>
        </p>

        {/* Quick answer table */}
        <section className="mt-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">How many hangers fit per foot of closet rod?</h2>
          <p className="mt-3 text-[17px] text-stone-600 leading-relaxed">About how many pieces fit on each foot of rod, rounded, with a little breathing room left between them.</p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
            <table className="w-full text-left text-[14px] sm:text-[15px]">
              <caption className="sr-only">Pieces per foot of closet rod by hanger type</caption>
              <thead>
                <tr className="bg-[#F4EFE6]">
                  <th scope="col" className="px-2 sm:px-5 py-3.5 font-bold text-stone-900">Clothing</th>
                  {HANGERS.map((h) => (
                    <th key={h.id} scope="col" className={`px-2 sm:px-5 py-3.5 font-bold ${h.id === 'velvet' ? 'bg-amber-600 text-white' : 'text-stone-900'}`}>{h.short}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WARDROBES.filter((w) => w.id !== 'mixed').map((w) => (
                  <tr key={w.id} className="border-t border-stone-100">
                    <th scope="row" className="px-2 sm:px-5 py-3.5 font-medium text-stone-800">{w.label}</th>
                    {HANGERS.map((h) => (
                      <td key={h.id} className={`px-2 sm:px-5 py-3.5 tabular-nums text-lg ${h.id === 'velvet' ? 'bg-amber-50 font-bold text-amber-800' : 'text-stone-700'}`}>
                        {perFoot(h, w)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to measure */}
        <section className="mt-14">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">How to measure your closet rod</h2>
          <ol className="mt-6 grid gap-5">
            {[
              ['Clear the ends', 'Slide clothes to the middle so you can see where the rod meets the wall or its brackets.'],
              ['Measure wall to wall', 'Run a tape measure along the top of the rod from one end to the other. That is your rod width.'],
              ['Measure each rod', 'If you already have two rods, measure both and add them together, or tick the second-rod box above.'],
            ].map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="w-10 h-10 rounded-full bg-amber-600 text-white font-black flex items-center justify-center shadow-sm" aria-hidden="true">{i + 1}</span>
                <span className="text-[17px] text-stone-600 leading-relaxed"><strong className="text-stone-900">{t}.</strong> {b}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Method */}
        <section className="mt-14 bg-[#F4EFE6] rounded-3xl p-6 sm:p-8">
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">How the calculator works</h2>
          <p className="mt-3 text-[17px] text-stone-600 leading-relaxed">
            Every piece takes up its own hanging width plus the thickness of its hanger. We add the two, then only count{' '}
            {Math.round(BREATHING_ROOM * 100)}% of the rod, because closet designers recommend leaving 10 to 15% free so clothes don't crush.
          </p>
          <dl className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-1 text-[15px]">
            {HANGERS.map((h) => (
              <div key={h.id} className="flex justify-between gap-4 border-b border-stone-300/60 py-2">
                <dt className="text-stone-600 min-w-0">{h.label} hanger</dt><dd className="font-bold text-stone-900 whitespace-nowrap">{h.note.replace('about ', '')}</dd>
              </div>
            ))}
            {WARDROBES.filter((w) => w.id !== 'mixed').map((w) => (
              <div key={w.id} className="flex justify-between gap-4 border-b border-stone-300/60 py-2">
                <dt className="text-stone-600 min-w-0">{w.label}</dt><dd className="font-bold text-stone-900 whitespace-nowrap">{w.range} wide</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-stone-600">
            We use the middle of each range. "A bit of everything" assumes about half tops, a quarter pants and skirts, and the rest dresses and jackets.
          </p>
          <p className="mt-4 text-sm font-bold text-stone-800">Sources</p>
          <ul className="mt-1 text-sm text-stone-600 list-disc pl-5 space-y-1">
            {CLOSET_SOURCES.map((src) => (
              <li key={src.url}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="underline decoration-amber-500 underline-offset-2 hover:text-amber-800">{src.label}</a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <FaqAccordion items={CLOSET_FAQS} />
        </section>

        {/* Save to Pinterest, styled like the homepage gradient card */}
        <section className="mt-10 rounded-3xl p-8 sm:p-10 text-center border border-amber-300/60 shadow-lg bg-gradient-to-br from-[#FFF4E6] via-[#FAF3EA] to-[#FDE8D0]">
          <h2 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Save this calculator for later</h2>
          <p className="mt-2 text-stone-600 max-w-md mx-auto">Pin it to your closet board so it's there when you reorganize or shop for hangers.</p>
          <a href={pinUrl} target="_blank" rel="noopener noreferrer"
            className="mt-5 bg-[#E60023] hover:bg-[#c8001e] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-full shadow-md transition inline-flex items-center gap-2">
            Save to Pinterest
          </a>
        </section>
      </div>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-6">Keep reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p) => (
              <ArticleCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
