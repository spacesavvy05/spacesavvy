import React from 'react';
import { Scale, FileCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../../src/components/SEOHead';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 text-stone-800">
      <SEOHead
        title="Terms of Service & Rental Advisory"
        description="SpaceSavvy's terms of service, editorial use conditions, landlord wall-safety advisory, and intellectual property terms."
        canonicalPath="/terms"
      />
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 font-semibold font-mono mb-3">
        <Scale className="w-4 h-4 text-amber-700" />
        <span>Legal Terms & Use</span>
      </div>

      <h1 className="text-3xl md:text-5xl font-serif text-stone-900 font-black mb-4 leading-tight tracking-tight">
        Terms of Service & Rental Advisory
      </h1>

      <p className="text-stone-500 text-xs sm:text-sm font-mono mb-8 pb-6 border-b border-stone-200">
        Last Updated: October 9, 2026 · Effective Immediately
      </p>

      <div className="prose prose-stone max-w-none text-stone-600 space-y-6 leading-relaxed font-sans text-sm md:text-base">
        <p>
          Welcome to SpaceSavvy. By accessing our website, reading our design guides, or following product recommendations, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-2">
          1. Editorial & Informational Use Only
        </h2>
        <p>
          The content published on SpaceSavvy is provided for creative interior styling, organization inspiration, and informational purposes only. While our team tests dimensions and verifies damage-free hardware specifications, individual lease terms, wall substrates (drywall vs. plaster vs. brick), and landlord regulations vary significantly.
        </p>

        <div className="bg-[#FAF8F5] border border-stone-200/90 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            <span>Important Renter Notice</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Always inspect your wall surfaces and verify manufacturer load limits before hanging heavy mirrors, monitors, or floating shelves. SpaceSavvy cannot be held responsible for incidental wall damage, peeling paint from improperly cured adhesives, or landlord deposit deductions.
          </p>
        </div>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          2. Intellectual Property Rights
        </h2>
        <p>
          All editorial articles, guides, layouts, custom visual compositions, and curation criteria are the intellectual property of SpaceSavvy unless otherwise stated. Readers may pin our original images to Pinterest for personal inspiration, but mass syndication or unauthorized scraping is strictly prohibited.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          3. Third-Party Links & Amazon Disclaimer
        </h2>
        <p>
          SpaceSavvy contains links to third-party e-commerce sites, including Amazon.com. We do not control and are not responsible for the products, fulfillment, returns, or terms of third-party vendors. For details on how we earn affiliate commissions, review our <Link to="/affiliate-disclosure" className="text-amber-800 font-semibold hover:underline">Affiliate Disclosure</Link>.
        </p>

        <h2 className="text-xl md:text-2xl font-serif font-bold text-stone-900 pt-4">
          4. Contact Information
        </h2>
        <p>
          For editorial questions, licensing inquiries, or feedback regarding our curation, please contact our team via our <Link to="/about" className="text-amber-800 font-semibold hover:underline">About page</Link> or our verified social channels.
        </p>

        <div className="pt-6 border-t border-stone-200 text-xs text-stone-500">
          <Link to="/privacy-policy" className="text-amber-800 hover:underline mr-4">Privacy Policy</Link>
          <Link to="/affiliate-disclosure" className="text-amber-800 hover:underline mr-4">Affiliate Disclosure</Link>
          <Link to="/ai-disclaimer" className="text-amber-800 hover:underline">AI Transparency</Link>
        </div>
      </div>
    </div>
  );
}
