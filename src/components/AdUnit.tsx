import { ArrowRight, Info } from 'lucide-react';

interface AdUnitProps {
  slot?: string;
  type?: 'banner' | 'rectangle' | 'in-feed';
  className?: string;
}

export default function AdUnit({ slot = "default-slot", type = "rectangle", className = "" }: AdUnitProps) {
  // Policy-compliant simulated premium Scandinavian design partners to fit the look & feel
  const sponsors = [
    {
      brand: "M U U T O",
      title: "New Perspectives on Scandinavian Design",
      desc: "Discover sustainable solid wood tables & minimalist lounge chairs crafted in Copenhagen.",
      cta: "Explore Muuto",
      link: "https://www.amazon.com/s?k=scandinavian+furniture+minimalist",
      bg: "bg-[#F3EFE9]"
    },
    {
      brand: "I K E A  P R O",
      title: "Renter-Safe Storage Systems under $50",
      desc: "Modular pegboards, tension organizers, and compact shelving designed for active micro-living.",
      cta: "Shop Storage",
      link: "https://www.amazon.com/s?k=ikea+storage+hacks+apartment",
      bg: "bg-[#EEF1EB]"
    }
  ];

  // Pick sponsor based on slot or type to add variety
  const sponsorIndex = slot.charCodeAt(0) % sponsors.length;
  const sponsor = sponsors[sponsorIndex];

  return (
    <div className={`my-8 w-full ${className}`}>
      {/* Policy compliant header */}
      <div className="flex items-center justify-between px-2 mb-1.5">
        <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase">
          Advertisement / Sponsored Link
        </span>
        <a 
          href="/privacy-policy#adsense" 
          className="text-stone-400 hover:text-stone-600 transition-colors"
          title="Ad Choices & AdSense Policy"
        >
          <Info className="w-3 h-3" />
        </a>
      </div>

      {type === 'banner' ? (
        /* Horizontal Banner Format */
        <a
          href={sponsor.link}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className={`group flex flex-col md:flex-row items-center justify-between p-5 md:py-4 md:px-8 rounded-xl border border-stone-200/50 ${sponsor.bg} transition-all hover:border-stone-300 hover:shadow-xs`}
        >
          <div className="flex flex-col md:flex-row items-baseline md:items-center gap-2 md:gap-6 text-left">
            <span className="text-xs font-mono tracking-widest font-semibold text-stone-900 shrink-0">
              {sponsor.brand}
            </span>
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                {sponsor.title}
              </h4>
              <p className="text-xs text-stone-500 line-clamp-1 max-w-xl">
                {sponsor.desc}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 text-[11px] font-semibold transition-colors shrink-0">
            <span>{sponsor.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </a>
      ) : (
        /* Square/Rectangle Card Format */
        <a
          href={sponsor.link}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className={`group block p-6 rounded-xl border border-stone-200/50 ${sponsor.bg} text-left transition-all hover:border-stone-300 hover:shadow-xs`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-widest font-bold text-stone-800">
              {sponsor.brand}
            </span>
            <span className="text-[9px] font-mono border border-stone-300 rounded px-1.5 py-0.2 text-stone-500">
              Sponsored Slot
            </span>
          </div>
          <h4 className="text-base font-serif font-bold text-stone-900 mb-2 group-hover:text-amber-800 transition-colors leading-tight">
            {sponsor.title}
          </h4>
          <p className="text-xs text-stone-600 mb-4 leading-relaxed">
            {sponsor.desc}
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 group-hover:text-amber-800 transition-colors">
            <span>{sponsor.cta}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      )}
    </div>
  );
}
