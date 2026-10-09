import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../../src/components/SEOHead';

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-stone-800">
      <SEOHead
        title="Affiliate Advertising & FTC Disclosure"
        description="SpaceSavvy's FTC and Amazon Associates compliance disclosure, editorial review standards, and affiliate transparency."
        canonicalPath="/affiliate-disclosure"
      />
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 font-semibold font-mono mb-3">
        <ShieldCheck className="w-4 h-4 text-amber-700" />
        <span>Legal & Policy Compliance</span>
      </div>

      <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-black mb-4 leading-tight tracking-tight">
        Affiliate Advertising & FTC Disclosure
      </h1>

      <p className="text-stone-500 text-xs sm:text-sm font-mono mb-8 pb-6 border-b border-stone-200">
        Last Updated: October 2026 · FTC & Amazon Associates Compliant
      </p>

      <div className="prose prose-stone max-w-none text-stone-600 space-y-6 leading-relaxed font-sans text-sm md:text-base">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-2">
          Editorial Standards
        </h2>
        <p>
          At SpaceSavvy, we value editorial integrity and total transparency. We do not accept payment in exchange for positive coverage or guaranteed placement. Products featured on this site are selected based on practical criteria: space-saving efficiency, verified rental-friendly dimensions, and real buyer feedback.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          Amazon Associates Program Participation
        </h2>
        <p>
          SpaceSavvy is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com and affiliated regional marketplaces.
        </p>
        <p>
          As an Amazon Associate, SpaceSavvy earns from qualifying purchases. When you click outbound links to Amazon products across our design guides, shop curation, and articles, and complete a qualifying purchase, we may earn a small referral commission. This occurs at zero additional cost to you.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          FTC Compliance & Transparency
        </h2>
        <p>
          In accordance with Federal Trade Commission (FTC) guidelines concerning advertising disclosures (16 CFR Part 255):
        </p>
        <ul className="list-disc pl-5 space-y-2 text-stone-700">
          <li>Outbound product links across our guides and recommendations may generate affiliate revenue.</li>
          <li>Our curation highlights functional tools and furniture aimed at solving real compact living and small-apartment challenges.</li>
          <li>Pricing, stock availability, and shipping terms are controlled entirely by the retailer and change frequently. Please verify exact dimensions and details on the merchant site prior to purchase.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          Questions or Inquiries
        </h2>
        <p>
          If you have questions regarding our affiliate disclosures, curation standards, or privacy practices, please contact us via our{' '}
          <Link to="/about" className="text-amber-800 font-semibold hover:underline">
            About page
          </Link>{' '}
          or official social channels.
        </p>

        <div className="pt-8 mt-8 border-t border-stone-200 text-xs sm:text-sm text-stone-500 flex flex-wrap items-center gap-3">
          <Link to="/privacy-policy" className="text-amber-800 hover:underline">
            Privacy Policy
          </Link>
          <span className="text-stone-300">·</span>
          <Link to="/terms" className="text-amber-800 hover:underline">
            Terms of Service
          </Link>
          <span className="text-stone-300">·</span>
          <Link to="/shop" className="text-amber-800 hover:underline">
            Curated Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
