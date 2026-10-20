import React from 'react';
import { Cpu, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../../src/components/SEOHead';

export default function AIDisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-stone-800">
      <SEOHead
        title="AI & Synthetic Media Statement"
        description="SpaceSavvy's generative AI transparency statement, human-in-the-loop curation policy, and 3D visual concept principles."
        canonicalPath="/ai-disclaimer"
      />
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 font-semibold font-mono mb-3">
        <Cpu className="w-4 h-4 text-amber-700" />
        <span>Media Transparency</span>
      </div>

      <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-black mb-4 leading-tight tracking-tight">
        Synthetic Media & AI Transparency Statement
      </h1>

      <p className="text-stone-500 text-xs sm:text-sm font-mono mb-8 pb-6 border-b border-stone-200">
        Published: October 9, 2026 · Built with Ethics & Integrity
      </p>

      <div className="prose prose-stone max-w-none text-stone-600 space-y-6 leading-relaxed font-sans text-sm md:text-base">
        <p>
          At SpaceSavvy, we believe in practical problem-solving and absolute transparency. We use modern creative tools—including generative AI models and visual software—to explore compact layouts, brainstorm storage concepts, and design spatial inspiration.
        </p>

        <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Our AI Safeguards & Code of Conduct</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            We operate under a strict <strong>&ldquo;Human-in-the-Loop, Human-in-Charge&rdquo;</strong> doctrine. Technology serves as an exploratory aid to test layout possibilities and draft concepts, while real human curators review dimensions, evaluate practical usability, and select vetted products.
          </p>
        </div>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          1. AI-Assisted Research & Human Curation
        </h2>
        <p>
          We leverage generative technology to research layout configurations, structure ideas, and generate first drafts. Every product is then checked against its live Amazon listing (name, size and materials), and anything that needs drilling or has a known limitation is flagged in the article before it goes live.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          2. Visual Concepts & Product Sourcing
        </h2>
        <p>
          To illustrate compact living ideas where physical photography is unavailable, we use synthetic imagery and digital renderings to spark inspiration. Every linked product, however, is a real-world, commercially available item from trusted merchants.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          3. Reader Trust & Ongoing Commitment
        </h2>
        <p>
          We will never publish low-effort, automated content farms. Our commitment is to provide practical, reliable home inspiration that you can actually implement in your apartment or house without guesswork or unrealistic expectations.
        </p>

        <div className="pt-6 border-t border-stone-200 text-xs text-stone-500">
          <Link to="/about" className="text-amber-800 hover:underline mr-4">About SpaceSavvy</Link>
          <Link to="/affiliate-disclosure" className="text-amber-800 hover:underline mr-4">Affiliate Disclosure</Link>
          <Link to="/privacy-policy" className="text-amber-800 hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
