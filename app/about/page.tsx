import React from 'react';
import SEOHead from '../../src/components/SEOHead';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-24">
      <SEOHead
        title="About SpaceSavvy - Our Story & Curation Standards"
        description="Simple ideas for a calmer, better-organized home. Learn how SpaceSavvy curates renter-friendly storage, compact furniture layouts, and home decor."
        canonicalPath="/about"
      />
      {/* 1. Page Header & Container */}
      <header className="text-center max-w-3xl mx-auto pt-6 pb-10 border-b border-stone-200/80">
        <span className="text-amber-800 font-extrabold text-xs uppercase tracking-widest inline-block mb-3">
          OUR STORY &amp; APPROACH
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-amber-700 leading-tight mb-6">
          Simple ideas for a calmer, better-organized home.
        </h1>
        <blockquote className="font-serif italic text-lg sm:text-2xl text-stone-600 max-w-2xl mx-auto leading-relaxed border-y border-stone-200/80 py-5 my-6">
          &ldquo;You don&apos;t need huge square footage or expensive renovations to live in a comfortable, beautifully organized space.&rdquo;
        </blockquote>
      </header>

      {/* 2. Conversational Editorial Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 my-14 items-center">
        {/* Left Column */}
        <div className="space-y-4 text-stone-600 text-base leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
            Why We Started SpaceSavvy
          </h2>
          <p>
            Finding practical pieces for your home shouldn&apos;t involve endless scrolling through low-quality junk or dealing with complicated renovations. Most design publications push custom built-ins that cost thousands, while discount sites offer flimsy organizers that warp within months.
          </p>
          <p>
            We focus on the sweet spot of thoughtful home styling paired with practical, durable solutions. We spend hours reading customer reviews, exact dimensions, and easy setups so you can clear clutter and style your home with confidence.
          </p>
        </div>

        {/* Right Column */}
        <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
          <img
            src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
            alt="Bright, organized living room space"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* 3. The 4-Point Curation Standard */}
      <section className="my-16">
        <span className="text-amber-700 font-extrabold text-xs uppercase tracking-widest block text-center mb-2">
          HOW WE CHOOSE PRODUCTS
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 text-center mb-12">
          Our 4-Point Curation Standard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="group bg-white border border-stone-200/90 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-amber-200 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
            <div>
              <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-black flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-100 transition-transform duration-200">
                01
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                Spatial Function
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Every pick must genuinely solve a storage problem by unlocking dead vertical room, awkward corners, or cluttered surfaces.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white border border-stone-200/90 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-amber-200 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
            <div>
              <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-black flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-100 transition-transform duration-200">
                02
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                Easy Setup
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                No heavy construction or tricky power tools required. We favor clean-release and hassle-free installations.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white border border-stone-200/90 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-amber-200 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
            <div>
              <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-black flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-100 transition-transform duration-200">
                03
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                Community Vetted
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                We do not rely on stock photos. We analyze real buyer photos and feedback to ensure long-term durability and accurate sizing.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group bg-white border border-stone-200/90 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-amber-200 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
            <div>
              <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-black flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-100 transition-transform duration-200">
                04
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                Everyday Durability
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                We steer clear of flimsy materials and prioritize sturdy woods, powder-coated metals, durable glass, and textured fabrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Rich Gradient Editorial Desk Card */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950/90 text-white border border-amber-500/20 rounded-3xl p-8 sm:p-12 my-14 shadow-xl flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-400 font-serif text-2xl font-bold flex items-center justify-center shrink-0 shadow-inner">
          SS
        </div>
        <div className="space-y-1 text-center sm:text-left relative z-10">
          <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest mb-1 block">
            INDEPENDENT EDITORIAL DESK
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
            The SpaceSavvy Desk
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            SpaceSavvy curates practical setup ideas, smart storage solutions, and home inspiration. Our recommendations are supported by affiliate links across trusted retailers at zero additional cost to you.
          </p>
        </div>
      </section>
    </div>
  );
}
